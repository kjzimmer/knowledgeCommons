# Status, decisions and roadmap

## Resume here

### Change brief 0.1: the question loop (2026-11-23)

Karl's change brief 0.1 and its design documents are in `docs/incoming/changeBrief_v0_1/`. Karl's answers to my
first questions are in `ChangeBrief_v0_1_Answers.md` there; they override the brief where they differ (notably the
order of work: one seed question end to end right after the foundations).

- **Stage 0 is done and committed:** the report `docs/reports/2026-11-23-stage0.md`, `STATE.md` and
  `CHANGELOG.md` (served at `/state` and `/changelog`, linked in the footer). Karl agreed to all five
  recommendations in the report's section 6: exports pulled by a local script and committed by a person; a
  one-time seeding allowance (~$20) on the Costs page; **Q6 (polycrisis) goes first**; `knowledge-and-copyright`
  stays with the governance questions.
- **Karl will create the keys as work proceeds:** a new `ANTHROPIC_API_KEY` (plus `ANTHROPIC_KEY_EXPIRES`) and a
  Resend key for the monitor; also the R2 bucket and its credentials as Railway variables on `livingSystems`.
- **Stage 1 (foundations) is built, 2026-11-27.** Waiting for Karl's go-ahead for stage 2.
  - `requirements/`: the standard (`00-standard.md`, with the record format in section 9), principles P-01 to P-11,
    L2 stubs, and 134 L3 requirements for this slice in EARS form. `tests/acceptance.yaml` holds 100 L4 tests:
    9 automated ones pass (`npm test`), and 7 manual ones carried over from the demo pass. `npm run trace:check`
    passes and writes `requirements/traceability.md`.
  - `decisions/`: 0001 to 0007 and 0010, all proposed, each with a recommendation; 0008 and 0009 are reserved
    numbers, not drafted. **Karl decides each.**
  - Agents: the files are renamed (`config.yaml`, `CHANGELOG.md`, `tests/`). There is a `spec.md` for all 13
    agents. Config files exist for the challenger, facilitator, scout and monitor. The auditor's model is set per
    kind of work. The loader finds agents by folder; `/agents` shows specs.
  - The monitor (`app/src/ops/monitor.ts`, `agents/monitor/`) runs every 6 hours through the in-process scheduler
    (`app/src/ops/scheduler.ts`; tables `JobRun` and `MonitorRun`, migration `20261127000000_jobs_and_monitor`).
    Results are on `/operations`, where a steward can also run the checks now. Email goes through Resend.
  - Budget shares are in `growth/budget.yaml` and `app/src/ops/budget.ts`, shown live on `/growth`.
  - `CLAUDE.md`, `STRUCTURE.md` and `.env.example` are updated, including the new knowledge rule (decision 0007).
- **Karl to set on `livingSystems`:** `ANTHROPIC_API_KEY` + `ANTHROPIC_KEY_EXPIRES` (YYYY-MM-DD), `RESEND_API_KEY`
  + `MONITOR_ALERT_TO` + `MONITOR_ALERT_FROM` (an `@abundancearchitecture.world` address; see below). Until
  they're set, the monitor shows failures (key, model) and a warning (alerts) on `/operations`.
- **Temporary (Karl, 2026-11-27): alert email is sent through Karl's existing Resend account, with a
  sending-only key restricted to `abundancearchitecture.world`.** Good enough for prototyping and demos before
  real users; it ties the commons' operations to AA's domain and to an account shared with other projects. Undo
  when the commons settles (Karl expects to know within about a month): move to an AA subdomain or the commons'
  own domain, ideally in a Resend account of the commons' own, then change `RESEND_API_KEY` and
  `MONITOR_ALERT_FROM` (no code change). Longer term, the Anthropic key should also be linked to a service account
  in a dedicated workspace, in an organization the commons owns with at least two admins; to become a decision
  record when the commons becomes its own entity.
- **Not verified on the live site yet:** the scheduled run, the model check and the email (T-MON-001, T-MON-003,
  T-MON-007-live). Run them once the keys are in.
