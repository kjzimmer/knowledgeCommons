# L3: the steward surface

What only a steward can do (change brief 0.1, section 12; app design 0.1, section 2). Keys and secrets stay outside
the app. Ids `SRF-STW-NNN`.

### SRF-STW-001 · Steward only

```yaml
statement: The system shall let only a steward use the steward view.
rationale: Separation of powers; today the steward is Karl.
parents: [P-03]
verification: [T-STW-001]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### SRF-STW-002 · Steward view contents

```yaml
statement: The system shall show in the steward view the invitations, the moderation hold queue, the record-mode setting with the sandbox wipe, the budget with its shares, and the feedback log.
rationale: Change brief 0.1, section 12.
parents: [P-02, P-03]
verification: [T-STW-002]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### SRF-STW-003 · Wipe confirmation

```yaml
statement: When a steward starts the sandbox wipe, the system shall show what will be deleted and what kept, and wipe only after a second confirmation.
rationale: A wipe cannot be undone.
parents: [P-02]
verification: [T-REC-004]
phase: now
status: proposed
origin: change brief 0.1, section 5
decisions: []
```
