// app/src/routes/api.ts
// The public interface (v1). Host sites such as Abundance Architecture use only this. In the draft, callers identify
// with a site key: SITE_KEYS="Site Name=secret;Other Site=secret2".

import crypto from 'crypto';
import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { commons } from '../content/load';
import { search } from '../content/search';
import { Entry } from '../content/types';
import { ask, shareQuestion } from '../holon/holon';
import { anthropicConfigured } from '../holon/anthropic';
import { limitReached } from '../holon/usage';
import { renderAnswer } from '../site/ui';

const router = Router();

function siteKeys(): { site: string; key: string }[] {
  return (process.env.SITE_KEYS ?? '')
    .split(';')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const i = pair.lastIndexOf('=');
      return { site: pair.slice(0, i).trim(), key: pair.slice(i + 1).trim() };
    })
    .filter((s) => s.site && s.key.length >= 24);
}

function requireSite(req: Request, res: Response, next: NextFunction): void {
  const given = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  const match = siteKeys().find((s) => {
    const a = Buffer.from(s.key);
    const b = Buffer.from(given);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
  if (!match) {
    res.status(401).json({ error: 'A valid site key is required in the draft.' });
    return;
  }
  res.locals.site = match.site;
  next();
}

router.use(requireSite);

const base = () => (process.env.PUBLIC_BASE_URL ?? '').replace(/\/$/, '');

function entryJson(e: Entry, full: boolean) {
  const c = commons();
  const contributor = c.contributors.get(e.contributor);
  return {
    id: e.id,
    url: `${base()}/entries/${e.id}`,
    claim: e.claim,
    evidence: e.evidence,
    agreement: e.agreement,
    topics: e.topics,
    review: e.review,
    aiDrafted: contributor?.kind === 'agent',
    ...(full ? {
      objection: e.objection,
      unknowns: e.unknowns,
      basis: e.basis,
      contributor: contributor ? { name: contributor.name, kind: contributor.kind, model: contributor.model } : e.contributor,
      approver: e.approver,
      sources: e.sources.map((s) => ({ ...s, citation: c.artifacts.get(s.artifact)?.citation ?? null, url: `${base()}/artifacts/${s.artifact}` })),
    } : {}),
  };
}

router.get('/entries', (req, res) => {
  const topic = String(req.query.topic ?? '');
  const status = String(req.query.status ?? '');
  const list = [...commons().entries.values()]
    .filter((e) => e.status === 'published' && (!topic || e.topics.includes(topic)) && (!status || e.agreement.status === status));
  res.json({ entries: list.map((e) => entryJson(e, false)) });
});

router.get('/entries/:id', (req, res) => {
  const e = commons().entries.get(req.params.id);
  if (!e) return res.status(404).json({ error: 'No such entry' });
  res.json(entryJson(e, true));
});

router.get('/artifacts/:id', (req, res) => {
  const a = commons().artifacts.get(req.params.id);
  if (!a) return res.status(404).json({ error: 'No such artifact' });
  res.json({ id: a.id, url: `${base()}/artifacts/${a.id}`, citation: a.citation, kind: a.kind, link: a.url, rights: a.rights, basis: a.basis, summary: a.body });
});

router.get('/questions', (_req, res) => {
  res.json({ questions: [...commons().questions.values()].map((q) => ({ id: q.id, url: `${base()}/questions/${q.id}`, question: q.question, status: q.status, positions: q.positions.length })) });
});

router.get('/questions/:id', (req, res) => {
  const q = commons().questions.get(req.params.id);
  if (!q) return res.status(404).json({ error: 'No such question' });
  res.json({ ...q, file: undefined, url: `${base()}/questions/${q.id}` });
});

router.get('/search', (req, res) => {
  const query = String(req.query.q ?? '').slice(0, 200);
  res.json({ results: search(query, { limit: 20 }) });
});

const siteAskLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  keyGenerator: (_req, res) => String(res.locals.site),
  message: { error: 'Too many requests from this site.' },
});

router.post('/holon/ask', siteAskLimiter, async (req, res) => {
  const site = String(res.locals.site);
  const question = String(req.body?.question ?? '').trim().slice(0, 2000);
  const email = String(req.body?.asker?.email ?? '').trim().toLowerCase();
  const name = String(req.body?.asker?.name ?? '').trim().slice(0, 120) || undefined;
  if (!question) return res.status(400).json({ error: 'question is required' });
  if (!email) return res.status(400).json({ error: 'asker.email is required (fair-use limits are per person)' });
  if (!anthropicConfigured()) return res.status(503).json({ error: 'Holon is not connected on this deployment.' });
  const limit = await limitReached(email);
  if (limit) return res.status(429).json({ error: limit });
  try {
    const r = await ask(question, { kind: 'site', site, name, email }, req.body?.sessionId ? String(req.body.sessionId) : null);
    res.json({
      sessionId: r.sessionId,
      answer: { markdown: r.answer, html: renderAnswer(r.answer).value.replace(/href="\//g, `href="${base()}/`) },
      cited: r.cited,
      unknownCitations: r.unknownCitations,
      gaps: r.gaps.length,
      agent: { name: 'Holon', provider: r.provider, model: r.model, instructions: r.instructionVersion },
      costUsd: r.costUsd,
    });
  } catch (err) {
    console.error('[holon] api ask failed:', err);
    res.status(502).json({ error: 'Holon could not answer just now.' });
  }
});

router.post('/holon/share', async (req, res) => {
  const ok = await shareQuestion(String(req.body?.sessionId ?? ''), String(req.body?.asker?.email ?? ''));
  res.json({ ok });
});

router.post('/holon/discuss', (_req, res) => res.status(501).json({ error: 'Discuss mode is not built in the concept demo.' }));
router.post('/proposals', (_req, res) => res.status(501).json({ error: 'Proposals are not built in the concept demo.' }));

router.use((_req, res) => res.status(404).json({ error: 'Not found' }));

export default router;
