// app/src/ops/monitor.ts
// The monitor (agents/monitor/): scheduled checks that the app, the database, the models, the AI key, the
// scheduled jobs and the budget are in order; alerts Karl by email when a check fails. It changes nothing it
// checks. Its instructions in plain language are agents/monitor/instructions.md; results are on /operations.

import prisma, { dbConfigured } from '../lib/db';
import { commons, contentErrors } from '../content/load';
import { providers } from '../holon/anthropic';
import { anthropicConfigured } from '../holon/anthropic';
import { fairUse, logCall } from '../holon/usage';
import { budget, spend, Spend, Budget } from './budget';
import { scheduledJobs, Job } from './scheduler';

export type Result = 'ok' | 'warn' | 'fail';

export interface CheckResult {
  id: string;
  name: string;
  result: Result;
  detail: string;
}

interface MonitorSettings {
  everyHours: number;
  keyExpiryWarningDays: number;
  budgetWarningShare: number;
  jobLateAfterIntervals: number;
  repeatSameFailuresAfterHours: number;
}

export function monitorSettings(): MonitorSettings {
  const c = (commons().agents.get('monitor')?.config ?? {}) as {
    schedule?: { everyHours?: number };
    checks?: { keyExpiryWarningDays?: number; budgetWarningShare?: number; jobLateAfterIntervals?: number };
    alerts?: { repeatSameFailuresAfterHours?: number };
  };
  return {
    everyHours: Number(c.schedule?.everyHours) || 6,
    keyExpiryWarningDays: Number(c.checks?.keyExpiryWarningDays) || 14,
    budgetWarningShare: Number(c.checks?.budgetWarningShare) || 0.8,
    jobLateAfterIntervals: Number(c.checks?.jobLateAfterIntervals) || 2,
    repeatSameFailuresAfterHours: Number(c.alerts?.repeatSameFailuresAfterHours) || 24,
  };
}

function monitorVersion(): string {
  return `monitor ${commons().agents.get('monitor')?.version ?? '?'}`;
}

// ─── Pure checks (tested in monitor.test.ts) ────────────────────────────────────────────────────────────────

/** The AI key: set, and its recorded expiry (YYYY-MM-DD) more than `warningDays` away */
export function checkKeyExpiry(keySet: boolean, expires: string | undefined, now: Date, warningDays: number): CheckResult {
  const base = { id: 'key', name: 'The AI key' };
  if (!keySet) return { ...base, result: 'fail', detail: 'No AI key is set, so no agent can run.' };
  const raw = (expires ?? '').trim();
  if (!raw) return { ...base, result: 'warn', detail: 'The key is set, but its expiry is not recorded (ANTHROPIC_KEY_EXPIRES), so the monitor cannot warn before it expires.' };
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const at = m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : NaN;
  if (Number.isNaN(at)) return { ...base, result: 'warn', detail: `The recorded expiry "${raw}" is not a date in the form YYYY-MM-DD.` };
  const days = Math.floor((at - now.getTime()) / 86_400_000);
  if (days < 0) return { ...base, result: 'fail', detail: `The key expired on ${raw}.` };
  if (days < warningDays) return { ...base, result: 'fail', detail: `The key expires on ${raw}, in ${days} day${days === 1 ? '' : 's'}. Create a new one and update ANTHROPIC_API_KEY and ANTHROPIC_KEY_EXPIRES.` };
  return { ...base, result: 'ok', detail: `The key is set and expires on ${raw}, in ${days} days.` };
}

/** A scheduled job: succeeded within `lateAfter` times its interval */
export function checkJob(job: Pick<Job, 'name' | 'everyMinutes'>, lastSuccess: Date | null, now: Date, lateAfter: number): CheckResult {
  const base = { id: `job:${job.name}`, name: `Scheduled job: ${job.name}` };
  if (!lastSuccess) return { ...base, result: 'warn', detail: 'Has not completed a run yet.' };
  const minutes = Math.round((now.getTime() - lastSuccess.getTime()) / 60_000);
  const ago = minutes < 120 ? `${minutes} minutes ago` : `${Math.round(minutes / 60)} hours ago`;
  if (minutes > job.everyMinutes * lateAfter) {
    return { ...base, result: 'fail', detail: `Last succeeded ${ago}; it should run every ${job.everyMinutes} minutes.` };
  }
  return { ...base, result: 'ok', detail: `Last succeeded ${ago}.` };
}

