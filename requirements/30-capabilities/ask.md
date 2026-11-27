# L3: asking Holon

Ask Holon as plain question and answer, answering from readings (change brief 0.1, section 12). Ids `CAP-ASK-NNN`.

### CAP-ASK-001 · Answers from readings

```yaml
statement: When Holon answers a question the commons holds a reading on, the system shall give Holon that reading with each point's level.
rationale: Readings are computed once and reused, which keeps cost flat (agent definitions 0.2, section 9).
parents: [P-04, P-07]
verification: [T-ASK-001]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### CAP-ASK-002 · Levels stated

```yaml
statement: The system shall show with Holon's answer the level of every reading it draws on.
rationale: Holon never presents a reading as more tested than its level.
parents: [P-04]
verification: [T-ASK-002]
phase: now
status: proposed
origin: change brief 0.1, sections 12 and 14
decisions: []
```

### CAP-ASK-003 · Sources cited

```yaml
statement: The system shall show the commons' sources Holon's answer cites, linked to their artifacts.
rationale: The state-of-knowledge standard. Built in the concept demo for entries; extended to readings.
parents: [P-02, P-04]
verification: [T-ASK-003]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### CAP-ASK-004 · Not from the commons

```yaml
statement: The system shall label any part of Holon's answer that does not come from the commons.
rationale: Honest labels.
parents: [P-04]
verification: [T-ASK-002]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### CAP-ASK-005 · Private sessions

```yaml
statement: The system shall keep each Ask Holon session private to the asker and the stewards, and never pass it to another agent.
rationale: Private sessions are never published and never feed other agents. Stewards see them during the draft, and askers are told so.
parents: [P-02, P-06]
verification: [T-ASK-005]
phase: now
status: built
origin: brief v0.2; agent definitions 0.2, section 5.1
decisions: []
```

### CAP-ASK-006 · Shared gaps become questions

```yaml
statement: When an asker shares a question Holon could not answer, the system shall offer it as a new question with the origin "Holon gap shared by the asker".
rationale: Question origins (agent definitions 0.2, section 2).
parents: [P-02]
verification: [T-ASK-006]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: []
```
