import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from './lib/http-error.js';
import { claudeRateLimit } from './lib/rate-limit.js';
import astragalomancyRouter from './routes/astragalomancy.js';
import astrologyRouter from './routes/astrology.js';
import cardsRouter from './routes/cards.js';
import greekOracleRouter from './routes/greekOracle.js';
import readingsRouter from './routes/readings.js';
import { spreadList } from './spreads.js';

// Each router's mount point, named once so it can't drift out of sync with
// the rate-limited paths below (which each reuse one of these as a prefix).
const API = '/api/';
const CARDS = `${API}cards`;
const READINGS = `${API}readings`;
const ASTROLOGY = `${API}astrology`;
const GREEK_ORACLE = `${API}greek-oracle`;
const ASTRAGALOMANCY = `${API}astragalomancy`;
const LLM = '/interpret';
const LLM_BY_ID = `/:readingId${LLM}`;

const app = express();

// Trust exactly one hop — the platform's single reverse proxy (Render/Fly/
// Railway-style) in front of this process — so req.ip reflects the real
// client from X-Forwarded-For without trusting an arbitrary client-supplied
// chain. Required for express-rate-limit's IP keying. Harmless locally: with
// no X-Forwarded-For header, Express falls back to the socket address.
app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.get(`${API}health`, (_request, response) => {
  response.json({ ok: true });
});

app.get(`${API}spreads`, (_request, response) => {
  response.json(spreadList);
});

// Rate limit only the Claude-costing routes (5/hour/IP). Registered as
// path-specific layers ahead of the routers mounted below, so the free
// routes sharing those routers (/draw, /roll) are untouched — see
// lib/rate-limit.ts.
app.post(`${READINGS}${LLM_BY_ID}`, claudeRateLimit);
app.post(`${ASTROLOGY}${LLM}`, claudeRateLimit);
app.post(`${ASTROLOGY}/transits`, claudeRateLimit);
app.post(`${GREEK_ORACLE}${LLM_BY_ID}`, claudeRateLimit);
app.post(`${ASTRAGALOMANCY}${LLM_BY_ID}`, claudeRateLimit);

app.use(CARDS, cardsRouter);
app.use(READINGS, readingsRouter);
app.use(ASTROLOGY, astrologyRouter);
app.use(GREEK_ORACLE, greekOracleRouter);
app.use(ASTRAGALOMANCY, astragalomancyRouter);

/** Every error response's one shape — `{ "error": "..." }` — pinned in one place. */
function sendError(response: Response, status: number, message: string): void {
  response.status(status).json({ error: message });
}

// Centralized error handler — must be registered last, and needs all four args
// for Express to treat it as an error handler. Every failed request ends up here
// as `{ error }`; only unexpected (>= 500) errors are logged.
app.use((err: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const { status = 500, message = 'Something went wrong.', cause } = err as HttpError;
  if (status >= 500 || !(err instanceof HttpError)) console.error(cause ?? err);
  sendError(response, status, message);
});

export default app;
