# [COMMONS NAME]: app design

Draft 0.1, 21 Nov 2026. Claude's draft for Karl Zimmer. Nothing here is adopted. Split out from the agent definitions: this document covers the app (surfaces, architecture, dialog, operations hooks and scale); `Commons_AgentDefinitions` covers the agents. Sections 4, 6.8 and 9 of agent definitions 0.2 are superseded by sections 4, 5 and 6 here. It is the source for the first L1 principles and the L3 surface requirements under the development standard.

## 1. Principles (draft L1)

| Id | Principle |
|---|---|
| P-01 | **Open and forkable.** Plain files are the canonical, downloadable format of all knowledge, agent definitions and requirements; a complete copy is always available. |
| P-02 | **Transparent by default.** Every agent's instructions are public, every action is logged, every cost and funder is published. Only private Holon sessions and personal account data are private. |
| P-03 | **Separation of powers.** No role both contributes and decides, moderates and contributes, or checks its own work, for agents and people alike. |
| P-04 | **Honest labels.** AI-made content, reading levels, working drafts and "not from the commons" are always labelled. |
| P-05 | **No single AI provider.** Every agent can run on another model without changing the app. |
| P-06 | **No private agent memory.** Everything an agent remembers is a commons record, so any model can be given the same context. |
| P-07 | **Bounded context.** Agents work on one question's record at a time. |
| P-08 | **Nothing knowledge-changing without its audit.** |
| P-09 | **Events connect the parts.** The knowledge store, the app, the AI workers and dialog services are separate and communicate through events. |
| P-10 | **Phone first, accessible always.** |
| P-11 | **Grow in quality, not size.** Features are added when requirements and evidence call for them; every feature has an owner role and a test. |

## 2. Surfaces

Because the commons is transparent, most of what an administrator sees is also publicly readable. The split between surfaces is about who may **act**, not who may **see**.

| Surface | Who | Main functions |
|---|---|---|
| **Public** | Anyone, no account | Learn what the commons is (definition, charter, agents and their instructions, principles); read questions and their readings with levels and history; read artifacts; ask Holon within fair-use limits; transparency pages (costs, funding, changes, gap log, agent test results, moderation log); join |
| **Participant** | Joined members | Disclosure; take part in dialogs (text over time first; live text and sessions later); endorse, accept with reservations or dispute points; correct extractions of their own posts; contribute artifacts and objections; pose questions; follow questions and receive updates; make essays, talks and other material with Holon; their own account and consent settings |
| **Steward** | Interim stewards and, later, moderators | Moderation queue (held posts) and appeals; permission log; budget dial; approval of agent definitions, design principles and requirements; approval of merges and deploys; keys and secrets (outside the app); disclosure and consent records |
| **Operations** | Stewards, and the app team's agents | Monitoring dashboard; agent activity and errors; feedback and support issues; improvement proposals; requirements and decision records in progress; triggers for switching on app-team roles |

## 3. Architecture (draft, for decisions 0003, 0006 and 0007)

| Part | Role |
|---|---|
| **Knowledge store** | Questions, readings, points, entries, artifacts, dialog records, endorsements, disclosures, with full revision history. Plain files in the repository today; a database with revision history and regular full exports later (section 6). |
| **App** | The four surfaces and the public interface (API). |
| **AI workers** | The agents, each started by events or schedules, running through the provider interface, reading and writing only through the knowledge store's interfaces. |
| **Dialog services** | Threads and live text inside the app; audio and video through an integrated open-source service later. |
| **Operational store** | Sessions, call log, budget and ledger, notifications, queues. |

**Events (first list):** question posed; reading drafted, challenged, audited, revised; post or transcript segment added; extraction corrected; endorsement given or changed; session scheduled, started, ended; artifact acquired; re-check found a bearing artifact; check failed; budget share used up; moderation action taken; feedback received. Each event names the agents and notifications it triggers.

## 4. Kinds of dialog

| Kind | What it needs | When |
|---|---|---|
| **Text over time** | Threads, consent, extraction, facilitator, notifications | First |
| **Live text** | The same data delivered in real time; a facilitator that responds quickly; working drafts | Second |
| **Live audio and video** | Scheduling, registration, reminders; recording consent; a video service; transcripts with speakers and timestamps that become the dialog record; a facilitator working beside the call | Later on the roadmap, with the path kept open now |

**The path for audio and video.** Integrate an open-source video service rather than build one: a full conference system such as Jitsi or BigBlueButton, or a toolkit such as LiveKit, self-hosted or rented. The app owns everything around the call: scheduling sessions on a question, consent before recording, transcripts, extraction and the record. To keep the path open now, a dialog contribution is either a post or a transcript segment (speaker, start and end time, text), and sessions are a record type with a schedule, participants and consent.

## 5. Ready to switch on the app team: hooks built now

- Logging of every operation, error and cost, in one place.
- A feedback channel on every page, and a public issue tracker on the repository with templates.
- A deployment pipeline with automated tests and an approval gate.
- The requirements set and decision records in the repository (development standard).
- Agent slots for every app-team role in the provider configuration, empty until switched on.
- Published triggers for switching each role on (for example weekly active participants, support volume, incident count), with defaults set by Karl.

## 6. Scale

The long-term target is Wikipedia's scale in artifacts and participants, plus the AI layer: cost that grows with use, and context that grows with content.

1. **The live store will outgrow plain files in git.** Plain files stay the canonical format; the data model is designed now so the live store can move to a database with revision history and regular full exports. This revises D18's "plain files from the start" in practice, not in principle.
2. **Readings keep AI cost under control.** A reading is a synthesis computed once and reused; most of Holon's answers start from readings. Further levers: smaller models for simpler tasks, batch processing, answer reuse, self-hosted open models, the budget dial.
3. **Organizing by question keeps context bounded** (P-07); only very busy questions need layered, audited summaries.
4. **Human attention runs out first.** Agents absorb routine work; endorsement and appeals stay with people. Recruiting people is the true limit.
5. **Many commons rather than one giant** (D26): topic packs and federation.
6. **Parts scale separately** (P-09): AI workers, search (a dedicated search service when load requires) and media each scale on their own.
