// app/src/content/load.ts
// Reads the commons' plain files from the repository, validates them, and returns them as typed maps.
// Loaded once at startup: the repository is the source of truth, and a deploy is how content changes.

import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import {
  Agent, Artifact, Basis, CommonsContent, Contributor, Entry, Named, Passage, Question,
} from './types';

/** Repository root: three levels up from app/src/content (or app/dist/content) */
export const REPO_ROOT = process.env.COMMONS_ROOT ?? path.resolve(__dirname, '../../..');

function read(rel: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
}

function readYaml(rel: string): Record<string, unknown> {
  return (parseYaml(read(rel)) ?? {}) as Record<string, unknown>;
}

function exists(rel: string): boolean {
  return fs.existsSync(path.join(REPO_ROOT, rel));
}

/** Splits "---\nyaml\n---\nbody" into its header and Markdown body */
function frontMatter(rel: string): { data: Record<string, unknown>; body: string } {
  const src = read(rel);
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${rel}: missing YAML header`);
  return { data: (parseYaml(m[1]) ?? {}) as Record<string, unknown>, body: m[2].trim() };
}

function mdFiles(dir: string): string[] {
  const abs = path.join(REPO_ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter((f) => f.endsWith('.md')).sort().map((f) => `${dir}/${f}`);
}

const str = (v: unknown): string => (v == null ? '' : String(v).trim());
const arr = <T = string>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Splits a Markdown document into passages, one per "## " section, located by section heading */
function sectionPassages(artifact: string, markdown: string): Passage[] {
  const out: Passage[] = [];
  let heading = 'Opening';
  let buf: string[] = [];
  const flush = () => {
    const text = buf.join('\n').trim();
    if (text) out.push({ artifact, location: `Section: ${heading}`, text });
    buf = [];
  };
  for (const line of markdown.split('\n')) {
    const h = line.match(/^##\s+(.+)/);
    if (h) {
      flush();
      heading = h[1].trim();
    } else if (!/^#\s/.test(line)) {
      buf.push(line);
    }
  }
  flush();
  return out;
}

export interface LoadResult {
  content: CommonsContent;
  errors: string[];
}

export function loadContent(): LoadResult {
  const errors: string[] = [];

  const contributors = new Map<string, Contributor>();
  for (const c of arr<Contributor>(readYaml('contributors.yaml').contributors)) contributors.set(c.id, c);

  const domains = readYaml('map/domains.yaml');
  const standards = readYaml('map/standards.yaml');
  const map = {
    purpose: frontMatter('map/purpose.md').body,
    areas: arr<Named>(domains.areas),
    topics: arr<Named>(domains.topics),
    evidenceLevels: arr<Named>(standards.evidenceLevels),
    evidenceKinds: arr<Named>(standards.evidenceKinds),
    agreementStatuses: arr<Named>(standards.agreementStatuses),
    rightsStatuses: arr<Named & { fullText: boolean }>(standards.rightsStatuses),
    glossary: arr<{ term: string; meaning: string }>(readYaml('map/glossary.yaml').terms),
  };
  const topicIds = new Set([...map.areas, ...map.topics].map((t) => t.id));
  const levelIds = new Set(map.evidenceLevels.map((l) => l.id));
  const kindIds = new Set(map.evidenceKinds.map((k) => k.id));
  const statusIds = new Set(map.agreementStatuses.map((s) => s.id));
  const rightsIds = new Set(map.rightsStatuses.map((r) => r.id));
  const fullTextAllowed = new Set(map.rightsStatuses.filter((r) => r.fullText).map((r) => r.id));
  const bases: Basis[] = ['checked-against-text', 'model-knowledge', 'own-work'];

  const checkTopics = (file: string, topics: string[]) => {
    for (const t of topics) if (!topicIds.has(t)) errors.push(`${file}: unknown topic "${t}"`);
  };
  const checkContributor = (file: string, id: string) => {
    if (!contributors.has(id)) errors.push(`${file}: unknown contributor "${id}"`);
  };

  // Artifacts
  const artifacts = new Map<string, Artifact>();
  const passages: Passage[] = [];
  for (const file of mdFiles('artifacts')) {
    const { data, body } = frontMatter(file);
    const rights = (data.rights ?? {}) as Artifact['rights'];
    const entered = (data.entered ?? {}) as Artifact['entered'];
    const a: Artifact = {
      id: str(data.id),
      citation: str(data.citation),
      kind: str(data.kind),
      url: data.url ? str(data.url) : null,
      year: typeof data.year === 'number' ? data.year : null,
      topics: arr(data.topics),
      rights: { status: str(rights.status), why: str(rights.why), permission: rights.permission ? str(rights.permission) : undefined },
      entered: { how: str(entered.how), by: str(entered.by), date: str(entered.date) },
      basis: str(data.basis) as Basis,
      note: data.note ? str(data.note) : undefined,
      fullText: data.fullText ? str(data.fullText) : undefined,
      body,
      file,
    };
    if (!a.id || `${a.id}.md` !== path.basename(file)) errors.push(`${file}: id must match the file name`);
    if (!a.citation) errors.push(`${file}: missing citation`);
    if (!rightsIds.has(a.rights.status)) errors.push(`${file}: unknown rights status "${a.rights.status}"`);
    if (!bases.includes(a.basis)) errors.push(`${file}: unknown basis "${a.basis}"`);
    checkTopics(file, a.topics);
    checkContributor(file, a.entered.by);
    if (a.fullText) {
      // The commons never holds full text unless the rights status allows it
      if (!fullTextAllowed.has(a.rights.status)) errors.push(`${file}: full text held but rights status "${a.rights.status}" does not allow it`);
      else if (!exists(a.fullText)) errors.push(`${file}: full text file "${a.fullText}" not found`);
      else passages.push(...sectionPassages(a.id, read(a.fullText)));
    }
    artifacts.set(a.id, a);
  }

  // Entries
  const entries = new Map<string, Entry>();
  for (const file of mdFiles('entries')) {
    const { data, body } = frontMatter(file);
    const ev = (data.evidence ?? {}) as Record<string, unknown>;
    const ag = (data.agreement ?? {}) as Record<string, unknown>;
    const e: Entry = {
      id: str(data.id),
      claim: str(data.claim),
      evidence: { level: str(ev.level), kinds: arr(ev.kinds), why: str(ev.why) },
      agreement: { status: str(ag.status), why: str(ag.why), wouldChange: str(ag.wouldChange) },
      objection: str(data.objection),
      unknowns: str(data.unknowns),
      sources: arr<Entry['sources'][number]>(data.sources).map((s) => ({
        artifact: str(s.artifact), location: str(s.location), note: s.note ? str(s.note) : undefined,
      })),
      topics: arr(data.topics),
      contributor: str(data.contributor),
      basis: str(data.basis) as Basis,
      approver: data.approver ? str(data.approver) : null,
      status: str(data.status) === 'withdrawn' ? 'withdrawn' : 'published',
      review: str(data.review) === 'reviewed' ? 'reviewed' : 'unreviewed',
      body,
      file,
    };
    if (!e.id || `${e.id}.md` !== path.basename(file)) errors.push(`${file}: id must match the file name`);
    if (!e.claim) errors.push(`${file}: missing claim`);
    if (!levelIds.has(e.evidence.level)) errors.push(`${file}: unknown evidence level "${e.evidence.level}"`);
    for (const k of e.evidence.kinds) if (!kindIds.has(k)) errors.push(`${file}: unknown evidence kind "${k}"`);
    if (!statusIds.has(e.agreement.status)) errors.push(`${file}: unknown agreement status "${e.agreement.status}"`);
    if (!e.objection) errors.push(`${file}: missing strongest objection`);
    if (e.sources.length === 0) errors.push(`${file}: no sources`);
    if (!bases.includes(e.basis)) errors.push(`${file}: unknown basis "${e.basis}"`);
    checkTopics(file, e.topics);
    checkContributor(file, e.contributor);
    entries.set(e.id, e);
  }
  for (const e of entries.values()) {
    for (const s of e.sources) if (!artifacts.has(s.artifact)) errors.push(`${e.file}: source artifact "${s.artifact}" not found`);
  }

  // Questions
  const questions = new Map<string, Question>();
  for (const file of mdFiles('questions')) {
    const { data } = frontMatter(file);
    const q: Question = {
      id: str(data.id),
      question: str(data.question),
      status: str(data.status) || 'open',
      kind: str(data.kind) === 'about-the-commons' ? 'about-the-commons' : 'knowledge',
      sample: data.sample === true,
      positions: arr<Question['positions'][number]>(data.positions).map((p) => ({
        holder: str(p.holder), position: str(p.position), entries: arr(p.entries),
      })),
      cruxes: arr(data.cruxes),
      gaps: arr(data.gaps),
      notes: data.notes ? str(data.notes) : undefined,
      contributor: str(data.contributor),
      seeded: str(data.seeded),
      file,
    };
    if (!q.id || `${q.id}.md` !== path.basename(file)) errors.push(`${file}: id must match the file name`);
    for (const p of q.positions) for (const id of p.entries) if (!entries.has(id)) errors.push(`${file}: position cites unknown entry "${id}"`);
    checkContributor(file, q.contributor);
    questions.set(q.id, q);
  }

  // Agents
  const agents = new Map<string, Agent>();
  for (const id of ['holon', 'curator', 'auditor']) {
    const dir = `agents/${id}`;
    const { data, body } = frontMatter(`${dir}/instructions.md`);
    agents.set(id, {
      id,
      version: str(data.version),
      updated: str(data.updated),
      note: data.note ? str(data.note) : undefined,
      instructions: body,
      modelSettings: readYaml(`${dir}/model.yaml`),
      testedOn: exists(`${dir}/tested-on.yaml`) ? readYaml(`${dir}/tested-on.yaml`) : null,
      history: exists(`${dir}/history.md`) ? read(`${dir}/history.md`) : '',
    });
  }

  const content: CommonsContent = {
    artifacts,
    entries,
    questions,
    agents,
    contributors,
    passages,
    map,
    docs: {
      readme: read('README.md'),
      charter: read('CHARTER.md'),
      licence: read('LICENCE'),
      funding: read('FUNDING.md'),
      structure: read('STRUCTURE.md'),
    },
    growth: {
      budget: readYaml('growth/budget.yaml'),
      watchlist: readYaml('growth/watchlist.yaml'),
      seedList: readYaml('growth/seed-list.yaml'),
    },
    permissions: readYaml('permissions/log.yaml'),
    tests: { holon: readYaml('tests/holon.yaml'), auditor: readYaml('tests/auditor.yaml') },
    demo: { proposals: readYaml('demo/proposals.yaml'), growth: readYaml('demo/growth.yaml') },
    prices: readYaml('config/prices.yaml'),
  };
  return { content, errors };
}

let cached: CommonsContent | null = null;

/** The loaded commons. Logs validation errors once; the check script fails on them instead */
export function commons(): CommonsContent {
  if (!cached) {
    const { content, errors } = loadContent();
    for (const e of errors) console.warn(`[content] ${e}`);
    cached = content;
  }
  return cached;
}
