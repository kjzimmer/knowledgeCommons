// app/src/site/pages/transparency.ts
// Everything that shows how the commons works: the definition, agents, costs, funding, changes, permissions,
// the public interface, and (stewards only) the private sessions kept during the draft.

import { stringify as toYaml } from 'yaml';
import { commons } from '../../content/load';
import { Agent } from '../../content/types';
import { html, Html, text } from '../../lib/html';
import prisma, { dbConfigured } from '../../lib/db';
import { askSettings } from '../../holon/holon';
import { fairUse } from '../../holon/usage';
import { markdown, renderAnswer, usd } from '../ui';

export function howItWorksPage(): Html {
  const d = commons().docs;
  return html`
<div class="doc">${markdown(d.readme)}</div>
<hr>
<div class="doc">${markdown(d.charter)}</div>
<h2>Licence</h2>
<p>${text(d.licence.split('\n')[0])}</p>
<p class="muted">${d.licence.split('\n').slice(2).join(' ')}</p>
<hr>
<div class="doc">${markdown(d.structure)}</div>`;
}

/** STATE.md and CHANGELOG.md, the commons' public face (project comms 0.1). Links between the repository's
 * top-level files are pointed at the pages that show them */
function repoDoc(source: string): Html {
  const pages: Record<string, string> = { 'README.md': '/how-it-works', 'STATE.md': '/state', 'CHANGELOG.md': '/changelog' };
  const linked = source.replace(/\]\((README|STATE|CHANGELOG)\.md\)/g, (_m, name: string) => `](${pages[`${name}.md`]})`);
  return html`<div class="doc">${markdown(linked)}</div>`;
}

export function statePage(): Html {
  return repoDoc(commons().docs.state);
}

export function changelogPage(): Html {
  return repoDoc(commons().docs.changelog);
}

const AGENT_STATUS: Record<Agent['status'], { label: string; badge: string }> = {
  running: { label: 'Running', badge: 'ok' },
  specified: { label: 'Specified, being built', badge: 'warn' },
  later: { label: 'Specification only', badge: '' },
};

function agentCard(a: Agent): Html {
  const s = AGENT_STATUS[a.status];
  return html`<li class="card"><a class="card-title" href="/agents/${a.id}">${a.name}</a><p>${a.summary}</p><div class="meta"><span class="badge ${s.badge}">${s.label}</span>${a.version ? html` <span class="badge">instructions ${a.version}</span>` : ''}</div></li>`;
}

export function agentsPage(): Html {
  const all = [...commons().agents.values()];
  return html`
<h1>Agents</h1>
<p class="lede">Each agent has a public specification (what it does, what it never does, what it remembers, who checks it) and, once it runs, public instructions. Every answer and contribution records the model and the version of the instructions that produced it.</p>
<h2>The knowledge agents</h2>
<ul class="cards">${all.filter((a) => a.kind === 'knowledge').map(agentCard)}</ul>
<h2>The app team</h2>
<p class="muted">Agents that look after the commons' software. Only the monitor runs; the rest are specifications, ready to be switched on when the commons needs them.</p>
<ul class="cards">${all.filter((a) => a.kind === 'app-team').map(agentCard)}</ul>
<h2>Many models, not one</h2>
<p>The commons starts on Anthropic's Claude models and intends to run on a mix, including open-source models it can host itself. Agent code talks to models through one provider interface, so a second provider can be added without changing the agents.</p>
<p>No agent's work is checked by the model that produced it. The challenger runs on Claude Opus 5.5 against the curator's Claude Sonnet 5.5. The auditor's model is set per kind of work: Opus audits work made by Sonnet (the curator's readings, Holon's posts), Sonnet audits work made by Opus (the challenger's case), and Haiku is available for mechanical checks. <strong>These are different Claude models, not different providers yet</strong>: a second provider is planned before the commons opens to the public.</p>`;
}

