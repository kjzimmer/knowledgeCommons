// app/src/lib/html.ts
// Tiny HTML templating. `html` escapes every interpolated value unless it is already Html (from another `html`
// call or `raw`), so content can't inject markup by accident. Same pattern as the Abundance Architecture site.

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class Html {
  constructor(readonly value: string) {}
  toString(): string {
    return this.value;
  }
}

export type Part = Html | string | number | null | undefined | false | Part[];

function render(part: Part): string {
  if (part == null || part === false) return '';
  if (part instanceof Html) return part.value;
  if (Array.isArray(part)) return part.map(render).join('');
  return escapeHtml(String(part));
}

export function html(strings: TemplateStringsArray, ...parts: Part[]): Html {
  let out = strings[0];
  for (let i = 0; i < parts.length; i++) out += render(parts[i]) + strings[i + 1];
  return new Html(out);
}

/** Trusted markup, inserted as-is */
export function raw(value: string): Html {
  return new Html(value);
}

const PLACEHOLDER_RE = /\[[A-Z][A-Z0-9 ,'’-]+\]/g;

/** Text with bracketed placeholders such as [COMMONS NAME] shown in the muted placeholder style */
export function text(value: string | null | undefined, empty = '—'): Html {
  if (value == null || value.trim() === '') return html`<span class="muted">${empty}</span>`;
  const out: Part[] = [];
  let last = 0;
  for (const m of value.matchAll(PLACEHOLDER_RE)) {
    out.push(value.slice(last, m.index), html`<span class="ph">${m[0]}</span>`);
    last = m.index! + m[0].length;
  }
  out.push(value.slice(last));
  return html`${out}`;
}
