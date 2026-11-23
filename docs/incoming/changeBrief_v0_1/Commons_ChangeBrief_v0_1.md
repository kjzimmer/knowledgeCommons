# Change brief for Claude Code: the question loop, first slice

Version 0.1, 21 Nov 2026, written for Karl Zimmer. A change brief against the concept demo as built (see `STATUS.md`), not a rewrite. Read with it, all in this project:

- `Commons_WhatThisCommonsIs_v0_2.md`: the definition (L0); its rules still apply.
- `claude/Commons_AgentDefinitions_v0_2.md`: the agents, the question loop, reading levels, endorsement, memory design. Source of truth for every agent's role.
- `claude/Commons_AppDesign_v0_1.md`: principles (L1), surfaces, architecture and events, kinds of dialog, scale. Where it supersedes sections of the agent definitions, it says so.
- `claude/Commons_DevStandard_v0_1.md`: how requirements, decisions and agent specifications are written and where they live.
- `claude/Commons_SeedQuestions_v0_1.md`: the questions to seed.
- `Commons_SeedList_v0_1.md`: the works to acquire first.

## 0. Karl: fill these in before handing over

| Item | Value |
|---|---|
| Cloudflare R2 bucket(s) and how credentials reach Railway | `[R2 BUCKET]`, `[R2 CREDENTIALS METHOD]` |
| Seed questions, after Karl's edit | `claude/Commons_SeedQuestions_v0_1.md` as edited |
| People to invite during the draft (Karl first; possibly the Audacity Lab) | `[INVITEES]` |
| Monthly budget for the slice, and its split | `[MONTHLY BUDGET]` (draft: $50; shares in section 13) |

## 1. What this slice is for

Build the whole question loop once, minimally, end to end, so Karl can use it, try the UX, and refine the design standards from what it reveals:

> A question gets an agent's reading → the challenger challenges it → the auditor checks it against real text → the question opens for dialog → posts are extracted, cited sources are acquired → people endorse or dispute points → the reading is revised → participants see what changed → new questions enter.

Plus Ask Holon as plain question and answer, answering from readings.

Everything stays on the draft site, reachable only by invitation.

## 2. How to work

