# Tarot Oracle App

A multi-oracle divination app built with React, TypeScript, Express, PostgreSQL, and the Anthropic Claude API. It has four sections, switched with the tab nav:

- **Tarot** — draw a spread and get an interpretation
- **Astrology** — cast a natal chart in the browser and have Claude analyze it
- **Transits** — see how a given day's sky moves across your natal chart
- **Greek Alphabet Oracle** — draw one of the 24 letters of the Olympian inscription

Every system's reference data — tarot card meanings and correspondences, astrology signs/planets/houses/aspects/dignities, the Greek oracle letters — lives in PostgreSQL and is supplied to Claude as grounding context. Claude interprets only from that data and is instructed to address the reader directly in the second person rather than writing about them in the third person. View state (the drawn spread, the cast chart, each reading) is retained in memory while you switch tabs, and cleared on reload.

## Features

### Tarot

- Draw any spread defined in `server/spreads.ts` (one to four cards); the client picker is populated from `GET /api/spreads`. Ten spreads ship by default: Single card, Yes / No, Past / Present / Future, Thinking / Feeling / Doing, Situation / Action / Outcome, Mind / Body / Soul, The Oracle, Relationship Check, The Way Ahead, and Past / Present / Future / Advice
- Ask an optional question that Claude answers directly
- Optionally include reversed cards (off by default)
- Hover or focus a drawn card to load its extended correspondences (element, numerology, court/Major Arcana associations) from the database
- Store readings and drawn cards in PostgreSQL

### Astrology

- Cast a natal chart from a birth date, time, and place — computed in the browser with `circular-natal-horoscope-js` and drawn as an SVG wheel (signs, houses, planets, angles, and major aspect lines)
- Have Claude analyze the chart against seeded reference data (signs, planets, houses, aspects, dignities, modalities, elements, and degree-theory notes), reading it in the second person
- The whole reference library is sent as a **cached** system prefix; identical charts are served from the stored reading without a new Claude call

### Transits

- A chosen day's sky (today by default) drawn as an outer ring on the natal wheel, with dashed transit-to-natal aspect chords
- Anchored to the birthplace, or — with permission — the browser's current location
- Claude reads the day from the ranked transit contacts, leading with the most significant one and noting whether each is applying or separating
- Same natal chart + calendar day is served from its stored row

### Greek Alphabet Oracle

- Draw one of the 24 letters of the Olympian oracle inscription; the letter shows as a single disc
- Hover or focus the disc for its oracle line, meaning, and keywords from the database
- Claude gives a short second-person reading grounded only in that letter's text

### Shared

- Database-grounded, personally-addressed interpretations rendered from Markdown with `react-markdown`
- Tab navigation between sections, with each view's state retained across switches

## Project Structure

```text
client/   React and Vite frontend
server/   Express and TypeScript backend
```

Important files:

- `server/schema.sql`: PostgreSQL table definitions (tarot, astrology reference + `astrology_readings` + `astrology_transit_readings`, `greek_oracle_letters` + `greek_oracle_readings`)
- `server/seed.sql`: tarot cards, meanings, and correspondences; astrology reference data (transcribed from `Astrology.md`); the 24 Greek oracle letters
- `server/index.ts`: process entrypoint — loads env, then starts the Express app
- `server/app.ts`: Express app assembly — middleware, routes, centralized error handling
- `server/routes/`: route handlers, one file per resource — `cards.ts`, `readings.ts`, `astrology.ts` (natal `interpret` + `transits`), `greekOracle.ts` (`draw` + `interpret`)
- `server/db/pool.ts`: PostgreSQL connection pool and transaction rollback helper
- `server/db/queries/`: SQL queries and row-to-response mapping, one file per resource
- `server/spreads.ts`: the spread registry (label, position labels, prompt guidance) — the single place to add a spread; the API, client picker, draw count, and prompt instructions all derive from it
- `server/lib/http-error.ts`: `HttpError` used by routes; caught by `app.ts`'s error middleware
- `server/lib/anthropic-client.ts`: Anthropic client and model configuration
- `client/src/App.tsx`: app shell — masthead, tab nav, and the lazily-loaded feature route for each section
- `client/src/features/<feature>/`: one folder per section (`tarot`, `astrology`, `greek-oracle`), each with `…View.tsx` (state + API calls), `api.ts`, `types.ts`, a `.css` file, and a `components/` folder. `astrology/` also holds `TransitView.tsx` and `lib/` — `horoscope.ts` (the `circular-natal-horoscope-js` wrapper + chart geometry), `chartSummary.ts` / `transitSummary.ts` / `transits.ts` (flatten the horoscope for the API), `geocode.ts`, `geolocation.ts` — plus the SVG chart components
- `client/src/components/`: shared UI — `WorkspaceLayout` (controls + two-column workspace + the Markdown reading), `ControlsSection`, `ReadingPanel`, `DetailOverlay` (the hover/focus details panel used by tarot cards and the Greek letter), `ButtonComponent`, `QuestionInput`, `Header`, `TabNav`
- `client/src/hooks/`: `useRetainedState` (a `useState` that survives tab switches), `useBirthChart` (the natal chart shared by the Astrology and Transits tabs)
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

