// app/src/routes/pages.ts
// Reviewer-facing pages and the Ask endpoint behind the Ask Holon page. All behind the review gate.

import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { commons } from '../content/load';
import { Html, html } from '../lib/html';
import { reviewerOf, stewardOnly } from '../lib/review';
import { ask, shareQuestion } from '../holon/holon';
import { anthropicConfigured } from '../holon/anthropic';
import { limitReached } from '../holon/usage';
import { page } from '../site/layout';
import { renderAnswer, usd } from '../site/ui';
import { askPage } from '../site/pages/ask';
import {
  artifactPage, artifactsPage, entriesPage, entryPage, questionPage, questionsPage, searchPage,
} from '../site/pages/knowledge';
import { contributePage, growthPage, reviewPage } from '../site/pages/process';
import {
  agentPage, agentsPage, changesPage, costsPage, fundingPage, howItWorksPage, interfacePage, permissionsPage, sessionsPage,
} from '../site/pages/transparency';

const router = Router();

function send(req: Request, res: Response, title: string, body: Html, extra: { sample?: string; scripts?: string[] } = {}) {
  res.type('html').send(page({ title, path: req.path, reviewer: reviewerOf(res), body, ...extra }));
}

function notFound(req: Request, res: Response) {
  res.status(404);
  send(req, res, 'Not found', html`<h1>Not found</h1><p>The commons holds nothing at this address.</p>`);
}

const q = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

router.get('/', (req, res) => send(req, res, 'Ask Holon', askPage(), { scripts: ['/assets/ask.js'] }));
router.get('/entries', (req, res) => send(req, res, 'Entries', entriesPage({ status: q(req.query.status) || undefined, topic: q(req.query.topic) || undefined })));
router.get('/entries/:id', (req, res) => {
  const e = commons().entries.get(req.params.id);
  if (!e) return notFound(req, res);
  send(req, res, e.claim.slice(0, 60), entryPage(e));
});
router.get('/artifacts', (req, res) => send(req, res, 'Artifacts', artifactsPage()));
router.get('/artifacts/:id', (req, res) => {
  const body = artifactPage(req.params.id);
  if (!body) return notFound(req, res);
  send(req, res, 'Artifact', body);
});
router.get('/questions', (req, res) => send(req, res, 'Questions', questionsPage()));
router.get('/questions/:id', (req, res) => {
  const body = questionPage(req.params.id);
  if (!body) return notFound(req, res);
  send(req, res, 'Question', body);
});
router.get('/search', (req, res) => send(req, res, 'Search', searchPage(q(req.query.q).slice(0, 200))));
router.get('/contribute', (req, res) => send(req, res, 'Contribute', contributePage()));
router.get('/review', (req, res) =>
  send(req, res, 'Review', reviewPage(), { sample: 'These proposals and auditor reports were written to show how review works. No agent produced them, and the buttons do nothing in the demo.' }));
router.get('/growth', async (req, res) =>
  send(req, res, 'Growth', await growthPage(), { sample: 'The loops are not running in the demo, except gap notes from Holon. Loop status, candidates and the watchlist are illustrative; spend and gaps are live.' }));
router.get('/how-it-works', (req, res) => send(req, res, 'How this commons works', howItWorksPage()));
router.get('/agents', (req, res) => send(req, res, 'Agents', agentsPage()));
router.get('/agents/:id', (req, res) => {
  const body = agentPage(req.params.id);
  if (!body) return notFound(req, res);
  send(req, res, 'Agent', body);
});
router.get('/costs', async (req, res) => send(req, res, 'Costs', await costsPage()));
router.get('/funding', (req, res) => send(req, res, 'Funding', fundingPage()));
router.get('/changes', async (req, res) => send(req, res, 'Changes', await changesPage()));
router.get('/permissions', (req, res) => send(req, res, 'Permissions', permissionsPage()));
router.get('/interface', (req, res) => send(req, res, 'Interface', interfacePage()));
router.get('/sessions', stewardOnly, async (req, res) => send(req, res, 'Sessions', await sessionsPage()));

// ─── Ask (JSON, called by public/ask.js) ───────────────────────────────────────────────────────────────────

const askLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 8,
  keyGenerator: (_req, res) => reviewerOf(res)?.email ?? 'anonymous',
  message: { error: 'Too many questions in a minute. Please wait a moment.' },
});

router.post('/ask', askLimiter, async (req, res) => {
  const reviewer = reviewerOf(res)!;
  const question = q(req.body?.question).slice(0, 2000);
  const sessionId = q(req.body?.sessionId) || null;
  if (!question) return res.status(400).json({ error: 'Please type a question.' });
  if (!anthropicConfigured()) return res.status(503).json({ error: 'Holon is not connected on this deployment.' });
  const limit = await limitReached(reviewer.email);
  if (limit) return res.status(429).json({ error: limit });
  try {
    const r = await ask(question, { kind: 'reviewer', name: reviewer.name, email: reviewer.email }, sessionId);
    res.json({
      sessionId: r.sessionId,
      html: renderAnswer(r.answer).value,
      cited: r.cited,
      unknownCitations: r.unknownCitations,
      gaps: r.gaps.length,
      meta: `${r.model} · ${r.instructionVersion} · ${usd(r.costUsd)}`,
    });
  } catch (err) {
    console.error('[holon] ask failed:', err);
    res.status(502).json({ error: 'Holon could not answer just now. Please try again in a moment.' });
  }
});

router.post('/ask/share', async (req, res) => {
  const reviewer = reviewerOf(res)!;
  const ok = await shareQuestion(q(req.body?.sessionId), reviewer.email);
  res.json({ ok });
});

router.use(notFound);

export default router;
