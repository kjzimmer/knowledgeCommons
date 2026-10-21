# CLAUDE.md: the knowledge commons

*Read this file at the start of every session, then `docs/STATUS.md` ("Resume here" first).*

## What this is

A **concept demo** of an independent knowledge commons on living, complex adaptive systems (including human
societies) and what helps them flourish. Its purpose right now is to show the idea to potential collaborators and
test for buy-in, so build lean and label everything that isn't real. The commons' name is undecided: keep the
`[COMMONS NAME]` placeholder everywhere.

- **The definition** (what the commons is, its rules): `README.md` (draft 0.2, not adopted). It is the source of
  truth for the commons' principles.
- **Holon** is the commons' AI agent. It answers under the *state-of-knowledge standard*: sources, where they
  agree or conflict, agreement status with its reason, strongest objection, what we don't know.
- **Abundance Architecture (AA)** started and funds the commons but has **no privileged access**: it uses only the
  public interface (`/api/v1`), identified by its site key, like any other site.
- The commons is meant to become its own entity. This repo is **public**: never commit secrets or private material.

Owner: Karl Zimmer. The briefs this was built from live in the AA repo:
`abundanceArchitecture/docs/wip/knowledge-commons/` (build brief v0.2, definition v0.2, seed list, open questions)
with AA's side of the status in `abundanceArchitecture/docs/wip/knowledge-commons.md`.

## Layout

See `STRUCTURE.md`. In short: content as plain files (`map/`, `artifacts/`, `entries/`, `questions/`,
`agents/`, `tests/`, `growth/`, `permissions/`, `demo/` for labelled sample data), the web app in `app/`
(Express 5 + TypeScript, server-rendered pages), and `prisma/` for operational data only (Holon sessions, the
model-call log, gap notes). **Knowledge lives in files; the database never holds knowledge.**

| Code | What it does |
|---|---|
| `app/src/content/load.ts` | Reads and validates every content file; `npm run content:check` runs it |
| `app/src/content/search.ts` | BM25 full-text search (no vector store, by design) |
| `app/src/holon/provider.ts` | Provider interface: agent code never names a provider |
| `app/src/holon/anthropic.ts` | Anthropic provider (prompt caching, `fallbacks: "default"` refusal fallback) |
| `app/src/holon/holon.ts` | Holon ask mode: system prompt (instructions + layer-1 map + entry index), tools, loop, sessions |
| `app/src/holon/usage.ts` | Cost per call from `config/prices.yaml`, call log, fair-use limits |
| `app/src/routes/pages.ts` | Reviewer pages and `POST /ask` |
| `app/src/routes/api.ts` | Public interface `/api/v1` (site keys) |
| `app/src/site/pages/*.ts` | One file per group of pages |
| `app/public/` | `style.css`, `ask.js` |

## Commands

```
npm run content:check                     # validate all content files (run before committing content)
npm run typecheck
npm run dev                               # needs .env (see .env.example); port 3100
npm run review:link -- --name "X" --email x@y.z [--steward]
npm run ask -- "question"                 # ask Holon from the command line
```
With production variables (from this folder; the Railway CLI is linked to project `knowledgeCommons`):
`railway run --service livingSystems npm run review:link -- …` and, for a CLI Holon test without the
internal-only database: `railway run --service livingSystems -- bash -c 'DATABASE_URL= npm run ask -- "…"'`.

## Deploy

- Railway project **knowledgeCommons**: service **`livingSystems`** (production environment) deploys branch
  **`feat/concept-demo`**, plus a Postgres service. Address: https://livingsystems-production.up.railway.app
  (invite-only, noindex).
- `railway.toml`: nixpacks, `npm run build` (prisma generate + tsc), start runs `prisma migrate deploy` first.
- Variables: `ANTHROPIC_API_KEY`, `DATABASE_URL`, `REVIEW_LINK_SECRET`, `PUBLIC_BASE_URL`, `SITE_KEYS`
  (`Abundance Architecture=<key>`), `NODE_ENV=production`. Optional: `ANTHROPIC_WORKSPACE_ID`, `HOLON_MODEL`,
  `DAILY_SPEND_CEILING_USD`, `COMMONS_REPO`, `COMMONS_BRANCH`.
- Never print secrets. To copy a value between services, read it into a shell variable and pass it on.
- AA staging (`draft.abundancearchitecture.world`) holds `COMMONS_URL` and `COMMONS_SITE_KEY` (the same key as in
  `SITE_KEYS`).

## Rules for content

- Every AI-drafted item records its contributor (see `contributors.yaml`) and its **basis**:
  `checked-against-text` or `model-knowledge` (not checked). `review: unreviewed` until a person reviews it.
- **Never store a copyrighted work's full text without recorded permission.** Full text only for own work, open
  licence, public domain, or permission granted. When unsure, rights status `not-held`.
- **Never invent quotations.** Quote only text actually read; otherwise paraphrase and say so.
- Abundance Architecture's thesis is content (with objections and status), never the commons' conclusion.
- Sample data lives in `demo/` and every page that uses it says so.
- YAML gotcha: quote values that contain `: ` or ` #`. Run `npm run content:check` after editing content.

## Working conventions (carried over from the AA project)

- Feature branches; never push to `main` directly. Commit messages end with the Co-Authored-By line.
- Prisma: `provider = "prisma-client-js"`; never `db push`. Generate migration SQL with
  `prisma migrate diff --from-empty|--from-migrations … --script` + `migrate deploy` (migrate dev is not
  interactive here). Local Node is 20.12 (Railway runs newer): keep dependencies Node-20 compatible.
- Railway skips devDependencies with `NODE_ENV=production`, so build tools are in `dependencies`.
- Karl decides quickly when given a clear recommendation with trade-offs; he adds documentation incrementally.
  He wants changes staged before production (see the open question on access in `docs/STATUS.md`).
- Keep `docs/STATUS.md` current at the end of each working session.
