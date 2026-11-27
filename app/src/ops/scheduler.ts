// app/src/ops/scheduler.ts
// A small in-process job runner (decision 0006, answers to change brief 0.1, C). Each job runs every N minutes;
// every run is recorded in JobRun, so a restart does not reset the schedule and the monitor can see when a job
// last succeeded. Assumes one app instance; a separate worker or cron service replaces this when load calls for it.

import prisma, { dbConfigured } from '../lib/db';

export interface Job {
  name: string;
  everyMinutes: number;
  /** Returns a short line for the run's record; throws on failure */
  run: () => Promise<string>;
}

const jobs: Job[] = [];
const running = new Set<string>();
let timer: NodeJS.Timeout | null = null;

export function registerJob(job: Job): void {
  if (!jobs.some((j) => j.name === job.name)) jobs.push(job);
}

export function scheduledJobs(): readonly Job[] {
  return jobs;
}

export function schedulerRunning(): boolean {
  return timer !== null;
}

/** Runs a job now and records the run. Never throws */
export async function runJob(job: Job): Promise<{ ok: boolean; detail: string }> {
  if (running.has(job.name)) return { ok: false, detail: 'already running' };
  running.add(job.name);
  const record = await prisma.jobRun.create({ data: { job: job.name } }).catch(() => null);
  let ok = true;
  let detail: string;
  try {
    detail = await job.run();
  } catch (err) {
    ok = false;
    detail = err instanceof Error ? err.message : String(err);
    console.error(`[scheduler] ${job.name} failed:`, err);
  } finally {
    running.delete(job.name);
  }
  if (record) {
    await prisma.jobRun
      .update({ where: { id: record.id }, data: { finishedAt: new Date(), ok, detail: detail.slice(0, 2000) } })
      .catch((err) => console.error('[scheduler] could not record the run:', err));
  }
  return { ok, detail };
}

async function tick(): Promise<void> {
  for (const job of jobs) {
    if (running.has(job.name)) continue;
    try {
      const last = await prisma.jobRun.findFirst({ where: { job: job.name }, orderBy: { startedAt: 'desc' } });
      if (!last || Date.now() - last.startedAt.getTime() >= job.everyMinutes * 60_000) void runJob(job);
    } catch (err) {
      console.error(`[scheduler] could not check ${job.name}:`, err);
    }
  }
}

/** Starts checking once a minute whether a job is due (first check after 30 seconds). Needs the database */
export function startScheduler(): void {
  if (timer || !dbConfigured()) return;
  setTimeout(() => void tick(), 30_000).unref();
  timer = setInterval(() => void tick(), 60_000);
  timer.unref();
  console.log(`[scheduler] started: ${jobs.map((j) => `${j.name} every ${j.everyMinutes} min`).join(', ') || 'no jobs'}`);
}
