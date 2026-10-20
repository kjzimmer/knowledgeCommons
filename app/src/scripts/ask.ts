// app/src/scripts/ask.ts
// Asks Holon one question from the command line and prints the answer, citations and cost. For trying out
// changes to Holon's instructions. Usage (with the model key in the environment, e.g. via `railway run`):
//   npm run ask -- "Is resilience always a good thing?"

import { ask } from '../holon/holon';

const question = process.argv.slice(2).join(' ').trim();
if (!question) {
  console.error('Usage: npm run ask -- "your question"');
  process.exit(1);
}

ask(question, { kind: 'reviewer', name: 'Command line', email: 'cli@localhost' })
  .then((r) => {
    console.log(r.answer);
    console.log('\n---');
    console.log(`entries cited: ${r.cited.entries.join(', ') || 'none'}`);
    if (r.cited.questions.length) console.log(`questions cited: ${r.cited.questions.join(', ')}`);
    if (r.unknownCitations.length) console.log(`UNKNOWN citations: ${r.unknownCitations.join(', ')}`);
    if (r.gaps.length) console.log(`gaps logged: ${r.gaps.join(' | ')}`);
    console.log(`${r.provider} ${r.model} · ${r.instructionVersion} · stop ${r.stop} · $${r.costUsd.toFixed(4)}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
