# How the commons and its users stay in touch

Draft 0.1, 17 Nov 2026. Claude's draft for Karl Zimmer.

The knowledge commons now has its own Claude project. Claude projects cannot read each other's files, and the commons is meant to stand on its own, so communication runs through published documents, the same way any user of the commons would stay informed.

## Out: the commons publishes its own state

The commons repository carries two public files, written for both people and AI chats. Any user can read them, whether that is Abundance Architecture, the book project, or someone else entirely.

| File | What it holds | Updated |
|---|---|---|
| `STATE.md` | A short, current picture of the commons: what it is (linking the README), what is live and what is sample, the agents and the models they run on, content counts, the budget and recent spend, the main open questions, and what changed since the last version. Dated at the top. Kept to about three pages, so it can be attached to any chat. | At the end of every work session that changes something |
| `CHANGELOG.md` | Dated entries, newest first, each tagged **Decision**, **Release**, **Content**, **Incident** or **Governance**. Human-readable; not every commit, since the Changes page already shows those. | Whenever something worth knowing happens |

Rules:

- `STATE.md` and `CHANGELOG.md` are the commons' public face to its users. `STATUS.md` stays as Claude Code's working log for the next build session; when the two overlap, `STATE.md` is written for outsiders.
- Claude Code updates both at the end of each build session. Decisions made in the commons project's chats reach `CHANGELOG.md` through the next change brief. Later, an operations agent can take this on (open question D27).
- Both files are also served on the commons website (for example `/state` and `/changelog`), so they can be read without access to the repository.
- The repository is meant to be public. Until it is, Karl attaches the files to the chats that need them.

**How a user project uses them.** At the start of a session that touches the commons, attach the current `STATE.md`, or keep a dated copy in the project (for example `claude/Commons_STATE_snapshot_2026-11-17.md`) and replace it when the changelog shows something relevant. Nothing in a user project is treated as current information about the commons unless it came from `STATE.md` or `CHANGELOG.md`.

## In: users send notes to the commons

**For now:** Karl brings notes into the commons project's chat as Markdown files, using the template below, so each note says who it comes from and what it asks.

**Soon:** users of the commons send requests through the same public channels as anyone else: issues on the commons repository, with templates for requests, feedback and questions; and, for content, the Contribute interface and the proposals endpoint once they run. Abundance Architecture is one participant and should not have a private back channel; its requests are as visible as anyone's.

Karl acting as interim steward is different from Karl acting for AA. Steward decisions are made in the commons project and recorded in `CHANGELOG.md` as Governance or Decision entries. Requests from AA or the book arrive as notes from a user.

### Note template

```markdown
# Note to the commons

- From: [project or person, e.g. "Abundance Architecture site" or "Abundance Architecture book"]
- Date: [YYYY-MM-DD]
- Kind: request | feedback | proposal | question | heads-up
- About: [the part of the commons it concerns]

## What happened or what we need

[Plain description.]

## What we are asking the commons to do

[A specific ask, or "nothing; for information".]

## Sources or attachments

[Links, files, or "none".]
```

## First steps

1. Ask Claude Code, in the next change brief, to create `STATE.md` and `CHANGELOG.md` from the current `STATUS.md` and the repository's history, and to serve both on the website.
2. Copy the first `STATE.md` into this project as a dated snapshot.
3. Add issue templates to the commons repository when it goes public.
