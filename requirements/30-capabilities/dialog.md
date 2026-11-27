# L3: dialog

Text dialog over time on a question (change brief 0.1, sections 6, 11 and 12; agent definitions 0.2, sections 3 to
5). Ids `CAP-DLG-NNN`.

## Contributions

### CAP-DLG-001 · Contribution kinds

```yaml
statement: The system shall record each contribution as a post or a transcript segment with speaker, start, end and text.
rationale: Only posts are built now; the transcript type keeps the path open for audio and video.
parents: [P-01, P-09]
verification: [T-DLG-001]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: ["0007"]
```

### CAP-DLG-002 · Posts and replies

```yaml
statement: The system shall show a question's posts in order with the poster's name and time, and let a participant reply to a specific post.
rationale: Change brief 0.1, section 12.
parents: [P-10]
verification: [T-DLG-002]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### CAP-DLG-003 · Poster's disclosure

```yaml
statement: The system shall link each poster's name to their disclosure.
rationale: Disclosures weigh independence and are attached to contributions.
parents: [P-02]
verification: [T-DLG-002]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### CAP-DLG-004 · Agent posts labelled

```yaml
statement: The system shall label the facilitator's posts "Facilitator (AI)", Holon's "Holon (the commons' agent)", and challenges posted by either as the challenger's.
rationale: Honest labels; the challenger never argues in dialogs as itself.
parents: [P-04]
verification: [T-DLG-004]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

## Extraction and sources

### CAP-DLG-005 · Extraction

```yaml
statement: When a post is added, the system shall have the curator extract its claims, the sources it cites and what it responds to.
rationale: Agent definitions 0.2, section 3, step 6.
parents: [P-07, P-09]
verification: [T-DLG-005]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: ["0006"]
```

### CAP-DLG-006 · Extraction shown

```yaml
statement: The system shall show under each post, collapsed, "what the curator took from this".
rationale: Change brief 0.1, section 12.
parents: [P-02, P-04]
verification: [T-DLG-006]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### CAP-DLG-007 · Extraction corrected

```yaml
statement: When a post's author corrects its extraction, the system shall keep the correction beside the original extraction.
rationale: Only the author can correct it; the original stays for the record.
parents: [P-02, P-03]
verification: [T-DLG-007]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: []
```

### CAP-DLG-008 · Source cards

```yaml
statement: When a post cites a source, the system shall show a source card on the post saying whether its full text is held or it is citation only.
rationale: Change brief 0.1, section 9.
parents: [P-04]
verification: [T-DLG-008]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: []
```

## Facilitator and Holon

### CAP-DLG-009 · One person present

```yaml
statement: While only one person is taking part in a dialog, the system shall have the facilitator converse with them and keep the thread on the question.
rationale: Karl is the only participant during the draft.
parents: [P-03]
verification: [T-DLG-009]
phase: now
status: proposed
origin: change brief 0.1, sections 8 and 16
decisions: []
```

### CAP-DLG-010 · Inviting endorsement

```yaml
statement: When the facilitator notices convergence on a point, the system shall have it invite endorsements and ask the curator for a working draft.
rationale: The facilitator surfaces agreement but never claims it.
parents: [P-03]
verification: [T-DLG-010]
phase: now
status: proposed
origin: change brief 0.1, section 8
decisions: []
```

### CAP-DLG-011 · Moderation rungs

```yaml
statement: "The system shall let the facilitator take only the first three moderation steps: a private note, a public redirect, or holding a post for human review."
rationale: People handle held posts, appeals and anything further.
parents: [P-03]
verification: [T-DLG-011]
phase: now
status: proposed
origin: change brief 0.1, section 8
decisions: []
```

### CAP-DLG-012 · Held posts

```yaml
statement: When the facilitator holds a post, the system shall hide it pending a steward's review and record the hold in the public moderation log.
rationale: The moderation log is public (change brief 0.1, section 12).
parents: [P-02, P-03]
verification: [T-DLG-012]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

### CAP-DLG-013 · Holon in the thread

```yaml
statement: When a participant asks Holon on a thread or a post, the system shall post Holon's answer in the thread, labelled.
rationale: Holon's discuss mode; its posts feed the curator like anyone's.
parents: [P-03, P-04]
verification: [T-DLG-013]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```

## Endorsement and following

### CAP-DLG-014 · Endorsement

```yaml
statement: The system shall let a participant respond to a point of a reading revision with endorse, accept with reservations with the reservation, or dispute with the reason.
rationale: Endorsement is a person's explicit act on a three-point scale.
parents: [P-03, P-04]
verification: [T-DLG-014]
phase: now
status: proposed
origin: change brief 0.1, section 6
decisions: []
```

### CAP-DLG-015 · Position with an endorsement

```yaml
statement: The system shall let a participant add with an endorsement an optional short statement of their position on the question, shown with it.
rationale: Groundwork for the endorsed level (answers B3).
parents: [P-02]
verification: [T-DLG-014]
phase: now
status: proposed
origin: answers to change brief 0.1, B3
decisions: []
```

### CAP-DLG-016 · No inferred endorsement

```yaml
statement: The system shall record an endorsement only from a participant's own action.
rationale: No agent infers endorsement from what someone wrote.
parents: [P-03]
verification: [T-DLG-016]
phase: now
status: proposed
origin: agent definitions 0.2, section 2
decisions: []
```

### CAP-DLG-017 · Following

```yaml
statement: The system shall let a participant follow a question.
rationale: Followers receive notices of what changed (notifications).
parents: [P-02]
verification: [T-DLG-017]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```
