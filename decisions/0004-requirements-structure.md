# 0004: Requirements structure

- **Status:** proposed
- **Date:** 2026-11-27
- **Drafted by:** Claude Code (claude-opus-5-5), change brief 0.1, stage 1
- **Decision:** not yet made (Karl decides)

## Question

How are the app's requirements kept, linked to the principles, and checked?

## Context

The development standard (draft 0.1, now `requirements/00-standard.md`) sets the levels (L0 definition, L1
principles, L2 system standards, L3 surface and capability requirements, L4 verification), the record fields, EARS
sentence patterns and a check script. It leaves open the file format.

## Options

For the file format:

| Option | For | Against |
|---|---|---|
| **A. Markdown files per area, each requirement a heading plus a YAML block** | Readable on the repository host and on the site; prose and context between requirements; machine-checkable | A custom format (documented in `00-standard.md`, section 9) |
| B. YAML files only | Simplest to parse | Poor to read; no room for explanation |
| C. One Markdown file per requirement | Clean diffs per requirement | Hundreds of tiny files; hard to read an area as a whole |
| D. A requirements tool (e.g. Doorstop, Sphinx-needs) | Mature features | A dependency and tool to learn; the standard tailors tools out (section 8) |

For tests: **one YAML file** (`tests/acceptance.yaml`) listing each L4 test (id, title, kind, how, status, file),
with automated tests in code beside what they test. Requirements name their tests; the check joins the two.

## Recommendation

**A**, with tests in `tests/acceptance.yaml`, and the check as built: `npm run trace:check` fails on duplicated or
malformed ids, missing parents or tests, links to retired items, L3 requirements without a parent or a test,
"should" in a statement, a "verified" requirement whose tests are not all passing, unknown decisions, and agent
specifications tracing to unknown principles. It writes `requirements/traceability.md`.

## Consequences

- Stage 1 wrote L3 requirements only for change brief 0.1 (134), all `proposed` except what is already built; L2
  files are stubs, and L3 requirements trace to L1 principles until L2 standards exist.
- The check runs before every commit that touches `requirements/`, `tests/acceptance.yaml` or `agents/*/spec.md`
  (and, once there is a pipeline, on every change).
- Statuses move with the work: proposed → accepted (Karl) → built → verified (all tests passing).

## Traces to

P-02, P-11.
