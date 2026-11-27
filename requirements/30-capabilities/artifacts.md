# L3: artifacts

Artifact files in R2, with access by rights status (change brief 0.1, section 7; decision 0010). Ids `CAP-ART-NNN`.

### CAP-ART-001 · Metadata in the repository

```yaml
statement: The system shall keep every artifact's metadata in the repository, with a pointer to its file where one is held.
rationale: Metadata is knowledge and stays in plain files; files live in the object store.
parents: [P-01]
verification: [T-ART-001]
phase: now
status: proposed
origin: change brief 0.1, section 7
decisions: ["0007", "0010"]
```

### CAP-ART-002 · Files in an S3-compatible store

```yaml
statement: The system shall store artifact files in an object store reached through the S3-compatible interface.
rationale: Cloudflare R2 today; the interface keeps the store portable.
parents: [P-01, P-11]
verification: [T-ART-002]
phase: now
status: proposed
origin: change brief 0.1, section 7
decisions: ["0010"]
```

### CAP-ART-003 · Open files readable

```yaml
statement: Where an artifact's rights status is own work, open licence or public domain, the system shall let anyone with access read its file.
rationale: Access follows rights status.
parents: [P-01, P-02]
verification: [T-ART-003]
phase: now
status: proposed
origin: change brief 0.1, section 7
decisions: ["0010"]
```

### CAP-ART-004 · Permission terms followed

```yaml
statement: Where an artifact's rights status is permission granted, the system shall give access to its file only as its recorded terms allow, by default to agents and not as a download.
rationale: Change brief 0.1, section 7.
parents: [P-02]
verification: [T-ART-003]
phase: now
status: proposed
origin: change brief 0.1, section 7
decisions: ["0010"]
```

### CAP-ART-005 · No file without rights

```yaml
statement: If an artifact's rights status allows no full text, then the system shall hold no file for it.
rationale: Never store a copyrighted work's full text without recorded permission (CLAUDE.md; definition 0.2). Already enforced for repository files by the content check.
parents: [P-02]
verification: [T-ART-005]
phase: now
status: proposed
origin: change brief 0.1, sections 7 and 16
decisions: ["0010"]
```

### CAP-ART-006 · Held or citation only

```yaml
statement: The system shall show for every artifact whether its full text is held or it is citation only.
rationale: "Source cards on posts and artifact pages: \"Full text held\" or \"Citation only: not openly available\"."
parents: [P-04]
verification: [T-ART-006]
phase: now
status: proposed
origin: change brief 0.1, section 9
decisions: []
```
