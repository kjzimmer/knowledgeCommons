# L3: the operations surface

How the software is doing, readable by everyone invited (app design 0.1, section 2). Ids `SRF-OPS-NNN`.

### SRF-OPS-001 · Operations page

```yaml
statement: The system shall show on the Operations page the monitor's results, its history, the scheduled jobs and their last runs.
rationale: Change brief 0.1, section 4.
parents: [P-02]
verification: [T-MON-008]
phase: now
status: verified
origin: change brief 0.1, section 4
decisions: []
```

### SRF-OPS-002 · Feedback log

```yaml
statement: The system shall show the feedback log on the Operations page.
rationale: Change brief 0.1, section 10.
parents: [P-02, P-11]
verification: [T-JOIN-008]
phase: now
status: proposed
origin: change brief 0.1, section 10
decisions: []
```

### SRF-OPS-003 · Running the checks

```yaml
statement: The system shall offer a steward, and only a steward, a control on the Operations page that runs the monitor's checks at once.
rationale: Each run costs a fraction of a cent per model; others can read but not act.
parents: [P-03]
verification: [T-MON-001]
phase: now
status: verified
origin: Claude Code, stage 1
decisions: []
```
