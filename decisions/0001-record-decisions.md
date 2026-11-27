# 0001: Record decisions as decision records

- **Status:** proposed
- **Date:** 2026-11-27
- **Drafted by:** Claude Code (claude-opus-5-5), change brief 0.1, stage 1
- **Decision:** not yet made (Karl decides)

## Question

How are the commons' significant technical choices recorded, so that people, Claude Code and later the
requirements agent can see what was decided, why, and what else was considered?

## Context

Until now decisions lived in `docs/STATUS.md` ("Decisions so far") and in chats. That works for one builder; it
does not let anyone outside see the options that were rejected, and it mixes decisions with the working log. The
development standard (section 4) asks for one record per significant choice.

## Options

| Option | For | Against |
|---|---|---|
| **A. Decision records in `decisions/`**, one Markdown file each, numbered | Plain files, public, versioned with the code they govern; a widely used practice (architecture decision records); the requirements agent can read and draft them | One more folder to keep up |
| B. Keep decisions in `docs/STATUS.md` | No new structure | Not public-facing; options and consequences get lost; the file is a working log for Claude Code |
| C. Issues or discussions on the repository host | Comments and links built in | Tied to one host, against P-01; not part of a clone |

## Recommendation

**A.** Format as in this file: question, context, options with pros and cons, recommendation, decision and who made
it, consequences, date, status (proposed, accepted, rejected, superseded by …). Never renumber; a superseded record
stays, linked to its replacement. `CHANGELOG.md` gets a Decision entry when Karl decides one.

## Consequences

- "Decisions so far" in `docs/STATUS.md` stays as history; new decisions go here.
- Requirements name the decisions they depend on (`decisions` field), and the traceability check fails on a
  missing one.

## Traces to

P-01 (plain files), P-02 (transparent by default).
