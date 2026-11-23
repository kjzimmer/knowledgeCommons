# The state of [COMMONS NAME]

*23 November 2026. Updated at the end of every work session that changes something. What happened, and when:
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
| Public interface (`/api/v1`): read, search, ask Holon, reviewer links for host sites | Contribute forms, endorse and dispute buttons, Holon discuss mode, proposals |
| Invite-only access through signed links | Test harness, monthly ledger, permission requests (none sent yet) |

**Content honesty.** All entries are AI-drafted and unreviewed. Three artifacts were checked against their actual
text; the rest were drafted from a model's knowledge and say so. The only full text the commons holds is its own
definition.

**Holon is currently offline.** A security incident at the hosting provider in October led to every provider key
being revoked; a new key is being created.

## Agents and models

| Agent | Role | Model | Running |
|---|---|---|---|
| Holon | Answers questions under the state-of-knowledge standard | Claude Sonnet 5.5 | Yes (ask mode), once its key is replaced |
| Curator | Drafts and revises readings | Claude Sonnet 5.5 | Not yet |
| Auditor | Checks work against sources' actual text | A different Claude model from the work it checks | Not yet |

Every model call records its provider, model and instruction version. Each agent's instructions are public at
`/agents` and in `agents/`. All agents run on Anthropic's Claude for now; the code reaches models through one
provider interface, so other providers can be added.

## Budget and spend

- Monthly AI budget (draft): **$50**. Fair use: 30 questions a day per person, and a $2 daily ceiling.
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

Status of the work: the Stage 0 report is written (`docs/reports/2026-11-23-stage0.md`). Nothing is built yet.

## Main open questions

- **How all of the commons is kept** (knowledge, files, the database, app code and configuration), so that the app
  runs efficiently, nothing is lost if the app or its host disappears, and anyone can fork the whole commons. The
  current storage plan is interim.
- The commons' name, licence, charter, legal entity, and how its AI budget is funded (`questions/`).
- Public access and a domain. The site stays invite-only for now.
- How "people who usually disagree" is measured for the endorsed level.
- When a second AI provider is added for the challenger and auditor.

Design documents for the next stage (drafts, not adopted) are in `docs/incoming/changeBrief_v0_1/`.
