// app/src/site/pages/pages.test.ts
// Acceptance tests for pages built in stage 1 of change brief 0.1 (tests/acceptance.yaml). Run: npm test
// Runs without a database: pages that read operational data show their empty states.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { commons } from '../../content/load';
import { budget } from '../../ops/budget';
import { agentPage, agentsPage, changelogPage, statePage } from './transparency';
import { operationsPage } from './operations';

test('T-PUB-007: /state and /changelog render the repository files, with links to their pages', () => {
  const state = statePage().value;
  const log = changelogPage().value;
  assert.match(state, /The state of/);
  assert.match(log, /Changelog/);
  assert.match(state, /href="\/changelog"/);
  assert.match(log, /href="\/state"/);
  assert.doesNotMatch(state + log, /href="[^"]*\.md"/, 'links to repository files are pointed at site pages');
});

test('T-AGT-006: the Agents page states the models per role and that they are not different providers', () => {
  const page = agentsPage().value;
  assert.match(page, /different Claude models, not different providers/);
  assert.match(page, /Opus audits work made by Sonnet/);
});

test('T-AGT-009: every agent folder has a page with its specification; instructions and settings where they exist', () => {
  const agents = [...commons().agents.values()];
  assert.ok(agents.length >= 13, 'all agents in agent definitions 0.2 are specified');
  for (const a of agents) {
    const page = agentPage(a.id)?.value ?? '';
    assert.match(page, /<h2>Specification<\/h2>/, `${a.id}: specification shown`);
    if (a.instructions !== null) assert.match(page, /Instructions, verbatim/, `${a.id}: instructions shown`);
    if (a.config) assert.match(page, /<h2>Settings<\/h2>/, `${a.id}: settings shown`);
    if (a.changelog) assert.match(page, /<h2>History<\/h2>/, `${a.id}: history shown`);
  }
});

test('T-GRW-010: the budget shares are those of change brief 0.1, section 13, and add up to the monthly budget', () => {
  const b = budget();
  const pct = Object.fromEntries(b.shares.map((s) => [s.id, s.percent]));
  assert.deepEqual(pct, { holon: 30, curation: 25, audit: 15, challenge: 10, facilitation: 10, scouting: 10 });
  assert.equal(b.shares.reduce((s, x) => s + x.usd, 0), b.monthlyUsd);
  assert.equal(b.seeding?.usd, 20);
});

test("T-MON-008: the Operations page shows the monitor's instructions; only a steward sees the run control", async () => {
  const visitor = (await operationsPage(false)).value;
  const steward = (await operationsPage(true)).value;
  assert.match(visitor, /The monitor&#39;s instructions|The monitor's instructions/);
  assert.match(visitor, /ANTHROPIC_KEY_EXPIRES/);
  assert.doesNotMatch(visitor, /action="\/operations\/run"/);
  assert.match(steward, /action="\/operations\/run"/);
});
