# L3: the public surface

What anyone invited can see (change brief 0.1, section 12; app design 0.1, section 2). During the draft "public"
means every invitee; the site stays invite-only (change brief 0.1, section 15). Ids `SRF-PUB-NNN`.

### SRF-PUB-001 · Invite-only draft

```yaml
statement: While the commons is in its draft, the system shall serve its pages only to people holding a valid invitation or reviewer link.
rationale: Public access is not in this slice. Built in the concept demo.
parents: [P-02]
verification: [T-PUB-001]
phase: now
status: verified
origin: change brief 0.1, sections 1 and 15
decisions: []
```

### SRF-PUB-002 · What the commons is

```yaml
statement: The system shall show the definition, the principles and every agent with its specification and instructions.
rationale: Learn what the commons is (app design 0.1, section 2).
parents: [P-02]
verification: [T-PUB-002]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### SRF-PUB-003 · Questions and artifacts

```yaml
statement: The system shall show the list of questions, each question's page, and each artifact's page.
rationale: Change brief 0.1, section 12.
parents: [P-02]
verification: [T-PUB-003]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### SRF-PUB-004 · Question page layout

```yaml
statement: The system shall show a question's reading above its dialog, collapsible on a phone and beside the thread on a wide screen.
rationale: Change brief 0.1, section 12.
parents: [P-10]
verification: [T-PUB-004]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: ["0005"]
```

### SRF-PUB-005 · Reading on the page

```yaml
statement: The system shall show on a question page the reading's summary, each point with its status, level, provenance, rationale, sources and strongest objection, what we don't know, and the revision history.
rationale: Change brief 0.1, section 12.
parents: [P-02, P-04]
verification: [T-PUB-004]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### SRF-PUB-006 · Transparency pages

```yaml
statement: The system shall show the costs, changes, gap log, moderation log and Operations pages.
rationale: Costs, changes and the gap log are built; the moderation log comes with dialogs; Operations with the monitor.
parents: [P-02]
verification: [T-PUB-006]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### SRF-PUB-007 · State and changelog

```yaml
statement: The system shall serve STATE.md at /state and CHANGELOG.md at /changelog.
rationale: The commons' public face to its users (project comms 0.1).
parents: [P-02]
verification: [T-PUB-007]
phase: now
status: verified
origin: change brief 0.1, section 3
decisions: []
```

### SRF-PUB-008 · Phone width

```yaml
statement: The system shall render every page usable at 360 pixels wide without horizontal scrolling of the page.
rationale: Phone first. Wide tables scroll inside their own box.
parents: [P-10]
verification: [T-PUB-008]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: ["0005"]
```

### SRF-PUB-009 · One design system

```yaml
statement: The system shall style every surface from one set of type, colour, spacing and component definitions.
rationale: A first-pass design system, not Abundance Architecture's look.
parents: [P-10, P-11]
verification: [T-PUB-009]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: ["0005"]
```
