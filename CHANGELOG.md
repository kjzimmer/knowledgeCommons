# Changelog

What happened in the commons, newest first. Each entry is tagged **Decision**, **Release**, **Content**,
**Incident** or **Governance**. This log does not list every commit: the full history is on the Changes page and
in the repository. The current picture is in [STATE.md](STATE.md).

## 2026-11-27

- **Release.** The monitor runs. Every six hours it checks that the app, its database and each model in use answer,
  that the AI key is set and more than 14 days from expiry, that scheduled jobs ran, and that spending is within
  each budget share. It emails the steward when a check fails. Its instructions and results are public on the new
  Operations page.
- **Release.** Every agent now has a public specification. That covers the six knowledge agents (Holon, curator,
  challenger, auditor, facilitator, scout) and the app team (requirements agent, monitor, coding agent, code
  reviewer, support, improvement, administration). The Agents page shows them. The auditor's model is now set per
  kind of work it checks, never the model that produced the work.
- **Decision (proposed).** Eight decision records drafted for Karl to decide: how decisions are recorded, the tech
  stack, the repository layout, the requirements structure, the design system, events between the parts, where
  question-loop data lives (interim), and artifact files in R2.
- **Release.** The app's requirements are now written down (`requirements/`), with the development standard, the
  eleven design principles (proposed) and 134 requirements for the question loop. Each requirement traces to a
  principle and has an acceptance test. A check enforces the links.
- **Decision.** The monthly budget's shares follow change brief 0.1: Holon 30%, curation 25%, audit 15%, challenge
  10%, facilitation 10% and scouting 10%, plus a one-time $20 seeding allowance.

## 2026-11-23

- **Decision.** Answers to the Stage 0 questions on change brief 0.1, by Karl as interim steward:
  - The invite-only site is the draft site for the question loop.
  - Dialog and operational data will live in the database with full history and a complete export. Recorded
    readings will be plain files in the repository; during the sandbox period, only the first audited seed
    readings. This is interim: how all of the commons is kept, so nothing is lost and anyone can fork it, stays an
    open question.
  - When a source's full text is not held, the auditor records that per source, and the point shows how many
    sources were verified.
  - The existing 32 entries are material the curator may draw on, not evidence.
  - The auditor never runs on the model whose work it checks.
  - The endorsed level is not computed until its rule is designed.
  - One seed question goes all the way through the loop before the rest: Q6, on polycrisis.
  - The first readings of the fifteen seed questions are paid from a one-time seeding allowance (about $20),
    shown on the Costs page, not from the monthly shares.
  - Exported readings reach the repository through a person's commit; the app does not write to the repository.
- **Release.** [STATE.md](STATE.md) and this changelog published, also served at `/state` and `/changelog`.

## 2026-11-21

- **Decision.** Draft design documents for the next stage, not adopted: agent definitions 0.2, app design 0.1
  (principles, surfaces, architecture), development standard 0.1 (requirements, decision records, agent
  specifications), fifteen seed questions, and change brief 0.1 for the question loop.

## 2026-11-17

- **Decision.** The commons communicates with its users, Abundance Architecture included, through published files
  (`STATE.md`, `CHANGELOG.md`) and, later, public issues. Users have no private back channel.

## 2026-10-23

- **Incident.** A security incident at the hosting provider (21 to 23 October) led to every provider key held
  there being revoked. The commons rotated its reviewer-link secret and Abundance Architecture's site key; every
  earlier invitation link stopped working and new ones were issued. Holon's AI key was revoked and has not yet been
  replaced, so Holon is offline. The commons' database was not publicly reachable.

## 2026-10-20

- **Release.** The concept demo is live, by invitation only. Holon answers in ask mode; transparency pages (costs,
  changes, gap log, agents, permissions, interface); a public interface for host sites. Holon's three test
  questions all met the state-of-knowledge standard, at $0.01 to $0.03 an answer.
- **Release.** Host sites can issue reviewer links through the public interface; links name the site that vouched
  for the reviewer.
- **Content.** Seeded: 27 artifacts, 32 claim entries (AI-drafted, unreviewed), 10 open questions, the map, and
  instructions for Holon, the curator and the auditor. Three artifacts checked against their actual text.

## 2026-10-18

- **Governance.** The definition of the commons, draft 0.2 (`README.md`). Not adopted.
