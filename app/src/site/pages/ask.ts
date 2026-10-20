// app/src/site/pages/ask.ts
// Home: Ask Holon. The answer arrives through POST /ask (see public/ask.js); this page renders the shell.

import { commons } from '../../content/load';
import { html, Html } from '../../lib/html';
import { anthropicConfigured } from '../../holon/anthropic';
import { askSettings } from '../../holon/holon';
import { fairUse } from '../../holon/usage';

const EXAMPLES = [
  'Is resilience always a good thing?',
  "Didn't Hardin show that commons always fail?",
  'What is a complex adaptive system, and why does it matter for health care?',
  'Can communities govern global problems like climate change without a world government?',
  'What is the strongest argument against managing living systems as wholes rather than parts?',
  'How does this commons decide what is true?',
];

export function askPage(): Html {
  const c = commons();
  const limits = fairUse();
  const ready = anthropicConfigured();
  const fullText = [...c.artifacts.values()].filter((a) => a.fullText).length;
  return html`
<section class="hero">
  <h1>Ask Holon</h1>
  <p class="lede">Holon is the commons' AI agent. Every answer shows its sources, how well the evidence supports each claim, and the strongest objection, and it says plainly what nobody yet knows.</p>
</section>

<section class="ask" id="ask">
  ${ready ? '' : html`<p class="notice">Holon is not connected yet: no model API key is configured on this deployment.</p>`}
  <div id="thread" class="thread" aria-live="polite"></div>
  <form id="ask-form" class="ask-form" autocomplete="off">
    <label for="question" class="visually-hidden">Your question</label>
    <textarea id="question" name="question" rows="3" maxlength="2000" placeholder="Ask in your own words…" required ${ready ? '' : 'disabled'}></textarea>
    <div class="ask-row">
      <button type="submit" ${ready ? '' : 'disabled'}>Ask</button>
      <button type="button" id="new-session" class="secondary" hidden>New conversation</button>
      <span id="ask-status" class="muted"></span>
    </div>
  </form>
  <p class="privacy">Your questions are private: they are never published or used to train any model. <strong>During this draft, conversations are kept so the stewards can review how Holon behaves.</strong> When Holon can't answer something, it records only what was missing from the commons, never your words, unless you choose to share your question. Limit: ${limits.questionsPerDay} questions a day.</p>

  <h2 class="small">Start with one of these</h2>
  <ul class="examples">
    ${EXAMPLES.map((q) => html`<li><button type="button" class="example" data-q="${q}" ${ready ? '' : 'disabled'}>${q}</button></li>`)}
  </ul>
</section>

<section class="holds">
  <h2>What the commons holds today</h2>
  <ul class="stats">
    <li><a href="/entries"><strong>${c.entries.size}</strong> claim entries</a></li>
    <li><a href="/artifacts"><strong>${c.artifacts.size}</strong> artifacts</a>, ${fullText} held in full text</li>
    <li><a href="/questions"><strong>${c.questions.size}</strong> open questions</a></li>
    <li><a href="/agents"><strong>${c.agents.size}</strong> agents</a> with public instructions</li>
  </ul>
  <p>On day one the commons holds only what was seeded for this demo, most of it AI-drafted and not yet reviewed. What Holon's underlying model learned in training is not in the commons and cannot be cited; Holon labels anything from it "Not from the commons". Holon runs on ${askSettings().model}; see <a href="/agents/holon">its instructions</a> and <a href="/costs">what it costs</a>.</p>
</section>`;
}
