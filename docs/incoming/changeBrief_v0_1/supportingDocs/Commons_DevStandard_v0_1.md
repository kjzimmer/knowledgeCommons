# [COMMONS NAME]: development standard

Draft 0.1, 21 Nov 2026. Claude's draft for Karl Zimmer. Nothing here is adopted. It defines how the commons' software is specified, organized and changed, so that people, Claude Code and the requirements agent all work to one structure. Once adopted it becomes part of the procedural memory of the requirements agent and the coding agent, and lives in the repository at `requirements/00-standard.md`.

## 1. What it draws on

The standard is tailored from established practice, kept as light as the commons can sustain:

| Practice | What it contributes here |
|---|---|
| Hierarchical requirements with traceability (systems engineering; NASA's Level 1 to 4 requirements; ISO/IEC/IEEE 29148) | Requirements in levels, each tracing to a parent, each verified by a test |
| Tailoring (NASA systems engineering) | Use only the rigour the project can sustain; record what is tailored out |
| EARS (Easy Approach to Requirements Syntax) | A small set of sentence patterns that make requirements testable |
| Architecture decision records (ADRs) | One short record per significant technical choice, with options and consequences |
| Design systems (tokens, components, patterns) | One source for how the whole app looks and behaves |
| Docs as code | Requirements, decisions and specifications as plain files in the repository, reviewed and versioned like code |
| C4 model | Architecture described at four zoom levels: context, containers, components, code (only the first two are kept up) |

## 2. The hierarchy

| Level | What it holds | Changes | Who decides |
|---|---|---|---|
| **L0 Charter and definition** | Why the commons exists and how it is governed: README (definition), CHARTER | Rarely | Governance |
| **L1 Principles** | A short list of design principles every part of the app must follow | Rarely | Governance (today, Karl) |
| **L2 System standards** | Cross-cutting requirements the whole app follows: UX patterns and design system, accessibility, security and privacy, data model, API conventions, agent and AI conventions, quality attributes (availability, performance, cost) | Occasionally | Karl, on the requirements agent's proposal |
| **L3 Surface and capability requirements** | What each part of the app does: each surface (public, participant, steward, operations) and each capability (asking Holon, questions and readings, dialog, artifacts, joining and disclosure, and so on) | Often | Karl approves; the requirements agent maintains |
| **L4 Verification** | Acceptance tests that show each requirement is met | With L3 | Automated where possible |

Rules:

- **Every requirement traces up.** An L3 requirement names its L2 or L1 parents; an L2 standard names its L1 principles. A requirement with no parent is either a missing principle or not needed.
- **Every L3 requirement is verified** by at least one L4 test, automated where possible.
- **Lower levels may not contradict higher ones.** A conflict is resolved by changing the lower level, or by proposing a change to the higher one through its own process.
- **Agent definitions are a parallel tree** (section 5): each agent's specification traces to the same L1 principles and L2 standards.
- A script checks traceability on every change: no orphans, no L3 without a test, no links to retired items.

## 3. Requirement records

One file per requirement area (for example `requirements/30-capabilities/dialog.md`), holding several requirements, each with:

| Field | Content |
|---|---|
| `id` | Level prefix and number, never reused: `P-03` (principle), `SYS-UX-012`, `CAP-DLG-007`, `SRF-PUB-004` |
| `title` | A few words |
| `statement` | One requirement, in an EARS pattern (below) |
| `rationale` | Why it exists |
| `parents` | The ids it traces to |
| `verification` | The test or tests that show it is met |
| `phase` | When it is due: now, next, later |
| `status` | proposed, accepted, built, verified, retired |
| `origin` | Who or what proposed it (Karl, a participant, the improvement agent, a decision record) |
| `decisions` | Related decision records |

**EARS patterns**

| Pattern | Form | Example |
|---|---|---|
| Always | The system shall … | The system shall label every AI-made item as AI-made. |
| Event | When …, the system shall … | When a live session ends, the system shall request a recorded revision of the question's reading. |
| State | While …, the system shall … | While a reading is a working draft, the system shall show it as "working draft, not yet audited". |
| Unwanted | If …, then the system shall … | If the auditor's share of the budget is used up, then the system shall hold every proposal until it can be audited. |
| Optional | Where …, the system shall … | Where a participant has chosen digests, the system shall send reading changes as a daily digest. |

One requirement per statement; no "and" joining two behaviours; no "should" (requirements are "shall"; wishes go in rationale).

## 4. Decision records

One file per significant technical choice, in `decisions/`, numbered and never renumbered (`0001-record-decisions.md`). Each holds: the question; context; options with pros and cons; the decision and who made it; consequences; date; status (proposed, accepted, superseded by …). A superseded decision stays, linked to its replacement.

**First decision records to draft** (the requirements agent's first task, with Claude Code's report of what is built):

| # | Decision | Starting point |
|---|---|---|
| 0001 | Record decisions as ADRs | This standard |
| 0002 | Tech stack | Keep what the demo is built on (Node on Railway with Postgres) unless a requirement needs otherwise; changing a working stack needs a reason, not a preference |
| 0003 | Repository layout, including whether content and app split into two repositories | Section 6 |
| 0004 | Requirements structure | This standard |
| 0005 | UX framework and design system | One design system for every surface |
| 0006 | Events between the knowledge store, the app, the AI workers and dialog services | App design, section 3 |
| 0007 | Live store: plain files now, a database with revision history and full exports later | App design, section 6 |
| 0008 | Search: full-text now, hybrid when tests show misses | Agent definitions, section 7 |
| 0009 | Provider interface and model per role | As built |

## 5. Agent specifications

Agents are specified in their own tree, separate from the app's requirements, because they change on a different rhythm and are themselves public content of the commons:

| File in `agents/<name>/` | Holds |
|---|---|
| `spec.md` | The agent's definition: purpose, does, never, memory, checked by, people, tests (from the agent definitions document); traces to L1 and L2 |
| `instructions.md` | The prompt, in the common structure |
| `config.yaml` | Provider, model, limits |
| `tests/` | Its test set |
| `tested-on.yaml` | Results per model and instruction version |
| `CHANGELOG.md` | Every change to its spec or instructions |

The app implements what agents need (tools, data, events) through L3 requirements that reference the agent's spec.

## 6. Repository layout (draft for decision 0003)

```
README.md               definition (L0)
CHARTER.md  LICENCE  FUNDING.md
STATE.md  CHANGELOG.md  STATUS.md
content/                the knowledge: map/, artifacts/, entries/, questions/ (with readings and dialog records)
agents/<name>/          agent specifications (section 5)
requirements/
  00-standard.md        this standard
  10-principles.md      L1
  20-system/            L2: ux-patterns.md, design-system/, accessibility.md, security-privacy.md,
                        data-model.md, api.md, agents-and-ai.md, quality.md
  30-capabilities/      L3: ask.md, questions-and-readings.md, dialog.md, artifacts.md,
                        joining-and-disclosure.md, make.md, growth.md, notifications.md
  40-surfaces/          L3: public.md, participant.md, steward.md, operations.md
  traceability.md       generated: every requirement, its parents and tests
decisions/              ADRs
architecture/           C4 context and container views
app/                    the code (its internal layout set by decision 0002)
tests/                  L4: acceptance tests, agent test harnesses
growth/  ledger/        budget, seed list, watchlist; monthly summaries
docs/                   how-to guides for contributors and operators
```

Moving today's top-level `artifacts/`, `entries/`, `questions/` and `map/` into `content/` is part of decision 0003.

## 7. How a change flows

1. **Proposal**: from Karl, a participant, the improvement agent or a decision record.
2. **Requirements**: the requirements agent writes or updates the requirement, with parents and verification, and flags conflicts.
3. **Approval**: Karl accepts it (today); later, governance.
4. **Change brief**: the accepted requirements are bundled into a brief for the coding agent.
5. **Build**: the coding agent implements and writes the tests; the code reviewer reviews.
6. **Approval to merge and deploy**: a person (D27).
7. **Verification**: tests pass; statuses move to built and verified; `STATE.md` and `CHANGELOG.md` updated.

## 8. Tailored out, for now

Recorded so they can be added when the commons grows: formal requirement reviews with sign-off; a separate verification team; requirements management tools beyond plain files and a script; C4 component and code views; non-functional test suites beyond basic availability and cost checks.