export function agentPage(id: string): Html | null {
  const a = commons().agents.get(id);
  if (!a) return null;
  const s = AGENT_STATUS[a.status];
  const runs = (a.testedOn as { runs?: unknown[] } | null)?.runs;
  return html`
<p class="crumbs"><a href="/agents">Agents</a></p>
<h1>${a.name}</h1>
<div class="meta"><span class="badge ${s.badge}">${s.label}</span>${a.version ? html` <span class="badge">instructions ${a.version}</span> <span class="badge">updated ${a.updated}</span>` : ''} <span class="badge warn">Not yet approved</span></div>
<p class="lede">${a.summary}</p>
<h2>Specification</h2>
<p class="muted">From <a href="https://github.com/kjzimmer/knowledgeCommons/blob/main/agents/${a.id}/spec.md" rel="noopener" target="_blank">agents/${a.id}/spec.md</a>. Source: ${a.source}. Traces to the principles ${a.parents.join(', ')}.</p>
<div class="doc">${markdown(a.spec)}</div>
${a.instructions !== null
    ? html`<h2>Instructions, verbatim</h2>
${a.note ? html`<p class="muted">${a.note}</p>` : ''}
<p class="muted">From <a href="https://github.com/kjzimmer/knowledgeCommons/blob/main/agents/${a.id}/instructions.md" rel="noopener" target="_blank">agents/${a.id}/instructions.md</a>.${id === 'holon' ? ' Holon also receives the layer-1 map and an index of entries with every question.' : ''}</p>
<pre class="instructions">${a.instructions}</pre>`
    : html`<h2>Instructions</h2><p class="muted">Not written yet: instructions are written from the specification when the agent is built.</p>`}
${a.config ? html`<h2>Settings</h2><pre class="yaml">${toYaml(a.config)}</pre>` : ''}
${a.status !== 'later' ? html`<h2>Models tested on, and results</h2>
${Array.isArray(runs) && runs.length
    ? html`<pre class="yaml">${toYaml(a.testedOn)}</pre>`
    : html`<p class="muted">No test runs yet. A run reports, for each test case, whether the agent met its standard, and its cost.</p>`}` : ''}
${a.tests.map((t) => html`<h3>Test set: ${t.file.split('/').pop()} (example rows only)</h3><pre class="yaml">${toYaml(t.data)}</pre>`)}
${a.changelog ? html`<h2>History</h2>${markdown(a.changelog)}` : ''}`;
}

export async function costsPage(): Promise<Html> {
  const limits = fairUse();
  const settings = askSettings();
  let rows: { day: string; role: string; model: string; calls: number; input: number; output: number; cached: number; cost: number }[] = [];
  let totals = { calls: 0, cost: 0, answers: 0 };
  if (dbConfigured()) {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const calls = await prisma.modelCall.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: 'desc' } });
    const map = new Map<string, (typeof rows)[number]>();
    for (const c of calls) {
      const day = c.createdAt.toISOString().slice(0, 10);
      const key = `${day}|${c.role}|${c.model}`;
      const r = map.get(key) ?? { day, role: c.role, model: c.model, calls: 0, input: 0, output: 0, cached: 0, cost: 0 };
      r.calls++;
      r.input += c.inputTokens + c.cacheWriteTokens;
      r.cached += c.cacheReadTokens;
      r.output += c.outputTokens;
      r.cost += c.costUsd;
      map.set(key, r);
    }
    rows = [...map.values()];
    totals = {
      calls: calls.length,
      cost: calls.reduce((s, c) => s + c.costUsd, 0),
      answers: await prisma.holonMessage.count({ where: { role: 'assistant', createdAt: { gte: since } } }),
    };
  }
  return html`
<h1>Costs</h1>
<p class="lede">A document costs almost nothing however often it is read; every AI answer costs money. The AI budget is a shared, finite resource, so its use is public: every model call is logged with its tokens and its cost at list prices.</p>
<ul class="stats">
  <li><strong>${usd(totals.cost)}</strong> spent in the last 30 days</li>
  <li><strong>${totals.answers}</strong> answers</li>
  <li><strong>${totals.answers ? usd(totals.cost / totals.answers) : '—'}</strong> per answer</li>
  <li><strong>${totals.calls}</strong> model calls</li>
</ul>
<h2>Fair-use limits</h2>
<ul>
  <li>${limits.questionsPerDay} questions to Holon a day per reviewer.</li>
  <li>A shared daily spending ceiling of ${usd(limits.dailySpendCeilingUsd)}, after which Holon pauses with a polite message until midnight UTC.</li>
  <li>Holon runs on ${settings.provider} ${settings.model} (effort ${settings.effort}), with up to ${settings.maxToolRounds} rounds of looking things up per answer.</li>
</ul>
<h2>By day, role and model</h2>
${rows.length ? html`<div class="scroll"><table class="table"><thead><tr><th>Day</th><th>Role</th><th>Model</th><th>Calls</th><th>Input tokens</th><th>Cached</th><th>Output tokens</th><th>Cost</th></tr></thead><tbody>${rows.map((r) => html`<tr><td>${r.day}</td><td>${r.role}</td><td>${r.model}</td><td>${r.calls}</td><td>${r.input.toLocaleString()}</td><td>${r.cached.toLocaleString()}</td><td>${r.output.toLocaleString()}</td><td>${usd(r.cost)}</td></tr>`)}</tbody></table></div>` : html`<p class="muted">No model calls yet.</p>`}
<p class="muted">Prices are in <a href="https://github.com/kjzimmer/knowledgeCommons/blob/main/config/prices.yaml" rel="noopener" target="_blank">config/prices.yaml</a>. Monthly summaries will be committed to <code>ledger/</code>. Questions asked from host sites, such as Abundance Architecture, are recorded as usage by an outside site.</p>`;
}

