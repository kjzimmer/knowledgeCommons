# [COMMONS NAME]: agent definitions

Draft 0.2, 21 Nov 2026. Claude's draft for Karl Zimmer, from the commons chat of 17 to 21 Nov. Nothing here is adopted. Replaces draft 0.1. It is the basis for each agent's instructions (its prompt), its memory design, and the next change brief. Holon's current instructions in the repository (`agents/holon/`) are the starting point for its prompt; this draft changes its role (section 5.1).

New in 0.2: reading updates driven by events, with working drafts during dialogs (section 3); the kinds of dialog (section 4); the app team, with the requirements agent brought forward (section 6); scale (section 9); decisions of this chat (section 12).

## 1. Why the roles are split

- **Separation of powers.** No agent both contributes to a question and decides what the question concluded; no agent both moderates people and contributes knowledge; no agent checks its own work. The same holds for the app: requirements, coding, review and approval are four different roles.
- **One model now, a mix later.** Every agent starts on Claude. Each role is a seam where a different model can be substituted without changing the others, because every role's inputs, outputs and memory are defined as plain files and structured data, not as anything specific to one provider.
- **Checks across models.** Once a second provider is available, these pairs run on different providers: curator and auditor; curator and challenger; coding agent and code reviewer. Until then they run on different Claude models, and the transparency pages say so.

## 2. Shared terms

| Term | Meaning |
|---|---|
| **Question** | The unit the commons organizes knowledge around. Each records its origin: who or what posed it (Karl, a participant, a gap from a Holon conversation shared by the asker, mined from an artifact, raised in a dialog, or a challenge question). |
| **Point** | One claim within the answer to a question. A question's answer usually holds several points, each with its own agreement status. |
| **Reading** | The commons' current answer to a question: its points, each with agreement status, rationale, sources and strongest objection; what we don't know; and a short summary across the points. Always written by the curator. |
| **Working draft** | A reading updated by the curator during a live session or an active dialog, visible to participants and labelled "working draft, not yet audited". It becomes a recorded revision only after the challenger and auditor have checked it. |
| **Agreement status** | What the evidence says about a point: settled, leaning, contested, unknown, not studied (definition 0.2). |
| **Reading level** | How well a reading has been tested, separate from its status. A point can be "contested" and "audited" at once. |
| **Endorsement** | A person's explicit response to a point: **endorse** (matches my view), **accept with reservations** (I can stand behind this in principle; my reservation is ___), or **dispute** (this is wrong, because ___). Always a person's own act; no agent infers it from what someone wrote. |
| **Disclosure** | A participant's stated interests and affiliations relevant to the commons' subjects. For an agent: its model, provider and published instructions. Used to weigh the independence of contributions, never to reject them. |
| **AI-made** | The label on anything an agent produced. It stays on the item permanently. |

**Reading levels**

| Level | Reached when |
|---|---|
| **Agent's reading** | The curator has drafted or revised the reading. Nothing has checked it. |
| **Audited** | The challenger has written the strongest case against each point, and the auditor (on a different model) has checked provenance against the sources' actual text, integrity, reasoning and source independence, and passed it. Agents can reach this level without people. |
| **Endorsed** | People who usually disagree with each other have endorsed or accepted the point. Only people can reach this level. How "usually disagree" is measured is open (section 11). |

A revision drops the changed points back to "agent's reading" until they are audited again; endorsements of the earlier version are shown as such.

## 3. The question loop

