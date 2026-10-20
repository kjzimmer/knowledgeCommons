// app/src/lib/markdown.ts
// Markdown to HTML for repository content and Holon's answers. Raw HTML in the source is escaped first, so
// neither a content file nor a model answer can inject markup. Links are limited to http(s), relative paths
// and in-page anchors.

import { Marked } from 'marked';
import { escapeHtml } from './html';

const marked = new Marked({ gfm: true, breaks: false });

marked.use({
  renderer: {
    // Escape any raw HTML block or inline tag instead of passing it through
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens);
      const safe = /^(https?:\/\/|\/|#|[\w.-]+\.md$)/i.test(href) ? href : '#';
      const external = /^https?:\/\//i.test(safe);
      return `<a href="${escapeHtml(safe)}"${title ? ` title="${escapeHtml(title)}"` : ''}${
        external ? ' rel="noopener" target="_blank"' : ''
      }>${label}</a>`;
    },
    image({ text }) {
      return escapeHtml(text);
    },
  },
});

export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false }) as string;
}
