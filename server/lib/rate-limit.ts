import { rateLimit } from 'express-rate-limit';

/**
 * Per-IP rate limiting for the Claude-costing routes only. See app.ts for
 * which exact paths this is applied to.
 *
 * 5 requests/hour per client IP. Wired in app.ts at the 5 exact Claude-costing
 * route paths (not at the router-mount level), so /draw, /roll, and the other
 * free reads are never touched. Needs app.set('trust proxy', ...) in app.ts
 * for req.ip to reflect the real client behind a reverse proxy.
 *
 * Uses the library's default in-memory store: counts reset on restart and
 * are not shared across instances if this app is ever scaled horizontally.
 * Documented as a known limitation in the README.
 */
export const claudeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many reading requests — please try again in a bit.' },
});
