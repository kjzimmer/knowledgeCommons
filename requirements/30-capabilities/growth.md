# L3: growth (the scout, the budget)

Acquisition by the scout (change brief 0.1, section 9) and the budget shares (section 13). Ids `CAP-GRW-NNN`.

## The scout

### CAP-GRW-001 · Seed acquisition

```yaml
statement: When seed acquisition runs for a seed question, the system shall look up each work the question draws on through open metadata services.
rationale: OpenAlex, Crossref, Unpaywall, arXiv, PubMed Central, DOAJ and similar.
parents: [P-01, P-02]
verification: [T-GRW-001]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: []
```

### CAP-GRW-002 · What services reported

```yaml
statement: The system shall record what each metadata service reported for each work it looked up.
rationale: Rights and metadata decisions must be traceable to their source.
parents: [P-02]
verification: [T-GRW-001]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: []
```

### CAP-GRW-003 · Rights from licence metadata

```yaml
statement: The system shall set an acquired work's rights status from its recorded licence metadata, and to "not held" when the metadata is unclear.
rationale: The scout never decides rights from its own judgment.
parents: [P-02, P-04]
verification: [T-GRW-003]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: []
```

### CAP-GRW-004 · Open versions first

```yaml
statement: When a work is not openly available from its publisher, the system shall search for an open version before recording it as citation only.
rationale: Authors' preprints and open repositories (answers to change brief 0.1, B2).
parents: [P-01]
verification: [T-GRW-004]
phase: now
status: proposed
origin: answers to change brief 0.1, B2
decisions: []
```

### CAP-GRW-005 · Citation-only record

```yaml
statement: Where a work's full text cannot be held, the system shall record its citation, metadata, the abstract where its licence allows, a link, the reason, and an entry in the permission log.
rationale: Change brief 0.1, section 9.
parents: [P-02]
verification: [T-GRW-004]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: []
```

### CAP-GRW-006 · Sources from dialogs

```yaml
statement: When the curator extracts a cited source from a post, the system shall have the scout look it up and acquire it.
rationale: So the post can show a source card.
parents: [P-09]
verification: [T-GRW-006]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: ["0006"]
```

### CAP-GRW-007 · Missing notes

```yaml
statement: When the curator records that the commons holds too little on a point, the system shall have the scout acquire up to the set number of the most relevant open works, recording why each was chosen.
rationale: Default three works per note.
parents: [P-02, P-09]
verification: [T-GRW-007]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: ["0006"]
```

### CAP-GRW-008 · Daily cap

```yaml
statement: If the scout has acquired its daily cap of works, then the system shall stop acquisition until the next day.
rationale: Default 25 works a day.
parents: [P-11]
verification: [T-GRW-008]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: []
```

### CAP-GRW-009 · Only open, permitted sources

```yaml
statement: The system shall acquire only from sources that need no payment or login, and shall respect each site's robots rules and terms.
rationale: Change brief 0.1, section 9.
parents: [P-02]
verification: [T-GRW-009]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: []
```

## The budget

### CAP-GRW-010 · Spend per share

```yaml
statement: The system shall show month-to-date spending for each budget share against that share.
rationale: Shares in growth/budget.yaml (Holon 30%, curation 25%, audit 15%, challenge 10%, facilitation 10%, scouting 10% of $50).
parents: [P-02]
verification: [T-GRW-010]
phase: now
status: built
origin: change brief 0.1, section 13
decisions: []
```

### CAP-GRW-011 · Paused share

```yaml
statement: If a budget share is used up, then the system shall pause the work that share pays for until the next month.
rationale: growth/budget.yaml rules.
parents: [P-11]
verification: [T-GRW-011]
phase: now
status: proposed
origin: change brief 0.1, section 13
decisions: []
```

### CAP-GRW-012 · Audit share priority

```yaml
statement: If the audit share is used up, then the system shall hold every reading and revision unaudited until the audit share allows its audit.
rationale: Nothing counts without its audit.
parents: [P-08]
verification: [T-GRW-011]
phase: now
status: proposed
origin: change brief 0.1, section 13
decisions: []
```

### CAP-GRW-013 · Seeding allowance

```yaml
statement: The system shall charge the first readings of the seed questions to the one-time seeding allowance, shown on the Growth page.
rationale: About $20, outside the monthly shares (Stage 0 report, question 2).
parents: [P-02]
verification: [T-GRW-013]
phase: now
status: proposed
origin: Stage 0 report, question 2 (Karl, 2026-11-23)
decisions: []
```

### CAP-GRW-014 · Fair use

```yaml
statement: The system shall limit each person to the published number of questions to Holon a day, and pause Holon when the daily spending ceiling is reached.
rationale: 30 questions a day per person, $2 a day. Built in the concept demo.
parents: [P-02, P-11]
verification: [T-GRW-014]
phase: now
status: built
origin: brief v0.2; change brief 0.1, section 13
decisions: []
```
