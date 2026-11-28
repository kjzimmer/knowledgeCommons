# Findings from change brief 0.1, for the next revision

Started 28 Nov 2026. Claude Code, for Karl Zimmer and the next revision of the design documents (with Claude in
the commons project). Karl's direction (2026-11-28): **keep track of everything, change nothing now, finish and test
this version, then forward all findings to be folded into the next major revision.** Each finding says what was
found, what is proposed, and its status. Nothing here is being built unless marked otherwise.

| # | Finding | Found | Status |
|---|---|---|---|
| F1 | Holon should always answer; gaps become scout tasks | Stage 1 testing | Proposal written; pending second review |
| F2 | Alert on errors when they happen, not only on schedule | Stage 1 testing | Proposed |
| F3 | An independent watchdog outside the commons | Stage 1 testing | Proposed, with options |
| F4 | Steward or reviewer: which link you're signed in with is easy to miss | Stage 1 testing | Proposed |
| F5 | The first scheduled monitor run was not seen on deploy day | Stage 1 testing | To investigate |
| F6 | Who holds the commons' provider accounts and keys | Setting up keys | For a decision when the commons becomes its own entity |
| F7 | Alert email runs on AA's domain and a shared Resend account | Setting up keys | Temporary, by Karl's choice |
| F8 | Short key lifetimes make the expiry warning fire often | Setting up keys | Note |
| F9 | Decision records and requirements are not shown on the site | Stage 1 review | Proposed |
| F10 | Events must not be lost when the app stops; how events scale | Review of decision 0006 | Decision 0006 revised and accepted (2026-11-28) |
| F11 | A rule for discoveries that should stop a version | Review of decision 0006 | Adopted as a working rule |

## F1 · Holon should always answer; gaps become scout tasks

Asked "Who is Elinor Ostrom?", Holon said the biography was missing instead of answering. Karl's direction:
Holon answers every question from its own training where the commons falls short (labelled), and the sources it
relied on become scout tasks. Full proposal and seven questions for a second review:
`docs/reviews/2026-11-27-holon-gaps-to-scout.md`. Proposed requirements CAP-ASK-007 to 009, CAP-GRW-015 to 017
(marked "pending second review").

## F2 · Alert on errors when they happen

**Found.** The monitor runs active checks on a schedule (every six hours): it queries the database, sends each
model a one-line request, reads the key's recorded expiry, reads our job and call tables. It reads no logs, ours or
any provider's. A failure during use (say, a revoked key on a real question) can go unnoticed for up to six hours.

**Proposed.** Catch errors where they occur and alert at once, through the same de-duplication as the monitor:

- every model call: authentication errors (401/403) alert immediately; rate limits (429) and provider errors (5xx)
  alert when repeated past a threshold;
- every scheduled job that fails;
- every recorded cost: alert when a budget share crosses 80% and 100%;
- a failed alert email cannot itself be emailed, so it is recorded on the Operations page.

Keep the scheduled checks as the safety net for what produces no error: a broken key while nobody is asking, a key
about to expire, a stopped scheduler. With error alerts in place, the schedule could drop to once a day.

**Later, optional:** a short AI summary of the error in each alert (Haiku, about $0.001 an alert). Diagnosis and
proposed fixes belong to the improvement agent (agent definitions 0.2, 6.6), which proposes and never acts.

## F3 · An independent watchdog

**Found.** Nothing inside the app can report that the app itself is down, or that its scheduler has stopped.

**Karl's proposal (2026-11-28):** a watchdog timer, a separate service the commons must reset regularly; if it
isn't reset in time, a human operations lead is notified. Keep outside services to a minimum: build it ourselves or
use a third party.

**Assessment.** A watchdog ("dead man's switch" or heartbeat) is the right pattern and enough for now, and better
than a plain uptime check, provided the heartbeat is sent by the monitor's scheduled job *after its core checks
pass*. Then a missed heartbeat means one of: the app is down, the scheduler has stopped, or a core check is failing.
An uptime check only sees whether a page answers.

What matters most is that the watchdog does **not** run where the commons runs. A watchdog on the same Railway
project fails with it (same outage, same account, same billing problem), so building it as another Railway service
would not give independence.

| Option | Independent of Railway | New outside service | Work | Notes |
|---|---|---|---|---|
| **A. A Cloudflare Worker with a cron trigger** | Yes | No: Cloudflare is coming anyway for R2 | Small: ~50 lines; stores the last heartbeat, checks it every few minutes, emails through Resend | Ours, in this repository, forkable. Recommended |
| B. Healthchecks.io (hosted) | Yes | Yes | None: create a check, the commons pings its URL | Open source, so it can be self-hosted later; free tier enough |
| C. Another hosted service (Better Stack, Cronitor, UptimeRobot heartbeat) | Yes | Yes | None | Closed source |
| D. A watchdog service on Railway | **No** | No | Small | Not independent; not recommended |

**Recommendation: A**, since it adds no new provider once R2 is on Cloudflare and keeps the watchdog's code in the
commons' own repository. B is the fallback if a zero-code option is preferred. Either way the watchdog alerts by
email; a second channel (an SMS or a second address) is worth considering, because Resend could be the thing that
failed. Who the "operations lead" is today: Karl.

Also available at no cost: Railway's own email notifications for failed deploys and crashed services (account
settings), worth turning on now since it changes nothing in the commons.

## F4 · Steward or reviewer

