// app/src/scripts/check-trace.ts
// The traceability check (development standard, section 2; requirements/00-standard.md, section 9).
// Reads requirements/, tests/acceptance.yaml, decisions/ and agents/*/spec.md; fails on orphans, missing tests,
// unknown or retired links and malformed ids; writes requirements/traceability.md. Run: npm run trace:check

import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import { REPO_ROOT } from '../content/load';

interface Req {
  id: string;
  title: string;
  level: 'L1' | 'L2' | 'L3';
  file: string;
  statement: string;
  parents: string[];
  verification: string[];
  status: string;
  phase: string;
  decisions: string[];
}

interface Test {
  id: string;
  title: string;
  kind: string;
  status: string;
  file?: string;
}

const STATUSES = ['proposed', 'accepted', 'built', 'verified', 'retired'];
const TEST_KINDS = ['automated', 'harness', 'manual'];
const TEST_STATUSES = ['planned', 'written', 'passing', 'failing'];
const ID = /^(P-\d{2}|SYS-[A-Z0-9]+-\d{3}|CAP-[A-Z]+-\d{3}|SRF-[A-Z]+-\d{3})$/;
const TEST_ID = /^T-[A-Z]+-\d{3}(-[a-z]+)?$/;

const errors: string[] = [];
const warnings: string[] = [];
const rel = (abs: string) => path.relative(REPO_ROOT, abs).replace(/\\/g, '/');
const list = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => String(x)) : []);

