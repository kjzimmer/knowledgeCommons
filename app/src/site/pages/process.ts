// app/src/site/pages/process.ts
// How the commons changes: Contribute, Review (the proposal queue) and Growth (the loops and the budget).

import { commons } from '../../content/load';
import { html, Html } from '../../lib/html';
import prisma, { dbConfigured } from '../../lib/db';
import { usd } from '../ui';

export function contributePage(): Html {
  return html`
<h1>Contribute</h1>
<p class="lede">Anyone can propose an artifact, an entry, an objection or a question, or upload a source for the curator to draft entries from. People and agents contribute under the same rules: every contribution becomes a proposal, the auditor checks it, reviewers endorse or dispute it, and a steward applies it.</p>
<p class="notice">In the concept demo, contributions are not saved. The forms show what a contribution records.</p>
<div class="grid2">
  <form class="panel demo-form" onsubmit="return false">
    <h2 class="small">Propose an artifact</h2>
    <label>Citation <input type="text" disabled placeholder="Author, A. (Year). Title. Publisher."></label>
    <label>Link <input type="url" disabled placeholder="https://"></label>
    <label>Rights status <select disabled><option>Not held (citation, summary and link only)</option><option>Open licence</option><option>Own work</option><option>Public domain</option><option>Permission granted</option></select></label>
    <label>Why it matters <textarea rows="2" disabled></textarea></label>
    <button disabled>Propose</button>
  </form>
  <form class="panel demo-form" onsubmit="return false">
    <h2 class="small">Propose an entry or an objection</h2>
    <label>Claim <textarea rows="2" disabled></textarea></label>
    <label>Evidence level <select disabled><option>Established evidence</option><option>Reasonable extension</option><option>Speculation</option></select></label>
    <label>Sources, with locations <textarea rows="2" disabled></textarea></label>
    <label>Strongest objection you know of <textarea rows="2" disabled></textarea></label>
    <button disabled>Propose</button>
  </form>
  <form class="panel demo-form" onsubmit="return false">
    <h2 class="small">Propose a question</h2>
    <label>Question <textarea rows="2" disabled></textarea></label>
    <label>Why it is open <textarea rows="2" disabled></textarea></label>
    <button disabled>Propose</button>
  </form>
  <form class="panel demo-form" onsubmit="return false">
    <h2 class="small">Upload a source for the curator</h2>
    <label>File <input type="file" disabled></label>
    <label>Rights status <select disabled><option>Own work</option><option>Open licence</option><option>Permission granted</option></select></label>
    <p class="muted">The curator drafts entries from it; nothing is published until a steward applies it.</p>
    <button disabled>Upload</button>
  </form>
</div>
<p>Other sites contribute the same way, through the <a href="/interface">public interface</a>. Abundance Architecture sends what its discussions produce as proposals, attributed to the participants who consented.</p>`;
}

interface Check { result: string; note: string }
interface Proposal {
  id: string;
  title: string;
  contributor: { kind: string; name: string; model?: string; instructions?: string; inputs?: string; attributed?: string[] };
  submitted: string;
  items: { kind: string; type: string; target?: string; summary: string; proposed?: Record<string, string> }[];
  audit: { model: string; checks: Record<string, Check> };
  reviews: { name: string; action: string; item: number; note: string }[];
}

const CHECK_NAMES: Record<string, string> = {
  provenance: 'Provenance', integrity: 'Integrity', method: 'Method', reasoning: 'Reasoning', selfReinforcement: 'Self-reinforcement',
};

