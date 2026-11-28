# Decision records

One file per significant technical choice (development standard, section 4): the question, context, options with
pros and cons, a recommendation, the decision and who made it, consequences, date and status. Numbered and never
renumbered; a superseded record stays, linked to its replacement.

**Every record here is proposed. Karl decides each.** Drafted by Claude Code on 2026-11-27 for change brief 0.1,
stage 1. When Karl decides one, its status becomes `accepted` (or `rejected`), the decision line names him and the
date, and `CHANGELOG.md` gets a Decision entry.

| # | Question | Recommendation | Status |
|---|---|---|---|
| [0001](0001-record-decisions.md) | How are technical decisions recorded? | Decision records (ADRs) in `decisions/` | proposed |
| [0002](0002-tech-stack.md) | Which tech stack? | Keep what is built: TypeScript, Node, Express, server-rendered pages, Postgres through Prisma, Railway | proposed |
| [0003](0003-repository-layout.md) | How is the repository laid out; one repository or two? | Keep the current layout and one repository for this slice; move content into `content/` at a quiet point after it | proposed |
| [0004](0004-requirements-structure.md) | How are requirements kept and checked? | The development standard's levels, in Markdown files with YAML blocks, tests in one YAML file, a script that checks | proposed |
| [0005](0005-design-system.md) | Which UX framework and design system? | Server-rendered HTML with one hand-written design system (tokens and components in CSS), a little progressive JavaScript | proposed |
| [0006](0006-events.md) | How do the parts talk to each other? | Events recorded in Postgres, handled by a worker under four reliability rules; a separate worker service, then a broker, as load calls for it | **accepted** (Karl, 2026-11-28, as revised) |
| [0007](0007-live-store.md) | Where does question-loop data live? | Postgres for dialog and operational data, plain files for recorded readings, a complete nightly export. Interim | **accepted** (Karl, 2026-11-28) |
| 0008 | Search: full-text now, hybrid when tests show misses | Reserved (development standard, section 4); not yet drafted | — |
| 0009 | Provider interface and model per role | Reserved; not yet drafted. As built: one provider interface, models in `agents/*/config.yaml` | — |
| [0010](0010-artifact-files.md) | Where are artifact files kept, and who may read them? | Cloudflare R2 through the S3 interface, files read through the app, which applies the rights rules | proposed |
