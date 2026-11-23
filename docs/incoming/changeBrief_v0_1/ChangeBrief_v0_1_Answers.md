# Answers to the Stage 0 questions on change brief 0.1

From Karl (steward), 23 Nov 2026. Drafted with Claude in the commons project. Items marked **[Karl]** are Karl's to fill in or confirm before you finish Stage 0.

## Files

- Paths: the brief's `claude/...` paths mean `docs/incoming/changeBrief_v0_1/` (and `supportingDocs/`). No change needed.
- `Commons_WhatThisCommonsIs_v0_2.md` is the definition in `README.md`. Confirmed.
- `Commons_SeedList_v0_1.md` is what `growth/seed-list.yaml` already holds. Confirmed.

## A. Blockers

1. **Section 0 values. [Karl]**
   - R2 bucket and credentials: `[R2 BUCKET]`; credentials set by Karl as Railway variables on `livingSystems`.
   - Invitees: Karl only for now. Others (possibly the Audacity Lab) later, by invitation.
   - Monthly budget: $50, with the shares in brief section 13.
   - Seed questions: use `Commons_SeedQuestions_v0_1.md` as written unless Karl sends an edit.
2. **The draft site.** Agreed: treat `livingSystems` (production, already invite-only) as the draft site for this slice. The separate staging environment stays for later.
3. **The Anthropic key. [Karl]** Karl creates the new key and sets `ANTHROPIC_API_KEY`. Agreed: store its expiry as `ANTHROPIC_KEY_EXPIRES`; no Admin API key.
4. **Monitor email. [Karl]** Agreed: a transactional email service. Default Resend; Karl creates the account and sets the key.

## B. Conflicts and open points

1. **Readings and the database.** Accept your proposal, with one change. Dialog posts, extractions, endorsements, disclosures and working drafts go in Postgres; recorded revisions of readings are exported to `questions/<id>/reading.md`; a nightly full export covers the rest. **Change:** while `RECORD_MODE=sandbox`, commit only the first audited seed readings to the repository; later sandbox revisions are exported but not committed, so the repository's history isn't filled with throwaway material. In `keep` mode, every recorded revision is committed. Draft this as decision 0007 and update `CLAUDE.md` to say: "Plain files are the canonical record of knowledge; operational and dialog data live in the database with full exports."
2. **Audits when the source text isn't held.** Accept your second option, made visible per source:
   - The auditor records a provenance result for **each source** a point cites: *verified against full text*, *checked against abstract or metadata only*, or *unverifiable (text not held)*.
   - A point can reach "audited" when its integrity, reasoning and independence checks pass, but its provenance summary shows on the point beside the level, for example "Audited · provenance: 1 of 3 sources verified".
   - Where provenance is unverifiable, the point's claims about what its sources say rest on the model's knowledge, and the page says so.
   - The curator prefers sources the commons holds in full text, and the scout looks for open versions (authors' preprints, open repositories) of every cited work before recording "citation only".
3. **"Endorsed" and positions.** Add an optional per-question field to endorsement: "my position on this question" (short free text). Show it with each endorsement. Do **not** compute "endorsed" automatically in this slice: with one participant it cannot be reached anyway, and the rule for "positions that differ" still needs design. Show the endorsements, their positions, and a note that the endorsed level is not yet active.
4. **Seed readings and the sandbox wipe.** Agreed: keep the first audited seed readings; wipe only revisions that came from draft dialogs.
5. **Existing content.**
   - `polycrisis-useful` and `polycentric-global`: merge into Q6 and Q5. Their material becomes input to the curator's first readings; the sample questions are retired with a pointer to the seed question.
   - The 32 entries: material the curator may draw on, but **not evidence**. They are AI-drafted and unreviewed. Readings cite artifacts and passages as sources; an entry can be cited only as "earlier AI-drafted entry", and the auditor's self-reinforcement check flags any point resting on entries alone.
   - The 8 governance questions: agreed, keep them as their own kind, outside the knowledge loop.
6. **AA and invitations.** Don't change the AA-facing API in this slice. AA reviewers keep read-only reviewer access through `POST /api/v1/reviewer-links` as today. Joining (consent, disclosure, a stored participant record) applies only to people invited to take part in dialogs. Write the requirement so a reviewer can later be upgraded to a participant.
7. **Agent folder names.** Rename to the standard now, while it is cheap: `config.yaml` (holds model and limits), `CHANGELOG.md`, `tests/`, and keep `tested-on.yaml`. Record the rename in the agents' changelogs.
8. **Moving content into `content/`.** Agreed: draft decision 0003 only; leave the files where they are.
9. **Decisions 0005 and 0006.** Yes, draft both.
10. **Budget shares.** Agreed: replace the old shares in `growth/budget.yaml` with section 13's, keep the priority rule (nothing counts without its audit), and keep the "what more funding buys" display.

## C. Smaller points

- **Auditor model.** Agreed that the weakest model on the most important check is a concern. Make the auditor's model a setting per kind of work it checks, with the rule that it never matches the model whose work it checks. Starting defaults: Opus audits Sonnet-made work (curator readings, Holon posts); Sonnet audits Opus-made work (challenges). Keep Haiku available for mechanical checks. Let the test results decide, and show the choices on the Agents page.
- **Scheduler.** Agreed: a small in-process job runner first; a separate Railway worker or cron service when load calls for it.
- **Scale and order.** Agreed: deliver in stages with Karl's go-ahead at each. **One change to the order**, so something usable exists as early as possible: after Stage 0 and the foundations, take one seed question all the way through first (curator → challenger → auditor → visible on its question page), then widen to all seed questions, then build dialog, invitations and joining. Karl already has a steward link, so invitations can come after the first readings.

When these are confirmed, please write the formal Stage 0 report and create `STATE.md` and `CHANGELOG.md`.
