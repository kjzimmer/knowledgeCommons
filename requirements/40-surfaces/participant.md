# L3: the participant surface

What a joined participant can do (change brief 0.1, sections 10 to 12; app design 0.1, section 2). Most behaviour
is specified in the capability files; these requirements say where it appears. Ids `SRF-PAR-NNN`.

### SRF-PAR-001 · Acting needs joining

```yaml
statement: The system shall let only joined participants post, endorse, correct extractions or follow questions.
rationale: Reviewers from host sites stay read-only (answers to change brief 0.1, B6).
parents: [P-02, P-03]
verification: [T-PAR-001]
phase: now
status: proposed
origin: change brief 0.1, section 10
decisions: []
```

### SRF-PAR-002 · Actions on the question page

```yaml
statement: The system shall offer on a question page, to a participant, posting, replying, endorsing each point, asking Holon on the thread and on each post, and following the question.
rationale: Change brief 0.1, section 12.
parents: [P-10]
verification: [T-PAR-002]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### SRF-PAR-003 · Own disclosure and notices

```yaml
statement: The system shall let a participant see and change their own disclosure, and see their notices.
rationale: Disclosures are the participant's own; notices are in-app only in this slice.
parents: [P-02]
verification: [T-PAR-003]
phase: now
status: proposed
origin: change brief 0.1, sections 10 and 11
decisions: []
```
