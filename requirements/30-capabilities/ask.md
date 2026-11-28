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
status: verified
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

## Gap found in testing: questions the commons cannot answer yet

**Pending a second review** (Karl, 2026-11-27). Found when Holon, asked "Who is Elinor Ostrom?", reported the
biography as missing from the commons instead of answering. Karl's direction: Holon answers every question from
its own training where the commons falls short, and the sources it would rely on become work for the scout. The
proposal and the questions for the review are in `docs/reviews/2026-11-27-holon-gaps-to-scout.md`. Not to be built
until the review is done; related requirements CAP-GRW-015 to CAP-GRW-017.

### CAP-ASK-007 · Always an answer

```yaml
statement: When the commons holds too little to answer a question, the system shall have Holon answer from its own knowledge under the label "Not from the commons".
rationale: "A labelled answer from the model's training is still an answer; refusing helps no one (Karl, 2026-11-27). Today's instructions only say Holon may add its own knowledge."
parents: [P-04]
verification: [T-ASK-007]
phase: now
status: proposed
origin: "Karl, 2026-11-27 (testing: 'Who is Elinor Ostrom?'); pending second review"
review: pending second review
decisions: []
```

### CAP-ASK-008 · Gap notes name candidate works

```yaml
statement: When Holon answers any part of a question from its own knowledge, the system shall record a gap note naming what the commons is missing and the works that would fill it, marked as unchecked suggestions.
rationale: Turns each such answer into a lead for acquisition. The works are named from the model's memory and may be wrong, so they are suggestions until the scout verifies them (CAP-GRW-016).
parents: [P-02, P-04]
verification: [T-ASK-008]
phase: now
status: proposed
origin: Karl, 2026-11-27; pending second review
review: pending second review
decisions: []
```

### CAP-ASK-009 · Short answers to simple questions

```yaml
statement: Where a question asks for a simple fact, the system shall have Holon answer in a short form, with the full state-of-knowledge form kept for claims and open questions.
rationale: "A question like 'who is X' does not need evidence, objection and unknowns sections; docs/STATUS.md already expected a lighter format for short questions."
parents: [P-04, P-10]
verification: [T-ASK-007]
phase: now
status: proposed
origin: Karl, 2026-11-27; pending second review
review: pending second review
decisions: []
```
