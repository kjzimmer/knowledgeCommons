# L3: questions and readings

Requirements for the question record and the question loop (change brief 0.1, sections 6 and 11; agent definitions
0.2, sections 2 and 3; answers to change brief 0.1). Ids `CAP-QR-NNN`. All proposed; Karl approves.

## The record

### CAP-QR-001 · Question record

```yaml
statement: The system shall record for every question its text, origin, domains, status and followers.
rationale: The question is the unit the commons organizes knowledge around; its origin shows who or what posed it.
parents: [P-01, P-02]
verification: [T-QR-001]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: ["0007"]
```

### CAP-QR-002 · Question origins

```yaml
statement: The system shall record a question's origin as one of Karl, participant, Holon gap shared by the asker, mined from an artifact, raised in a dialog, or challenge.
rationale: Agent definitions 0.2, section 2. Challenge questions against the living-systems view are sought deliberately and must be visible as such.
parents: [P-02, P-04]
verification: [T-QR-001]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: []
```

### CAP-QR-003 · Reading as points

```yaml
statement: The system shall hold a question's reading as a list of points, each with a claim, agreement status, rationale, sources, strongest objection and reading level.
rationale: A question's answer usually holds several claims, each with its own status.
parents: [P-04, P-07]
verification: [T-QR-003]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: ["0007"]
```

### CAP-QR-004 · Reading summary and unknowns

```yaml
statement: The system shall hold with every reading what we don't know and a summary across its points.
rationale: The state-of-knowledge standard requires saying what is not known.
parents: [P-04]
verification: [T-QR-003]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: []
```

### CAP-QR-005 · Point sources

```yaml
statement: The system shall record each source of a point as an artifact and location, with a note on its independence.
rationale: Provenance and independence are what the auditor checks.
parents: [P-02, P-08]
verification: [T-QR-003]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: []
```

### CAP-QR-006 · Revision history

```yaml
statement: When a reading is revised, the system shall keep the earlier revision and record what changed, why, the trigger, and the agent, model and instruction version that wrote it.
rationale: Every revision's history is public; a revision must be reproducible and explainable.
parents: [P-01, P-02, P-05]
verification: [T-QR-006]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: ["0007"]
```

### CAP-QR-007 · Entries are not evidence

```yaml
statement: Where a point cites one of the commons' AI-drafted entries, the system shall label that source "earlier AI-drafted entry".
rationale: "The 32 seeded entries are AI-drafted and unreviewed: material, not evidence (answers to change brief 0.1, B5)."
parents: [P-04]
verification: [T-QR-007]
phase: now
status: proposed
origin: answers to change brief 0.1, B5
decisions: []
```

### CAP-QR-008 · Governance questions outside the loop

```yaml
statement: The system shall not run the question loop on questions about the commons itself.
rationale: The eight governance questions (name, licence, charter, budget, statuses, experiential knowledge, legal entity, knowledge and copyright) are decided by governance, not by readings (answers B5, Stage 0 report question 4).
parents: [P-03]
verification: [T-QR-008]
phase: now
status: proposed
origin: answers to change brief 0.1, B5
decisions: []
```

### CAP-QR-009 · Retired sample questions

```yaml
statement: When a sample question is retired, the system shall show a pointer to the seed question that replaces it.
rationale: polycrisis-useful and polycentric-global merge into Q6 and Q5; old links must still lead somewhere.
parents: [P-04]
verification: [T-QR-009]
phase: now
status: proposed
origin: answers to change brief 0.1, B5
decisions: []
```

## The loop on creation

### CAP-QR-010 · First reading

```yaml
statement: When a question is created in the knowledge loop, the system shall request a first reading from the curator.
rationale: Every question starts with an agent's reading (agent definitions 0.2, section 3, step 2).
parents: [P-07, P-09]
verification: [T-QR-010]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-011 · Challenge before audit

```yaml
statement: When the curator writes a reading or a recorded revision, the system shall send it to the challenger before the auditor.
rationale: The auditor checks the reading and the challenge together.
parents: [P-03, P-08]
verification: [T-QR-010]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-012 · Audit