/** Month-to-date spend per share, today's spend against the ceiling, and the seeding allowance */
export function checkBudget(b: Budget, s: Spend, dailyCeilingUsd: number, warnAt: number): CheckResult[] {
  const out: CheckResult[] = [];
  const money = (n: number) => `$${n.toFixed(2)}`;
  const level = (used: number, limit: number): Result => (limit <= 0 ? 'ok' : used >= limit ? 'fail' : used >= limit * warnAt ? 'warn' : 'ok');
  for (const share of b.shares) {
    const used = s.byShare[share.id] ?? 0;
    const result = level(used, share.usd);
    out.push({
      id: `budget:${share.id}`,
      name: `Budget share: ${share.label}`,
      result,
      detail: `${money(used)} of ${money(share.usd)} this month${result === 'fail' ? '; this work pauses until next month' : ''}.`,
    });
  }
  const today = level(s.today, dailyCeilingUsd);
  out.push({
    id: 'budget:today',
    name: 'Spending today',
    result: today === 'fail' ? 'warn' : today,
    detail: `${money(s.today)} of the ${money(dailyCeilingUsd)} daily ceiling${today === 'fail' ? '; Holon is paused until midnight UTC' : ''}.`,
  });
  if (b.seeding) {
    out.push({
      id: 'budget:seeding',
      name: 'Seeding allowance',
      result: level(s.seeding, b.seeding.usd),
      detail: `${money(s.seeding)} of the one-time ${money(b.seeding.usd)} used.`,
    });
  }
  return out;
}

/** Whether to email: there are failures, and either they differ from the last alert's or that alert is old */
export function shouldAlert(failing: string[], lastAlert: { at: Date; failing: string[] } | null, now: Date, repeatAfterHours: number): boolean {
  if (failing.length === 0) return false;
  if (!lastAlert) return true;
  const same = failing.length === lastAlert.failing.length && failing.every((f, i) => f === lastAlert.failing[i]);
  return !same || now.getTime() - lastAlert.at.getTime() >= repeatAfterHours * 3_600_000;
}

// ─── Checks that look at the running system ─────────────────────────────────────────────────────────────────

/** Every model a running agent uses: roles whose status is "running", with a model or per-check models */
export function modelsInUse(): { provider: string; model: string; agents: string[] }[] {
  const found = new Map<string, { provider: string; model: string; agents: Set<string> }>();
  for (const a of commons().agents.values()) {
    if (a.status !== 'running') continue;
    const roles = ((a.config as { roles?: Record<string, Record<string, unknown>> } | null)?.roles) ?? {};
    for (const role of Object.values(roles)) {
      if (role.status !== 'running') continue;
      const provider = String(role.provider ?? 'anthropic');
      const models = [role.model, ...Object.values((role.checks ?? {}) as Record<string, { model?: string }>).map((c) => c.model)]
        .filter((m): m is string => typeof m === 'string');
      for (const model of models) {
        const key = `${provider}/${model}`;
        const entry = found.get(key) ?? { provider, model, agents: new Set<string>() };
        entry.agents.add(a.name);
        found.set(key, entry);
      }
    }
  }
  return [...found.values()].map((e) => ({ provider: e.provider, model: e.model, agents: [...e.agents] }));
}