1. **A question enters**, with its origin recorded.
2. **The curator drafts a reading** from what the commons holds. Where the commons holds too little, the reading says so, and the curator records what is missing so the scout can look for it.
3. **The challenger** writes the strongest case against each point, and may pose challenge questions (labelled as such) that become new questions.
4. **The auditor** checks the reading and the challenge. Pass: the reading is "audited". Fail: the failure is shown on the reading and the curator revises.
5. **The question opens for dialog** in any of the forms in section 4. The facilitator hosts it; Holon contributes when invited or when it has something sourced to add; people contribute, with their disclosures attached.
6. **The curator extracts** each post's or transcript segment's claims, sources and what it responds to. The author can correct the extraction.
7. **The facilitator surfaces agreement**: names where people seem to agree and what remains, asks them to confirm, and invites endorsements.
8. **The curator updates the reading** when a trigger fires (below): as a working draft during a live session or active dialog, and as a recorded revision, through steps 3 and 4, at the end of a session or at a natural pause.
9. **Participants and followers receive the update**: what changed on each point and why, not just "updated".
10. **New questions** raised in the dialog, by the challenger or by the curator's extraction go back to step 1.
11. **Holon uses current readings**, with their levels, in every conversation, including making essays, talks and other material ("make" mode).

**Update triggers**

| Trigger | Update |
|---|---|
| A post or transcript segment brings a new source or argument on a point | Working draft during the dialog; recorded revision at the next pause |
| Endorsements shift on a point | Working draft; recorded revision at the next pause |
| The facilitator notices convergence, or a participant asks for an update | Working draft |
| A live session ends | Recorded revision |
| A new artifact bears on the question (found by the scheduled re-check) | Recorded revision |
| The challenger raises a new objection, or the auditor a failed check | Recorded revision |
| Nothing has changed for a set period | Scheduled re-check only; no revision without new material |

Updates within a short window are combined, so a busy dialog does not produce a stream of revisions.

**Distribution.** Live sessions show a banner with the working draft's changes. Followers of a question get a notice or a digest (their choice) with the changed points, the reasons and the new level. Every revision's history is public.

## 4. Kinds of dialog

| Kind | What it needs | When |
|---|---|---|
| **Text over time** | Threads, consent, extraction, facilitator, notifications | First |
| **Live text** | The same data delivered in real time; a facilitator that responds quickly; working drafts | Second |
| **Live audio and video** | Scheduling, registration, reminders; recording consent; a video service; transcripts with speakers and timestamps that become the dialog record; a facilitator working beside the call | Later on the roadmap, with the path kept open now |

**The path for audio and video.** The commons integrates an open-source video service rather than building one: a full conference system such as Jitsi or BigBlueButton, or a toolkit such as LiveKit, self-hosted or rented. The app owns everything around the call: scheduling sessions on a question, consent before recording, transcripts, extraction, and the record. To keep the path open now, the dialog record is designed from the start so that a "contribution" can be a post or a transcript segment (speaker, start and end time, text), and sessions are a record type with a schedule, participants and consent.

**The facilitator in live calls** starts beside the call, not in it: catch-up notes and named cruxes in the side chat, and a summary for after the session. Speaking in a live call is a later design and testing problem.

## 5. The knowledge agents

Each agent below lists its purpose, what it does and never does, its memory (section 7 explains the terms), who checks it, where people come in, and what its tests cover.

### 5.1 Holon: the commons' voice

