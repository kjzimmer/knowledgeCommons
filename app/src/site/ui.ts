// app/src/site/ui.ts
// Small shared pieces: status badges, labels for provenance, entry cards, and Holon's rendered answers.

import { commons } from '../content/load';
import { Artifact, Entry } from '../content/types';
import { escapeHtml, Html, html, raw } from '../lib/html';
import { renderMarkdown } from '../lib/markdown';

function nameOf(list: { id: string; name: string }[], id: string): string {
  return list.find((x) => x.id === id)?.name ?? id;
}

export function statusBadge(status: string): Html {
  return html`<span class="badge status-${status}">${nameOf(commons().map.agreementStatuses, status)}</span>`;
}

export function levelBadge(level: string): Html {
  return html`<span class="badge level">${nameOf(commons().map.evidenceLevels, level)}</span>`;
}

export function rightsBadge(status: string): Html {
  const r = commons().map.rightsStatuses.find((x) => x.id === status);
  return html`<span class="badge ${r?.fullText ? 'rights-full' : 'rights-cite'}">${r?.name ?? status}${r?.fullText ? ' · full text held' : ''}</span>`;
}

export function topicName(id: string): string {
  const c = commons();
  return nameOf([...c.map.areas, ...c.map.topics], id);
}

export function contributorName(id: string): string {
  return commons().contributors.get(id)?.name ?? id;
}

/** "AI-drafted, unreviewed · from the model's knowledge of the work" and similar */
export function provenance(item: { contributor?: string; basis: string; review?: string; approver?: string | null }): Html {
  const c = item.contributor ? commons().contributors.get(item.contributor) : undefined;
  const ai = c?.kind === 'agent';
  const basis =
    item.basis === 'checked-against-text' ? 'checked against the text'
      : item.basis === 'own-work' ? "the contributor's own work"
        : "from the model's knowledge of the work, not checked against the text";
  return html`<p class="prov">${ai ? html`<span class="badge ai">AI-drafted</span> ` : ''}${
    item.review === 'reviewed' ? html`<span class="badge ok">Reviewed</span>` : html`<span class="badge warn">Unreviewed</span>`
  } Contributed by ${c?.name ?? item.contributor ?? 'unknown'}${c?.model ? html` (model ${c.model})` : ''}; basis: ${basis}. Approved by: ${item.approver ?? 'not yet approved'}.</p>`;
}

export function entryCard(e: Entry): Html {
  return html`<li class="card">
  <a class="card-title" href="/entries/${e.id}">${e.claim}</a>
  <div class="meta">${statusBadge(e.agreement.status)} ${levelBadge(e.evidence.level)} ${
    commons().contributors.get(e.contributor)?.kind === 'agent' ? html`<span class="badge ai">AI-drafted</span>` : ''
  } <span class="badge warn">Unreviewed</span></div>
</li>`;
}

export function artifactLine(a: Artifact): Html {
  return html`<li><a href="/artifacts/${a.id}">${a.citation}</a> ${rightsBadge(a.rights.status)}</li>`;
}

export function markdown(source: string): Html {
  return raw(renderMarkdown(source));
}

/** Holon's answer: Markdown rendered safely, then [[entry:id]] / [[question:id]] turned into citation links */
export function renderAnswer(markdownText: string): Html {
  const c = commons();
  const rendered = renderMarkdown(markdownText).replace(/\[\[(entry|question):([a-z0-9-]+)\]\]/g, (_m, kind: string, id: string) => {
    if (kind === 'entry' && c.entries.has(id)) {
      const e = c.entries.get(id)!;
      return `<a class="cite" href="/entries/${id}" title="${escapeHtml(e.claim)}">${escapeHtml(id)}</a>`;
    }
    if (kind === 'question' && c.questions.has(id)) {
      return `<a class="cite q" href="/questions/${id}" title="${escapeHtml(c.questions.get(id)!.question)}">${escapeHtml(id)}</a>`;
    }
    return `<span class="cite bad" title="Holon cited an id the commons does not hold">${escapeHtml(id)}?</span>`;
  });
  return raw(rendered);
}

export function usd(n: number): string {
  if (n === 0) return '$0.00';
  return n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(2)}`;
}
