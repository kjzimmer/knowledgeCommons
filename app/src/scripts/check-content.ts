// app/src/scripts/check-content.ts
// Validates every file in the commons. Run before committing content: npm run content:check

import { loadContent } from '../content/load';

const { content, errors } = loadContent();
console.log(
  `${content.artifacts.size} artifacts, ${content.entries.size} entries, ${content.questions.size} questions, ` +
    `${content.passages.length} passages, ${content.agents.size} agents`,
);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('Content OK');