async function checkModels(): Promise<CheckResult[]> {
  const out: CheckResult[] = [];
  for (const m of modelsInUse()) {
    const base = { id: `model:${m.provider}/${m.model}`, name: `Model: ${m.model} (${m.agents.join(', ')})` };
    const provider = providers[m.provider];
    if (!provider) {
      out.push({ ...base, result: 'fail', detail: `No provider "${m.provider}" is configured in the app.` });
      continue;
    }
    if (m.provider === 'anthropic' && !anthropicConfigured()) {
      out.push({ ...base, result: 'fail', detail: 'Not checked: no AI key is set.' });
      continue;
    }
    const started = Date.now();
    try {
      const r = await provider.complete({
        model: m.model,
        system: 'You are a health check for a web application.',
        messages: [{ role: 'user', text: 'Reply with OK.' }],
        tools: [],
        maxTokens: 64,
      });
      await logCall({
        role: 'monitor.ping',
        provider: m.provider,
        model: r.model,
        instructionVersion: monitorVersion(),
        usage: r.usage,
        servedFor: 'commons operations',
        stopReason: r.stop,
      }).catch(() => 0);
      const served = r.model !== m.model ? ` (served by ${r.model})` : '';
      out.push({ ...base, result: 'ok', detail: `Answered in ${((Date.now() - started) / 1000).toFixed(1)} s${served}.` });
    } catch (err) {
      const status = (err as { status?: number }).status;
      out.push({ ...base, result: 'fail', detail: `Did not answer${status ? ` (status ${status})` : ''}: ${err instanceof Error ? err.message.slice(0, 200) : String(err)}` });
    }
  }
  if (out.length === 0) out.push({ id: 'model:none', name: 'Models', result: 'warn', detail: 'No running agent uses a model.' });
  return out;
}

async function checkDatabase(): Promise<CheckResult> {
  const base = { id: 'database', name: 'App and database' };
  if (!dbConfigured()) return { ...base, result: 'fail', detail: 'The app is up, but no database is configured (DATABASE_URL).' };
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ...base, result: 'ok', detail: 'The app is serving pages and the database answers.' };
  } catch (err) {
    return { ...base, result: 'fail', detail: `The app is up, but the database did not answer: ${err instanceof Error ? err.message.slice(0, 200) : String(err)}` };
  }
}

function checkContent(): CheckResult {
  const c = commons();
  const errors = contentErrors();
  const counts = `${c.artifacts.size} artifacts, ${c.entries.size} entries, ${c.questions.size} questions, ${c.agents.size} agents`;
  return errors.length
    ? { id: 'content', name: 'Content', result: 'warn', detail: `${counts}; ${errors.length} validation problem${errors.length === 1 ? '' : 's'}, e.g. ${errors[0]}` }
    : { id: 'content', name: 'Content', result: 'ok', detail: `${counts}; all valid.` };
}

async function checkJobs(settings: MonitorSettings): Promise<CheckResult[]> {
  const jobs = scheduledJobs();
  if (!dbConfigured()) return [{ id: 'jobs', name: 'Scheduled jobs', result: 'fail', detail: 'The scheduler needs the database and is not running.' }];
  if (jobs.length === 0) return [{ id: 'jobs', name: 'Scheduled jobs', result: 'warn', detail: 'No jobs are scheduled.' }];
  const now = new Date();
  return Promise.all(
    jobs.map(async (job) => {
      const last = await prisma.jobRun.findFirst({ where: { job: job.name, ok: true }, orderBy: { startedAt: 'desc' } });
      return checkJob(job, last?.startedAt ?? null, now, settings.jobLateAfterIntervals);
    }),
  );
}

function checkAlerts(): CheckResult {
  const ok = Boolean(process.env.RESEND_API_KEY && process.env.MONITOR_ALERT_TO);
  return ok
    ? { id: 'alerts', name: 'Alerts', result: 'ok', detail: 'Email alerts are configured.' }
    : { id: 'alerts', name: 'Alerts', result: 'warn', detail: 'Email alerts are not configured (RESEND_API_KEY, MONITOR_ALERT_TO), so failures show only on this page.' };
}

// ─── Alerts ─────────────────────────────────────────────────────────────────────────────────────────────────