Load the tarot cards, astrology reference data, and Greek oracle letters:

```bash
psql -d tarot_app -f server/seed.sql
```

The schema and seed files are designed to be rerunnable. The seed file updates curated meanings and reference data (via `ON CONFLICT … DO UPDATE`) while preserving stored readings.

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

### List spreads

```text
GET /api/spreads
```

Returns the spread registry from `server/spreads.ts` as `[{ id, label, positions }]`, in display order. The client uses this to populate the spread picker, so adding a spread there needs no client change.

### Card details

```text
GET /api/cards/:cardId
```

Returns a single card's stored meanings and correspondences (element, numerology, court rank, Major Arcana core theme/element/planets/signs/associations). Used by `TarotCard` on hover/focus.

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

`spreadType` is any spread `id` from `GET /api/spreads` (defaults to `three_card`); an unknown id is rejected with 400. `question` and `includeReversals` are optional (`includeReversals` defaults to `false`). The number of cards drawn is the length of that spread's `positions`. Draws the cards, stores the reading, and returns it with each card's position label and the spread's display label.

### Generate an interpretation

```text
POST /api/readings/:readingId/interpret
```

Loads the reading's cards and their stored meanings, suit data, numerology, court-card data, and Major Arcana correspondences, then asks Claude to interpret them using only that context — addressing the reader directly in the second person rather than describing them in the third person. The spread-specific instructions (opening framing, per-position guidance, and, for multi-card spreads, the closing synthesis prompt) are generated from `server/spreads.ts`. Requires `ANTHROPIC_API_KEY`.

### Analyze a birth chart

```text
POST /api/astrology/interpret
```

Body: `{ "chart": ChartSummary }`, where the chart summary is built in the browser from the computed horoscope (`client/src/features/astrology/lib/chartSummary.ts`) — planet placements (sign, house, degree, retrograde), the four angles, and the major aspects. The whole seeded reference library (`astrology_signs`, `astrology_planets`, `astrology_houses`, `astrology_aspects`, `astrology_dignities`, `astrology_modalities`, `astrology_elements`, `astrology_reference_notes`) is rendered into a **cached** system prefix (`cache_control: ephemeral`); only the chart itself varies per request. Claude reads the chart against that reference in the second person. Because a birth chart is deterministic, an identical chart is served from its stored `astrology_readings` row (`{ "reused": true }`) without a new generation; otherwise a new row is written. Returns `{ "interpretation": "...markdown..." }`. Requires `ANTHROPIC_API_KEY`.

### Read a day's transits

```text
POST /api/astrology/transits
```

Body: `{ "natal": ChartSummary, "transit": TransitSummary }`, both built in the browser (`lib/chartSummary.ts`, `lib/transitSummary.ts`). The transit summary carries the day, the transiting-body positions, and the ranked transit-to-natal aspect contacts (with an applying/separating flag). Reuses the same cached reference prefix as `interpret`, with day-scoped prompt rules — Claude leads with the single most significant transit. An identical natal chart on the same calendar day is served from its stored `astrology_transit_readings` row (`{ "reused": true }`); otherwise a new row is written. Returns `{ "interpretation": "...markdown..." }`. Requires `ANTHROPIC_API_KEY`.

### Draw a Greek oracle letter

```text
POST /api/greek-oracle/draw
```

Body: `{ "question": "..." }` (optional). Draws one of the 24 seeded `greek_oracle_letters` at random, stores a `greek_oracle_readings` row, and returns `{ id, question, letter }` where `letter` is `{ letter, name, position, oracle, meaning, keywords }`.

### Interpret a Greek oracle letter

```text
POST /api/greek-oracle/:readingId/interpret
```

Loads the reading's letter and asks Claude for a short (2–4 sentence) second-person reading grounded only in that letter's oracle line, meaning, and keywords — answering the question if one was given. Persists the result on the reading row and returns `{ "interpretation": "..." }`. Requires `ANTHROPIC_API_KEY`.

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
- Readings, charts, transit readings, and letter draws are all stored, but there is not yet a history screen
- Astrology charts use the entered wall-clock birth time as-is; historical timezone / DST offsets are not resolved from the coordinates
- Retained view state is in-memory only — it survives tab switches but not a page reload

## Next Steps

- Add additional spreads including custom spreads
- Add more oracle decks and divination systems
- Add additional language support starting with Brazilian Portuguese
- Add history and retrieval across all four sections
- Persist retained view state across reloads
- Resolve historical timezone offsets for astrology charts
- Add automated backend and frontend tests
- Improve error handling and loading states
- Add user accounts if readings need to persist per user
