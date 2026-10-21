# How this repository is laid out

Every file is plain text: Markdown with a YAML header for prose (artifacts, entries, questions, agent
instructions), and YAML for lists and settings. A clone of this repository is enough to understand and rebuild
the commons; the web app's database holds only operational data (private Holon sessions, the usage log, gap notes).

| Path | Contents |
|---|---|
| `README.md` | The definition of the commons (draft 0.2, not adopted) |
| `CHARTER.md` | Governance: placeholder, then the interim governance from the definition |
| `LICENCE` | Placeholder: no licence chosen yet |
| `FUNDING.md` | Funding statement (placeholder) |
| `contributors.yaml` | Every contributor referred to by other files, with model and instruction version for agents |
| `map/` | Layer 1: purpose, domains, glossary, evidence levels and kinds, agreement statuses, rights statuses |
| `artifacts/` | One file per work: citation, kind, rights status and why, how it entered, summary, short quotations |
| `entries/` | One file per claim entry: evidence level, agreement status and why, strongest objection, unknowns, sources |
| `questions/` | Open questions the commons is holding, with positions and cruxes |
| `agents/` | One folder per agent: instructions, model settings, models tested on, change history |
| `tests/` | Test sets for Holon and the auditor (example rows only so far) |
| `ledger/` | Monthly cost summaries (not yet produced) |
| `growth/` | Seed list, watchlist, budget and allocations |
| `permissions/` | The public permission log |
| `demo/` | Sample data for parts that are not built yet. Clearly labelled; not real activity |
| `app/` | The web app that indexes this repository and serves Holon and the pages |
| `config/` | Model prices used to compute the cost of every call |
| `docs/` | Status, decisions and roadmap for the people building the commons (`docs/STATUS.md`) |
| `CLAUDE.md` | Orientation for AI coding sessions working on this repository |
| `prisma/` | The web app's database schema (operational data only) |

**Labels used on content.** `basis: checked-against-text` means the item was checked against the work's actual
text. `basis: model-knowledge` means it was drafted from an AI model's knowledge of the work and has not been
checked against the text. `review: unreviewed` means no person has reviewed it yet.
