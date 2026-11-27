// app/src/ops/budget.ts
// The monthly budget and its shares (growth/budget.yaml), and month-to-date spending per share from the call log.
// A call belongs to the share of its agent: the part of its role before the first dot ("holon.ask" → holon).

import prisma, { dbConfigured } from '../lib/db';
import { commons } from '../content/load';

export interface Share {
  id: string;
  label: string;
  percent: number;
  usd: number;
  agents: string[];
}

export interface Budget {
  monthlyUsd: number;
  shares: Share[];
  otherLabel: string;
  priority: string[];
  rules: string[];
  seeding: { usd: number; servedFor: string; about: string } | null;
}

export function budget(): Budget {
  const b = commons().growth.budget as {
    monthlyBudgetUsd?: number;
    shares?: Record<string, { percent?: number; label?: string; agents?: string[] }>;
    otherLabel?: string;
    priority?: string[];
    rules?: string[];
    seedingAllowance?: { usd?: number; servedFor?: string; about?: string };
  };
  const monthlyUsd = Number(b.monthlyBudgetUsd) || 0;
  return {
    monthlyUsd,
    shares: Object.entries(b.shares ?? {}).map(([id, s]) => ({
      id,
      label: s.label ?? id,
      percent: Number(s.percent) || 0,
      usd: ((Number(s.percent) || 0) / 100) * monthlyUsd,
      agents: s.agents ?? [],
    })),
    otherLabel: b.otherLabel ?? 'Other',
    priority: b.priority ?? [],
    rules: b.rules ?? [],
    seeding: b.seedingAllowance
      ? { usd: Number(b.seedingAllowance.usd) || 0, servedFor: b.seedingAllowance.servedFor ?? 'seeding', about: b.seedingAllowance.about ?? '' }
      : null,
  };
}

export function startOfMonthUtc(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function startOfDayUtc(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export interface Spend {
  /** Month to date, per share id; "other" for agents in no share */
  byShare: Record<string, number>;
  monthTotal: number;
  /** All-time spend charged to the seeding allowance */
  seeding: number;
  today: number;
}

/** Month-to-date spend per share, today's total, and what the seeding allowance has used */
export async function spend(): Promise<Spend> {
  const b = budget();
  const out: Spend = { byShare: Object.fromEntries([...b.shares.map((s) => [s.id, 0]), ['other', 0]]), monthTotal: 0, seeding: 0, today: 0 };
  if (!dbConfigured()) return out;
  const shareOfAgent = new Map<string, string>();
  for (const s of b.shares) for (const a of s.agents) shareOfAgent.set(a, s.id);
  const seedingTag = b.seeding?.servedFor ?? 'seeding';
  const dayStart = startOfDayUtc();
  const [month, seeding, today] = await Promise.all([
    prisma.modelCall.groupBy({
      by: ['role'],
      _sum: { costUsd: true },
      where: { createdAt: { gte: startOfMonthUtc() }, NOT: { servedFor: seedingTag } },
    }),
    prisma.modelCall.aggregate({ _sum: { costUsd: true }, where: { servedFor: seedingTag } }),
    prisma.modelCall.aggregate({ _sum: { costUsd: true }, where: { createdAt: { gte: dayStart } } }),
  ]);
  for (const row of month) {
    const share = shareOfAgent.get(row.role.split('.')[0]) ?? 'other';
    const cost = row._sum.costUsd ?? 0;
    out.byShare[share] = (out.byShare[share] ?? 0) + cost;
    out.monthTotal += cost;
  }
  out.seeding = seeding._sum.costUsd ?? 0;
  out.today = today._sum.costUsd ?? 0;
  return out;
}
