# L3: joining and disclosure

Invitations, joining, consent and disclosure (change brief 0.1, section 10; answers to change brief 0.1, B6). Ids
`CAP-JOIN-NNN`.

### CAP-JOIN-001 · Invitations

```yaml
statement: The system shall let a steward create an invitation link that is unique to one person.
rationale: The draft site stays invite-only; the existing signed links become invitations for participants.
parents: [P-02]
verification: [T-JOIN-001]
phase: now
status: proposed
origin: change brief 0.1, section 10
decisions: []
```

### CAP-JOIN-002 · Joining

```yaml
statement: When a person first opens their invitation, the system shall ask for the name to show, acceptance of the consent terms and the disclosure form before they take part.
rationale: Joining makes them a participant.
parents: [P-02, P-04]
verification: [T-JOIN-002]
phase: now
status: proposed
origin: change brief 0.1, section 10
decisions: []
```

### CAP-JOIN-003 · Consent states the mode

```yaml
statement: The system shall state the current record mode in the consent terms.
rationale: In sandbox mode, what a participant writes may be deleted.
parents: [P-04]
verification: [T-JOIN-002]
phase: now
status: proposed
origin: change brief 0.1, sections 5 and 10
decisions: []
```

### CAP-JOIN-004 · Optional disclosure

```yaml
statement: The system shall make every disclosure field optional and show an empty field as "not disclosed".
rationale: Interests, affiliations, funding and employment relevant to the commons' subjects. Disclosure weighs independence; it is never grounds for rejection.
parents: [P-02, P-04]
verification: [T-JOIN-004]
phase: now
status: proposed
origin: change brief 0.1, sections 6 and 10
decisions: []
```

### CAP-JOIN-005 · Reviewers stay read-only

```yaml
statement: The system shall give people who enter through a host site's reviewer link read-only access, without joining.
rationale: The AA-facing interface does not change in this slice (answers B6).
parents: [P-02]
verification: [T-JOIN-005]
phase: now
status: proposed
origin: answers to change brief 0.1, B6
decisions: []
```

### CAP-JOIN-006 · Reviewer upgrade

```yaml
statement: When a steward invites a person who already has reviewer access, the system shall let that person join as a participant.
rationale: "Answers B6: write it so a reviewer can later be upgraded."
parents: [P-02]
verification: [T-JOIN-005]
phase: now
status: proposed
origin: answers to change brief 0.1, B6
decisions: []
```

### CAP-JOIN-007 · Roles

```yaml
statement: The system shall give each participant the role of steward or participant, and only a steward may act on the steward view.
rationale: Karl is a steward; other invitees are participants.
parents: [P-03]
verification: [T-JOIN-007]
phase: now
status: proposed
origin: change brief 0.1, section 10
decisions: []
```

### CAP-JOIN-008 · Feedback link

```yaml
statement: The system shall offer on every page a link for comments on the site itself, recorded in the feedback log.
rationale: The feedback channel is one of the hooks for switching on the app team (app design 0.1, section 5).
parents: [P-02, P-11]
verification: [T-JOIN-008]
phase: now
status: proposed
origin: change brief 0.1, section 10
decisions: []
```
