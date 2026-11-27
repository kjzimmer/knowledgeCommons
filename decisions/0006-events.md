# 0006: Events between the parts

- **Status:** proposed
- **Date:** 2026-11-27
- **Drafted by:** Claude Code (claude-opus-5-5), change brief 0.1, stage 1
- **Decision:** not yet made (Karl decides)

## Question

How do the knowledge store, the app, the AI workers and (later) dialog services tell each other that something
happened: a question posed, a post added, an endorsement changed, a reading audited, a pause reached?

## Context

P-09 asks that the parts be separate and communicate through events. Change brief 0.1 needs an Event record (type,
subject, time, what it triggered) and many triggers: a new question asks for a reading; a reading goes to the
challenger, then the auditor; a post is extracted; a quiet hour turns a working draft into a recorded revision;
updates within a window combine. Today there is one app instance on Railway and no queue. Stage 1 added a small
in-process scheduler with every run recorded in Postgres (`JobRun`), used by the monitor.

## Options

| Option | For | Against |
|---|---|---|
| **A. Events recorded in Postgres, handled by an in-process worker** (an "outbox": the app writes an event row in the same transaction as the change; a worker picks up unhandled events, runs the agents, records what each event triggered) | No new service; events and their effects are durable and inspectable; survives restarts; the Event record the brief asks for is the queue itself; combining windows and pauses are simple queries | One instance only; a heavy load would need the worker moved out |
| B. A message broker (e.g. Redis streams, NATS, a hosted queue) | Scales; standard | Another service to run and pay for; events must still be recorded for transparency, so the database is needed anyway |
| C. Direct function calls (the route that saves a post calls the curator) | Simplest code | Lost work on a crash or deploy; slow requests while agents run; no record of what triggered what; against P-09 |

## Recommendation

**A.** The worker uses the same job runner as the monitor. Each event row holds its type, subject, time, the
record that caused it, and, once handled, what it triggered (agent calls, revisions, notices). Moving the worker to
a separate Railway service later is a deployment change, not a code change; a broker replaces the polling when
load calls for it.

## Consequences

- Agent work never runs inside a page request; pages show "being drafted" until the worker finishes.
- Events are public where their subject is (a question's events show on its history), except those about private
  Holon sessions.
- Assumes one app instance. Running two needs a lock per event (a `SELECT … FOR UPDATE SKIP LOCKED` claim), noted
  for when it is needed.

## Traces to

P-02, P-07, P-09.
