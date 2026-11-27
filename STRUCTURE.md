# How this repository is laid out

Every file is plain text: Markdown with a YAML header for prose (artifacts, entries, questions, agent
instructions), and YAML for lists and settings. Plain files are the canonical record of the commons' knowledge;
the web app's database holds operational and dialog data (private Holon sessions, the usage log, gap notes,
scheduled jobs, the monitor's history; later dialog posts and reading revisions), with full exports (decision 0007,
interim).

| Path | Contents |
|---|---|
| `README.md` | The definition of the commons (draft 0.2, not adopted) |
| `CHARTER.md` | Governance: placeholder, then the interim governance from the definition |
| `LICENCE` | Placeholder: no licence chosen yet |
| `FUNDING.md` | Funding statement (placeholder) |
| `STATE.md` | A short, current picture of the commons for anyone outside it; served at `/state` |
| `CHANGELOG.md` | Dated, tagged entries: decisions, releases, content, incidents, governance; served at `/changelog` |
| `contributors.yaml` | Every contributor referred to by other files, with model and instruction version for agents |
| `map/` | Layer 1: purpose, domains, glossary, evidence levels and kinds, agreement statuses, rights statuses |
| `artifacts/` | One file per work: citation, kind, rights status and why, how it entered, summary, short quotations |
| `entries/` | One file per claim entry: evidence level, agreement status and why, strongest objection, unknowns, sources |
| `questions/` | Open questions the commons is holding, with positions and cruxes |
| `agents/` | One folder per agent (development standard, section 5): `spec.md` (what it does and never does), `config.yaml` (provider, model, limits), `CHANGELOG.md`, and once it runs `instructions.md`, `tests/` (its test set) and `tested-on.yaml` |
| `requirements/` | How the app is specified: the development standard, principles (L1), system standards (L2, stubs), surface and capability requirements (L3), and the generated `traceability.md` |
| `decisions/` | Decision records: one per significant technical choice, with options and a recommendation; Karl decides |
| `tests/` | `acceptance.yaml`: the acceptance tests (L4) each requirement names. Agents' own test sets are in `agents/<name>/tests/` |
| `ledger/` | Monthly cost summaries (not yet produced) |
| `growth/` | Seed list, watchlist, the budget and its shares |
| `permissions/` | The public permission log |
| `demo/` | Sample data for parts that are not built yet. Clearly labelled; not real activity |
| `app/` | The web app that indexes this repository and serves Holon and the pages |
| `config/` | Model prices used to compute the cost of every call |
| `docs/` | The working log, roadmap and open questions for the people building the commons (`docs/STATUS.md`), reports, and incoming briefs (`docs/incoming/`) |
| `CLAUDE.md` | Orientation for AI coding sessions working on this repository |
| `prisma/` | The web app's database schema and migrations |

**Labels used on content.** `basis: checked-against-text` means the item was checked against the work's actual
text. `basis: model-knowledge` means it was drafted from an AI model's knowledge of the work and has not been
checked against the text. `review: unreviewed` means no person has reviewed it yet.