- **Purpose.** Answers anyone's questions in whatever form they need, under the state-of-knowledge standard; takes part in dialogs; makes essays, talks, lesson plans and briefings from the commons.
- **Does.** Explains current readings and their levels; cites sources; adds sourced analysis to dialogs, labelled as analysis; records gaps; in make mode, states the declared purpose and always includes the honest layer.
- **Never.** Writes or revises readings (that is the curator's job; Holon's dialog contributions feed the curator like anyone's); moderates; claims to be a person or to hold beliefs; presents a reading as more tested than its level.
- **Change from the brief.** Holon's scheduled "analysis" loop becomes contributions to questions; turning contributions into readings moves to the curator.
- **Memory.** Procedural: its instructions, the answer standard, make-mode templates (always loaded). Semantic: the map (always loaded); readings, entries and passages (retrieved through tools). Episodic: the current conversation or thread only; private sessions are never published and never feed other agents.
- **Checked by.** The auditor, on its dialog contributions and make-mode products; its test set.
- **People.** Anyone can ask; askers choose whether to share an unanswered question.
- **Tests.** Questions with the sources a good answer must use; answers that must report a reading's level correctly; make-mode requests that must keep the honest layer.

### 5.2 Curator: the synthesizer

- **Purpose.** Keeps each question's reading: drafts it, extracts dialog contributions, updates it, and mines new questions.
- **Does.** Drafts readings point by point; extracts claims, sources and replies from posts and transcripts; keeps working drafts during dialogs; writes recorded revisions with reasons; writes the change notice for participants and followers; drafts entries from new artifacts; extracts open questions from artifacts and dialogs; records what is missing.
- **Never.** Argues in dialogs; sets a reading's level (the levels follow from the checks and from people); infers endorsement; drops a position without a cited reason; proposes a higher evidence level when unsure between two (it proposes the lower).
- **Memory.** Procedural: its instructions, the evidence and status definitions. Semantic: the question's record (points, sources, entries, endorsements, disclosures), loaded whole by structured lookup; related entries and passages, retrieved. Episodic: the dialog's extractions and the reading's revision history, loaded whole for the question it is working on; for a very long dialog, layered summaries, each audited.
- **Checked by.** The challenger and the auditor, on every recorded revision.
- **People.** Authors correct extractions of their own posts.
- **Tests.** Readings that must split a question into points; revisions that must follow new evidence and must not follow mere repetition; extractions that must not put words in a poster's mouth; change notices that must say what changed and why.

### 5.3 Challenger: the strongest opponent

- **Purpose.** Makes sure every reading has faced its strongest objection before anyone relies on it, and poses the questions a sharp critic of the living-systems view would ask.
- **Does.** Writes the strongest case against each point, sourced where possible and labelled "unsourced" where not; generates challenge questions, labelled by origin.
- **Never.** Changes the reading; argues in dialogs as itself (its challenges can be posted by Holon or the facilitator as the challenger's, labelled); softens a challenge because the reading is popular.
- **Memory.** Procedural: its instructions. Semantic: the reading and its sources; the commons' opposing works and recorded objections, retrieved. Episodic: none beyond the task.
- **Model.** On a different provider from the curator as soon as one is available.
- **Checked by.** The auditor (are its sources real and do they say what it claims?); its test set.
- **Tests.** Readings with a known strong objection that must be found; challenge-question sets reviewed for whether they would satisfy a real critic.

### 5.4 Auditor: the checker

- **Purpose.** Checks every contribution, from people and agents alike, before it counts.
- **Does.** Checks provenance against the sources' actual text, integrity (dropped or weakened positions, double-counted sources), method and reasoning (isolated variables, mismatched scales, single causes for emergent outcomes), source independence including disclosed interests, and self-reinforcement (reliance on earlier AI-made content). Reports beside the contribution; a failed check marks it, does not delete it.
- **Never.** Judges whether a claim is true; checks work produced by its own model; rejects an opinion because of who holds it. A disclosed or discovered conflict of interest is reported as a reason to investigate and verify, and it can lower how independent a source counts as; it is never a reason to reject.
- **Memory.** Procedural: its checklists. Semantic: the contribution, its cited passages (fetched), the contributor's disclosure. Episodic: none beyond the task.
- **Model.** On a different provider from whatever it checks, as soon as one is available.
- **Checked by.** Its test set of contributions with planted problems; spot checks by people once there are reviewers.
- **Tests.** Misquoted sources, dropped positions, double-counted studies, single-cause explanations, undisclosed shared funding; clean contributions that must pass.

### 5.5 Facilitator: the host of dialogs

Moved into the commons by D25. It belongs to the commons' discussion space, and other sites can run it from its published definition.

- **Purpose.** Keeps dialogs on a question productive and fair, and helps people see and record where they agree, without trying to convince anyone.
- **Does.** Welcomes newcomers with the question's current reading; offers catch-up summaries; names cruxes; when people agree but keep arguing, names the overlap and what remains, asks each to confirm, and labels what remains as a disagreement about facts, values or framing; invites endorsements; asks the curator for a working draft when it notices convergence; parks tangents; logs unanswered questions; converses when only one person is present; handles the first three moderation rungs (private note, public redirect, hold for human review). In live calls, works in the side chat and prepares the session summary.
- **Never.** Has a view on the subject; contributes knowledge; writes the reading; endorses or claims agreement on anyone's behalf; categorizes anyone's personality, even privately (it responds to what people do in the thread, not to a judgment of who they are); pushes toward closure ("unresolved" is legitimate); deletes, edits or bans; acts when unsure.
- **Memory.** Procedural: its instructions and the behaviour norms. Semantic: the question's current reading (summary level). Episodic: the thread or session and its own past interventions.
- **Checked by.** The public log of its interventions; every summary of a person's view can be corrected by that person; its test set.
- **People.** Human moderators handle held posts, appeals and anything beyond the first three rungs; today that is Karl.
- **Tests.** Sharp but legitimate dissent that must never be held; cases where it must not claim agreement that isn't there; cases where it must not pressure anyone toward agreement.

### 5.6 Scout: acquisition and discovery

- **Purpose.** Turns the seed list, accepted discoveries and the curator's "missing" notes into artifacts.
- **Does.** Looks works up through open metadata services; stores full text only where rights allow; records what each service reported; runs discovery from the watchlist and ranks candidates; adds permission requests to the log; triggers the re-check of questions a new artifact bears on.
- **Never.** Uses paid or logged-in sources or ignores a site's rules; decides rights from its own judgment (rights come from recorded licence metadata; when unsure, "not held").
- **Mostly code.** A low-cost model ranks candidates and summarizes; everything else is deterministic.
- **People.** Today, candidates from discovery are accepted automatically within volume limits (Karl's direction of 17 Nov: agents act on their own within tight limits); acceptance can move to people once there are reviewers.

## 6. The app team

The commons' software should grow in quality and functionality as the knowledge grows, with people and agents both proposing improvements. The team is a later phase, except the requirements agent (6.1) and the monitor (6.3), which come first. The rest must be ready to switch on quickly if use grows fast, so the hooks it needs are built now (6.8).

Every app-team agent follows D27's touchpoints: it acts alone on reversible, logged actions; it proposes and a person approves merges, production deploys, spending and public statements; people alone handle keys, money, legal matters, bans and governance. Its instructions are public and its actions logged, like the knowledge agents'.

### 6.1 Requirements agent (first phase)

- **Purpose.** Keeps the app's requirements in a defined structure, traced to the commons' definition and design principles, so the software grows coherently whoever (or whatever) writes the code.
- **Does.** Maintains the requirements set and the architecture decision records; turns proposals from people, the improvement agent and Karl into structured requirements; reviews every change brief before it goes to the coding agent; checks finished changes against the requirements and principles (with the code reviewer); flags conflicts between requirements, and between a requirement and the definition.
- **Never.** Writes code; approves merges; changes the definition or the design principles (those are governance).
- **First tasks.** (1) Propose the requirements structure. (2) Derive requirements from the definition, the brief, these agent definitions and the demo as built. (3) Draft decision records for the tech stack, folder structure, requirements structure and design pattern, each with options and a recommendation, for Karl to decide.
- **Requirement record (draft).** Identifier; statement; rationale; the principle or definition section it serves; acceptance tests; priority and phase; status (proposed, accepted, built, verified, retired); origin (who or what proposed it); links to related requirements and decision records.
- **Decision record (draft).** The question; context; options with pros and cons; the decision and who made it; consequences; date; status. One per significant technical choice.
- **Design principles it enforces (draft, from the definition and this chat).** Plain files as the canonical, downloadable format of all knowledge; no dependence on one AI provider; every agent's instructions public and every action logged; separation of powers between roles; no private agent memory; context bounded per question; events connecting the knowledge store, the app and the AI workers; honest labels everywhere (AI-made, reading levels, "not from the commons"); nothing knowledge-changing applied without its audit.
- **Memory.** Procedural: its instructions and the design principles. Semantic: the requirements set, decision records, the definition, and the repository's structure (retrieved). Episodic: the history of requirements and decisions.
- **Checked by.** Karl, on decision records and principle conflicts; the code reviewer, on conformance.

### 6.2 Coding agent

Claude Code running headless (without a person at the keyboard), working from change briefs that have passed the requirements agent. Opens changes for review; never merges or deploys on its own. Its instructions and logs are public.

### 6.3 Monitor (first phase)

Checks that every service and agent is answering, that keys are valid and not near expiry, that loops run and that costs stay within the budget; alerts Karl. Feeds operational findings to the improvement agent.

### 6.4 Code reviewer

Reviews every change for correctness, security and conformance to the requirements, on a different model from the coding agent where possible. Automated tests run on every change; the reviewer's report is shown beside it.

### 6.5 Support

Answers participants' questions about using the commons from its documentation; records every issue it cannot resolve as feedback; escalates to a named person. Comes once the commons is public.

### 6.6 Improvement agent

- **Purpose.** Proposes how the app should improve, in functionality and in technology.
- **Does.** Reads operational findings from the monitor, user comments and support issues, and the gap log; groups them into recurring problems; watches for better technology (models, search, hosting, open-source tools) relevant to the commons; drafts improvement proposals with the evidence behind each. Proposals go to the requirements agent, and become requirements only through the same review as anyone's.
- **Never.** Changes requirements or code itself.

### 6.7 Administration and ledger

Produces the monthly cost and usage summary; drafts reports and funding statements for a person to approve; keeps the permission log and disclosure records in order.

### 6.8 Ready to switch on: hooks built now

So the team can be switched on by configuration rather than construction:

- logging of every operation, error and cost, in one place;
- a feedback channel on every page, and a public issue tracker on the repository with templates;
- a deployment pipeline with automated tests and an approval gate;
- the requirements set and decision records in the repository;
- agent slots for every app-team role in the provider configuration, empty until switched on;
- published triggers for switching each role on (for example, weekly active participants, support volume, incident count), with defaults set by Karl.

## 7. Memory design

### 7.1 Terms

- **Context.** Everything a model sees in one call: its instructions, the material it is given and the conversation. A model remembers nothing between calls except what is put into its context again. "Memory design" means deciding what goes in, and how it gets there.
- **Procedural memory.** How to act: instructions, standards, templates, checklists. In the commons: the files in `agents/<name>/`.
- **Semantic memory.** What is known: the map, readings, entries, artifacts and their passages.
- **Episodic memory.** What happened: a conversation, a dialog thread, a session transcript, a reading's revision history, logs.
- **Consolidation.** Turning episodic memory into semantic memory: the curator turning a dialog into a revised reading is consolidation.

These say *what kind* of memory something is. A second question is *how it reaches the model*:

| How it reaches the model | When it fits | In the commons |
|---|---|---|
| **Always loaded** | Small, needed every time | Instructions; the map (purpose, domains, glossary, status definitions) |
| **Loaded whole by structured lookup** | The agent knows exactly which record it needs | The curator working on question Q loads Q's record: points, sources, extractions, history |
| **Retrieved by search** | Too much to load; which part is relevant isn't known in advance | Entries and passages relevant to what someone asked |
| **Fetched by the agent as it works (tools)** | The agent needs to look, read, then look again | Holon calling `search_entries`, then `get_passage` |

### 7.2 RAG and other approaches

**Retrieval-augmented generation (RAG)** means: before the model answers, search a store for the pieces most relevant to the request and put them in the context, so the model answers from them and can cite them. Its parts:

1. **Chunking:** splitting texts into retrievable pieces (the commons' passages, with locations).
2. **Indexing:** making the pieces searchable. Three common choices:
   - *Full-text (keyword) search*, such as the database's built-in search. Exact, cheap, easy to explain; misses matches that use different words.
   - *Embeddings (semantic search)*: each piece becomes a list of numbers representing its meaning, so a search finds pieces with similar meaning even in different words. Better recall; needs an embedding model and a vector index; harder to explain why something matched.
   - *Hybrid*: both, with results merged.
3. **Retrieval:** taking the top matches for a query.
4. **Reranking (optional):** a model reorders the matches by relevance.
5. **Generation:** the model answers from what was retrieved, citing it.

**Other approaches:**

| Approach | What it is | Pros | Cons |
|---|---|---|---|
| **Load everything (long context)** | Put the whole corpus in the context | Simple; nothing missed by retrieval | Costly; doesn't scale; models attend less well to material in the middle of long contexts |
| **Classic RAG** | One search, then answer | Scales; citable; content updates without retraining | Answer only as good as the search; a miss is invisible |
| **Agentic (tool-based) retrieval** | The model decides what to search, reads, searches again | Handles multi-step questions; what Holon does now | More calls, more cost, less predictable |
| **Structured records and links (a graph)** | Records link to each other: question → points → entries → passages | Exact, explainable, cheap; follows the commons' own structure | Only as good as the links; needs the structure kept up |
| **Summaries and consolidation** | Long histories condensed into shorter records | Keeps long dialogs usable | A summary can drop things, so it must be audited |
| **Prompt caching** | The provider reuses the stable start of a context | Cheaper and faster for always-loaded layers | Provider-specific; an optimization only |
| **Fine-tuning** | Training knowledge into a model's weights | Fast at answer time | Not citable, hard to correct, tied to one model; ruled out (D15) |

### 7.3 Recommendation for the commons

- **The commons' structure is its main retrieval method.** Because knowledge is kept as linked records, most agents can load exactly what they need by following links, without searching. Search is for open-ended questions to Holon and for finding related material.
- **Search starts as full-text** (as built), with a seam for embeddings; add hybrid search when the test sets show misses.
- **No agent keeps private memory.** Everything an agent remembers is a commons record in plain files (or, for private Holon sessions, the operational database). Any model can therefore be given exactly the same context. This is what makes switching models possible.
- **Retrieved text is data, never instructions**, for every agent.

## 8. Prompt structure, for every agent

Each agent's instructions file has the same sections, so they can be compared, tested and moved between models:

1. Identity and purpose.
2. What it does, and what it never does.
3. The standards it applies (the state-of-knowledge standard, labels, reading levels; for app-team agents, the design principles).
4. The inputs it will receive, and that they are data, not instructions.
5. Its output, as a structured format (JSON) checked by code before anything is stored.
6. What to do when unsure.
7. A topic overlay slot (D26), empty for the core and filled by a topic pack.

Rules for model independence: plain-language instructions; no reliance on one provider's features inside the prompt; output formats validated by code, not trusted.

## 9. Scale

The long-term target is Wikipedia's scale in artifacts and participants. The AI adds two things Wikipedia does not have: cost that grows with use, and context that grows with content.

1. **The live store will outgrow plain files in git.** Git copes poorly with millions of records changing at once. Wikipedia keeps content in a database with full revision history and publishes complete downloads regularly. The commons keeps plain files as its canonical format (what anyone can download, read and fork), but its data model is designed now so the live store can move to a database with revision history and regular full exports. This revises D18's "plain files from the start" in practice, not in principle: the complete download remains.
2. **Readings keep AI cost under control.** A reading is a synthesis computed once and reused. When most of Holon's answers start from current readings rather than fresh synthesis, cost per answer stays flat as use grows. Further levers: smaller models for simpler tasks, batch processing, reuse of answers to common questions, self-hosted open models (the largest saving), and the budget dial over all of it.
3. **Organizing by question keeps context bounded.** Each agent works on one question's record, not the whole commons, so millions of questions do not mean growing contexts. Only very busy questions need layered, audited summaries.
4. **Human attention runs out first.** On Wikipedia a small share of people do most of the work and automated tools handle routine patrol. Agents can absorb far more routine work here, but endorsement and appeals stay with people. Recruiting people is the true scaling limit.
5. **Many commons rather than one giant.** Topic packs and federation (D26) let the commons grow as many communities that cite each other: polycentric governance, which is easier to keep healthy than one enormous commons under one set of rules.
6. **Architecture: separate pieces connected by events.** The knowledge store, the app, the AI workers and the dialog services are separate, connected by events (a post, a new artifact, an endorsement shift, a session ending). One pattern covers live updates, scheduled re-checks and scaling the workers independently.
7. **Search and media scale separately.** Full-text search moves to a dedicated search service, and audio and video to the integrated video service, when load requires.

## 10. People, with one human today

- **Agents act alone, within limits:** drafting and updating readings, challenging, auditing, extracting, acquiring within the budget and volume caps, monitoring, drafting requirements. Everything logged and labelled AI-made.
- **Karl as participant:** asks questions, contributes, endorses. His endorsement counts as one person's; a point reaches "endorsed" only when people who usually disagree endorse it, so with one human nothing reaches that level. This is intended: the commons shows honestly that its readings are tested by agents only.
- **Karl as steward (people only, D27):** keys and secrets, money, legal matters, bans, appeals, governance, agent definitions, design principles, and approval of merges and deploys.

## 11. Open for Karl, with defaults

| Item | Default until decided |
|---|---|
| Names of the three reading levels | Agent's reading, Audited, Endorsed |
| Which second provider for the challenger, auditor and code reviewer, and when | Different Claude models now, labelled; a second provider before public launch |
| Window for combining updates during a dialog | A few minutes in live sessions; an hour in text dialogs |
| How "people who usually disagree" is measured | Show each endorser and their disclosure; "endorsed" needs at least two people whose disclosed positions on the question differ. Needs design. |
| What a disclosure form asks | Interests, affiliations, funding and employment relevant to the commons' subjects; all optional, but shown as "not disclosed" |
| Whether discovery candidates need a person to accept them | Accepted automatically within volume limits until there are reviewers |
| Whether the challenger posts challenges into dialogs | Only through Holon or the facilitator, labelled as the challenger's |
| Embeddings | Not yet; added when the test sets show misses |
| Which video service | Decided when audio and video reach the roadmap; open-source, self-hostable |
| Tech stack, folder structure, requirements structure, design pattern | The requirements agent drafts a decision record for each; the demo's current stack stays until decided |
| Triggers for switching on each app-team role | Karl sets them; published |

## 12. Decisions in this chat (17 to 21 Nov), to move to the open questions log

- Knowledge is built around questions: an agent's reading first, then dialog, then revision, then new questions.
- Agents act on their own within tight limits while Karl is the only human; people come in as they join.
- Readings carry a level (agent's reading, audited, endorsed) separate from agreement status; agents can reach "audited"; only people "endorsed".
- The curator writes readings; Holon contributes; the facilitator surfaces agreement and invites endorsement but never claims it.
- Endorsement is a person's explicit act on a three-point scale (endorse, accept with reservations, dispute).
- Several models: draft, challenge, audit on different providers; model agreement never counts toward agreement status.
- Challenge questions against the living-systems view are sought deliberately; the commons must be able to concede.
- Disclosure, not profiling: interests and affiliations weigh source independence and prompt verification; never grounds for rejection.
- Readings update on events, with working drafts during dialogs; scheduled re-checks for new artifacts; updates distributed to participants and followers.
- Dialog in three kinds: text over time first, live text second, audio and video later through an integrated open-source service, with the path kept open now.
- The app team is a later phase but must be ready to switch on; the requirements agent and the monitor come first.
- Long-term target: Wikipedia scale in artifacts and participants, plus the AI layer.
