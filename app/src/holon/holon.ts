// app/src/holon/holon.ts
// Holon, ask mode. Builds the system prompt from Holon's instructions in agents/holon/ plus the layer-1 map and an
// index of entries, runs a tool loop over the commons, records every model call, and keeps the private session.

import prisma, { dbConfigured } from '../lib/db';
import { commons } from '../content/load';
import { search } from '../content/search';
import { providers } from './anthropic';
import { ChatMessage, ToolResult, ToolSpec } from './provider';
import { logCall } from './usage';

interface AskSettings {
  provider: string;
  model: string;
  effort: 'low' | 'medium' | 'high';
  maxTokens: number;
  maxToolRounds: number;
}

export function askSettings(): AskSettings {
  const roles = (commons().agents.get('holon')!.modelSettings as { roles?: Record<string, Partial<AskSettings>> }).roles ?? {};
  const s = roles.ask ?? {};
  return {
    provider: s.provider ?? 'anthropic',
    model: process.env.HOLON_MODEL ?? s.model ?? 'claude-sonnet-5-5',
    effort: (s.effort as AskSettings['effort']) ?? 'medium',
    maxTokens: Number(s.maxTokens) || 6000,
    maxToolRounds: Number(s.maxToolRounds) || 6,
  };
}

export function instructionVersion(): string {
  return `holon ${commons().agents.get('holon')!.version}`;
}

// ─── System prompt: instructions + layer 1 (stable, so the provider can cache it) ─────────────────────────────

let systemPrompt: string | null = null;

export function buildSystemPrompt(): string {
  if (systemPrompt) return systemPrompt;
  const c = commons();
  const named = (list: { id: string; name: string; meaning?: string; about?: string }[]) =>
    list.map((x) => `- ${x.name} (\`${x.id}\`): ${x.meaning ?? x.about ?? ''}`).join('\n');
  const entryIndex = [...c.entries.values()]
    .filter((e) => e.status === 'published')
    .map((e) => `- \`${e.id}\` [${e.agreement.status}; ${e.evidence.level}] ${e.claim}`)
    .join('\n');
  const questionIndex = [...c.questions.values()].map((q) => `- \`${q.id}\` ${q.question}`).join('\n');

  systemPrompt = [
    c.agents.get('holon')!.instructions,
    '# The commons: layer 1 (always loaded)',
    '## Purpose',
    c.map.purpose,
    '## Areas',
    named(c.map.areas),
    '## Evidence levels',
    named(c.map.evidenceLevels),
    '## Agreement statuses',
    named(c.map.agreementStatuses),
    '## Glossary',
    c.map.glossary.map((g) => `- **${g.term}**: ${g.meaning}`).join('\n'),
    '## Index of published entries (id, [agreement status; evidence level], claim)',
    'Use get_entry for the full entry before relying on it: the index omits objections, unknowns and sources.',
    entryIndex,
    '## Questions the commons is holding',
    questionIndex,
  ].join('\n\n');
  return systemPrompt;
}

// ─── Tools ────────────────────────────────────────────────────────────────────────────────────────────────

