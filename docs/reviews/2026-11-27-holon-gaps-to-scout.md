# For review: questions the commons cannot answer yet

27 Nov 2026. Claude Code, for Karl Zimmer and a second review with Claude in the commons project. A proposal, not
built. Requirements: CAP-ASK-007 to CAP-ASK-009 (`requirements/30-capabilities/ask.md`) and CAP-GRW-015 to
CAP-GRW-017 (`requirements/30-capabilities/growth.md`), all marked "pending second review".

## What happened

Testing the live draft site after stage 1 of change brief 0.1, Karl asked Holon "Who is Elinor Ostrom?". Holon
said the biography was missing from the commons.

Why: the commons holds works (artifacts) and claims (entries), not facts about people. It has *Governing the
Commons* (1990) and entries built on Ostrom's work, but nothing about her. Holon's instructions
(`agents/holon/instructions.md`, version 0.1.0) tell it to search the commons first, *allow* (not require) it to
add its own knowledge under "Not from the commons", and log a gap for anything missing. They also push every answer
into the full state-of-knowledge shape.

## Karl's direction

The model should use its own training on any question it is asked. If it can answer with facts and the commons is
missing the sources it relies on, that is a real gap: it becomes a task for the scout to acquire those sources. The
question is still answered.

## The proposal

1. **Holon always answers** (CAP-ASK-007). What does not come from the commons is labelled "Not from the commons";
   what the commons holds on the topic is cited as now.
2. **Short answers to simple questions** (CAP-ASK-009). "Who is X" gets a few sentences, not the sections on
   evidence, objection and unknowns, which stay for claims and open questions.
3. **The gap note names candidate works** (CAP-ASK-008): what the commons is missing and the works that would fill
   it, e.g. for Ostrom her 2009 Nobel lecture and a published biography or obituary. They are named from the
   model's memory, so they are marked unchecked.
4. **Gaps within scope become scout tasks** (CAP-GRW-015). The scout verifies each candidate through open
   metadata services and acquires it, or records "citation only" with the reason, under its existing rules (open
   sources only, rights from licence metadata, 25 works a day, its 10% budget share). Next time, the answer can
   cite the commons.
5. **Suggestions are never sources** (CAP-GRW-016). A candidate work does not appear as a source until the scout
   has verified it.
6. **Out of scope** (CAP-GRW-017). A gap outside the commons' subject areas (`map/domains.yaml`) is still
   answered and logged, but marked out of scope and not given to the scout.
7. Unchanged: gap notes never hold the asker's words.

Implementation, once agreed: Holon's instructions 0.1.1; an optional list of candidate works on the `log_gap` tool
and a column for it on gap notes (one migration); the scout reads in-scope gap notes when it is built (change brief
0.1, stage 3). Test: the Ostrom question plus Holon's three test questions, about $0.10.

## Questions for the review

1. **Is "always answer" sound under the state-of-knowledge standard?** The label separates the commons from the
   model's training; is a label enough, or should answers from training carry more (for example "not checked
   against any source")?
2. **Should background facts (people, dates, terms) be in the commons at all?** The proposal acquires sources
   about them, which grows the commons toward a reference work. Alternatives: acquire only works that bear on the
   commons' questions; or keep biographical gaps out of the scout's tasks.
3. **The scope rule.** Is "within the subject areas in `map/domains.yaml`" the right test, and who decides
   borderline cases (Holon when it writes the note, or the scout, or a person)?
4. **Model-named candidate works.** The scout verifies them, but a model's suggestions carry its biases toward
   well-known, English-language, often Western sources. Should the scout also search openly for the gap, not only
   for the named works?
5. **Volume and cost.** If most questions produce gaps early on, the scout's cap and share will be used up by
   gaps. Should gap tasks have their own cap, or a priority below seed acquisition and the curator's "missing"
   notes?
6. **Relation to readings.** Once readings exist, should a gap on the commons' subject also become a question for
   the question loop, rather than only a source to acquire?
7. **Self-reinforcement.** An answer from training, followed by acquisition of the sources that answer relied on,
   could make the commons echo the model. Does the auditor's self-reinforcement check need to cover this path?
