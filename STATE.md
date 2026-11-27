# The state of [COMMONS NAME]

*27 November 2026. Updated at the end of every work session that changes something. What happened, and when:
[CHANGELOG.md](CHANGELOG.md).*

## What this is

An independent knowledge commons on living, complex adaptive systems, including human societies, and what helps
them flourish. Its rules are in the definition, [README.md](README.md) (draft 0.2, not adopted). Its name is
undecided.

Today it is a **concept demo**: a working site, reachable only by invitation, built to show the idea to potential
collaborators. Abundance Architecture started the commons and funds it, but has no privileged access: it uses the
same public interface as any other site.

## What is live and what is sample

| Live | Sample (labelled on its page) or not built |
|---|---|
| The content: 27 artifacts (works), 32 claim entries, 10 questions, the map (domains, glossary, statuses) | Curator and auditor: instructions written, not running |
| Holon, the commons' agent, in ask mode: answers with sources, agreement status and reason, strongest objection, and what we don't know | Review queue: sample proposals and auditor reports |
| Costs page with every model call and its cost; gap log; change history | Growth loops (discovery, question mining, analysis): sample status only |
| The monitor: checks every six hours, results on the Operations page (`/operations`) | |
| Requirements, decision records (all proposed) and a traceability check | |
| Public interface (`/api/v1`): read, search, ask Holon, reviewer links for host sites | Contribute forms, endorse and dispute buttons, Holon discuss mode, proposals |
| Invite-only access through signed links | Test harness, monthly ledger, permission requests (none sent yet) |

**Content honesty.** All entries are AI-drafted and unreviewed. Three artifacts were checked against their actual
text; the rest were drafted from a model's knowledge and say so. The only full text the commons holds is its own
definition.

**Holon is currently offline.** A security incident at the hosting provider in October led to every provider key
being revoked; a new key is being created.

## Agents and models

Every agent has a public specification (`agents/<name>/spec.md`, shown at `/agents`).

| Agent | Role | Model | Running |
|---|---|---|---|
| Holon | Answers questions under the state-of-knowledge standard | Claude Sonnet 5.5 | Yes (ask mode), once its key is replaced |
| Curator | Drafts and revises readings | Claude Sonnet 5.5 | Not yet |
| Challenger | Writes the strongest case against each point | Claude Opus 5.5 | Not yet |
| Auditor | Checks work against its sources | Opus for Sonnet's work, Sonnet for Opus's, Haiku for mechanical checks | Not yet |
| Facilitator | Hosts dialogs | Claude Sonnet 5.5 | Not yet |
| Scout | Acquires open works | Mostly code; Claude Haiku 5.5 to rank and summarize | Not yet |
| Monitor | Checks the app, models, key, jobs and budget; alerts the steward | Code (one-line model checks) | Yes |

The app team's other agents (requirements, coding, code review, support, improvement, administration) are
specifications only. Every model call records its provider, model and instruction version. All agents run on
Anthropic's Claude for now, and no agent's work is checked by the model that produced it; these are different
Claude models, not different providers yet. The code reaches models through one provider interface, so other
providers can be added.

## Budget and spend

- Monthly AI budget (draft): **$50**, in shares: Holon 30%, curation 25%, audit 15%, challenge 10%, facilitation
  10%, scouting 10%. Nothing counts without its audit.
- A one-time **seeding allowance of $20** for the first readings of the fifteen seed questions.
- Fair use: 30 questions a day per person, and a $2 daily ceiling.
- Measured cost of a Holon answer: $0.01 to $0.03.
- Live spend is on the Costs page (`/costs`), from the call log.

## What comes next: the question loop

A change brief (0.1, 21 Nov) is being started. It builds the commons' core cycle once, end to end, on the draft site:

> A question gets an agent's reading → a challenger writes the strongest case against it → an auditor checks it
> against the sources → the question opens for dialog → people endorse or dispute points → the reading is revised →
> participants see what changed → new questions enter.

- **Fifteen seed questions**: ten on the subject and five that challenge the living-systems view.
- **New agents**: challenger, facilitator, scout (acquires open works), monitor.
- **Reading levels**: *agent's reading*, *audited* (checked by agents on different models), *endorsed* (people
  who usually disagree; not active while there is one participant). Each point also shows how many of its sources
  were verified against full text.
- **Record mode**: the draft starts in *sandbox* mode. Dialog during the draft may be wiped; works acquired, seed
  questions and their first audited readings are kept.
- **Storage**: artifact files in Cloudflare R2, readable according to their rights; dialog data in a database with
  full history and a complete export; recorded readings as plain files in this repository.

Status of the work:

- **Stage 0 (done):** the report (`docs/reports/2026-11-23-stage0.md`) and these public files.
- **Stage 1, foundations (done, 27 Nov):** requirements (`requirements/`: 11 principles, 134 requirements for
  this slice, each with its tests, all proposed); eight decision records for Karl to decide (`decisions/`); agent
  specifications for all thirteen agents; the monitor with its Operations page; the budget shares.
- **Next:** stage 2 (record mode, the question record in the database, artifact files in R2), then one seed
  question (Q6, on polycrisis) all the way through the loop.

## Main open questions

- **How all of the commons is kept** (knowledge, files, the database, app code and configuration), so that the app
  runs efficiently, nothing is lost if the app or its host disappears, and anyone can fork the whole commons. The
  current storage plan is interim.
- The commons' name, licence, charter, legal entity, and how its AI budget is funded (`questions/`).
- Public access and a domain. The site stays invite-only for now.
- How "people who usually disagree" is measured for the endorsed level.
- When a second AI provider is added for the challenger and auditor.
- The eight technical decision records, each with a recommendation (`decisions/`).

Design documents for the next stage (drafts, not adopted) are in `docs/incoming/changeBrief_v0_1/`.
