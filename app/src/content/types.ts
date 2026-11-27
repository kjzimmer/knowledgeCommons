// app/src/content/types.ts
// Shapes of the commons' files once loaded and validated. The files themselves are the source of truth.

export type Basis = 'checked-against-text' | 'model-knowledge' | 'own-work';

export interface Contributor {
  id: string;
  kind: 'person' | 'agent' | 'site';
  name: string;
  model?: string;
  provider?: string;
  instructions?: string;
  note?: string;
}

export interface Rights {
  status: string;
  why: string;
  permission?: string;
}

export interface Artifact {
  id: string;
  citation: string;
  kind: string;
  url: string | null;
  year: number | null;
  topics: string[];
  rights: Rights;
  entered: { how: string; by: string; date: string };
  basis: Basis;
  note?: string;
  /** Repository-relative path of the full text, where rights allow it to be held */
  fullText?: string;
  /** Markdown body: summary and short quotations */
  body: string;
  file: string;
}

export interface Passage {
  artifact: string;
  location: string;
  text: string;
}

export interface EntrySource {
  artifact: string;
  location: string;
  note?: string;
}

export interface Entry {
  id: string;
  claim: string;
  evidence: { level: string; kinds: string[]; why: string };
  agreement: { status: string; why: string; wouldChange: string };
  objection: string;
  unknowns: string;
  sources: EntrySource[];
  topics: string[];
  contributor: string;
  basis: Basis;
  approver: string | null;
  status: 'published' | 'withdrawn';
  review: 'unreviewed' | 'reviewed';
  body: string;
  file: string;
}

export interface Position {
  holder: string;
  position: string;
  entries: string[];
}

export interface Question {
  id: string;
  question: string;
  status: string;
  kind: 'knowledge' | 'about-the-commons';
  sample: boolean;
  positions: Position[];
  cruxes: string[];
  gaps: string[];
  notes?: string;
  contributor: string;
  seeded: string;
  file: string;
}

/** One agent's folder, `agents/<id>/`, laid out as the development standard (section 5) sets */
export interface Agent {
  id: string;
  name: string;
  kind: 'knowledge' | 'app-team';
  /** running | specified (to be built) | later (specification only) */
  status: 'running' | 'specified' | 'later';
  summary: string;
  /** The L1 principles (and later L2 standards) the specification traces to */
  parents: string[];
  source: string;
  /** spec.md body: purpose, does, never, memory, checked by, people, tests */
  spec: string;
  /** From instructions.md, when the agent has instructions yet */
  version: string | null;
  updated: string | null;
  note?: string;
  /** Instructions text, verbatim (the Markdown body), or null for a specification-only agent */
  instructions: string | null;
  /** config.yaml: provider, model, limits */
  config: Record<string, unknown> | null;
  testedOn: unknown;
  /** tests/*.yaml: the agent's test set */
  tests: { file: string; data: Record<string, unknown> }[];
  changelog: string;
}

export interface Named {
  id: string;
  name: string;
  meaning?: string;
  about?: string;
  area?: string;
}

export interface CommonsContent {
  artifacts: Map<string, Artifact>;
  entries: Map<string, Entry>;
  questions: Map<string, Question>;
  agents: Map<string, Agent>;
  contributors: Map<string, Contributor>;
  passages: Passage[];
  map: {
    purpose: string;
    areas: Named[];
    topics: Named[];
    evidenceLevels: Named[];
    evidenceKinds: Named[];
    agreementStatuses: Named[];
    rightsStatuses: (Named & { fullText: boolean })[];
    glossary: { term: string; meaning: string }[];
  };
  docs: { readme: string; charter: string; licence: string; funding: string; structure: string; state: string; changelog: string };
  growth: { budget: Record<string, unknown>; watchlist: Record<string, unknown>; seedList: Record<string, unknown> };
  permissions: Record<string, unknown>;
  demo: { proposals: Record<string, unknown>; growth: Record<string, unknown> };
  prices: Record<string, unknown>;
}
