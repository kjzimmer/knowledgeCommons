// app/src/lib/review.ts
// Invite-only access for the concept demo: signed per-reviewer links, the same scheme as the Abundance Architecture
// draft site. A token is base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload, REVIEW_LINK_SECRET)).
// Nothing is stored, so links survive database resets. Revoke one reviewer by adding their email to REVIEW_REVOKED
// (comma-separated); revoke every link by changing REVIEW_LINK_SECRET.

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export interface Reviewer {
  name: string;
  email: string;
  /** steward = can see private sessions (Karl, in the draft) */
  role: 'steward' | 'reviewer';
  /** The host site that vouched for this reviewer, when the link was issued through the public interface */
  via?: string;
  iat: number;
}

/** A same-site path such as "/entries/x", or null. Guards redirects against leaving the site */
export function safePath(value: unknown): string | null {
  const p = typeof value === 'string' ? value.trim() : '';
  return /^\/(?!\/)[\w\-./?=&%]*$/.test(p) && !p.includes('\\') ? p : null;
}

export const REVIEW_COOKIE = 'kc_review';
const COOKIE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

function secret(): string | null {
  const s = process.env.REVIEW_LINK_SECRET;
  return s && s.length >= 32 ? s : null;
}

function sign(payload: string, key: string): string {
  return crypto.createHmac('sha256', key).update(payload).digest('base64url');
}

export function createReviewToken(r: Omit<Reviewer, 'iat'>): string {
  const key = secret();
  if (!key) throw new Error('REVIEW_LINK_SECRET is not set (32+ characters)');
  const payload = Buffer.from(JSON.stringify({ ...r, iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  return `${payload}.${sign(payload, key)}`;
}

function revoked(): Set<string> {
  return new Set((process.env.REVIEW_REVOKED ?? '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean));
}

export function verifyReviewToken(token: string | undefined): Reviewer | null {
  const key = secret();
  if (!key || !token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  try {
    const r = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Reviewer;
    if (typeof r.name !== 'string' || typeof r.email !== 'string') return null;
    if (r.role !== 'steward' && r.role !== 'reviewer') return null;
    if (revoked().has(r.email.toLowerCase())) return null;
    return r;
  } catch {
    return null;
  }
}

export function reviewerOf(res: Response): Reviewer | null {
  return (res.locals.reviewer as Reviewer | undefined) ?? null;
}

const PRIVATE_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Private draft</title><link rel="stylesheet" href="/assets/style.css"></head><body><main class="narrow"><h1>This draft is private</h1><p>Open the review link you were sent. If it has stopped working, ask for a new one.</p></main></body></html>`;

/** Every page needs a reviewer cookie, set by opening a signed review link. Fails closed without a secret */
export function reviewGate(req: Request, res: Response, next: NextFunction): void {
  const reviewer = verifyReviewToken(req.cookies?.[REVIEW_COOKIE]);
  if (!reviewer) {
    res.status(403).type('html').send(PRIVATE_PAGE);
    return;
  }
  res.locals.reviewer = reviewer;
  next();
}

export function stewardOnly(_req: Request, res: Response, next: NextFunction): void {
  if (reviewerOf(res)?.role !== 'steward') {
    res.status(404).type('text').send('Not found');
    return;
  }
  next();
}

/** GET /r/:token: exchange a review link for the cookie, then drop the token from the address bar */
export function acceptReviewLink(req: Request, res: Response): void {
  const token = String(req.params.token ?? '');
  if (!verifyReviewToken(token)) {
    res.status(403).type('html').send(PRIVATE_PAGE);
    return;
  }
  res.cookie(REVIEW_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  });
  res.redirect(303, safePath(req.query.to) ?? '/');
}
