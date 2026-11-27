# 0005: UX framework and design system

- **Status:** proposed
- **Date:** 2026-11-27
- **Drafted by:** Claude Code (claude-opus-5-5), change brief 0.1, stage 1
- **Decision:** not yet made (Karl decides)

## Question

How are the commons' pages built and styled, so every surface shares one look and works first on a phone?

## Context

Change brief 0.1 (section 12) asks for a first-pass design system: one set of type, colour, spacing and components
for every surface, phone first, and **not Abundance Architecture's look**. The demo already has one stylesheet
(`app/public/style.css`) with colour tokens as CSS custom properties for light and dark schemes, a serif and sans
pairing, and components such as cards, badges, tables and notices. The question page in this slice needs: a reading
that collapses on a phone and sits beside the thread on a wide screen; points with status, level and provenance
badges; endorsement buttons; posts with replies; collapsed extractions; source cards.

## Options

| Option | For | Against |
|---|---|---|
| **A. Server-rendered HTML, one hand-written design system in CSS** (tokens, components), with small progressive JavaScript for interaction | Matches the stack (0002); fast and light on phones; works without JavaScript for reading; no dependency; tokens make the look easy to change in one place | Components are written by hand; consistency depends on discipline (the L2 design-system file and a review check help) |
| B. A utility CSS framework (e.g. Tailwind) | Fast to build with; consistent spacing | A build step; class-heavy markup; the look tends toward the framework's defaults |
| C. A component framework (React plus a component library) | Rich components ready-made | Decision 0002 recommends against a front-end framework; heavier pages |

## Recommendation

**A.** In stage 3, before the question page is built:

1. Move the tokens into their own file (`app/public/tokens.css`): type scale, colour (light and dark), spacing,
   radius, with names by role (ink, surface, accent, warn, bad, ok, ai) rather than by colour.
2. Document each component with its states in `requirements/20-system/design-system/` (L2), starting with the
   ones the question page needs: point, level badge, provenance summary, endorsement control, post, source card,
   collapsible panel.
3. A distinct look of the commons' own: Karl to review a first pass before it spreads to every page.

## Consequences

- The question page is the first page built on the documented components; other pages move over as they change.
- SRF-PUB-008 (no sideways scrolling at 360 px) and SRF-PUB-009 (one design system) are checked by hand until
  there is a pipeline.

## Traces to

P-10, P-11.
