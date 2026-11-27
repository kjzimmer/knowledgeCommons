# L3: record mode and the full export

The sandbox record mode (change brief 0.1, section 5) and the export of everything the commons holds (decision 0007,
interim). Ids `CAP-REC-NNN`.

## Record mode

### CAP-REC-001 · Mode setting

```yaml
statement: The system shall take its record mode from the RECORD_MODE setting, sandbox unless set to keep.
rationale: The draft period's use is rough and not meant to be kept.
parents: [P-02, P-04]
verification: [T-REC-001]
phase: now
status: proposed
origin: change brief 0.1, section 5
decisions: []
```

### CAP-REC-002 · Sandbox flag

```yaml
statement: While the record mode is sandbox, the system shall mark questions created during the draft, reading revisions, dialog posts, extractions, endorsements and disclosures as sandbox records.
rationale: So they can be wiped together.
parents: [P-02]
verification: [T-REC-002]
phase: now
status: proposed
origin: change brief 0.1, section 5
decisions: ["0007"]
```

### CAP-REC-003 · Sandbox banner

```yaml
statement: "While the record mode is sandbox, the system shall show on every page \"Draft site: what happens here may be deleted.\""
rationale: Change brief 0.1, section 5.
parents: [P-04]
verification: [T-REC-003]
phase: now
status: proposed
origin: change brief 0.1, section 5
decisions: []
```

### CAP-REC-004 · Sandbox wipe

```yaml
statement: When a steward confirms the sandbox wipe, the system shall delete every sandbox record and log the wipe with the steward and the time.
rationale: Change brief 0.1, section 5.
parents: [P-02]
verification: [T-REC-004]
phase: now
status: proposed
origin: change brief 0.1, section 5
decisions: []
```

### CAP-REC-005 · What a wipe keeps

```yaml
statement: The system shall keep through a sandbox wipe acquired artifacts, the seed questions, their first audited readings, agent files, requirements, decisions, the call log and the monitor's history.
rationale: Change brief 0.1, section 5; answers to change brief 0.1, B4.
parents: [P-01]
verification: [T-REC-004]
phase: now
status: proposed
origin: answers to change brief 0.1, B4
decisions: []
```

### CAP-REC-006 · Switching to keep

```yaml
statement: When a steward switches the record mode, the system shall log the switch with the steward and the time.
rationale: The switch to keep is a Governance entry in CHANGELOG.md, written by a person from this log.
parents: [P-02, P-03]
verification: [T-REC-006]
phase: now
status: proposed
origin: change brief 0.1, section 5
decisions: []
```

## Export

### CAP-REC-007 · Full export

```yaml
statement: The system shall produce a full export of everything the commons may publish, nightly and on request.
rationale: Database records as plain files, readings, and artifact files the rights allow (decision 0007).
parents: [P-01]
verification: [T-REC-007]
phase: now
status: proposed
origin: change brief 0.1, sections 6 and 7
decisions: ["0007"]
```

### CAP-REC-008 · Self-describing export

```yaml
statement: The system shall include in every export a manifest of its files with checksums, the database schema version and the code commit that wrote it.
rationale: "Keeps the open question of how the whole commons is kept answerable: an export must be enough to rebuild from (Karl, 2026-11-23)."
parents: [P-01]
verification: [T-REC-007]
phase: now
status: proposed
origin: Karl, 2026-11-23 (docs/STATUS.md, open question 2)
decisions: ["0007"]
```

### CAP-REC-009 · Readings to the repository

```yaml
statement: The system shall provide a command, run from a copy of the repository, that writes recorded readings from the export to questions/<id>/reading.md for a person to commit.
rationale: The app has no write access to the repository; pushing to the deploy branch would redeploy it (Stage 0 report, question 1).
parents: [P-01, P-03]
verification: [T-REC-009]
phase: now
status: proposed
origin: Stage 0 report, question 1 (Karl, 2026-11-23)
decisions: ["0007"]
```

### CAP-REC-010 · What is committed in each mode

```yaml
statement: While the record mode is sandbox, the readings command shall write only the first audited reading of each seed question.
rationale: Keeps throwaway material out of the repository's history; in keep mode every recorded revision is written (answers B1).
parents: [P-01]
verification: [T-REC-009]
phase: now
status: proposed
origin: answers to change brief 0.1, B1
decisions: ["0007"]
```
