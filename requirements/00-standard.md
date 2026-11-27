# [COMMONS NAME]: development standard

Draft 0.1, 21 Nov 2026 (`docs/incoming/changeBrief_v0_1/supportingDocs/Commons_DevStandard_v0_1.md`), placed here
by change brief 0.1. **Not adopted.** It defines how the commons' software is specified, organized and changed, so
that people, Claude Code and the requirements agent all work to one structure. Once adopted it becomes part of the
procedural memory of the requirements agent and the coding agent. Section 9 records how it is applied in this
repository; decision 0004 covers the choices made there.

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
| **L1 Principles** | A short list of design principles every part of the app must follow (`10-principles.md`) | Rarely | Governance (today, Karl) |
| **L2 System standards** | Cross-cutting requirements the whole app follows: UX patterns and design system, accessibility, security and privacy, data model, API conventions, agent and AI conventions, quality attributes (availability, performance, cost) (`20-system/`) | Occasionally | Karl, on the requirements agent's proposal |
| **L3 Surface and capability requirements** | What each part of the app does: each surface (public, participant, steward, operations) and each capability (asking Holon, questions and readings, dialog, artifacts, joining and disclosure, and so on) (`30-capabilities/`, `40-surfaces/`) | Often | Karl approves; the requirements agent maintains |
| **L4 Verification** | Acceptance tests that show each requirement is met (`tests/acceptance.yaml`) | With L3 | Automated where possible |

Rules:

- **Every requirement traces up.** An L3 requirement names its L2 or L1 parents; an L2 standard names its L1
  principles. A requirement with no parent is either a missing principle or not needed.
- **Every L3 requirement is verified** by at least one L4 test, automated where possible.
- **Lower levels may not contradict higher ones.** A conflict is resolved by changing the lower level, or by
  proposing a change to the higher one through its own process.
- **Agent definitions are a parallel tree** (section 5): each agent's specification traces to the same L1 principles
  and L2 standards.
- A script checks traceability on every change: no orphans, no L3 without a test, no links to retired items
  (`npm run trace:check`).

## 3. Requirement records

One file per requirement area (for example `requirements/30-capabilities/dialog.md`), holding several
requirements, each with:

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

One requirement per statement; no "and" joining two behaviours; no "should" (requirements are "shall"; wishes go
in rationale).

## 4. Decision records

One file per significant technical choice, in `decisions/`, numbered and never renumbered
(`0001-record-decisions.md`). Each holds: the question; context; options with pros and cons; the decision and who
made it; consequences; date; status (proposed, accepted, superseded by …). A superseded decision stays, linked to
its replacement.

## 5. Agent specifications

Agents are specified in their own tree, separate from the app's requirements, because they change on a different
rhythm and are themselves public content of the commons:

| File in `agents/<name>/` | Holds |
|---|---|
| `spec.md` | The agent's definition: purpose, does, never, memory, checked by, people, tests (from the agent definitions document); traces to L1 and L2 |
| `instructions.md` | The prompt, in the common structure |
| `config.yaml` | Provider, model, limits |
| `tests/` | Its test set |
| `tested-on.yaml` | Results per model and instruction version |
| `CHANGELOG.md` | Every change to its spec or instructions |

The app implements what agents need (tools, data, events) through L3 requirements that reference the agent's spec.

## 6. Repository layout

The target layout is drafted in decision 0003 (proposed). Until it is decided, content stays in its current
top-level folders (`map/`, `artifacts/`, `entries/`, `questions/`).

## 7. How a change flows

1. **Proposal**: from Karl, a participant, the improvement agent or a decision record.
2. **Requirements**: the requirements agent writes or updates the requirement, with parents and verification, and
   flags conflicts.
3. **Approval**: Karl accepts it (today); later, governance.
4. **Change brief**: the accepted requirements are bundled into a brief for the coding agent.
5. **Build**: the coding agent implements and writes the tests; the code reviewer reviews.
6. **Approval to merge and deploy**: a person (D27).
7. **Verification**: tests pass; statuses move to built and verified; `STATE.md` and `CHANGELOG.md` updated.

## 8. Tailored out, for now

Recorded so they can be added when the commons grows: formal requirement reviews with sign-off; a separate
verification team; requirements management tools beyond plain files and a script; C4 component and code views;
non-functional test suites beyond basic availability and cost checks.

## 9. In this repository

**A requirement** is a level-3 heading with its id and title, followed by a YAML block with the other fields:

````markdown
### CAP-MON-004 · Key expiry

```yaml
statement: The system shall report a failed check when the AI key expires within 14 days.
rationale: An expired key stops every agent; two weeks gives time to renew it.
parents: [P-02, P-11]
verification: [T-MON-004]
phase: now
status: proposed
origin: change brief 0.1, section 4
decisions: []
```
````

Prose between requirements is allowed and ignored by the check.

**A principle** (L1) uses the same form with `statement`, `rationale` and `source` (the part of the definition or
design documents it comes from) instead of `parents`.

**A test** (L4) is an entry in `tests/acceptance.yaml`: `id` (`T-` plus the area and a number), `title`, `kind`
(`automated`: code in the repository; `harness`: an agent test run with results committed to
`agents/<name>/tested-on.yaml`; `manual`: a person follows the steps), `how`, and `status` (planned, written,
passing, failing). Automated tests name their file in `file`.

**The check** (`npm run trace:check`) fails when an id is duplicated or malformed, a parent or test does not exist,
a requirement points to a retired item, an L3 requirement has no parent or no test, or an agent specification
traces to a principle that does not exist. It warns about tests no requirement uses. It writes
`requirements/traceability.md`.
