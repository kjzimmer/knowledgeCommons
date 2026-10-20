// app/src/site/layout.ts
// The page shell: header, navigation, the concept-demo banner, footer.

import { Html, html, Part } from '../lib/html';
import { Reviewer } from '../lib/review';

const NAV: [string, string][] = [
  ['/', 'Ask Holon'],
  ['/entries', 'Entries'],
  ['/questions', 'Questions'],
  ['/search', 'Search'],
  ['/contribute', 'Contribute'],
  ['/review', 'Review'],
  ['/growth', 'Growth'],
  ['/how-it-works', 'How it works'],
];

const TRANSPARENCY: [string, string][] = [
  ['/how-it-works', 'The definition'],
  ['/agents', 'Agents'],
  ['/costs', 'Costs'],
  ['/funding', 'Funding'],
  ['/changes', 'Changes'],
  ['/permissions', 'Permissions'],
  ['/artifacts', 'Artifacts'],
  ['/interface', 'Interface'],
];

export interface PageOptions {
  title: string;
  path: string;
  reviewer: Reviewer | null;
  body: Part;
  /** Shown under the title as a "sample data" notice when the page uses demo/ data */
  sample?: string;
  scripts?: string[];
}

export function page(o: PageOptions): string {
  const current = (href: string) =>
    href === '/' ? o.path === '/' : o.path === href || o.path.startsWith(`${href}/`);
  const doc: Html = html`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${o.title} · [COMMONS NAME]</title>
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<div class="banner">Concept demo, for invited reviewers. Content marked <em>AI-drafted, unreviewed</em> or <em>sample</em> shows how the commons would work; it is not reviewed knowledge.</div>
<header class="site">
  <div class="wrap header-row">
    <a class="brand" href="/"><span class="ph">[COMMONS NAME]</span><span class="tag">a knowledge commons on living systems</span></a>
    ${o.reviewer ? html`<span class="who">${o.reviewer.name}${o.reviewer.role === 'steward' ? html` · <a href="/sessions">Sessions</a>` : ''}</span>` : ''}
  </div>
  <nav class="wrap main-nav" aria-label="Main">
    ${NAV.map(([href, label]) => html`<a href="${href}"${current(href) ? html` aria-current="page"` : ''}>${label}</a>`)}
  </nav>
</header>
<main class="wrap">
${o.sample ? html`<p class="sample-note"><strong>Sample data.</strong> ${o.sample}</p>` : ''}
${o.body}
</main>
<footer class="site">
  <div class="wrap">
    <nav aria-label="Transparency">${TRANSPARENCY.map(([href, label]) => html`<a href="${href}">${label}</a>`)}</nav>
    <p>Everything here is public and inspectable except the private questions people ask Holon. All content lives as plain files in a <a href="https://github.com/kjzimmer/knowledgeCommons" rel="noopener" target="_blank">public repository</a>. Draft 0.2, not adopted.</p>
  </div>
</footer>
${(o.scripts ?? []).map((s) => html`<script src="${s}" defer></script>`)}
</body>
</html>`;
  return doc.value;
}