async function sendAlert(results: CheckResult[]): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.MONITOR_ALERT_TO;
  if (!key || !to) return { sent: false, error: 'Email alerts are not configured.' };
  const failed = results.filter((r) => r.result === 'fail');
  const base = (process.env.PUBLIC_BASE_URL ?? '').replace(/\/$/, '');
  const text = [
    `The commons' monitor found ${failed.length} failed check${failed.length === 1 ? '' : 's'}:`,
    '',
    ...failed.map((r) => `- ${r.name}: ${r.detail}`),
    '',
    base ? `All results: ${base}/operations` : 'All results are on the Operations page.',
    '',
    'You receive this at most once a day for the same failures, and again whenever they change.',
  ].join('\n');
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.MONITOR_ALERT_FROM ?? 'Commons monitor <onboarding@resend.dev>',
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        subject: `[COMMONS NAME] monitor: ${failed.length} check${failed.length === 1 ? '' : 's'} failed`,
        text,
      }),
    });
    if (res.ok) return { sent: true };
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    return { sent: false, error: `The email service returned ${res.status}${body.message ? `: ${body.message.slice(0, 200)}` : ''}` };
  } catch (err) {
    return { sent: false, error: `Could not reach the email service: ${err instanceof Error ? err.message : String(err)}` };
  }
}

// ─── A run ──────────────────────────────────────────────────────────────────────────────────────────────────

export interface MonitorReport {
  at: Date;
  trigger: 'schedule' | 'steward';
  ok: boolean;
  results: CheckResult[];
  failing: string[];
  alertSent: boolean;
  alertError?: string;
}

export async function runChecks(trigger: 'schedule' | 'steward'): Promise<MonitorReport> {
  const settings = monitorSettings();
  const now = new Date();
  const database = await checkDatabase();
  const results: CheckResult[] = [database, checkContent()];
  results.push(...(await checkModels()));
  results.push(checkKeyExpiry(anthropicConfigured(), process.env.ANTHROPIC_KEY_EXPIRES, now, settings.keyExpiryWarningDays));
  if (database.result === 'ok') {
    results.push(...(await checkJobs(settings)));
    results.push(...checkBudget(budget(), await spend(), fairUse().dailySpendCeilingUsd, settings.budgetWarningShare));
  } else {
    results.push({ id: 'jobs', name: 'Scheduled jobs and budget', result: 'fail', detail: 'Not checked: the database did not answer.' });
  }
  results.push(checkAlerts());

  const failing = results.filter((r) => r.result === 'fail').map((r) => r.id).sort();
  let lastAlert: { at: Date; failing: string[] } | null = null;
  if (database.result === 'ok') {
    const last = await prisma.monitorRun.findFirst({ where: { alertSent: true }, orderBy: { startedAt: 'desc' } });
    lastAlert = last ? { at: last.startedAt, failing: last.failing } : null;
  }
  let alert: { sent: boolean; error?: string } = { sent: false };
  if (shouldAlert(failing, lastAlert, now, settings.repeatSameFailuresAfterHours)) alert = await sendAlert(results);

  const report: MonitorReport = { at: now, trigger, ok: failing.length === 0, results, failing, alertSent: alert.sent, alertError: alert.error };
  if (database.result === 'ok') {
    await prisma.monitorRun.create({
      data: {
        startedAt: now,
        trigger,
        ok: report.ok,
        results: results as unknown as object,
        failing,
        alertSent: alert.sent,
        alertError: alert.error ?? null,
      },
    });
  }
  return report;
}

/** The monitor as a scheduled job */
export function monitorJob(): Job {
  return {
    name: 'monitor',
    everyMinutes: monitorSettings().everyHours * 60,
    run: async () => {
      const r = await runChecks('schedule');
      const failed = r.failing.length;
      const warned = r.results.filter((x) => x.result === 'warn').length;
      return `${r.results.length} checks: ${failed} failed, ${warned} warnings${r.alertSent ? '; alert sent' : ''}${r.alertError && failed ? `; alert not sent (${r.alertError})` : ''}`;
    },
  };
}
