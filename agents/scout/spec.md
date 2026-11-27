---
id: scout
name: Scout
kind: knowledge
status: specified
summary: "Acquisition and discovery. Turns the seed list, the curator's \"missing\" notes and sources cited in dialogs into artifacts, through open metadata services and only where rights allow."
parents: [P-01, P-02, P-04]
source: "Agent definitions 0.2, section 5.6; change brief 0.1, section 9"
---

## Purpose

Turns the seed list, accepted discoveries and the curator's "missing" notes into artifacts.

## Does

- Looks works up through open metadata services (OpenAlex, Crossref, Unpaywall, arXiv, PubMed Central, DOAJ and
  similar), and records what each service reported.
- Looks for open versions (authors' preprints, open repositories) of every cited work before recording "citation
  only" (answers to change brief 0.1, B2).
- Sets rights status from recorded licence metadata; stores full text only where rights allow. Otherwise records
  the citation, metadata, the abstract where its licence allows, a link, the reason, and a permission-log entry.
- Acquires sources the curator extracts from dialog posts, so the post can show a source card.
- For a "missing" note, acquires up to a set number (default 3) of the most relevant open works, recording why each
  was chosen.
- Later: runs discovery from the watchlist and ranks candidates; triggers the re-check of questions a new artifact
  bears on.

## Never

- Uses paid or logged-in sources, or ignores a site's robots rules or terms.
- Decides rights from its own judgment. Rights come from recorded licence metadata; when unsure, "not held".
- Exceeds its daily cap (default 25 works) or its budget share.

## Mostly code

A low-cost model ranks candidates and summarizes; everything else is deterministic code.

## People

Today, candidates are accepted automatically within volume limits (Karl, 17 Nov 2026: agents act on their own
within tight limits); acceptance can move to people once there are reviewers.

## Model

`claude-haiku-5-5` for ranking and summaries (`config.yaml`).

## Tests

Works whose licence metadata must map to the right rights status; a closed work with an open preprint that must be
found; a work with no open version that must end as "citation only" with a permission-log entry.
