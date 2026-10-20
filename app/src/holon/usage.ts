// app/src/holon/usage.ts
// Cost of each model call at the prices in config/prices.yaml, the call log, and the fair-use limits.

import prisma, { dbConfigured } from '../lib/db';
import { commons } from '../content/load';
import { Usage } from './provider';

interface Price { input: number; output: number; cacheRead: number; cacheWrite: number }

export function priceOf(provider: string, model: string): Price | null {
  const table = commons().prices[provider] as Record<string, Price> | undefined;
  return table?.[model] ?? null;
}

export function costOf(provider: string, model: string, u: Usage): number {
  const p = priceOf(provider, model);
  if (!p) return 0;
  return (
    (u.inputTokens * p.input + u.outputTokens * p.output + u.cacheReadTokens * p.cacheRead + u.cacheWriteTokens * p.cacheWrite) /
    1_000_000
  );
}

export interface FairUse {
  questionsPerDay: number;
  dailySpendCeilingUsd: number;
}

export function fairUse(): FairUse {
  const f = (commons().growth.budget.fairUse ?? {}) as Record<string, number>;
  return {
    questionsPerDay: Number(f.holonQuestionsPerReviewerPerDay) || 30,
    dailySpendCeilingUsd: Number(process.env.DAILY_SPEND_CEILING_USD) || Number(f.dailySpendCeilingUsd) || 2,
  };
}

function startOfDayUtc(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Why Holon can't answer this asker right now, or null if it can */
export async function limitReached(askerEmail: string): Promise<string | null> {
  if (!dbConfigured()) return null;
  const since = startOfDayUtc();
  const limits = fairUse();
  const [asked, spend] = await Promise.all([
    prisma.holonMessage.count({
      where: { role: 'user', createdAt: { gte: since }, session: { askerEmail: askerEmail.toLowerCase() } },
    }),
    prisma.modelCall.aggregate({ _sum: { costUsd: true }, where: { createdAt: { gte: since } } }),
  ]);
  if (asked >= limits.questionsPerDay) {
    return `You've reached today's limit of ${limits.questionsPerDay} questions. The limit resets at midnight UTC.`;
  }
  if ((spend._sum.costUsd ?? 0) >= limits.dailySpendCeilingUsd) {
    return "Holon has reached today's shared spending limit and is paused until midnight UTC. The limit is published on the Costs page.";
  }
  return null;
}

export interface CallRecord {
  role: string;
  provider: string;
  model: string;
  instructionVersion: string;
  usage: Usage;
  servedFor: string;
  askerEmail?: string;
  sessionId?: string;
  stopReason: string;
}

export async function logCall(r: CallRecord): Promise<number> {
  const cost = costOf(r.provider, r.model, r.usage);
  if (dbConfigured()) {
    await prisma.modelCall.create({
      data: {
        role: r.role,
        provider: r.provider,
        model: r.model,
        instructionVersion: r.instructionVersion,
        inputTokens: r.usage.inputTokens,
        cacheReadTokens: r.usage.cacheReadTokens,
        cacheWriteTokens: r.usage.cacheWriteTokens,
        outputTokens: r.usage.outputTokens,
        costUsd: cost,
        servedFor: r.servedFor,
        askerEmail: r.askerEmail?.toLowerCase(),
        sessionId: r.sessionId,
        stopReason: r.stopReason,
      },
    });
  }
  return cost;
}