```yaml
statement: When the challenger has written its case against a reading, the system shall send the reading and the challenge to the auditor.
rationale: Nothing knowledge-changing counts without its audit.
parents: [P-08]
verification: [T-QR-010]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-013 · Audited level

```yaml
statement: When the auditor passes a point's integrity, reasoning and independence checks, the system shall set that point's level to "audited".
rationale: Agents can reach "audited" without people; provenance is shown beside the level, not required for it (answers B2).
parents: [P-04, P-08]
verification: [T-QR-013]
phase: now
status: proposed
origin: answers to change brief 0.1, B2
decisions: []
```

### CAP-QR-014 · Failed checks shown

```yaml
statement: If the auditor fails a check on a point, then the system shall show the failed check on the reading.
rationale: A failed check marks a contribution; it does not delete it.
parents: [P-02, P-04]
verification: [T-QR-014]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: []
```

### CAP-QR-015 · Revision after a failed check

```yaml
statement: If the auditor fails a check on a reading, then the system shall request a revision from the curator.
rationale: Agent definitions 0.2, section 3, step 4.
parents: [P-08]
verification: [T-QR-014]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: []
```

### CAP-QR-016 · Provenance per source

```yaml
statement: The system shall record the auditor's provenance result for each source a point cites, as verified against full text, checked against abstract or metadata only, or unverifiable.
rationale: Most seed works are not held in full text; the label must say how far each source was checked (answers B2).
parents: [P-04, P-08]
verification: [T-QR-016]
phase: now
status: proposed
origin: answers to change brief 0.1, B2
decisions: []
```

### CAP-QR-017 · Provenance summary

```yaml
statement: The system shall show each point's provenance summary beside its level.
rationale: "For example \"Audited · provenance: 1 of 3 sources verified\" (answers B2)."
parents: [P-04]
verification: [T-QR-016]
phase: now
status: proposed
origin: answers to change brief 0.1, B2
decisions: []
```

### CAP-QR-018 · Unverifiable sources

```yaml
statement: Where a point's provenance is unverifiable for a source, the system shall state on the point that its claims about that source rest on the model's knowledge.
rationale: Honest labels (answers B2).
parents: [P-04]
verification: [T-QR-016]
phase: now
status: proposed
origin: answers to change brief 0.1, B2
decisions: []
```

## Levels

### CAP-QR-019 · Changed points drop a level

```yaml
statement: When a reading is revised, the system shall set each changed point's level to "agent's reading" until it is audited again.
rationale: A revision is untested until checked.
parents: [P-04, P-08]
verification: [T-QR-019]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: []
```

### CAP-QR-020 · Endorsements of earlier revisions

```yaml
statement: While an endorsement refers to an earlier revision of a point, the system shall show it as an endorsement of that revision.
rationale: An endorsement must not appear to support wording the person never saw.
parents: [P-04]
verification: [T-QR-019]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: []
```

### CAP-QR-021 · Endorsed level not active

```yaml
statement: The system shall show on every question page that the "endorsed" level is not yet active, and why.
rationale: The rule for "people whose positions differ" still needs design, and with one participant it cannot be reached (answers B3).
parents: [P-04]
verification: [T-QR-021]
phase: now
status: proposed
origin: answers to change brief 0.1, B3
decisions: []
```

### CAP-QR-022 · Working draft label

```yaml
statement: While a reading revision is a working draft, the system shall show it as "working draft, not yet audited".
rationale: Working drafts are visible during dialogs before the challenger and auditor have checked them.
parents: [P-04, P-08]
verification: [T-QR-022]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: []
```

## Update triggers

### CAP-QR-023 · New source or argument

```yaml
statement: When the curator's extraction of a post finds a new source or argument on a point, the system shall request a working draft.
rationale: Agent definitions 0.2, update triggers.
parents: [P-09]
verification: [T-QR-023]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-024 · Endorsements shift

```yaml
statement: When endorsements on a point change, the system shall request a working draft.
rationale: Agent definitions 0.2, update triggers.
parents: [P-09]
verification: [T-QR-023]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-025 · Convergence or request

```yaml
statement: When the facilitator notices convergence or a participant asks for an update, the system shall request a working draft.
rationale: Agent definitions 0.2, update triggers.
parents: [P-09]
verification: [T-QR-023]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-026 · Recorded revision at the pause

```yaml
statement: When a dialog with a working draft has had no new posts for the pause period, the system shall request a recorded revision through the challenger and the auditor.
rationale: The default pause is one hour; a recorded revision can also be requested by a participant (CAP-QR-027).
parents: [P-08, P-09]
verification: [T-QR-026]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-027 · Recorded revision on request

```yaml
statement: When a participant asks for a recorded revision of a question with a working draft, the system shall request one through the challenger and the auditor.
rationale: Change brief 0.1, section 11.
parents: [P-08, P-09]
verification: [T-QR-026]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-028 · New artifact

```yaml
statement: When a new artifact bears on a question, the system shall request a recorded revision of its reading.
rationale: Agent definitions 0.2, update triggers.
parents: [P-09]
verification: [T-QR-028]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-029 · New objection or failed check

```yaml
statement: When the challenger raises a new objection or the auditor a failed check, the system shall request a recorded revision.
rationale: Agent definitions 0.2, update triggers.
parents: [P-08, P-09]
verification: [T-QR-028]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-030 · Combining updates

```yaml
statement: The system shall combine update requests on one question within the combining window into one update.
rationale: A busy dialog must not produce a stream of revisions. Default window one hour in text dialogs.
parents: [P-07, P-11]
verification: [T-QR-030]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: ["0006"]
```

### CAP-QR-031 · No revision without new material

```yaml
statement: If a re-check of a question finds no new material, then the system shall not create a revision.
rationale: "Agent definitions 0.2, update triggers: scheduled re-checks only."
parents: [P-11]
verification: [T-QR-030]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: []
```

### CAP-QR-032 · New questions

```yaml
statement: When the curator's extraction or the challenger proposes a new question, the system shall create it with its origin at the level "agent's reading".
rationale: Agent definitions 0.2, section 3, step 10.
parents: [P-02, P-04]
verification: [T-QR-032]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: []
```

### CAP-QR-033 · Seed questions

```yaml
statement: The system shall hold the fifteen seed questions with their recorded origins, and run each through the question loop once.
rationale: Seed questions test the loop on the subject and against challenges from the start (seed questions 0.1); Q6 goes first (Stage 0 report, question 3).
parents: [P-07, P-08]
verification: [T-QR-033]
phase: now
status: proposed
origin: change brief 0.1, sections 1 and 16
decisions: []
```
