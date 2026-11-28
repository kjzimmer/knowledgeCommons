# L3: monitoring

The monitor, basic version (change brief 0.1, section 4; agent definitions 0.2, section 6.3; spec in
`agents/monitor/spec.md`). Ids `CAP-MON-NNN`. Built in stage 1.

### CAP-MON-001 · Scheduled checks

```yaml
statement: The system shall run the monitor's checks every six hours.
rationale: Often enough to catch a stopped service the same day; cheap (one short call per model).
parents: [P-02, P-11]
verification: [T-MON-001]
phase: now
status: verified
origin: change brief 0.1, section 4
decisions: ["0006"]
```

### CAP-MON-002 · Checks on demand

```yaml
statement: When a steward asks, the system shall run the monitor's checks at once.
rationale: To confirm a fix without waiting for the schedule.
parents: [P-11]
verification: [T-MON-001]
phase: now
status: verified
origin: change brief 0.1, section 4
decisions: []
```

### CAP-MON-003 · App, database and models

```yaml
statement: The system shall check that the app, its database and every model a running agent uses answer.
rationale: "Change brief 0.1, section 4: the app, Holon and every agent answer."
parents: [P-02, P-05]
verification: [T-MON-003]
phase: now
status: verified
origin: change brief 0.1, section 4
decisions: []
```

### CAP-MON-004 · Key expiry

```yaml
statement: The system shall report a failed check when the AI key is missing or expires within 14 days.
rationale: An expired key stops every agent (the October incident showed how quietly that happens). The expiry is recorded by a steward as ANTHROPIC_KEY_EXPIRES; no admin key is used (answers A3).
parents: [P-02, P-11]
verification: [T-MON-004]
phase: now
status: verified
origin: change brief 0.1, section 4; answers to change brief 0.1, A3
decisions: []
```

### CAP-MON-005 · Jobs ran

```yaml
statement: The system shall report a failed check when a scheduled job has not succeeded within twice its interval.
rationale: "Change brief 0.1, section 4: that loops ran."
parents: [P-02, P-09]
verification: [T-MON-005]
phase: now
status: verified
origin: change brief 0.1, section 4
decisions: ["0006"]
```

### CAP-MON-006 · Spending within budget

```yaml
statement: The system shall report a failed check when a budget share's month-to-date spending reaches the share.
rationale: Change brief 0.1, section 4. A warning is shown at 80%.
parents: [P-02]
verification: [T-MON-006]
phase: now
status: verified
origin: change brief 0.1, section 4
decisions: []
```

### CAP-MON-007 · Email alert

```yaml
statement: When a check fails, the system shall email the steward, at most once a day for the same failures.
rationale: A changed set of failures is emailed at once; warnings are not emailed. Email through Resend (answers A4).
parents: [P-02]
verification: [T-MON-007, T-MON-007-live]
phase: now
status: verified
origin: change brief 0.1, section 4; answers to change brief 0.1, A4
decisions: []
```

### CAP-MON-008 · Public results

```yaml
statement: The system shall publish the monitor's instructions, its latest results and its history on the Operations page.
rationale: Change brief 0.1, section 4.
parents: [P-02]
verification: [T-MON-008]
phase: now
status: verified
origin: change brief 0.1, section 4
decisions: []
```

### CAP-MON-009 · Alerts not configured

```yaml
statement: If email alerts are not configured, then the system shall show a warning on the Operations page.
rationale: Otherwise failures would be silent.
parents: [P-04]
verification: [T-MON-008]
phase: now
status: verified
origin: Claude Code, stage 1
decisions: []
```

### CAP-MON-010 · No secrets reported

```yaml
statement: The system shall report about keys only whether they are set and when they expire.
rationale: The Operations page is public to everyone invited.
parents: [P-02]
verification: [T-MON-010]
phase: now
status: verified
origin: Claude Code, stage 1
decisions: []
```
