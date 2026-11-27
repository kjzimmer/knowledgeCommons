# 0002: Tech stack

- **Status:** proposed
- **Date:** 2026-11-27
- **Drafted by:** Claude Code (claude-opus-5-5), change brief 0.1, stage 1
- **Decision:** not yet made (Karl decides)

## Question

What does the commons' app run on? The development standard's starting point: keep what the demo is built on
unless a requirement needs otherwise; changing a working stack needs a reason, not a preference.

## Context

As built (Stage 0 report, section 1): TypeScript on Node; Express 5; server-rendered HTML from tagged templates
that escape by default; no front-end framework, two small static files; Postgres through Prisma 6; Railway
(nixpacks), deploying `feat/concept-demo`; Anthropic through one provider interface. Local Node is 20.12, so
dependencies must stay Node 20 compatible.

What change brief 0.1 adds, and what it needs from the stack:

| Need | Can the current stack do it? |
|---|---|
| Question loop with background agents, triggers, a pause timer | Yes: an in-process job runner and events in Postgres (decision 0006) |
| Artifact files in R2 | Yes: an S3 client library (decision 0010) |
| Email alerts | Yes: Resend's HTTP interface through `fetch`, no new package |
| Phone-first pages, collapsible reading | Yes: HTML and CSS, a little progressive JavaScript (decision 0005) |
| Live text (next slice) | Yes: server-sent events from Express, or WebSockets with a small library |
| Audio and video (later) | Through an integrated open-source service, not this app |

## Options

| Option | For | Against |
|---|---|---|
| **A. Keep the stack as built**, adding an S3 client and a job runner | Works today; small; every page is plain HTML (fast on a phone, works without JavaScript); no build step for the browser; the team (Claude Code) knows it | Interactive parts (dialog, endorsement) need hand-written progressive JavaScript; no component library |
| B. Move the front end to a framework (e.g. React or Svelte with server rendering) | Richer interaction; component ecosystem | A rewrite of every page for no current requirement; a browser build step; heavier pages on phones |
| C. Another language for the workers (e.g. Python for agents) | Python's data and AI libraries | Two runtimes to deploy and keep; the agents are API calls, which TypeScript handles well |

## Recommendation

**A.** No requirement in this slice needs anything else. Revisit if live text or a requirement for rich interaction
shows the hand-written approach failing (P-11: grow when evidence calls for it).

## Consequences

- New dependencies go in `dependencies`, not `devDependencies` (Railway skips devDependencies in production) and
  must support Node 20.
- Tests use Node's own test runner through `tsx` (`npm test`); no test framework dependency.
- The provider interface (as built) stays the only place a model provider is named (P-05); decision 0009, when
  drafted, records it.

## Traces to

P-05, P-10, P-11.