**Found.** "Run the checks now" did not appear on `/operations`: Karl was signed in with a reviewer link (likely
through the AA site), not his steward link. The only sign is "· Sessions" in the header.

**Proposed.** Show the role plainly in the header ("Karl Zimmer · steward"), and on steward-only controls show a
note to reviewers ("Stewards can run the checks from here"). Keep links somewhere safe: the 2026-10-23 links are in
`claudeSites/review-links-2026-10-23.txt`, outside the repository, which says to delete it once the links are sent.
Invitations and joining (stage 5) replace these links for participants.

## F5 · The first scheduled monitor run

**Found.** On deploy day (2026-11-27) Karl saw no scheduled run on `/operations`; on 2026-11-28 the page showed one
three hours earlier. The scheduler is meant to run the monitor about 30 seconds after the app starts, then every six
hours.

**To investigate** (when convenient; no change now): the Operations history (trigger "schedule") and the app's
start-up log line `[scheduler] started` for 2026-11-27. Possible causes: the page was opened before the first run
finished; or a restart, or an overlap of the old and new deployments, delayed it. If the first run is not reliable,
F2 and F3 cover the risk.

## F6 · Who holds the commons' provider accounts and keys

Today the Anthropic key is the commons' own key, linked to Karl's user, in the Default workspace of an organization
not owned by the commons. Once the app is operational: link the key to a **service account**, in a **dedicated
workspace** with its own spend limit, in an **organization the commons owns** with at least two admins. The same
question applies to Resend, Railway, Cloudflare and GitHub. A governance matter (people only: keys, money, D27);
to become a decision record when the commons becomes its own entity.

## F7 · Alert email on AA's domain

Alerts are sent through Karl's existing Resend account (shared with other projects), with a sending-only key
restricted to `abundancearchitecture.world`. Karl's choice for prototyping and demos (2026-11-27). Undo when the
commons settles: an AA subdomain or the commons' own domain, ideally in a Resend account of the commons' own; then
change `RESEND_API_KEY` and `MONITOR_ALERT_FROM` (no code change).

## F8 · Key lifetimes

The Anthropic key expires 30 days after creation, and the monitor warns from 14 days before expiry, so it starts
failing the check after about 16 days and the key needs renewing monthly. A 90-day key would cut the churn. Every
renewal: update `ANTHROPIC_API_KEY` and `ANTHROPIC_KEY_EXPIRES` together.

## F9 · Decisions and requirements on the site

**Found.** Karl looked for decisions 0006 and 0007 (2026-11-28). They exist only in the repository (`decisions/`),
as do the requirements and principles; the site shows neither. SRF-PUB-002 already asks for the principles to be
shown.

**Proposed.** Pages for the decision records (list with status and recommendation; each record rendered) and for
the requirements (principles, each area, the traceability summary), linked from the footer, so stewards can read
and decide without the repository, and so the commons' design is as transparent as its content (P-02).

## F10 · Events: nothing lost when the app stops, and scale

**Found** (Karl's review of decision 0006, 2026-11-28). Karl's reading: parts of the app communicate by events; a
recipient acts on a message, which can lead to further events; the process breaks if the app loses track of events
created but not delivered or not acted on, and there was no stated mechanism to record events, recipients and
results. His two questions: can an event still be lost if the app stops, and does this scale to many people at
once?

**Answers.**
- The draft implied but did not state the rules that prevent loss. Four are needed: the event is saved in the
  same transaction as the change; the worker claims events with a lease and retries, marking an event failed and
  alerting after repeated failures; handlers are safe to run twice; waiting is stored as data, not as timers in
  memory. Plus: events about one subject are handled in order. Remaining gaps (losing the database itself; the
  worker stopping entirely; a repeated model call after a stop; outside callers, none yet) are named, with what
  covers each.
- Scale: the queue is not the limit (Postgres handles thousands of events a second); the AI calls are. Path:
  the worker as its own service or several copies (claims with `FOR UPDATE SKIP LOCKED`), then priorities and
  concurrency limits, then archiving, then a broker only if Postgres becomes the bottleneck. Live text is a
  separate delivery path (server-sent events with `LISTEN/NOTIFY`).

**Done.** Decision 0006 revised to state all of this (still proposed; Karl decides). It changes how stage 2 builds
the event table and worker, not what this version delivers, so it did not stop the version (F11).

**For the next revision.** Fold the four rules into the app design's architecture section (app design 0.1,
section 3) and an L2 standard (`requirements/20-system/data-model.md` or a new `events.md`), so they bind every
future handler, not only this record.

## F11 · When a discovery should stop the version

**Karl's rule (2026-11-28):** if a discovery is significant enough that it no longer makes sense to continue
implementing this version, decide so, record the decision, and stop. Otherwise record the finding and continue.

**How it is applied.** Each finding gets a line in this log. A finding stops the version when continuing would
build on something now known to be wrong, so that the work would have to be redone: a principle that fails, a
data model that cannot hold what the loop needs, a decision that reverses. Then: record it here and in
`CHANGELOG.md` as a Decision, update `docs/STATUS.md`, and stop for Karl. A finding that refines or adds to the
design (most findings) is recorded and the version continues. Claude Code proposes which kind a finding is; Karl
decides.

**Assessment of F1 to F10 against this rule:** none stops the version. F10 changes how the event table and worker
are built in stage 2, and decision 0006 now says so; F1 changes Holon's behaviour, which is stage 8's work and
waits for its second review; the rest are additions or later work.
