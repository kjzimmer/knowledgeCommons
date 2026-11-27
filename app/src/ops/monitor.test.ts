// app/src/ops/monitor.test.ts
// Acceptance tests for the monitor's checks (tests/acceptance.yaml: T-MON-*). Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBudget, checkJob, checkKeyExpiry, shouldAlert } from './monitor';
import { Budget, Spend } from './budget';

const now = new Date(Date.UTC(2026, 10, 27, 12));
const day = (n: number) => new Date(now.getTime() + n * 86_400_000).toISOString().slice(0, 10);

test('T-MON-004: a key 10 days from expiry fails; 30 days passes; a missing expiry warns; no key fails', () => {
  assert.equal(checkKeyExpiry(true, day(10), now, 14).result, 'fail');
  assert.equal(checkKeyExpiry(true, day(30), now, 14).result, 'ok');
  assert.equal(checkKeyExpiry(true, day(-1), now, 14).result, 'fail');
  assert.equal(checkKeyExpiry(true, undefined, now, 14).result, 'warn');
  assert.equal(checkKeyExpiry(true, 'next spring', now, 14).result, 'warn');
  assert.equal(checkKeyExpiry(false, day(30), now, 14).result, 'fail');
});

test('T-MON-005: a job that has not succeeded within twice its interval fails', () => {
  const job = { name: 'monitor', everyMinutes: 360 };
  assert.equal(checkJob(job, new Date(now.getTime() - 5 * 3_600_000), now, 2).result, 'ok');
  assert.equal(checkJob(job, new Date(now.getTime() - 13 * 3_600_000), now, 2).result, 'fail');
  assert.equal(checkJob(job, null, now, 2).result, 'warn');
});

test('T-MON-006: a spent share fails, 80% warns; the seeding allowance is checked on its own', () => {
  const b: Budget = {
    monthlyUsd: 50,
    shares: [
      { id: 'holon', label: 'Holon', percent: 30, usd: 15, agents: ['holon'] },
      { id: 'audit', label: 'Audit', percent: 15, usd: 7.5, agents: ['auditor'] },
      { id: 'curation', label: 'Curation', percent: 25, usd: 12.5, agents: ['curator'] },
    ],
    otherLabel: 'Other',
    priority: [],
    rules: [],
    seeding: { usd: 20, servedFor: 'seeding', about: '' },
  };
  const s: Spend = { byShare: { holon: 1, audit: 7.5, curation: 10.5, other: 0.01 }, monthTotal: 19.01, seeding: 4, today: 0.5 };
  const r = Object.fromEntries(checkBudget(b, s, 2, 0.8).map((x) => [x.id, x.result]));
  assert.equal(r['budget:holon'], 'ok');
  assert.equal(r['budget:audit'], 'fail');
  assert.equal(r['budget:curation'], 'warn');
  assert.equal(r['budget:seeding'], 'ok');
  assert.equal(r['budget:today'], 'ok');
});

test('T-MON-007: the same failures do not send a second email within a day; changed failures do', () => {
  const recent = { at: new Date(now.getTime() - 6 * 3_600_000), failing: ['key'] };
  assert.equal(shouldAlert([], null, now, 24), false);
  assert.equal(shouldAlert(['key'], null, now, 24), true);
  assert.equal(shouldAlert(['key'], recent, now, 24), false);
  assert.equal(shouldAlert(['database', 'key'], recent, now, 24), true);
  assert.equal(shouldAlert(['key'], { at: new Date(now.getTime() - 25 * 3_600_000), failing: ['key'] }, now, 24), true);
});
