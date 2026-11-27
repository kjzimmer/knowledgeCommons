# 0003: Repository layout

- **Status:** proposed
- **Date:** 2026-11-27
- **Drafted by:** Claude Code (claude-opus-5-5), change brief 0.1, stage 1
- **Decision:** not yet made (Karl decides). Karl's direction for this slice: draft only, leave the files where they
  are (answers to change brief 0.1, B8).

## Question

How is the repository laid out, and do content and app split into two repositories?

## Context

Today one repository holds content in top-level folders (`map/`, `artifacts/`, `entries/`, `questions/`), the
agents, the app (`app/`, `prisma/`), and project files. Stage 1 added `requirements/`, `decisions/` and
`tests/acceptance.yaml`. The development standard (section 6) proposes moving content into `content/`. The first
brief foresaw two repositories (content and app). And there is an open question, to come back to later: how all of
the commons is kept (knowledge, files, database, app code, configuration) so nothing is lost and anyone can fork it
(`docs/STATUS.md`, open question 2).

## Options

| Option | For | Against |
|---|---|---|
| **A. Keep the current layout and one repository for this slice** | No churn while the question loop is built; every link, path and the content loader stay as they are | The top level is crowded (fourteen folders and files) |
| B. Move content into `content/` now | The target layout of the development standard; a clear line between knowledge and everything else | Touches every content path, the loader, the AI's prompts and pages in the middle of a slice; nothing needs it yet |
| C. Split content and app into two repositories | Content could be forked without the app; separate histories | Two places to change for every feature that touches both; how the commons is kept is still open, and the split should follow from that answer |

## Recommendation

**A for this slice**, then **B at a quiet point after it** (a single commit that moves the folders and updates the
loader), and **decide C with the open question on how the whole commons is kept**, since the answer to that
question decides what a fork needs.

## Consequences

- New folders added by change brief 0.1: `requirements/`, `decisions/`; agent folders follow the development
  standard (section 5) from stage 1.
- `questions/<id>/reading.md` (decision 0007) needs a question to become a folder; until the move, a question with
  a recorded reading has both `questions/<id>.md` and `questions/<id>/reading.md`, and the loader reads both.

## Traces to

P-01, P-11.
