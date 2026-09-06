import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { HttpError } from './lib/http-error.js';
import cardsRouter from './routes/cards.js';
import readingsRouter from './routes/readings.js';
import { spreadList } from './spreads.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/api/spreads', (_request, response) => {
  response.json(spreadList);
});

app.use('/api/cards', cardsRouter);
app.use('/api/readings', readingsRouter);

app.use((err: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    if (err.status >= 500) console.error(err.cause ?? err);
    response.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  response.status(500).json({ error: 'Something went wrong.' });
});

export default app;
