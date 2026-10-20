// app/src/content/search.ts
// Plain full-text search over entries, artifacts and questions (BM25 over an in-memory index).
// No embeddings or vector store, per the brief. Semantic search can be added behind `search()` later.

import { commons } from './load';

export type DocKind = 'entry' | 'artifact' | 'question';

export interface SearchHit {
  kind: DocKind;
  id: string;
  title: string;
  score: number;
}

interface Doc {
  kind: DocKind;
  id: string;
  title: string;
  topics: string[];
  terms: Map<string, number>;
  length: number;
}

const STOP = new Set(
  ('a an and are as at be but by can do does for from has have how if in into is it its of on or our so than that the their them then there these they this to was we what when where which who why will with without would you your not no always ever never often really just about').split(' '),
);

/** Lowercase words, stopwords dropped, a light plural/suffix strip so "commons" finds "commons" and "systems" finds "system" */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => {
      if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
      if (w.length > 4 && w.endsWith('ing')) return w.slice(0, -3);
      if (w.length > 5 && w.endsWith('ed') && !w.endsWith('eed')) return w.slice(0, -2);
      if (w.length > 6 && w.endsWith('ure')) return w.slice(0, -3);
      if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
      return w;
    });
}

function makeDoc(kind: DocKind, id: string, title: string, topics: string[], fields: [string, number][]): Doc {
  const terms = new Map<string, number>();
  let length = 0;
  for (const [text, weight] of fields) {
    for (const t of tokenize(text)) {
      terms.set(t, (terms.get(t) ?? 0) + weight);
      length += weight;
    }
  }
  return { kind, id, title, topics, terms, length };
}

let index: { docs: Doc[]; df: Map<string, number>; avgLen: number } | null = null;

function buildIndex() {
  const c = commons();
  const topicName = new Map([...c.map.areas, ...c.map.topics].map((t) => [t.id, t.name]));
  const topicText = (ids: string[]) => ids.map((id) => topicName.get(id) ?? id).join(' ');
  const docs: Doc[] = [];

  for (const e of c.entries.values()) {
    if (e.status !== 'published') continue;
    const citations = e.sources.map((s) => c.artifacts.get(s.artifact)?.citation ?? '').join(' ');
    docs.push(makeDoc('entry', e.id, e.claim, e.topics, [
      [e.claim, 3], [topicText(e.topics), 3], [e.objection, 1], [e.unknowns, 1], [e.evidence.why, 1],
      [e.agreement.why, 1], [citations, 1], [e.body, 1],
    ]));
  }
  for (const a of c.artifacts.values()) {
    docs.push(makeDoc('artifact', a.id, a.citation, a.topics, [[a.citation, 2], [topicText(a.topics), 2], [a.body, 1]]));
  }
  for (const q of c.questions.values()) {
    const positions = q.positions.map((p) => `${p.holder} ${p.position}`).join(' ');
    docs.push(makeDoc('question', q.id, q.question, [], [[q.question, 3], [positions, 1], [q.cruxes.join(' '), 1], [q.notes ?? '', 1]]));
  }

  const df = new Map<string, number>();
  for (const d of docs) for (const t of d.terms.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const avgLen = docs.reduce((s, d) => s + d.length, 0) / Math.max(docs.length, 1);
  index = { docs, df, avgLen };
}

export function search(query: string, opts: { kinds?: DocKind[]; topics?: string[]; limit?: number } = {}): SearchHit[] {
  if (!index) buildIndex();
  const { docs, df, avgLen } = index!;
  const q = [...new Set(tokenize(query))];
  if (q.length === 0) return [];
  const N = docs.length;
  const k1 = 1.4;
  const b = 0.75;
  const hits: SearchHit[] = [];
  for (const d of docs) {
    if (opts.kinds && !opts.kinds.includes(d.kind)) continue;
    if (opts.topics?.length && !d.topics.some((t) => opts.topics!.includes(t))) continue;
    let score = 0;
    for (const t of q) {
      const tf = d.terms.get(t);
      if (!tf) continue;
      const n = df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * d.length) / avgLen)));
    }
    if (score > 0) hits.push({ kind: d.kind, id: d.id, title: d.title, score });
  }
  return hits.sort((x, y) => y.score - x.score).slice(0, opts.limit ?? 20);
}