export function reviewPage(): Html {
  const proposals = (commons().demo.proposals.proposals ?? []) as Proposal[];
  return html`
<h1>Review</h1>
<p class="lede">Every contribution, from a steward, a reviewer, Holon, the curator or an outside site, becomes a proposal. The auditor checks it first; a failed check marks it but does not block it. Reviewers endorse or dispute each item, with names shown. A steward applies or rejects items, and applying writes them to the repository as a commit naming the contributor, the endorsers and the steward.</p>
<p>Additions need a lower bar than status changes. Who may apply a change is decided in one replaceable rule; today it is the interim stewards. Agents are limited to 10 proposals a day each, and when more than 50 items await review, the agents' loops pause.</p>
<div class="queue">
${proposals.map((p) => html`
<article class="proposal panel">
  <header>
    <h2 class="small">${p.title}</h2>
    <p class="muted">${p.contributor.kind === 'agent' ? html`<span class="badge ai">Agent</span> ${p.contributor.name}, model ${p.contributor.model}, instructions ${p.contributor.instructions}` : p.contributor.kind === 'site' ? html`<span class="badge">Outside site</span> ${p.contributor.name}${p.contributor.attributed ? html`, attributed to ${p.contributor.attributed.join(' and ')}` : ''}` : html`<span class="badge">Person</span> ${p.contributor.name}`} · submitted ${p.submitted}${p.contributor.inputs ? html`<br>Inputs: ${p.contributor.inputs}` : ''}</p>
  </header>
  <ol class="items">${p.items.map((it) => html`<li><span class="badge ${it.kind === 'status-change' ? 'warn' : ''}">${it.kind === 'status-change' ? 'Status change' : 'Addition'}: ${it.type}</span>${it.target ? html` → <a href="/${it.type === 'analysis' ? 'questions' : 'entries'}/${it.target}">${it.target}</a>` : ''}<br>${it.summary}</li>`)}</ol>
  <div class="audit">
    <h3>Auditor report <span class="muted">(${p.audit.model}, a different model from the contributor's)</span></h3>
    <ul class="checks">${Object.entries(p.audit.checks).map(([k, v]) => html`<li class="check-${v.result}"><strong>${CHECK_NAMES[k] ?? k}</strong>: ${v.result}${v.note ? html`. ${v.note}` : ''}</li>`)}</ul>
  </div>
  ${p.reviews.length ? html`<ul class="reviews">${p.reviews.map((r) => html`<li><strong>${r.name}</strong> ${r.action === 'endorse' ? 'endorsed' : 'disputed'} item ${r.item}: ${r.note}</li>`)}</ul>` : ''}
  <div class="actions"><button disabled>Endorse</button> <button disabled class="secondary">Dispute</button> <button disabled class="secondary">Apply (stewards)</button></div>
</article>`)}
</div>`;
}

interface Loop { id: string; name: string; status: string; detail: string }
interface Candidate { title: string; why: string; score: number }

export async function growthPage(): Promise<Html> {
  const c = commons();
  const budget = c.growth.budget as { monthlyBudgetUsd?: number; allocations?: Record<string, number>; priority?: string[]; rules?: string[] };
  const g = c.demo.growth as { loops?: Loop[]; candidates?: Candidate[]; fundingEstimates?: { note: string; perTenDollars: Record<string, number> } };
  const seed = (c.growth.seedList.works ?? []) as { citation: string; artifact?: string; likely: string }[];
  const watch = (c.growth.watchlist.watch ?? []) as { area: string; terms: string[]; feeds: string[] }[];
  const total = Number(budget.monthlyBudgetUsd) || 0;

  let monthSpend = 0;
  let gaps: { note: string; count: number }[] = [];
  let shared = 0;
  if (dbConfigured()) {
    const start = new Date();
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
    const [s, grouped, sharedCount] = await Promise.all([
      prisma.modelCall.aggregate({ _sum: { costUsd: true }, where: { createdAt: { gte: start }, role: 'holon.ask' } }),
      prisma.gapNote.groupBy({ by: ['note'], where: { source: 'holon' }, _count: { note: true }, orderBy: { _count: { note: 'desc' } }, take: 30 }),
      prisma.gapNote.count({ where: { source: 'shared-question' } }),
    ]);
    monthSpend = s._sum.costUsd ?? 0;
    gaps = grouped.map((r) => ({ note: r.note, count: r._count.note }));
    shared = sharedCount;
  }
  const answeringShare = ((budget.allocations?.answering ?? 0) / 100) * total;
  const labels: Record<string, string> = { answering: 'Answering people (Holon)', auditing: 'Auditing', curation: 'Curation', discovery: 'Discovery', questionMining: 'Question mining', analysis: 'Analysis' };

  return html`
<h1>Growth</h1>
<p class="lede">On day one the commons holds only what was seeded. It grows through five loops (acquisition, discovery, curation, question mining and Holon's analysis), each a scheduled job that records everything it does and stops when its share of the budget is used. People review everything before it is applied.</p>

<h2>The budget</h2>
<p>Monthly budget for the commons' AI work: <strong>${usd(total)}</strong> (draft value, set by the stewards in <code>growth/budget.yaml</code>). When money runs short, answering people comes first, then auditing, then curation, then the rest. Nothing is applied without its audit.</p>
<table class="table">
  <thead><tr><th>Share</th><th>%</th><th>Per month</th><th>Spent this month</th></tr></thead>
  <tbody>${Object.entries(budget.allocations ?? {}).map(([k, pct]) => html`<tr><td>${labels[k] ?? k}</td><td>${pct}%</td><td>${usd((pct / 100) * total)}</td><td>${k === 'answering' ? html`${usd(monthSpend)} <span class="muted">(live)</span>${monthSpend >= answeringShare && answeringShare > 0 ? html` <span class="badge warn">Paused for budget</span>` : ''}` : html`<span class="muted">not running</span>`}</td></tr>`)}</tbody>
</table>
<p class="sample-note"><strong>What more funding buys (illustrative).</strong> ${g.fundingEstimates?.note ?? ''} Each additional $10 a month would buy about ${g.fundingEstimates?.perTenDollars.artifactsCurated ?? '?'} artifacts curated, ${g.fundingEstimates?.perTenDollars.analysesRun ?? '?'} analyses run, or ${g.fundingEstimates?.perTenDollars.questionsAnswered ?? '?'} questions answered.</p>

<h2>The loops</h2>
<table class="table">
  <thead><tr><th>Loop</th><th>Status</th><th>What it does</th></tr></thead>
  <tbody>${(g.loops ?? []).map((l) => html`<tr><td>${l.name}</td><td><span class="badge ${l.status.startsWith('Live') ? 'ok' : 'sample'}">${l.status}</span></td><td>${l.detail}</td></tr>`)}</tbody>
</table>

<h2>Discovery candidates <span class="badge sample">Sample</span></h2>
<p class="muted">Discovery ranks new works for relevance and records why each was found. Nothing is acquired until a person accepts it.</p>
<ul class="cards">${(g.candidates ?? []).map((cand) => html`<li class="card"><span class="card-title">${cand.title}</span><p class="muted">${cand.why} Relevance ${cand.score.toFixed(2)}.</p><div class="actions"><button disabled>Accept</button> <button disabled class="secondary">Reject with a reason</button></div></li>`)}</ul>

<h2>Gap log <span class="badge ok">Live</span></h2>
<p class="muted">What Holon could not answer, recorded as what was missing from the commons, never the asker's words. ${shared ? html`${shared} question${shared === 1 ? '' : 's'} shared by askers.` : ''}</p>
${gaps.length ? html`<table class="table"><thead><tr><th>Missing from the commons</th><th>Reports</th></tr></thead><tbody>${gaps.map((x) => html`<tr><td>${x.note}</td><td>${x.count}</td></tr>`)}</tbody></table>` : html`<p class="muted">No gaps recorded yet.</p>`}

<h2>The seed list</h2>
<p>${seed.length} works, drafted from memory and awaiting review; ${seed.filter((w) => w.artifact).length} are already artifacts. Acquisition looks each one up through open services and records what it finds.</p>
<details><summary>Show the seed list</summary><ul class="plain">${seed.map((w) => html`<li>${w.artifact ? html`<a href="/artifacts/${w.artifact}">${w.citation}</a>` : w.citation} <span class="badge">${w.likely}</span></li>`)}</ul></details>

<h2>The watchlist <span class="badge sample">Sample</span></h2>
<ul>${watch.map((w) => html`<li><strong>${c.map.areas.find((a) => a.id === w.area)?.name ?? w.area}</strong>: ${w.terms.join(', ')}. Feeds: ${w.feeds.join('; ')}</li>`)}</ul>`;
}
