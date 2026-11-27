# L1: principles

Draft, from app design 0.1, section 1 (`docs/incoming/changeBrief_v0_1/supportingDocs/Commons_AppDesign_v0_1.md`).
**Not adopted:** principles are governance, decided today by Karl. Every L2 standard and L3 requirement, and every
agent specification, traces to one or more of these.

### P-01 · Open and forkable

```yaml
statement: Plain files are the canonical, downloadable format of all knowledge, agent definitions and requirements; a complete copy is always available.
rationale: Anyone must be able to read, download and fork the commons, and nothing may be lost if the app or its host disappears. How the whole commons (including the database, files and app code) is kept is an open question (docs/STATUS.md); decision 0007 is interim.
source: "Definition 0.2 (README.md); agent definitions 0.2, sections 7.3 and 9; app design 0.1, section 1"
status: proposed
```

### P-02 · Transparent by default

```yaml
statement: Every agent's instructions are public, every action is logged, every cost and funder is published. Only private Holon sessions and personal account data are private.
rationale: Trust in the commons rests on anyone being able to see how it works and what it costs.
source: "Definition 0.2; app design 0.1, section 1"
status: proposed
```

### P-03 · Separation of powers

```yaml
statement: No role both contributes and decides, moderates and contributes, or checks its own work, for agents and people alike.
rationale: Concentrated roles are how a commons drifts toward one view without anyone noticing.
source: "Agent definitions 0.2, section 1; app design 0.1, section 1"
status: proposed
```

### P-04 · Honest labels

```yaml
statement: AI-made content, reading levels, working drafts and "not from the commons" are always labelled.
rationale: People must always be able to tell how tested something is and who or what made it.
source: "Definition 0.2; app design 0.1, section 1"
status: proposed
```

### P-05 · No single AI provider

```yaml
statement: Every agent can run on another model without changing the app.
rationale: Independence from any one company, and checks across models (curator and auditor, curator and challenger, coding agent and code reviewer).
source: "Agent definitions 0.2, section 1; app design 0.1, section 1"
status: proposed
```

### P-06 · No private agent memory

```yaml
statement: Everything an agent remembers is a commons record, so any model can be given the same context.
rationale: This is what makes switching models possible, and keeps what agents know inspectable.
source: "Agent definitions 0.2, section 7.3; app design 0.1, section 1"
status: proposed
```

### P-07 · Bounded context

```yaml
statement: Agents work on one question's record at a time.
rationale: Keeps cost and context flat as the commons grows to millions of questions.
source: "Agent definitions 0.2, section 9; app design 0.1, section 1"
status: proposed
```

### P-08 · Nothing knowledge-changing without its audit

```yaml
statement: Nothing knowledge-changing without its audit.
rationale: The audit is where provenance, integrity and reasoning are checked; without it, AI-made errors compound.
source: "Brief v0.2 and budget rules; app design 0.1, section 1"
status: proposed
```

### P-09 · Events connect the parts

```yaml
statement: The knowledge store, the app, the AI workers and dialog services are separate and communicate through events.
rationale: One pattern covers live updates, scheduled re-checks and scaling the workers independently.
source: "Agent definitions 0.2, section 9; app design 0.1, sections 1 and 3"
status: proposed
```

### P-10 · Phone first, accessible always

```yaml
statement: Phone first, accessible always.
rationale: Most people will meet the commons on a phone; a commons that excludes people is not one.
source: "App design 0.1, section 1"
status: proposed
```

### P-11 · Grow in quality, not size

```yaml
statement: Features are added when requirements and evidence call for them; every feature has an owner role and a test.
rationale: A small commons that works is worth more than a large one that doesn't.
source: "App design 0.1, section 1"
status: proposed
```
