# Status, decisions and roadmap

## Resume here

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
2. **Domain.** Karl would like a `.commons` domain; no such top-level domain is known to exist. Undecided.
3. Everything listed in the definition's open questions (`questions/` in this repo): name, licence, charter,
   funding of the AI budget, agreement statuses, experiential knowledge, copyright, legal entity.
4. Brief §0 placeholders still open: stewards, funding statement, monthly budget, reviewed seed list, which AA
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
