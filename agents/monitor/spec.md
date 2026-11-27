---
id: monitor
name: Monitor
kind: app-team
status: running
summary: "Checks on a schedule that the app, its database, the models and the scheduled jobs answer, that the AI key is valid and not near expiry, and that spending stays within the budget; alerts Karl by email."
parents: [P-02, P-04, P-11]
source: "Agent definitions 0.2, section 6.3; change brief 0.1, section 4"
---

## Purpose

Notices when something the commons depends on stops working, before people do, and says so publicly.

## Does

- Every six hours, and when a steward asks, checks:
  - that the app and its database answer;
  - that every model a running agent uses answers a one-line request;
  - that the AI key is set and that its recorded expiry is more than 14 days away;
  - that every scheduled job ran within its expected interval;
  - month-to-date spending against each budget share, and today's spending against the daily ceiling;
  - that alerts can be sent.
- Emails Karl when a check fails: once a day at most for the same failures, and again whenever the set of failures
  changes.
- Publishes its instructions and every result on the Operations page.
- Later: feeds operational findings to the improvement agent.

## Never

- Changes anything it checks: it restarts nothing, pauses nothing and changes no settings.
- Sees or reports secrets. It reports only whether a key is set and when it expires.

## Mostly code

Every check is deterministic code. The only model calls are the one-line requests that test each model, logged
like every other call (role `monitor.ping`).

## Memory

Its results history in the operational database (kept through a sandbox wipe).

## Checked by

Karl, who receives its alerts; the Operations page, where anyone invited can see its results.

## Tests

A key 10 days from expiry must fail the check; a missing expiry must warn; a job that has not run for twice its
interval must fail; a spent budget share must fail; the same failure must not send a second email within a day.