function mdFilesUnder(dir: string): string[] {
  const abs = path.join(REPO_ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const p = path.join(abs, e.name);
    if (e.isDirectory()) out.push(...mdFilesUnder(rel(p)));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out.sort();
}

function levelOf(id: string): Req['level'] {
  return id.startsWith('P-') ? 'L1' : id.startsWith('SYS-') ? 'L2' : 'L3';
}

// ─── Requirements ───────────────────────────────────────────────────────────────────────────────────────────

const reqs = new Map<string, Req>();
// The standard itself shows an example requirement; the generated file repeats every id
const skip = new Set(['requirements/00-standard.md', 'requirements/traceability.md']);
for (const abs of mdFilesUnder('requirements')) {
  const file = rel(abs);
  if (skip.has(file)) continue;
  const src = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n');
  const block = /^### (\S+) · (.+)\n+```yaml\n([\s\S]*?)\n```/gm;
  for (const m of src.matchAll(block)) {
    const [, id, title] = m;
    let data: Record<string, unknown> = {};
    try {
      data = (parseYaml(m[3]) ?? {}) as Record<string, unknown>;
    } catch (err) {
      errors.push(`${file} ${id}: YAML does not parse (${err instanceof Error ? err.message.split('\n')[0] : err})`);
    }
    if (!ID.test(id)) errors.push(`${file}: "${id}" is not a valid requirement id`);
    if (reqs.has(id)) errors.push(`${file}: ${id} is defined twice (also in ${reqs.get(id)!.file})`);
    const r: Req = {
      id,
      title: title.trim(),
      level: levelOf(id),
      file,
      statement: String(data.statement ?? '').trim(),
      parents: list(data.parents),
      verification: list(data.verification),
      status: String(data.status ?? ''),
      phase: String(data.phase ?? ''),
      decisions: list(data.decisions).map((d) => d.padStart(4, '0')),
    };
    if (!r.statement) errors.push(`${file} ${id}: no statement`);
    if (!STATUSES.includes(r.status)) errors.push(`${file} ${id}: status "${r.status}" is not one of ${STATUSES.join(', ')}`);
    if (r.level !== 'L1' && !['now', 'next', 'later'].includes(r.phase)) errors.push(`${file} ${id}: phase must be now, next or later`);
    if (r.level !== 'L1' && /\bshould\b/i.test(r.statement)) errors.push(`${file} ${id}: statements say "shall", never "should"`);
    if (r.level !== 'L1' && !/\bshall\b/.test(r.statement)) errors.push(`${file} ${id}: statement has no "shall"`);
    reqs.set(id, r);
  }
}

// ─── Tests ──────────────────────────────────────────────────────────────────────────────────────────────────

const tests = new Map<string, Test>();
const testsFile = 'tests/acceptance.yaml';
if (!fs.existsSync(path.join(REPO_ROOT, testsFile))) {
  errors.push(`${testsFile}: missing`);
} else {
  const data = (parseYaml(fs.readFileSync(path.join(REPO_ROOT, testsFile), 'utf8')) ?? {}) as { tests?: Record<string, unknown>[] };
  for (const t of data.tests ?? []) {
    const test: Test = { id: String(t.id ?? ''), title: String(t.title ?? ''), kind: String(t.kind ?? ''), status: String(t.status ?? ''), file: t.file ? String(t.file) : undefined };
    if (!TEST_ID.test(test.id)) errors.push(`${testsFile}: "${test.id}" is not a valid test id`);
    if (tests.has(test.id)) errors.push(`${testsFile}: ${test.id} is defined twice`);
    if (!TEST_KINDS.includes(test.kind)) errors.push(`${testsFile} ${test.id}: kind must be one of ${TEST_KINDS.join(', ')}`);
    if (!TEST_STATUSES.includes(test.status)) errors.push(`${testsFile} ${test.id}: status must be one of ${TEST_STATUSES.join(', ')}`);
    if (!test.title) errors.push(`${testsFile} ${test.id}: no title`);
    if (test.file && !fs.existsSync(path.join(REPO_ROOT, test.file))) errors.push(`${testsFile} ${test.id}: file ${test.file} not found`);
    if (test.kind === 'automated' && test.status !== 'planned' && !test.file) errors.push(`${testsFile} ${test.id}: an automated test that exists names its file`);
    tests.set(test.id, test);
  }
}

// ─── Decisions ──────────────────────────────────────────────────────────────────────────────────────────────

const decisionsDir = path.join(REPO_ROOT, 'decisions');
const decisions = new Map<string, string>();
if (fs.existsSync(decisionsDir)) {
  for (const f of fs.readdirSync(decisionsDir)) {
    const m = f.match(/^(\d{4})-.+\.md$/);
    if (m) decisions.set(m[1], f);
  }
}
// Numbers the development standard reserves for records not drafted yet
const reservedDecisions = new Set(['0008', '0009']);

// ─── Links ──────────────────────────────────────────────────────────────────────────────────────────────────

const usedTests = new Set<string>();
for (const r of reqs.values()) {
  const where = `${r.file} ${r.id}`;
  if (r.level === 'L1') continue;
  if (r.parents.length === 0) errors.push(`${where}: no parents (orphan)`);
  for (const p of r.parents) {
    const parent = reqs.get(p);
    if (!parent) errors.push(`${where}: parent ${p} does not exist`);
    else if (parent.status === 'retired' && r.status !== 'retired') errors.push(`${where}: parent ${p} is retired`);
    else if (r.level === 'L2' && parent.level !== 'L1') errors.push(`${where}: an L2 standard traces to L1 principles, not ${p}`);
    else if (r.level === 'L3' && parent.level === 'L3') errors.push(`${where}: an L3 requirement traces to L1 or L2, not ${p}`);
  }
  if (r.level === 'L3' && r.status !== 'retired' && r.verification.length === 0) errors.push(`${where}: no verification (every L3 requirement needs a test)`);
  for (const t of r.verification) {
    usedTests.add(t);
    if (!tests.has(t)) errors.push(`${where}: test ${t} is not in ${testsFile}`);
  }
  if (r.status === 'verified' && r.verification.some((t) => tests.get(t)?.status !== 'passing')) {
    errors.push(`${where}: status is verified, but not every test is passing`);
  }
  for (const d of r.decisions) {
    if (!decisions.has(d) && !reservedDecisions.has(d)) errors.push(`${where}: decision ${d} does not exist in decisions/`);
  }
}
for (const t of tests.keys()) if (!usedTests.has(t)) warnings.push(`${testsFile}: ${t} verifies no requirement`);

// ─── Agent specifications (a parallel tree, tracing to the same principles) ────────────────────────────────

interface Spec { id: string; parents: string[] }
const specs: Spec[] = [];
const agentsDir = path.join(REPO_ROOT, 'agents');
for (const d of fs.existsSync(agentsDir) ? fs.readdirSync(agentsDir, { withFileTypes: true }) : []) {
  if (!d.isDirectory()) continue;
  const specFile = path.join(agentsDir, d.name, 'spec.md');
  if (!fs.existsSync(specFile)) {
    errors.push(`agents/${d.name}: no spec.md`);
    continue;
  }
  const m = fs.readFileSync(specFile, 'utf8').replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
  const data = (m ? parseYaml(m[1]) : {}) as Record<string, unknown>;
  const spec = { id: d.name, parents: list(data.parents) };
  if (spec.parents.length === 0) errors.push(`agents/${d.name}/spec.md: no parents`);
  for (const p of spec.parents) {
    const parent = reqs.get(p);
    if (!parent) errors.push(`agents/${d.name}/spec.md: parent ${p} does not exist`);
    else if (parent.status === 'retired') errors.push(`agents/${d.name}/spec.md: parent ${p} is retired`);
    else if (parent.level === 'L3') errors.push(`agents/${d.name}/spec.md: a specification traces to L1 or L2, not ${p}`);
  }
  specs.push(spec);
}

// ─── Report ─────────────────────────────────────────────────────────────────────────────────────────────────

const byLevel = (l: Req['level']) => [...reqs.values()].filter((r) => r.level === l);
const children = (id: string) => [...reqs.values()].filter((r) => r.parents.includes(id)).map((r) => r.id);
const testCell = (ids: string[]) => ids.map((t) => `${t}${tests.get(t) ? ` (${tests.get(t)!.status})` : ' (missing)'}`).join(', ');
const count = (list: Req[], status: string) => list.filter((r) => r.status === status).length;
const l3 = byLevel('L3');

const lines = [
  '# Traceability',
  '',
  '*Generated by `npm run trace:check` from `requirements/`, `tests/acceptance.yaml` and `agents/*/spec.md`. Do not edit by hand.*',
  '',
  `${byLevel('L1').length} principles, ${byLevel('L2').length} system standards, ${l3.length} surface and capability requirements ` +
    `(${count(l3, 'proposed')} proposed, ${count(l3, 'accepted')} accepted, ${count(l3, 'built')} built, ${count(l3, 'verified')} verified), ` +
    `${tests.size} tests (${[...tests.values()].filter((t) => t.status === 'passing').length} passing), ${specs.length} agent specifications.`,
  '',
  errors.length ? `**${errors.length} problem(s)** at the last run; see the check's output.` : 'The check passed.',
  '',
  '## L1 principles',
  '',
  '| Principle | Requirements tracing to it | Agent specifications tracing to it |',
  '|---|---|---|',
  ...byLevel('L1').map((p) => `| ${p.id} ${p.title} | ${children(p.id).length} | ${specs.filter((s) => s.parents.includes(p.id)).map((s) => s.id).join(', ') || '—'} |`),
  '',
  '## L2 system standards',
  '',
  byLevel('L2').length ? '| Id | Title | Parents | Status |\n|---|---|---|---|' : 'None written yet (stubs in `requirements/20-system/`).',
  ...byLevel('L2').map((r) => `| ${r.id} | ${r.title} | ${r.parents.join(', ')} | ${r.status} |`),
  '',
  '## L3 surface and capability requirements',
  '',
  '| Id | Title | Parents | Tests | Status | File |',
  '|---|---|---|---|---|---|',
  ...l3.map((r) => `| ${r.id} | ${r.title} | ${r.parents.join(', ')} | ${testCell(r.verification)} | ${r.status} | \`${r.file.replace('requirements/', '')}\` |`),
  '',
];
fs.writeFileSync(path.join(REPO_ROOT, 'requirements/traceability.md'), lines.join('\n'));

console.log(
  `${byLevel('L1').length} principles, ${byLevel('L2').length} L2, ${l3.length} L3, ${tests.size} tests, ${specs.length} agent specs, ${decisions.size} decisions`,
);
for (const w of warnings) console.warn(`  warning: ${w}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('Traceability OK (requirements/traceability.md written)');
