# Tarot Oracle App

A tarot reading app built with React, TypeScript, Express, PostgreSQL, and the Anthropic Claude API.

Card meanings and correspondences (suit, numerology, court rank, and Major Arcana) live in PostgreSQL and are supplied to Claude as grounding context — Claude only interprets from that data, and is instructed to address the reader directly rather than writing about them in the third person.

## Features

- Draw one of three spreads: Past / Present / Future (three cards), one-card Yes / No, or Mind / Body / Soul (three cards)
- Ask an optional question that Claude answers directly
- Optionally include reversed cards (off by default)
- Hover or focus a drawn card to load its extended correspondences (element, numerology, court/Major Arcana associations) from the database
- Store readings and drawn cards in PostgreSQL
- Generate database-grounded, personally-addressed interpretations with Claude
- Preview sample Markdown interpretation text without making an API call
- Render Claude's Markdown with `react-markdown`

## Project Structure

```text
client/   React and Vite frontend
server/   Express and TypeScript backend
```

Important files:

- `server/schema.sql`: PostgreSQL table definitions
- `server/seed.sql`: tarot cards, meanings, and correspondences
- `server/index.ts`: process entrypoint — loads env, then starts the Express app
- `server/app.ts`: Express app assembly — middleware, routes, centralized error handling
- `server/routes/cards.ts`, `server/routes/readings.ts`: route handlers, one file per resource
- `server/db/pool.ts`: PostgreSQL connection pool and transaction rollback helper
- `server/db/queries/`: SQL queries and row-to-response mapping, one file per resource
- `server/spreads.ts`: spread definitions and the Claude prompt instructions built from them
- `server/lib/http-error.ts`: `HttpError` used by routes; caught by `app.ts`'s error middleware
- `server/lib/anthropic-client.ts`: Anthropic client and model configuration
- `client/src/App.tsx`: frontend state and API orchestration
- `client/src/components/`: `ReadingControls`, `Spread`, `TarotCard`, `Interpretation`, `Header`
- `client/public/tarot/`: tarot card images

## Requirements

- Node.js
- PostgreSQL
- A local PostgreSQL database named `tarot_app`
- An Anthropic API key for interpretation generation

## Setup

Install dependencies:

```bash
npm --prefix client install
npm --prefix server install
```

Create the local environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_api_key_here
CLAUDE_MODEL=claude-sonnet-5
PGDATABASE=tarot_app
PGUSER=your_postgres_user
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

`DATABASE_URL` is also supported as an alternative to `PGDATABASE`/`PGUSER` (e.g. for a hosted Postgres instance) — set it and the individual `PG*` vars are ignored.

Never commit `.env` or share the API key.

## Database Setup

Create or update the PostgreSQL tables:

```bash
psql -d tarot_app -f server/schema.sql
```

Load the tarot cards and reference data:

```bash
psql -d tarot_app -f server/seed.sql
```

The schema and seed files are designed to be rerunnable. The seed file updates curated meanings and reference data while preserving the card set.

## Run Locally

Start the backend in one terminal:

```bash
npm --prefix server run dev
```

This builds the TypeScript and starts the server (`npm run start` runs the last build without rebuilding — use `dev` after editing server code).

Start the frontend in another terminal:

```bash
npm --prefix client run dev
```

Open the Vite URL shown in the frontend terminal, usually:

```text
http://localhost:5173
```

The Vite development server proxies `/api` requests to the Express server at `http://localhost:3001`.

## API Routes

All error responses are `{ "error": "..." }` with an appropriate status code (400 for invalid input, 404 for missing resources, 503 if `ANTHROPIC_API_KEY` isn't configured, 500 for unexpected failures).

### Health check

```text
GET /api/health
```

### Card details

```text
GET /api/cards/:cardId
```

Returns a single card's stored meanings and correspondences (element, numerology, court rank, Major Arcana element/planets/signs/associations). Used by `TarotCard` on hover/focus.

### Draw a reading

```text
POST /api/readings/draw
```

Example request:

```json
{
  "spreadType": "mind_body_soul",
  "question": "What should I focus on this week?",
  "includeReversals": true
}
```

`spreadType` is one of `three_card`, `yes_no`, or `mind_body_soul` (defaults to `three_card`); `question` and `includeReversals` are optional (`includeReversals` defaults to `false`). Draws the cards, stores the reading, and returns it with each card's position label and the spread's display label.

### Generate an interpretation

```text
POST /api/readings/:readingId/interpret
```

Loads the reading's cards and their stored meanings, suit data, numerology, court-card data, and Major Arcana correspondences, then asks Claude to interpret them using only that context — addressing the reader directly in the second person rather than describing them in the third person. The spread-specific instructions (opening framing, per-position guidance, and, for multi-card spreads, the closing synthesis prompt) are generated from `server/spreads.ts`. Requires `ANTHROPIC_API_KEY`.

## Validation

Server — typecheck/build, lint, and format:

```bash
npm --prefix server run build
npm --prefix server run lint
npm --prefix server run format:check
```

Client — TypeScript and Vite build:

```bash
npm --prefix client run build
```

Run ESLint:

```bash
npm --prefix client run lint
```

Auto-fix TypeScript and React formatting:

```bash
npm --prefix client run lint:fix
```

Run Stylelint for CSS:

```bash
npm --prefix client run stylelint
```

Auto-format CSS with Prettier:

```bash
npm --prefix client run format:css
```

## Current Limitations

- Claude interpretation requires an Anthropic API key and available API credits
- There are no automated tests yet (`server`'s `test` script is a placeholder)
- Readings are stored, but there is not yet a reading history screen

## Next Steps

- Add additional spreads including custom spreads
- Add Oracle cards and meanings
- Add additional language support starting with Brazilian Portuguese
- Add reading history and retrieval
- Add automated backend and frontend tests
- Improve error handling and loading states
- Add user accounts if readings need to persist per user
