// app/src/scripts/review-link.ts
// Issues a signed review link. Usage:
//   npm run review:link -- --name "Hans Prahl" --email hans@example.com [--steward]
// Needs REVIEW_LINK_SECRET and PUBLIC_BASE_URL (e.g. via `railway run`).

import { createReviewToken } from '../lib/review';

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const name = arg('name');
const email = arg('email');
if (!name || !email) {
  console.error('Usage: npm run review:link -- --name "Full Name" --email person@example.com [--steward]');
  process.exit(1);
}
const role = process.argv.includes('--steward') ? 'steward' : 'reviewer';
const base = (process.env.PUBLIC_BASE_URL ?? 'http://localhost:3100').replace(/\/$/, '');
console.log(`${base}/r/${createReviewToken({ name, email, role })}`);
