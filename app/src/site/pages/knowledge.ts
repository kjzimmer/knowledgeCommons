// app/src/site/pages/knowledge.ts
// The knowledge pages: entries, artifacts, questions and search.

import { commons } from '../../content/load';
import { search, SearchHit } from '../../content/search';
import { Entry } from '../../content/types';
import { html, Html, text } from '../../lib/html';
import {
  artifactLine, contributorName, entryCard, levelBadge, markdown, provenance, rightsBadge, statusBadge, topicName,
} from '../ui';

export function entriesPage(filter: { status?: string; topic?: string }): Html {
  const c = commons();
  let list = [...c.entries.values()].filter((e) => e.status === 'published');
  if (filter.status) list = list.filter((e) => e.agreement.status === filter.status);
  if (filter.topic) list = list.filter((e) => e.topics.includes(filter.topic!));
  const byArea = new Map<string, Entry[]>();
  for (const e of list) {
    const area = c.map.topics.find((t) => e.topics.includes(t.id))?.area ?? e.topics.find((t) => c.map.areas.some((a) => a.id === t)) ?? 'other';
    byArea.set(area, [...(byArea.get(area) ?? []), e]);
  }
  return html`
<h1>Claim entries</h1>
<p class="lede">Each entry is one claim with its evidence level, its agreement status and why, the strongest objection, what we don't know, and its sources.</p>
<form class="filters" method="get">
  <label>Agreement status <select name="status"><option value="">Any</option>${c.map.agreementStatuses.map((s) => html`<option value="${s.id}"${filter.status === s.id ? ' selected' : ''}>${s.name}</option>`)}</select></label>
  <label>Topic <select name="topic"><option value="">Any</option>${c.map.topics.map((t) => html`<option value="${t.id}"${filter.topic === t.id ? ' selected' : ''}>${t.name}</option>`)}</select></label>
  <button type="submit" class="secondary">Filter</button>
</form>
${list.length === 0 ? html`<p>No entries match.</p>` : ''}
${c.map.areas.filter((a) => byArea.has(a.id)).map((a) => html`
<h2>${a.name}</h2>
<ul class="cards">${byArea.get(a.id)!.map(entryCard)}</ul>`)}`;
}

export function entryPage(e: Entry): Html {
  const c = commons();
  const kinds = e.evidence.kinds.map((k) => c.map.evidenceKinds.find((x) => x.id === k)?.name ?? k).join(', ');
  const status = c.map.agreementStatuses.find((s) => s.id === e.agreement.status);
  const citedBy = [...c.questions.values()].filter((q) => q.positions.some((p) => p.entries.includes(e.id)));
  return html`
<p class="crumbs"><a href="/entries">Entries</a></p>
<h1 class="claim">${e.claim}</h1>
<div class="meta">${statusBadge(e.agreement.status)} ${levelBadge(e.evidence.level)} ${e.topics.map((t) => html`<a class="badge topic" href="/entries?topic=${t}">${topicName(t)}</a>`)}</div>
${provenance(e)}

<dl class="fields">
  <dt>Agreement status</dt>
  <dd><strong>${status?.name ?? e.agreement.status}</strong> <span class="muted">(${status?.meaning ?? ''})</span><br>${e.agreement.why}</dd>
  <dt>What would change it</dt><dd>${e.agreement.wouldChange}</dd>
  <dt>Evidence</dt><dd><strong>${c.map.evidenceLevels.find((l) => l.id === e.evidence.level)?.name}</strong>; kind: ${kinds}.<br>${e.evidence.why}</dd>
  <dt>Strongest objection</dt><dd>${e.objection}</dd>
  <dt>What we don't know</dt><dd>${e.unknowns}</dd>
  <dt>Sources</dt>
  <dd><ul class="sources">${e.sources.map((s) => {
    const a = c.artifacts.get(s.artifact);
    return html`<li><a href="/artifacts/${s.artifact}">${a?.citation ?? s.artifact}</a><br><span class="muted">Location: ${s.location}</span>${s.note ? html`<br><span class="muted">Note: ${s.note}</span>` : ''}</li>`;
  })}</ul></dd>
</dl>
${e.body ? markdown(e.body) : ''}
${citedBy.length ? html`<h2 class="small">Questions that cite this entry</h2><ul>${citedBy.map((q) => html`<li><a href="/questions/${q.id}">${q.question}</a></li>`)}</ul>` : ''}

<section class="panel">
  <h2 class="small">Endorsements and disputes</h2>
  <p class="muted">None yet. Reviewers can endorse or dispute any published item; disputes stay visible here until resolved. (Not saved in the concept demo: see <a href="/review">Review</a> for how it works.)</p>
  <h2 class="small">History</h2>
  <p class="muted">Every change to this entry is a commit to <a href="https://github.com/kjzimmer/knowledgeCommons/commits/main/${e.file}" rel="noopener" target="_blank">${e.file}</a>.</p>
</section>`;
}

export function artifactsPage(): Html {
  const c = commons();
  const list = [...c.artifacts.values()].sort((a, b) => a.citation.localeCompare(b.citation));
  return html`
<h1>Artifacts</h1>
<p class="lede">The works the commons draws on. Each records its rights status. The commons holds full text only for its contributors' own work, openly licensed and public-domain works, and works whose rights holders have given permission. For everything else it holds the citation, a summary, short quotations and a link, and says why.</p>
<ul class="plain">${list.map(artifactLine)}</ul>`;
}

