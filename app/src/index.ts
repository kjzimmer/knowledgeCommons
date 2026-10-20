// app/src/index.ts
// The commons web app: indexes the repository's files, runs Holon, serves the pages and the public interface.

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import { commons, REPO_ROOT } from './content/load';
import { acceptReviewLink, reviewGate } from './lib/review';
import apiRouter from './routes/api';
import pageRouter from './routes/pages';

const app = express();
app.disable('x-powered-by');

// Load and validate content at startup, so a bad file shows up in the deploy log rather than on a page
const c = commons();
console.log(`[content] ${c.entries.size} entries, ${c.artifacts.size} artifacts, ${c.questions.size} questions`);

app.use((_req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/robots.txt', (_req, res) => res.type('text').send('User-agent: *\nDisallow: /\n'));
app.use('/assets', express.static(path.join(REPO_ROOT, 'app/public'), { maxAge: 0 }));

app.use(express.json({ limit: '64kb' }));
app.use('/api/v1', apiRouter);

app.use(cookieParser());
app.get('/r/:token', acceptReviewLink);
app.use(reviewGate);
app.use(pageRouter);

const port = Number(process.env.PORT) || 3100;
app.listen(port, () => console.log(`[commons] listening on ${port}`));