export function fundingPage(): Html {
  return html`
<div class="doc">${markdown(commons().docs.funding)}</div>
<p>The commons publishes every source of funding and every cost. It carries no advertising and sells nothing about anyone. Abundance Architecture is listed as a funder while it is one.</p>
<p><a href="/costs">See the costs</a> · <a href="/growth">See the budget and what more funding would buy</a></p>`;
}

interface Commit { sha: string; html_url: string; commit: { message: string; author: { name: string; date: string } } }
let commitCache: { at: number; commits: Commit[] | null; error?: string } = { at: 0, commits: null };

async function recentCommits(): Promise<{ commits: Commit[] | null; error?: string }> {
  if (Date.now() - commitCache.at < 10 * 60 * 1000) return commitCache;
  const repo = process.env.COMMONS_REPO ?? 'kjzimmer/knowledgeCommons';
  const branch = process.env.COMMONS_BRANCH ?? 'main';
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=40`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'knowledge-commons' },
    });
    commitCache = res.ok ? { at: Date.now(), commits: (await res.json()) as Commit[] } : { at: Date.now(), commits: null, error: `GitHub returned ${res.status}` };
  } catch (err) {
    commitCache = { at: Date.now(), commits: null, error: err instanceof Error ? err.message : String(err) };
  }
  return commitCache;
}

export async function changesPage(): Promise<Html> {
  const { commits, error } = await recentCommits();
  const repo = process.env.COMMONS_REPO ?? 'kjzimmer/knowledgeCommons';
  return html`
<h1>Changes</h1>
<p class="lede">The repository's history is the commons' change log: what changed, who contributed it, who endorsed it and who applied it. Applied proposals become commits that name all three.</p>
${commits ? html`<ul class="changes">${commits.map((c) => html`<li><a href="${c.html_url}" rel="noopener" target="_blank"><code>${c.sha.slice(0, 7)}</code></a> ${c.commit.message.split('\n')[0]}<br><span class="muted">${c.commit.author.name}, ${c.commit.author.date.slice(0, 10)}</span></li>`)}</ul>` : html`<p class="muted">Could not load the history${error ? ` (${error})` : ''}. It is always readable at <a href="https://github.com/${repo}/commits" rel="noopener" target="_blank">github.com/${repo}/commits</a>.</p>`}`;
}

export function permissionsPage(): Html {
  const c = commons();
  const toRequest = [...c.artifacts.values()].filter((a) => a.rights.permission === 'to-request' || a.rights.permission === 'check-licence');
  const requests = (c.permissions.requests ?? []) as { artifact: string; to: string; sent: string; outcome?: string }[];
  return html`
<h1>Permissions</h1>
<p class="lede">The commons aims to hold the full text of every work it relies on, and pursues that aim lawfully and in the open: it asks rights holders for permission, and records each request and its outcome here.</p>
<h2>Requests sent</h2>
${requests.length ? html`<ul>${requests.map((r) => html`<li>${r.artifact}: to ${r.to}, ${r.sent}. ${r.outcome ?? 'Awaiting reply.'}</li>`)}</ul>` : html`<p class="muted">None yet.</p>`}
<h2>Works to ask about, or whose licence to check</h2>
<ul class="plain">${toRequest.map((a) => html`<li><a href="/artifacts/${a.id}">${a.citation}</a> <span class="badge">${a.rights.permission === 'check-licence' ? 'check licence' : 'request permission'}</span><br><span class="muted">${a.rights.why}</span></li>`)}</ul>
<p>Whether knowledge of this kind should be enclosed at all is itself <a href="/questions/knowledge-and-copyright">an open question in the commons</a>.</p>`;
}

export function interfacePage(): Html {
  const endpoint = (method: string, path: string, about: string, body?: string) =>
    html`<div class="endpoint"><p><code class="method">${method}</code> <code>${path}</code></p><p>${about}</p>${body ? html`<pre>${body}</pre>` : ''}</div>`;
  return html`
<h1>Interface</h1>
<p class="lede">Any site or tool reads from the commons, asks Holon and proposes contributions through this public HTTP interface. Abundance Architecture uses only this interface; it has no privileged access.</p>
<p>In the draft, callers identify with a site key: <code>Authorization: Bearer &lt;key&gt;</code>. Responses are JSON. Base path: <code>/api/v1</code>.</p>
<h2>Read</h2>
${endpoint('GET', '/api/v1/entries', 'Published entries. Optional ?topic= and ?status=.')}
${endpoint('GET', '/api/v1/entries/:id', 'One entry with its sources expanded, plus its page URL.')}
${endpoint('GET', '/api/v1/artifacts/:id', 'One artifact: citation, rights status, summary.')}
${endpoint('GET', '/api/v1/questions', 'Open questions.')}
${endpoint('GET', '/api/v1/questions/:id', 'One question with positions and cruxes.')}
${endpoint('GET', '/api/v1/search?q=', 'Full-text search over entries, artifacts and questions.')}
<h2>Ask Holon</h2>
${endpoint('POST', '/api/v1/holon/ask', "Ask a question on behalf of a person on the host site. Holon's answer comes back with the entries it cited, the model and instruction version, and the cost. The host site decides how to show it.", `{
  "question": "Is resilience always a good thing?",
  "sessionId": null,
  "asker": { "name": "Reviewer name", "email": "reviewer@example.com" }
}`)}
${endpoint('POST', '/api/v1/holon/share', 'The asker chose to share their unanswered question with the commons, which logs it as a gap with their words.', '{ "sessionId": "…", "asker": { "email": "reviewer@example.com" } }')}
<h2>Contribute</h2>
${endpoint('POST', '/api/v1/proposals', "Propose additions or status changes, attributed to the people who made them. Proposals from outside sites are audited and reviewed exactly like anyone else's. Not built in the concept demo (returns 501).")}
${endpoint('POST', '/api/v1/reviewer-links', "Draft only: lets a host site's invited reviewers into the commons' pages, so its citations open here. Returns a signed link that names the site that vouched for the reviewer. Optional \"to\" is a page path.", '{ "reviewer": { "name": "…", "email": "…" }, "to": "/entries/dispersed-knowledge" }')}
${endpoint('POST', '/api/v1/holon/discuss', "Invite Holon into a discussion: the host sends the thread, Holon returns one labelled contribution. Not built in the concept demo (returns 501).")}`;
}

export async function sessionsPage(): Promise<Html> {
  if (!dbConfigured()) return html`<h1>Sessions</h1><p class="muted">No database configured.</p>`;
  const sessions = await prisma.holonSession.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  return html`
<h1>Private sessions</h1>
<p class="lede">Stewards only. Kept during the draft to review how Holon behaves, as reviewers are told on the Ask page. Never published.</p>
${sessions.length === 0 ? html`<p class="muted">None yet.</p>` : ''}
${sessions.map((s) => html`<details class="panel"><summary>${s.createdAt.toISOString().slice(0, 16).replace('T', ' ')} · ${s.askerName ?? s.askerEmail}${s.site ? ` via ${s.site}` : ''} · ${s.messages.filter((m) => m.role === 'user').length} question(s)</summary>
${s.messages.map((m) => m.role === 'user'
    ? html`<p class="q"><strong>Q:</strong> ${m.text}${m.shared ? html` <span class="badge">shared</span>` : ''}</p>`
    : html`<div class="a">${renderAnswer(m.text)}<p class="muted">${m.model} · ${m.instructionVersion} · ${usd(m.costUsd ?? 0)}</p></div>`)}
</details>`)}`;
}
