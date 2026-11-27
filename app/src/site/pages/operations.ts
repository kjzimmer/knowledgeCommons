// app/src/site/pages/operations.ts
// The Operations page: the monitor's instructions, its latest results and history, and the scheduled jobs.
// Readable by everyone invited; only a steward can run the checks on demand.

import prisma, { dbConfigured } from '../../lib/db';
import { commons } from '../../content/load';
import { html, Html } from '../../lib/html';
import { CheckResult, monitorSettings, Result } from '../../ops/monitor';
import { scheduledJobs, schedulerRunning } from '../../ops/scheduler';
import { markdown } from '../ui';

const LABEL: Record<Result, { text: string; badge: string }> = {
  ok: { text: 'ok', badge: 'ok' },
  warn: { text: 'warning', badge: 'warn' },
  fail: { text: 'failed', badge: 'fail' },
};

const when = (d: Date) => `${d.toISOString().slice(0, 16).replace('T', ' ')} UTC`;

export async function operationsPage(isSteward: boolean, notice?: string): Promise<Html> {
  const monitor = commons().agents.get('monitor');
  const settings = monitorSettings();
  let runs: { startedAt: Date; trigger: string; ok: boolean; results: unknown; failing: string[]; alertSent: boolean; alertError: string | null }[] = [];
  let jobs: { name: string; everyMinutes: number; last: { startedAt: Date; ok: boolean | null; detail: string | null } | null }[] = [];
  let dbError: string | null = null;
  if (dbConfigured()) {
    try {
      runs = await prisma.monitorRun.findMany({ orderBy: { startedAt: 'desc' }, take: 20 });
      jobs = await Promise.all(
        scheduledJobs().map(async (j) => ({
          name: j.name,
          everyMinutes: j.everyMinutes,
          last: await prisma.jobRun.findFirst({ where: { job: j.name }, orderBy: { startedAt: 'desc' }, select: { startedAt: true, ok: true, detail: true } }),
        })),
      );
    } catch (err) {
      dbError = err instanceof Error ? err.message : String(err);
    }
  }
  const latest = runs[0];
  const results = (latest?.results ?? []) as CheckResult[];

  return html`
<h1>Operations</h1>
<p class="lede">How the commons' software is doing, in public. The <a href="/agents/monitor">monitor</a> checks every ${settings.everyHours} hours that the app, its database, the AI models, the AI key, the scheduled jobs and the budget are in order, and emails the steward when a check fails. It changes nothing it checks.</p>
${notice ? html`<p class="notice">${notice}</p>` : ''}
${!dbConfigured() ? html`<p class="notice">No database is configured on this deployment, so the monitor's results are not kept.</p>` : ''}
${dbError ? html`<p class="notice">Could not read the monitor's history: ${dbError}</p>` : ''}

<h2>Latest checks</h2>
${latest
    ? html`<p class="muted">${when(latest.startedAt)}, ${latest.trigger === 'steward' ? 'run by a steward' : 'on schedule'}. ${latest.ok ? 'No check failed.' : `${latest.failing.length} failed.`}${latest.alertSent ? ' An alert was emailed.' : ''}${latest.alertError && !latest.ok ? ` The alert could not be sent: ${latest.alertError}` : ''}</p>
<div class="scroll"><table class="table"><thead><tr><th>Check</th><th>Result</th><th>Detail</th></tr></thead><tbody>${results.map((r) => html`<tr><td>${r.name}</td><td><span class="badge ${LABEL[r.result].badge}">${LABEL[r.result].text}</span></td><td>${r.detail}</td></tr>`)}</tbody></table></div>`
    : html`<p class="muted">The monitor has not run yet.</p>`}
${isSteward ? html`<form method="post" action="/operations/run" class="actions"><button type="submit">Run the checks now</button> <span class="muted">Stewards only. Each run makes one short call per model, a fraction of a cent.</span></form>` : ''}

<h2>Scheduled jobs</h2>
<p class="muted">Jobs run inside the app${schedulerRunning() ? '' : html` <span class="badge warn">The scheduler is not running on this deployment</span>`}. Every run is recorded.</p>
${jobs.length
    ? html`<div class="scroll"><table class="table"><thead><tr><th>Job</th><th>Runs every</th><th>Last run</th><th>Result</th></tr></thead><tbody>${jobs.map((j) => html`<tr><td>${j.name}</td><td>${j.everyMinutes >= 60 ? `${j.everyMinutes / 60} hours` : `${j.everyMinutes} minutes`}</td><td>${j.last ? when(j.last.startedAt) : '—'}</td><td>${j.last ? (j.last.ok === null ? 'running' : html`<span class="badge ${j.last.ok ? 'ok' : 'fail'}">${j.last.ok ? 'ok' : 'failed'}</span> ${j.last.detail ?? ''}`) : 'not yet run'}</td></tr>`)}</tbody></table></div>`
    : html`<p class="muted">No jobs.</p>`}

<h2>History</h2>
${runs.length
    ? html`<div class="scroll"><table class="table"><thead><tr><th>When</th><th>Trigger</th><th>Failed</th><th>Alert</th></tr></thead><tbody>${runs.map((r) => html`<tr><td>${when(r.startedAt)}</td><td>${r.trigger}</td><td>${r.failing.length ? r.failing.join(', ') : html`<span class="muted">none</span>`}</td><td>${r.alertSent ? 'sent' : r.failing.length && r.alertError ? `not sent: ${r.alertError}` : '—'}</td></tr>`)}</tbody></table></div>`
    : html`<p class="muted">No runs yet.</p>`}

<h2>The monitor's instructions</h2>
<p class="muted">From <a href="https://github.com/kjzimmer/knowledgeCommons/blob/main/agents/monitor/instructions.md" rel="noopener" target="_blank">agents/monitor/instructions.md</a>, version ${monitor?.version ?? '?'}.</p>
<div class="doc">${markdown(monitor?.instructions ?? '')}</div>

<h2>Still to come here</h2>
<p class="muted">The feedback log (comments on the site itself, from a link on every page) and the moderation log arrive with joining and dialogs, later in change brief 0.1.</p>`;
}
