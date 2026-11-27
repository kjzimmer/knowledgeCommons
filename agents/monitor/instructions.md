---
agent: monitor
version: 0.1.0
updated: 2026-11-27
contributor: claude-code-demo
approver: null
note: "The monitor is code, not a prompt. These are its instructions in plain language; app/src/ops/monitor.ts carries them out."
---

The monitor checks the commons every six hours, and whenever a steward presses "Run the checks now" on the
Operations page. Each check ends as **ok**, **warning** or **failed**.

1. **App and database.** The app is serving pages and the operational database answers a simple query. Failed if
   the database does not answer.
2. **Content.** The repository's content loaded without validation errors. Warning if there were errors.
3. **Models.** For every model a running agent uses (`agents/*/config.yaml`, roles whose status is "running"), one
   one-line request ("Reply with OK."). Failed if the model does not answer. Each request is logged as a model call
   with role `monitor.ping` and costs a fraction of a cent.
4. **The AI key.** The key is set, and its expiry, recorded by a steward as `ANTHROPIC_KEY_EXPIRES`, is more than
   14 days away. Failed if the key is missing, has expired or expires within 14 days; warning if no expiry is
   recorded. The monitor never reads or reports the key itself.
5. **Scheduled jobs.** Every scheduled job has run successfully within twice its interval. Failed if not.
6. **Budget.** Month-to-date spending for each share of `growth/budget.yaml`, against that share. Warning at 80%,
   failed at 100%. Also today's spending against the daily ceiling: warning at 80%.
7. **Alerts.** Email alerts are configured. Warning if not, because failures would then show only on this page.

**Alerts.** When any check fails, the monitor emails Karl, at most once a day for the same failures and again
whenever the set of failures changes. Warnings are shown here but not emailed.

**What the monitor never does.** It changes nothing it checks: it restarts nothing, pauses nothing and changes no
settings. People act on what it reports.