export function artifactPage(id: string): Html | null {
  const c = commons();
  const a = c.artifacts.get(id);
  if (!a) return null;
  const citing = [...c.entries.values()].filter((e) => e.sources.some((s) => s.artifact === id));
  const passages = c.passages.filter((p) => p.artifact === id);
  return html`
<p class="crumbs"><a href="/artifacts">Artifacts</a></p>
<h1 class="claim">${text(a.citation)}</h1>
<div class="meta">${rightsBadge(a.rights.status)} <span class="badge">${a.kind}</span> ${a.topics.map((t) => html`<span class="badge topic">${topicName(t)}</span>`)}</div>
${provenance({ contributor: a.entered.by, basis: a.basis })}
<dl class="fields">
  <dt>Rights</dt><dd>${a.rights.why}${a.rights.permission === 'to-request' ? html`<br><a href="/permissions">On the permission log as a request to make</a>` : ''}</dd>
  <dt>Link</dt><dd>${a.url ? html`<a href="${a.url}" rel="noopener" target="_blank">${a.url}</a>` : html`<span class="muted">None recorded</span>`}</dd>
  <dt>How it entered</dt><dd>${a.entered.how}, by ${contributorName(a.entered.by)}, ${a.entered.date}</dd>
  ${a.note ? html`<dt>Note</dt><dd>${a.note}</dd>` : ''}
</dl>
${markdown(a.body)}
${passages.length ? html`<h2>Full text, by passage</h2>${passages.map((p) => html`<details class="passage"><summary>${p.location}</summary>${markdown(p.text)}</details>`)}` : html`<p class="muted">Full text not held: ${a.rights.why}</p>`}
<h2 class="small">Entries that cite it</h2>
${citing.length ? html`<ul class="cards">${citing.map(entryCard)}</ul>` : html`<p class="muted">None yet. The curator drafts entries from new artifacts.</p>`}`;
}

export function questionsPage(): Html {
  const c = commons();
  const qs = [...c.questions.values()];
  const group = (kind: string) => qs.filter((q) => q.kind === kind);
  const item = (q: (typeof qs)[number]) => html`<li class="card"><a class="card-title" href="/questions/${q.id}">${q.question}</a>
  <div class="meta"><span class="badge">${q.status}</span> ${q.positions.length ? html`<span class="badge">${q.positions.length} positions</span>` : html`<span class="badge">No positions yet</span>`}${q.sample ? html` <span class="badge sample">Sample positions</span>` : ''}</div></li>`;
  return html`
<h1>Open questions</h1>
<p class="lede">Questions the commons is holding, with their positions and what they turn on. Questions also come from gaps Holon reports, from sources, and from discussions on host sites.</p>
<h2>About what we know</h2>
<ul class="cards">${group('knowledge').map(item)}</ul>
<h2>About the commons itself</h2>
<ul class="cards">${group('about-the-commons').map(item)}</ul>`;
}

export function questionPage(id: string): Html | null {
  const c = commons();
  const q = c.questions.get(id);
  if (!q) return null;
  return html`
<p class="crumbs"><a href="/questions">Questions</a></p>
<h1 class="claim">${q.question}</h1>
<div class="meta"><span class="badge">${q.status}</span>${q.sample ? html` <span class="badge sample">Sample positions, drafted for the demo</span>` : ''}</div>
<p class="prov">Seeded ${q.seeded} by ${contributorName(q.contributor)}.</p>
${q.notes ? html`<p>${q.notes}</p>` : ''}
<h2>Positions</h2>
${q.positions.length === 0 ? html`<p class="muted">No positions recorded yet.</p>` : html`<ul class="positions">${q.positions.map((p) => html`<li><strong>${p.holder}</strong>: ${p.position}${p.entries.length ? html`<br><span class="muted">Entries:</span> ${p.entries.map((eid) => html`<a class="cite" href="/entries/${eid}">${eid}</a> `)}` : html`<br><span class="muted">No entry yet</span>`}</li>`)}</ul>`}
${q.cruxes.length ? html`<h2>What it turns on</h2><ul>${q.cruxes.map((x) => html`<li>${x}</li>`)}</ul>` : ''}
${q.gaps.length ? html`<h2>Known gaps</h2><ul>${q.gaps.map((x) => html`<li>${x}</li>`)}</ul>` : ''}`;
}

export function searchPage(query: string): Html {
  const hits: SearchHit[] = query ? search(query, { limit: 40 }) : [];
  const c = commons();
  const href = (h: SearchHit) => (h.kind === 'entry' ? `/entries/${h.id}` : h.kind === 'artifact' ? `/artifacts/${h.id}` : `/questions/${h.id}`);
  return html`
<h1>Search</h1>
<form class="search-form" method="get"><label for="q" class="visually-hidden">Search</label><input id="q" name="q" type="search" value="${query}" placeholder="Search entries, artifacts and questions"> <button type="submit">Search</button></form>
${query ? html`<p class="muted">${hits.length} result${hits.length === 1 ? '' : 's'} for “${query}”.</p>` : ''}
<ul class="results">${hits.map((h) => html`<li><span class="badge">${h.kind}</span> <a href="${href(h)}">${h.title}</a>${h.kind === 'entry' ? html` ${statusBadge(c.entries.get(h.id)!.agreement.status)}` : ''}</li>`)}</ul>
<p class="muted">Plain full-text search. Semantic search can be added later if the test sets show it is missing things.</p>`;
}