const TOOLS: ToolSpec[] = [
  {
    name: 'search_entries',
    description: 'Full-text search over the commons\' published claim entries. Returns up to 8 matches with id, claim, agreement status and evidence level. Search again with different words if results miss.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Words to search for' },
        topics: { type: 'array', items: { type: 'string' }, description: 'Optional topic or area ids to restrict to' },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_entry',
    description: 'The full claim entry: evidence level and kinds, agreement status with reason and what would change it, strongest objection, what we don\'t know, sources with locations, contributor and review status.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
  },
  {
    name: 'get_artifact',
    description: 'An artifact (a source work): citation, rights status, whether its full text is held and why, summary, and short quotations.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
  },
  {
    name: 'get_passage',
    description: 'Passages from an artifact\'s held full text. Only works the commons may hold in full have passages; for others it says why the full text is not held.',
    inputSchema: {
      type: 'object',
      properties: {
        artifact: { type: 'string' },
        location: { type: 'string', description: 'Optional section name to narrow to' },
      },
      required: ['artifact'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_question',
    description: 'An open question the commons is holding, with its positions (holders and entries), cruxes and known gaps.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
  },
  {
    name: 'log_gap',
    description: 'Record something the commons could not answer. Describe only what was missing from the commons (e.g. "no entry on soil microbiome resilience"). Never include the person\'s words or anything identifying them.',
    inputSchema: {
      type: 'object',
      properties: { what_was_missing: { type: 'string' } },
      required: ['what_was_missing'],
      additionalProperties: false,
    },
  },
];

function runTool(name: string, input: Record<string, unknown>, gaps: string[]): string {
  const c = commons();
  const id = String(input.id ?? '');
  switch (name) {
    case 'search_entries': {
      const topics = Array.isArray(input.topics) ? input.topics.map(String) : undefined;
      const hits = search(String(input.query ?? ''), { kinds: ['entry'], topics, limit: 8 });
      if (hits.length === 0) return 'No entries matched.';
      return hits
        .map((h) => {
          const e = c.entries.get(h.id)!;
          return `- ${e.id} [${e.agreement.status}; ${e.evidence.level}] ${e.claim}`;
        })
        .join('\n');
    }
    case 'get_entry': {
      const e = c.entries.get(id);
      if (!e) return `No entry with id "${id}".`;
      const contributor = c.contributors.get(e.contributor);
      return [
        `id: ${e.id}`,
        `claim: ${e.claim}`,
        `evidence: ${e.evidence.level} (${e.evidence.kinds.join(', ')}). ${e.evidence.why}`,
        `agreement status: ${e.agreement.status}. Why: ${e.agreement.why} What would change it: ${e.agreement.wouldChange}`,
        `strongest objection: ${e.objection}`,
        `what we don't know: ${e.unknowns}`,
        'sources:',
        ...e.sources.map((s) => {
          const a = c.artifacts.get(s.artifact);
          return `  - ${s.artifact}: ${a?.citation ?? '(unknown)'}; location: ${s.location}${s.note ? `; note: ${s.note}` : ''}`;
        }),
        `contributor: ${contributor?.name ?? e.contributor}; basis: ${e.basis}; review: ${e.review}`,
      ].join('\n');
    }
    case 'get_artifact': {
      const a = c.artifacts.get(id);
      if (!a) return `No artifact with id "${id}".`;
      return [
        `id: ${a.id}`,
        `citation: ${a.citation}`,
        `rights: ${a.rights.status}. ${a.rights.why}`,
        `full text held: ${a.fullText ? 'yes' : 'no'}`,
        `basis of summary: ${a.basis}`,
        a.body,
      ].join('\n');
    }
    case 'get_passage': {
      const artifact = String(input.artifact ?? '');
      const a = c.artifacts.get(artifact);
      if (!a) return `No artifact with id "${artifact}".`;
      if (!a.fullText) return `The full text of ${artifact} is not held. Rights: ${a.rights.status}. ${a.rights.why} Use get_artifact for its summary and quotations.`;
      const want = String(input.location ?? '').toLowerCase();
      const ps = c.passages.filter((p) => p.artifact === artifact && (!want || p.location.toLowerCase().includes(want)));
      if (ps.length === 0) {
        const all = c.passages.filter((p) => p.artifact === artifact).map((p) => p.location);
        return `No passage matched. Locations: ${all.join('; ')}`;
      }
      return ps.slice(0, 3).map((p) => `[${p.location}]\n${p.text}`).join('\n\n');
    }
    case 'get_question': {
      const q = c.questions.get(id);
      if (!q) return `No question with id "${id}".`;
      return [
        `id: ${q.id}`,
        `question: ${q.question}`,
        `status: ${q.status}${q.sample ? ' (sample positions for the demo)' : ''}`,
        q.positions.length ? 'positions:' : 'positions: none recorded yet',
        ...q.positions.map((p) => `  - ${p.holder}: ${p.position}${p.entries.length ? ` (entries: ${p.entries.join(', ')})` : ''}`),
        ...(q.cruxes.length ? ['cruxes:', ...q.cruxes.map((x) => `  - ${x}`)] : []),
        ...(q.gaps.length ? ['known gaps:', ...q.gaps.map((x) => `  - ${x}`)] : []),
        q.notes ? `notes: ${q.notes}` : '',
      ].filter(Boolean).join('\n');
    }
    case 'log_gap': {
      const note = String(input.what_was_missing ?? '').trim().slice(0, 300);
      if (note) gaps.push(note);
      return 'Gap recorded.';
    }
    default:
      return `Unknown tool "${name}".`;
  }
}

// ─── Ask ──────────────────────────────────────────────────────────────────────────────────────────────────

export interface Asker {
  kind: 'reviewer' | 'site';
  name?: string;
  email: string;
  /** Host site name, for questions through the public interface */
  site?: string;
}

export interface AskResult {
  sessionId: string | null;
  answer: string;
  cited: { entries: string[]; questions: string[] };
  unknownCitations: string[];
  gaps: string[];
  provider: string;
  model: string;
  instructionVersion: string;
  costUsd: number;
  stop: string;
}

const CITATION_RE = /\[\[(entry|question):([a-z0-9-]+)\]\]/g;

export function citationsIn(text: string): { entries: string[]; questions: string[]; unknown: string[] } {
  const c = commons();
  const entries = new Set<string>();
  const questions = new Set<string>();
  const unknown = new Set<string>();
  for (const m of text.matchAll(CITATION_RE)) {
    if (m[1] === 'entry') (c.entries.has(m[2]) ? entries : unknown).add(m[2]);
    else (c.questions.has(m[2]) ? questions : unknown).add(m[2]);
  }
  return { entries: [...entries], questions: [...questions], unknown: [...unknown] };
}

async function priorTurns(sessionId: string): Promise<ChatMessage[]> {
  const rows = await prisma.holonMessage.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' }, take: 20 });
  return rows.map((r): ChatMessage =>
    r.role === 'user' ? { role: 'user', text: r.text } : { role: 'assistant', text: r.text, toolCalls: [] },
  );
}

export async function ask(question: string, asker: Asker, sessionId?: string | null): Promise<AskResult> {
  const settings = askSettings();
  const provider = providers[settings.provider];
  if (!provider) throw new Error(`Unknown provider "${settings.provider}"`);
  const version = instructionVersion();
  const email = asker.email.toLowerCase();
  const servedFor = asker.kind === 'site' ? (asker.site ?? 'outside site') : 'commons app';

  // Session: continue one this asker owns, or start a new one
  let session: string | null = null;
  const history: ChatMessage[] = [];
  if (dbConfigured()) {
    if (sessionId) {
      const s = await prisma.holonSession.findUnique({ where: { id: sessionId } });
      if (s && s.askerEmail === email) {
        session = s.id;
        history.push(...(await priorTurns(s.id)));
      }
    }
    if (!session) {
      const s = await prisma.holonSession.create({
        data: { askerKind: asker.kind, askerName: asker.name, askerEmail: email, site: asker.site },
      });
      session = s.id;
    }
    await prisma.holonMessage.create({ data: { sessionId: session, role: 'user', text: question } });
  }

  const messages: ChatMessage[] = [...history, { role: 'user', text: question }];
  const gaps: string[] = [];
  let costUsd = 0;
  let answer = '';
  let model = settings.model;
  let stop = 'other';

  for (let round = 0; round <= settings.maxToolRounds; round++) {
    const lastRound = round === settings.maxToolRounds;
    const response = await provider.complete({
      model: settings.model,
      system: buildSystemPrompt(),
      messages,
      // On the last round, offer no tools so the model must answer with what it has
      tools: lastRound ? [] : TOOLS,
      maxTokens: settings.maxTokens,
      effort: settings.effort,
    });
    model = response.model;
    stop = response.stop;
    costUsd += await logCall({
      role: 'holon.ask',
      provider: provider.id,
      model: response.model,
      instructionVersion: version,
      usage: response.usage,
      servedFor,
      askerEmail: email,
      sessionId: session ?? undefined,
      stopReason: response.stop,
    });

    if (response.stop === 'refusal') {
      answer = 'Holon could not answer this question. Try rephrasing it, or ask about a different aspect.';
      break;
    }
    if (response.stop !== 'tool-use' || response.toolCalls.length === 0) {
      answer = response.text.trim();
      if (response.stop === 'max-tokens') answer += '\n\n*(The answer was cut short.)*';
      break;
    }
    messages.push({ role: 'assistant', text: response.text, toolCalls: response.toolCalls, replay: response.replay });
    const results: ToolResult[] = response.toolCalls.map((call) => {
      try {
        return { callId: call.id, content: runTool(call.name, call.input, gaps) };
      } catch (err) {
        return { callId: call.id, content: `Tool error: ${err instanceof Error ? err.message : String(err)}`, isError: true };
      }
    });
    messages.push({ role: 'tool-results', results });
  }

  if (!answer) answer = 'Holon could not finish an answer. Please try again.';
  const cites = citationsIn(answer);

  if (dbConfigured() && session) {
    await prisma.holonMessage.create({
      data: {
        sessionId: session,
        role: 'assistant',
        text: answer,
        entriesCited: cites.entries,
        provider: provider.id,
        model,
        instructionVersion: version,
        costUsd,
      },
    });
    if (gaps.length) await prisma.gapNote.createMany({ data: gaps.map((note) => ({ note, source: 'holon' })) });
  }

  return {
    sessionId: session,
    answer,
    cited: { entries: cites.entries, questions: cites.questions },
    unknownCitations: cites.unknown,
    gaps,
    provider: provider.id,
    model,
    instructionVersion: version,
    costUsd,
    stop,
  };
}

/** The asker chose to share their unanswered question with the commons: it is logged as a gap, with their words */
export async function shareQuestion(sessionId: string, email: string): Promise<boolean> {
  if (!dbConfigured()) return false;
  const s = await prisma.holonSession.findUnique({ where: { id: sessionId } });
  if (!s || s.askerEmail !== email.toLowerCase()) return false;
  const last = await prisma.holonMessage.findFirst({ where: { sessionId, role: 'user' }, orderBy: { createdAt: 'desc' } });
  if (!last || last.shared) return false;
  await prisma.$transaction([
    prisma.holonMessage.update({ where: { id: last.id }, data: { shared: true } }),
    prisma.gapNote.create({ data: { note: 'Question shared by the asker', source: 'shared-question', sharedQuestion: last.text } }),
  ]);
  return true;
}