- **Next, stage 2:** record mode (`RECORD_MODE`, banner, wipe), the question record in Postgres (draft
  `requirements/20-system/data-model.md` first), the R2 client and access rules (needs Karl's bucket), the export.
  Before the question page (stage 3): the design-system first pass (decision 0005) for Karl to review.

### Ops update 2026-11-17

A Railway security incident (2026-10-21 to 10-23; full log in the AA repo,
`docs/wip/railway-incident-2026-10.md`) revoked every provider key in Railway. For the commons:

- **Holon is likely offline.** The Anthropic key it used (…zwAA) was deleted and, as of 2026-10-23, not replaced.
  Fix: create a new key in the Claude Console (Default scope, longer expiry) and set `ANTHROPIC_API_KEY` on
  `livingSystems`. The 2026-11-19 expiry below no longer applies.
- **Rotated and verified 2026-10-23:** `REVIEW_LINK_SECRET` (every earlier reviewer link stopped working) and AA's
  site key (commons `SITE_KEYS` = AA staging `COMMONS_SITE_KEY`). New links for Karl (steward), Hans Prahl and
  Natalie were issued; the new steward link and AA → commons link-through work.
- The commons' Postgres was already private (no public proxy).
- No commons code or content changed between 2026-10-20 and 2026-11-17.

*Updated 2026-10-20 (end of the first build session).*

The concept demo is **built, deployed and working**, including a live Holon. Karl is testing it next and will
decide on reviewer links and public access. Nothing is blocked.

- **Live:** https://livingsystems-production.up.railway.app (invite-only). Karl has a steward link; issue new ones
  with `railway run --service livingSystems npm run review:link -- --name "…" --email … [--steward]`.
- **Holon** runs on `claude-sonnet-5-5` (effort medium) with the Anthropic key "knowledge commons" (Default
  workspace scope). **The key expires 2026-11-19**: renew it and update `ANTHROPIC_API_KEY` in Railway before
  then, or Holon stops answering.
- **Test results (2026-10-20):** the three questions in `tests/holon.yaml` all met the standard: real citations,
  recorded statuses with reasons, source independence noted, strongest objection, unknowns, "unreviewed" noted.
  Cost $0.01–0.03 per answer. One was asked through AA staging, then the public interface, then Holon.
- **AA side** (in the `abundanceArchitecture` repo, branch `feat/site-draft`, on its staging environment):
  Learn opens with the commons and asks Holon through `/api/v1/holon/ask`; citation notes show commons entries
  and link through `/commons-link` (which asks this commons for a reviewer link); the question
  `global-problems-many-centers` has a sample facilitated discussion with a position map.

**Next session, start with:** Karl's feedback from testing. Likely items: lighter answer format for short
questions; then the first slice of "make" mode (below).

## What is real and what is sample

| Real | Sample (labelled on the page) or not built |
|---|---|
| Content as files: 27 artifacts, 32 entries, 10 questions, map, agent instructions | Curator and auditor (instructions written, not running) |
| Holon ask mode, tools, citations, gap notes, private sessions | Review queue: sample proposals and auditor reports in `demo/proposals.yaml` |
| Call log with costs, fair-use limits (30 questions/day/person, $2/day ceiling) | Growth loops: status, candidates, watchlist in `demo/growth.yaml`, `growth/watchlist.yaml` |
| Public interface: read, ask, share, reviewer-links | Proposals endpoint and Holon discuss mode (return 501) |
| Changes page (GitHub history), Costs page (live), gap log (live) | Contribute forms (disabled), endorse/dispute/apply buttons |
| Invite-only access with signed links | Test harness, monthly ledger commits, permission requests (none sent) |

Content honesty: 3 artifacts were checked against their actual text (Meadows 1999, Walker et al. 2004, the
Cascade polycrisis paper's web page); the rest were drafted from the model's knowledge and say so. All entries are
AI-drafted and unreviewed. Only the commons' own definition is held in full text.

## Decisions so far

- The commons is separate from AA from the start: its own repo and Railway project. AA is a consumer only.
- Holon live (ask mode only) for the demo; everything else is UX with labelled sample data.
- One repo holds both content and app for now (the brief foresees two; split later if useful).
- No database for knowledge; Postgres only for sessions, the call log and gap notes.
- Full-text search, no embeddings (brief).
- The anthropic key is scoped to the Default workspace (Karl can't create workspaces on his plan); the app's own
  Costs page tracks the commons' spend.
- AA reviewers get into commons pages through `POST /api/v1/reviewer-links` (site key required); links name the
  site that vouched for the reviewer.

## Open questions for Karl

1. **Public access.** Karl may mirror AA: a simple teaser on production and the full demo on a staging
   environment behind reviewer links. Needs a second Railway environment (or a mode switch like AA's `SITE_MODE`).
2. **How all of the commons is kept (open, to come back to later; Karl, 2026-11-23).** Everything beyond the
   artifact files in R2: knowledge, the database, app code, configuration and whatever else the app needs to run.
   The app must run efficiently, nothing may be lost if the app or its host disappears, and anyone must be able to
   fork the whole commons. Decision 0007 (database for dialog data, plain files for readings, nightly full export)
   is interim; build the export as a complete, self-describing bundle so this question stays open.
3. **Domain.** Karl would like a `.commons` domain; no such top-level domain is known to exist. Undecided.
4. Everything listed in the definition's open questions (`questions/` in this repo): name, licence, charter,
   funding of the AI budget, agreement statuses, experiential knowledge, copyright, legal entity.
5. Brief §0 placeholders still open: stewards, funding statement, monthly budget, reviewed seed list, which AA
   question gets the facilitator (Claude picked `global-problems-many-centers`), reviewer identity method.

## Roadmap

### Holon "make" mode: presentations, educational material, briefings

**Why (Karl, 2026-10-20):** Holon should help people with many purposes, e.g. building a presentation for a
political event or a board, or educational material. The definition already allows it: Holon may change the
*form* of an answer, never its *honesty*.

**Design (agreed in discussion, not built):**
- **One agent, two steps.** (1) Holon writes a state-of-knowledge brief on the topic: cheap, and where honesty is
  checked. (2) Holon in a "make" mode turns the brief into the requested format using a template. A second agent
  (the auditor) checking the product against the brief can come later.
- **Persuasion versus honesty.** People preparing for a board or political event want to make a case. Holon builds
  the case from the sources and always adds the honest layer: a "where this is contested" slide or speaker notes,
  the strongest objection with how to answer it, and what the evidence can't support. The person states their
  purpose up front (the definition's "declared purpose"), and the output says what it was made for. What they do
  with the final file is theirs to decide; Holon's draft never hides the weak points.
- **Output as structured content, rendered by this app** (recommended over having the model build files):
  Holon returns JSON (for slides: title, points, speaker notes, sources per slide). The app shows a slide view in
  the browser and offers downloads: PowerPoint via a JavaScript library such as `pptxgenjs`, plus Word or PDF.
  Works with any model provider, is cheaper, and can be checked against sources before it becomes a file.
  Alternative: the Claude API's document skills (code execution + Files API) can produce `.pptx`/`.docx`
  directly: less code, but tied to one provider, costlier and harder to check. Could be an optional extra behind
  the provider interface.
- **Templates are content.** "10-minute talk", "lesson plan", "board briefing" and so on live in the repo (e.g.
  `agents/holon/templates/`) like Holon's instructions: public, versioned, forkable, each with test examples.
- **Public interface.** A new endpoint, e.g. `POST /api/v1/holon/make` (purpose, template, topic), returning the
  structured content and download links, so AA and other sites can offer it.
- **Cost and limits.** A question costs $0.01–0.03; a full presentation is roughly 30–80k tokens, about
  $0.20–0.80 on Sonnet 5.5. Add a "making" share to `growth/budget.yaml`, a separate per-person daily limit, and
  batch mode for anything not needed instantly. Host sites could fund extra capacity for their own people (e.g. AA
  members), recorded on the Costs page as that site's usage, without compromising independence.
- **Growth.** With the author's consent, materials people make could be contributed back as artifacts.

**First slice (estimate: a day or two):** "Prepare a 10-minute talk": slide outline, speaker notes, sources, and a
slide on the strongest objection; slide view in the browser; PowerPoint download.

### Other next steps from the brief (when the demo has buy-in)

- Curator and auditor running for real; proposal queue with endorse, dispute and apply (writes commits).
- Acquisition from the seed list through open metadata services (OpenAlex, Crossref, Unpaywall…).
- Discovery, question mining, analysis and re-check loops inside the budget dial.
- Holon discuss mode, used by AA's facilitated question; AA threads, consent, extraction and consolidation.
- Test harness for Holon (and the auditor), results committed to `agents/<name>/tested-on.yaml`.
- Monthly ledger summaries committed to `ledger/`.