1. **Report before building** (section 3) and wait for Karl's go-ahead.
2. Work on branches and the draft deployment only. Nothing touches the AA site.
3. Commit in the stages of section 16.
4. At the end of every session that changes something, update `STATUS.md` (your working log), `STATE.md` and `CHANGELOG.md` (the commons' public face; `Commons_ProjectComms_v0_1.md`).
5. When this brief and the design documents disagree, the design documents win; when the design documents disagree with each other or with what is built, stop and ask.

## 3. Stage 0: report, and the public state files

Report to Karl:

- what the demo runs on: languages, frameworks, hosting, database, how content is loaded, folder layout;
- how the current data (27 artifacts, 32 entries, 10 questions, agent instructions) maps onto the new question record (section 6);
- your plan for every section below, and anything in this brief that would fight the existing code;
- your proposal for where question-loop data lives (section 6).

Then create `STATE.md` and `CHANGELOG.md` from `STATUS.md` and the repository's history, as specified in `Commons_ProjectComms_v0_1.md`, and serve them at `/state` and `/changelog`.

## 4. Stage 1: foundations

**Requirements and decisions, kept light** (development standard):

- Create `requirements/` with `00-standard.md` (the development standard), `10-principles.md` (the principles in section 1 of the app design) and stubs for the L2 and L3 files the standard lists. Write L3 requirements only for what this slice builds, in EARS form, each with parents and a test.
- Create `decisions/` with drafts of: 0001 record decisions as ADRs; 0002 tech stack (keep what is built unless a requirement needs otherwise); 0003 repository layout; 0004 requirements structure; 0007 where question-loop data lives; and a new one for R2 (section 7). Karl decides each.
- Add the traceability check script.

**The monitor** (agent definitions 6.3), basic version: a scheduled check that the app, Holon and every agent answer; that the Anthropic key works and its expiry is more than 14 days away; that loops ran; that spend is within the budget. It alerts Karl by email. Its instructions and results are public on an Operations page.

**Agent specifications**: create `agents/<name>/spec.md` for every agent in the agent definitions (including the requirements agent and the app team, as specifications only), following development standard section 5.

## 5. Record mode: sandbox first

The draft period's use will be rough and is not meant to be kept. Add a setting `RECORD_MODE`:

- **`sandbox`** (default now): questions created during the draft, readings, revisions, dialog posts, extractions, endorsements and disclosures are marked as sandbox records. A steward command wipes all sandbox records (with a confirmation and a log entry). Pages show a banner: "Draft site: what happens here may be deleted."
- **`keep`**: records are permanent, attributed and part of the commons.

What is kept in either mode: acquired artifacts (they are real works with real rights records), the seed questions themselves, agent specifications and instructions, requirements and decisions, the call log and costs, and the monitor's history.

Switching from `sandbox` to `keep` is a steward action, recorded in `CHANGELOG.md` as a Governance entry. The consent terms shown at joining (section 10) say which mode is on.

## 6. The question record

Implement the structures in the agent definitions (section 2):

- **Question**: text, origin (Karl, participant, Holon gap shared by the asker, mined from an artifact, raised in a dialog, challenge), domains, status (open, paused), followers, sandbox flag.
- **Reading**: a list of **points**, each with claim, agreement status (settled, leaning, contested, unknown, not studied), rationale, sources (artifact and location, with independence notes), strongest objection, and **reading level** (agent's reading, audited, endorsed); plus what we don't know and a summary across points. Every revision is kept, with what changed and why, the trigger, and the agent, model and instruction version that wrote it.
- **Working draft**: a reading revision marked "working draft, not yet audited".
- **Contribution**: a post or a transcript segment (speaker, start and end, text). Only posts are built now; the transcript type exists in the model so audio and video can come later.
- **Extraction**: per contribution, its claims, sources cited and what it responds to; correctable by its author, with the correction kept.
- **Endorsement**: participant, point, reading revision, response (endorse, accept with reservations with the reservation, dispute with the reason), time.
- **Disclosure**: participant, interests, affiliations, funding and employment relevant to the commons' subjects; each field optional and shown as "not disclosed" when empty.
- **Event**: type, subject, time, what it triggered (app design section 3).

**Where it lives** (decision 0007): propose in your report. Default: question-loop data in Postgres with full revision history and a complete export to plain files on demand and nightly, because a commit per post will not scale; artifacts, entries, the map and agent files stay in the repository as now.

## 7. Artifacts in R2

- Artifact files (full texts, PDFs, transcripts; later recordings) move to Cloudflare R2 through its S3-compatible interface, so the store stays portable. Artifact metadata stays in the repository and points to its file.
- **Access follows rights status**: own work, open licence and public domain are publicly readable; permission granted follows the recorded terms (default: readable by Holon and the agents, not downloadable); everything else has no file.
- The complete export includes every file the rights allow.

## 8. Agents for this slice

Write each agent's `instructions.md` from its specification, in the common prompt structure (agent definitions section 8), with structured JSON output validated by code before anything is stored. Every call records provider, model and instruction version.

| Agent | In this slice | Default model |
|---|---|---|
| **Curator** | Drafts readings point by point; extracts posts; writes working drafts and recorded revisions with reasons; writes change notices; records what is missing; extracts new questions from dialogs | `claude-sonnet-5-5` |
| **Challenger** | Strongest case against each point; may propose challenge questions | A different Claude model from the curator; default `claude-opus-5-5` |
| **Auditor** | Checks readings, challenges and Holon's dialog posts against cited passages' actual text; integrity, reasoning, independence, self-reinforcement | `claude-haiku-5-5` |
| **Facilitator** | Text dialog only: catch-up summaries, naming overlap and what remains, inviting endorsements, asking the curator for a working draft on convergence, parking tangents, conversing when only one person is present, the first three moderation rungs | `claude-sonnet-5-5` |
| **Holon** | Ask mode answering from readings with their levels; discuss mode when invited into a dialog | `claude-sonnet-5-5` (as built) |
| **Scout** | Acquisition only (section 9) | Low-cost model for summaries; the rest is code |

The transparency pages state that the challenger and auditor run on different Claude models from the curator, not on a different provider yet.

## 9. The scout

- **Seed acquisition first**: for each seed question, acquire the works it draws on (seed questions document) from the seed list, through open metadata services (OpenAlex, Crossref, Unpaywall, arXiv, PubMed Central, DOAJ and similar). Record what each service reported; set rights status from licence metadata; store full text in R2 only where rights allow; otherwise citation, metadata, abstract where its licence allows, link, reason, and a permission-log entry.
- **From dialogs**: when the curator extracts a cited source (DOI, link or reference) from a post, the scout looks it up and acquires it the same way. The post shows a source card: "Full text held" or "Citation only: not openly available".
- **From "missing" notes**: when the curator records that the commons holds too little on a point, the scout searches open services and acquires up to a set number of the most relevant open works (default 3), recording why each was chosen.
- Never a paid or logged-in source; respect each site's robots rules and terms; a daily cap (default 25 works) and its budget share.

## 10. Joining, by invitation only

- The draft site stays invite-only. The existing signed reviewer links become **invitations**: one unique link per person.
- First use of a link is joining: the person gives the name to show, reads and accepts the consent terms (which state the record mode), and fills in the disclosure form (optional fields). They are then a participant.
- Karl is a steward; other invitees are participants.
- A feedback link on every page sends comments on the site itself to a feedback log on the Operations page.

## 11. The question loop

Implement agent definitions section 3, including:

- **On creation** (seed or new): the curator drafts a reading → the challenger → the auditor → the reading is "audited" or shows its failed checks.
- **Update triggers**, as in the agent definitions' trigger table: a post with a new source or argument; endorsements shifting on a point; the facilitator noticing convergence; a participant asking for an update; a new artifact bearing on the question; a new objection or failed check. In a dialog, the curator writes a **working draft**, and a **recorded revision** (through challenger and auditor) at the next natural pause (default: one hour without new posts) or on request. Updates within a window are combined (default one hour).
- **Levels**: revised points drop to "agent's reading" until audited; endorsements of earlier versions are shown as such. "Endorsed" requires at least two participants whose disclosed positions on the question differ; with one participant nothing reaches it, and the page says why.
- **Notices**: in-app only for now. A participant who follows a question sees, per changed point, what changed, why and the new level.
- **New questions** from the curator's extraction or the challenger enter as questions with their origin, at "agent's reading".

## 12. The pages for this slice

Phone first. A first-pass design system (decision 0005): one set of type, colour, spacing and components for every surface, and not AA's look.

**Public (any invitee):** what the commons is (definition, principles, agents and their instructions); question list and question pages; artifact pages; Ask Holon; transparency pages as built (costs, changes, gap log), plus the moderation log and the Operations page.

**A question page:**

- The **reading** at the top (collapsible on a phone, beside the thread on a wide screen): summary; each point with its status, level, rationale, sources, strongest objection, and endorsement buttons; what we don't know; revision history; a banner when a working draft changes something.
- The **dialog** below: posts in order with the poster's name (linking to their disclosure) and time; replies to a specific post; the facilitator's posts labelled "Facilitator (AI)"; Holon's labelled "Holon (the commons' agent)"; challenges posted by the facilitator or Holon labelled as the challenger's; source cards on posts; under each post, collapsed, "what the curator took from this", correctable by its author.
- **Ask Holon** on the thread and on each post.
- **Follow** the question.

**Ask Holon page:** plain question and answer in a private session, answering from readings, stating each reading's level, citing sources, labelling anything not from the commons. No uploads or file outputs in this slice.

**Steward view (Karl):** invitations; the moderation hold queue; the record-mode setting and the sandbox wipe; the budget and its shares; the feedback log.

## 13. Costs and limits

Log every call as now. Add budget shares for curation, challenge, audit, facilitation, scouting and Holon (draft split: Holon 30%, curation 25%, audit 15%, challenge 10%, facilitation 10%, scouting 10%), with the existing priority rule: nothing counts without its audit, so proposals wait if the audit share is spent. Keep the fair-use limits as built.

## 14. Tests

In `tests/` and each agent's folder, ship a few clearly marked examples per agent and a harness that reports results and cost:

- **Curator:** a question that must be split into several points; a revision that must follow a new source and must not follow mere repetition; an extraction that must not put words in a poster's mouth.
- **Challenger:** a reading with a known strong objection it must find.
- **Auditor:** a misquoted source, a dropped position, a double-counted study; a clean reading that must pass.
- **Facilitator:** sharp but legitimate dissent it must never hold; a thread where it must not claim agreement that isn't there.
- **Holon:** answers that must state reading levels correctly.

## 15. Not in this slice

Live text; audio and video; discovery from the watchlist; make mode and document uploads or file outputs (Ask Holon will later take uploads and produce presentations, PDFs, Word files and images; keep the provider and output design open for it); a second AI provider (keep the provider interface ready); the app team beyond the monitor; email notifications; public access.

## 16. Order of work and definition of done

1. Stage 0 report; Karl's go-ahead; `STATE.md` and `CHANGELOG.md`.
2. Foundations: requirements, decision drafts, agent specifications, the monitor.
3. Record mode; the question record and its storage; R2 for artifacts.
4. Invitations, joining, consent, disclosure.
5. Agents' instructions and harnesses: curator, challenger, auditor.
6. The scout, and seed acquisition for the seed questions.
7. Seed questions with their first readings, challenged and audited.
8. The question page and dialog, with the facilitator, Holon in discuss mode, extraction and source cards.
9. Endorsement, update triggers, working drafts, recorded revisions, notices.
10. Ask Holon from readings; the steward view; costs and shares.
11. Tests run; results committed; `STATE.md`, `CHANGELOG.md` and `STATUS.md` updated.

**Done means:**

- Karl, joining through his invitation, can open a seed question, read its reading with points, statuses, levels, sources and strongest objections, and see that it was challenged and audited.
- He can post in its dialog, citing a source; the scout acquires or records the source; the post shows its source card; the curator's extraction appears and he can correct it.
- With only Karl present, the facilitator converses, keeps the thread on the question and invites endorsement; Holon answers when invited, labelled.
- Karl's endorsement or dispute is recorded; a working draft appears during the dialog; a recorded revision follows at the pause, goes through challenger and auditor, and Karl sees a notice of what changed and why.
- A new question raised in the dialog appears with its origin.
- Ask Holon answers from readings and states their levels.
- The sandbox wipe removes sandbox records and keeps artifacts.
- The monitor alerts on a stopped agent or a key within 14 days of expiry.
- Every AI-made item is labelled; every call records its model and instruction version; no copyrighted full text is stored without recorded permission.
- Traceability check passes for this slice's requirements.
