# 0007: Where question-loop data lives (interim)

- **Status:** proposed. Its substance was agreed by Karl on 2026-11-23 (answers to change brief 0.1, B1; Stage 0
  report, question 1); this record writes it down for his decision.
- **Date:** 2026-11-27
- **Drafted by:** Claude Code (claude-opus-5-5), change brief 0.1, stage 1
- **Decision:** not yet made (Karl decides)

**This decision is interim.** The wider question stays open, to come back to later: how all of the commons is
kept (knowledge, R2 files, the database, app code, configuration and everything else the app needs to run) so that
the app runs efficiently, nothing is lost if the app or its host disappears, and anyone can fork the whole commons
(`docs/STATUS.md`, open question 2; Karl, 2026-11-23).

## Question

Where do questions, readings and their revisions, dialog posts, extractions, endorsements, disclosures and events
live?

## Context

Until now: knowledge in plain files in the repository; the database only for operational data (`CLAUDE.md`: "the
database never holds knowledge"). The question loop writes often: a post, its extraction, an endorsement, a working
draft. A commit per post will not scale (agent definitions 0.2, section 9), and the app cannot write to its own
deploy branch without redeploying itself. P-01 requires plain files to stay the canonical, downloadable format.

## Options

| Option | For | Against |
|---|---|---|
| A. Everything in the repository, a commit per change | Pure plain files | Does not scale; the app would need write access to its own deploy branch, and every commit redeploys it |
| **B. Dialog and operational data in Postgres with full revision history; recorded readings as plain files; a complete export nightly and on request** | Scales; the canonical knowledge (readings) stays in files; everything else is exportable | Two stores to keep consistent; the database holds records that matter |
| C. Everything in Postgres, files only as exports | Simplest app | The repository stops being the commons' canonical knowledge; against P-01 in spirit |

## Recommendation

**B**, as agreed:

- **Postgres:** questions created in the loop, every reading revision (working drafts included), points, posts,
  extractions and corrections, endorsements, disclosures, events, with the sandbox flag. Full revision history:
  nothing is updated in place that a later reader would need.
- **The repository:** artifacts' metadata, entries, the map, agent files, requirements and decisions as now, plus
  `questions/<id>/reading.md` for recorded readings. While `RECORD_MODE=sandbox`, only the first audited reading of
  each seed question is committed; in `keep` mode, every recorded revision.
- **How readings reach the repository:** a command run from a copy of the repository pulls them from the export
  and writes the files; a person commits them. The app has no write access to the repository (Stage 0 report,
  question 1). A later option for `keep` mode: the app commits to a branch that does not deploy, merged by a person.
- **R2:** artifact files the rights allow (decision 0010) and the nightly export.
- **The export:** one bundle of everything the commons may publish: the database's public records as plain files
  (Markdown and YAML, the same shapes as the repository's), recorded readings, and artifact files the rights allow.
  It is self-describing: a manifest of every file with checksums, the database schema version and the code commit
  that wrote it, so the open question above stays answerable. Private Holon sessions and personal account data are
  never exported.

## Consequences

- `CLAUDE.md` changes to: "Plain files are the canonical record of knowledge; operational and dialog data live in
  the database with full exports." (Done in stage 1.)
- The data model is written as the L2 standard `requirements/20-system/data-model.md` in stage 2.
- Requirements CAP-REC-007 to CAP-REC-010 cover the export and the readings command.

## Traces to

P-01, P-02, P-06.
