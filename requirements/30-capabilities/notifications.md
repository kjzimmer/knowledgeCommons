# L3: notifications

In-app notices only in this slice; email notices are out of scope (change brief 0.1, sections 11 and 15). Ids
`CAP-NTF-NNN`.

### CAP-NTF-001 · Notice of a revision

```yaml
statement: When a recorded revision changes a point of a question a participant follows, the system shall show them an in-app notice of what changed on that point, why, and its new level.
rationale: Not just "updated" (agent definitions 0.2, section 3, step 9).
parents: [P-02, P-04]
verification: [T-NTF-001]
phase: now
status: proposed
origin: change brief 0.1, section 11
decisions: []
```

### CAP-NTF-002 · Working draft banner

```yaml
statement: While a working draft changes something in a question's reading, the system shall show a banner on the question page naming the changes.
rationale: Participants see the working draft during the dialog.
parents: [P-04]
verification: [T-NTF-002]
phase: now
status: proposed
origin: change brief 0.1, section 12
decisions: []
```
