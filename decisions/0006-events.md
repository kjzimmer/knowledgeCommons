# 0006: Events between the parts

- **Status:** accepted
- **Date:** 2026-11-27 (drafted); 2026-11-28 (revised: reliability rules, scaling path and remaining gaps made
  explicit, from Karl's questions; see `docs/reviews/findings-change-brief-0.1.md`, F10)
- **Drafted by:** Claude Code (claude-opus-5-5), change brief 0.1, stage 1
- **Decision:** option A with the rules below, as revised. Accepted by Karl Zimmer, 2026-11-28.

## Question

How do the knowledge store, the app, the AI workers and (later) dialog services tell each other that something
happened (a question posed, a post added, an endorsement changed, a reading audited, a pause reached), so that
whatever should follow does follow, even if the app stops, and so that there is a record of what happened and
what it caused?

## Context

P-09 asks that the parts be separate and communicate through events. Today the "parts" are modules inside one app
(the code that saves a post, the curator, the challenger, the auditor, notices); events keep them separate so that
any of them can later run on its own server without being rewritten.

Change brief 0.1 needs an Event record (type, subject, time, what it triggered) and many triggers: a new question
asks for a reading; a reading goes to the challenger, then the auditor; a post is extracted; a quiet hour turns a
working draft into a recorded revision; updates within a window combine. Today there is one app instance on Railway
and no queue. Stage 1 added a small in-process scheduler with every run recorded in Postgres (`JobRun`), used by the
monitor.

The risk to design against: an event that has happened but whose follow-up is lost (never delivered, never acted
on, or half done) because the app stopped, with no record of it.

## Options

| Option | For | Against |
|---|---|---|
| **A. Events recorded in Postgres, handled by a worker** (an "outbox": the app writes an event row in the same transaction as the change; a worker claims unhandled events, runs the part that should act, records what each event triggered) | No new service; events and their effects are durable and inspectable; survives restarts; the Event record the brief asks for is the queue itself; combining windows and pauses are simple queries | The worker must be written carefully (rules below); a very heavy load would move it to its own service, then perhaps to a broker |
| B. A message broker (e.g. Redis streams, NATS, a hosted queue) | Scales; standard | Another service to run and pay for; events must still be recorded for transparency, so the database is needed anyway; keeping the database and the broker consistent is its own problem |
| C. Direct function calls (the route that saves a post calls the curator) | Simplest code | Lost work on a crash or deploy; slow requests while agents run; no record of what triggered what; against P-09 |

## Recommendation

**A**, with these rules.

### How it works

1. A change and its event are saved together. The part that acts on the event is its handler.
2. The worker finds events not yet handled, claims one, runs its handler, and records the result: done, with what
   it triggered (agent calls, revisions, notices, further events), or failed, with the error.
3. A handler's result can itself be a change with new events, which the worker picks up in turn.

The event table is the queue and the history: every event, its subject, what caused it, every attempt, and what it
led to.

### Four rules, so that no event is lost when the app stops

1. **Same transaction.** An event is written in the same database transaction as the change that causes it: a post
   and its "post added" event are saved together or not at all. If the app stops mid-request, nothing half exists
   and the person sees an error; once the change is saved, its event exists.
2. **Claims with a lease, and retries.** The worker claims an event for a limited time (a lease, e.g. ten
   minutes) and records each attempt. If the app stops while a handler runs, the lease runs out and the event is
   claimed again after the restart. After a set number of failed attempts (e.g. five, with growing waits between
   them) the event is marked failed and alerted (findings F2), never dropped silently; a steward can retry it from
   the Operations page.
3. **Handlers are safe to run twice** (idempotent). Because of retries, an event can be handled twice, for example
   when its work finished but the app stopped before marking it done. Every handler first checks whether its work
   already exists ("is there already a revision for this event?") and records its results against the event's id.
   The one unavoidable cost: a model call made just before a stop may be repeated, and paid for twice; rare, and
   visible in the call log.
4. **Waiting is data, not timers in memory.** "Revise after an hour without posts" and "combine updates within the
   window" are worked out from stored times (the last post, the last revision), not from timers a restart would
   erase.

Plus one rule for order: **events about the same subject are handled in order** (the worker does not start an
event while an earlier one on the same question is unfinished), so a revision never overtakes the post that
prompted it.

### Scaling path

The queue will not be the limit for a long time: Postgres used this way handles thousands of events a second, and
each post produces only a few. The real limit is the AI calls (seconds each, costly, rate-limited), which budget
shares, per-agent concurrency limits and combining windows manage. When load grows, in this order:

1. **The worker as its own Railway service**, or several copies of it. Copies share the table safely by claiming
   with `SELECT … FOR UPDATE SKIP LOCKED`, so no event is claimed twice. Built that way from the start, so this is
   a deployment change, not a code change.
2. **Priorities and concurrency limits** per kind of work (answering people before scouting; at most N curator
   calls at once).
3. **Archiving** handled events older than a set age to an archive table (still exported, still public).
4. **A message broker** only if Postgres itself becomes the bottleneck; the event table stays as the record.

Live text (next slice) needs new posts pushed to open browsers. That is delivery to people, not between parts:
server-sent events, woken by Postgres's built-in notifications (`LISTEN/NOTIFY`), alongside this design.

### Gaps that remain, and where they are covered

| Gap | Covered by |
|---|---|
| The database itself is lost or corrupted | Backups and the nightly full export (decision 0007); the open question on how the whole commons is kept |
| The worker stops entirely (no one handles anything) | The monitor's job check, error alerts (F2) and the independent watchdog (F3) |
| A handler keeps failing | Rule 2: marked failed, alerted, retryable by a steward |
| A model call is repeated after a stop | Rule 3: no duplicate results; the extra cost is logged |
| Something outside the app (a webhook) is missed while the app is down | None today, since nothing outside calls the app; when something does, it must retry until acknowledged |

## Consequences

- Agent work never runs inside a page request; pages show "being drafted" until the worker finishes.
- Every event, attempt and result is recorded; a question's events show on its history; events about private
  Holon sessions are not public.
- Every handler is written to the idempotency rule, and its test (L4) includes "run twice, one result".
- The Operations page gains the queue's state: events waiting, being handled, failed (with retry for stewards).
- The in-process scheduler (stage 1) runs the worker today; moving it out is step 1 of the scaling path.

## Traces to

P-02, P-07, P-09, P-11.
