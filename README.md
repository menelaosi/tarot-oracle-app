# Tarot Oracle App

A multi-oracle divination app built with React, TypeScript, Express, PostgreSQL, and the Anthropic Claude API. It has five sections, switched with the tab nav:

- **Tarot** — draw a spread and get an interpretation
- **Astrology** — cast a natal chart in the browser and have Claude analyze it
- **Transits** — see how a given day's sky moves across your natal chart
- **Greek Alphabet Oracle** — draw one of the 24 letters of the Olympian inscription
- **Astragalomancy** — roll three standard or three zodiac dice and read what lands

Every system's reference data — tarot card meanings and correspondences, astrology signs/planets/houses/aspects/dignities, the Greek oracle letters, the traditional three-dice meanings — lives in PostgreSQL and is supplied to Claude as grounding context. Claude interprets only from that data and is instructed to address the reader directly in the second person rather than writing about them in the third person. View state (the drawn spread, the cast chart, each reading) is retained across tab switches and persisted to `localStorage`, so it survives a page reload too.

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

### Astragalomancy

- Pick a dice set (Zodiac by default) and roll — the dice tumble in and settle
- **Standard**: three d6; the sum (3–18) keys one traditional meaning from `astragalomancy_meanings`
- **Zodiac**: three d12 drawn from the astrology reference tables — a planet (the situation), a sign (the emotions), and a house (where the impact lands); hover a die for its keywords and associations
- Claude reads the roll grounded only in the supplied meaning / reference data

### Shared

- Database-grounded, personally-addressed interpretations rendered from Markdown with `react-markdown`
- Tab navigation between sections, with each view's state retained across switches and reloads (`localStorage`)

## Project Structure

```text
client/   React and Vite frontend
server/   Express and TypeScript backend
```

Important files:

- `server/schema.sql`: PostgreSQL table definitions — tarot (`cards`, `readings`, correspondence tables); astrology reference tables + `astrology_readings` + `astrology_transit_readings`; `greek_oracle_letters` + `greek_oracle_readings`; `astragalomancy_meanings` + `astragalomancy_readings`
- `server/seed.sql`: tarot cards, meanings, and correspondences; astrology reference data (transcribed from `Astrology.md`); the 24 Greek oracle letters; the 16 three-dice meanings
- `server/index.ts`: process entrypoint — loads env, then starts the Express app
- `server/app.ts`: Express app assembly — middleware, the per-resource routers, centralized error handling
- `server/routes/`: one thin file per resource — `cards.ts`, `readings.ts` (`draw` + `interpret`), `astrology.ts` (`interpret` + `transits`), `greekOracle.ts` (`draw` + `interpret`), `astragalomancy.ts` (`roll` + `interpret`). Handlers are `handler(async (req, res) => { … }, fallbackMessage)` and reach for the shared `lib/` helpers below rather than touching `pool` or the Anthropic SDK directly
- `server/lib/route.ts`: `handler()` — wraps an async route so any throw is normalized (`HttpError` passes through, anything else becomes a 500 with `fallbackMessage`) and forwarded to the error middleware. No per-handler `try/catch`
- `server/lib/db.ts`: `run()` (fire-and-forget write), `loadRow()` / `loadRows()` (query + 404 when empty) — the single choke point for Postgres access from routes
- `server/lib/claude.ts`: `generateReading()` — one grounded Claude call (key guard, request, truncation warning, usage/cache log, text extraction); `createSystemRules()` appends the shared voice + no-claims lines to a rule list
- `server/lib/validate.ts`: `optionalText()` — the optional `question` body field (absent/blank → null, non-string → 400)
- `server/lib/http-error.ts`: `HttpError` + `toHttpError`, used by the helpers above and caught by `app.ts`'s error middleware
- `server/lib/anthropic-client.ts`: the raw Anthropic client + model id (`lib/claude.ts` wraps it)
- `server/db/pool.ts`: the connection pool and `withTransaction(work)` — BEGIN → COMMIT, or ROLLBACK + rethrow on any throw, always releasing the client (used by `readings.ts` `/draw`)
- `server/db/queries/`: SQL strings, row types, and row-to-response mapping, one file per resource; `astrology.ts` also builds the cached reference digest
- `server/spreads.ts`: the spread registry (label, position labels, prompt guidance) — the single place to add a spread; the API, client picker, draw count, and prompt instructions all derive from it
- `client/src/App.tsx`: app shell — masthead, tab nav, and the lazily-loaded feature route for each section
- `client/src/features/<feature>/`: one folder per section (`tarot`, `astrology`, `greek-oracle`, `astragalomancy`), each with `…View.tsx` (state + API calls), `api.ts`, `types.ts`, a `.css` file, and a `components/` folder. `astrology/` also holds `TransitView.tsx` and `lib/` — `horoscope.ts` (the `circular-natal-horoscope-js` wrapper + chart geometry), `chartSummary.ts` / `transitSummary.ts` / `transits.ts` (flatten the horoscope for the API), `geocode.ts`, `geolocation.ts` — plus the SVG chart components
- `client/src/components/`: shared UI — `WorkspaceLayout` (controls + two-column workspace + the Markdown reading), `ControlsSection`, `ReadingPanel`, `DetailOverlay` (the hover/focus details panel used by tarot cards, the Greek letter, and the zodiac dice), `ButtonComponent`, `QuestionInput`, `Header`, `TabNav`
- `client/src/hooks/`: `useRetainedState` (a `useState` that survives tab switches and page reloads, backed by `localStorage` under a versioned `tarot-oracle:v1:` prefix; pass `{ persist: false }` to keep a value tab-switch-only), `useBirthChart` (the birth date/time/place shared by the Astrology and Transits tabs — each tab casts its own `Horoscope` from them)
- `client/public/tarot/`: tarot card images

### Backend request lifecycle

Every route follows the same shape, so a handler is just its own logic:

```ts
router.post(
  '/:readingId/interpret',
  handler(async (request, response) => {
    const reading = await loadRow<Row>(selectReading, [request.params.readingId], 'Reading not found.');
    const interpretation = await generateReading(createSystemRules(RULES), { ...reading }, 500, 'greek-oracle');
    await run(updateInterpretation, [interpretation, reading.id]);
    response.json({ interpretation });
  }, 'Could not generate the interpretation.'),
);
```

- **`handler(fn, fallbackMessage)`** owns error handling — no `try/catch` in routes. A thrown `HttpError` keeps its status; anything else becomes a 500 with `fallbackMessage`.
- **`loadRow` / `loadRows` / `run`** are the only way routes touch Postgres (`db/pool.ts`'s `withTransaction` for the one multi-statement write, in `readings.ts` `/draw`). A read that legitimately returns zero rows — e.g. astrology's "already generated?" check — still uses `pool.query` directly.
- **`generateReading(system, prompt, maxTokens, label)`** is the one Claude call: it guards `ANTHROPIC_API_KEY` (503), sends the request, logs token/cache usage, warns on truncation, and returns the concatenated text. `createSystemRules(rules)` joins a rule list and appends the shared second-person-voice and no-claims lines.
- **`optionalText(value, label)`** validates the optional `question` field.

## Requirements

- Node.js
- PostgreSQL
- A local PostgreSQL database named `tarot_app`
- An Anthropic API key for interpretation generation

## Setup

Install dependencies for both packages:

```bash
npm run install:all
# or individually:
#   npm --prefix client install
#   npm --prefix server install
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

Load the tarot cards, astrology reference data, Greek oracle letters, and dice meanings:

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

### Roll the dice

```text
POST /api/astragalomancy/roll
```

Body: `{ "mode": "zodiac" | "standard", "question": "..." }` (both optional; `mode` defaults to `zodiac`). Rolls server-side, stores an `astragalomancy_readings` row, and returns `{ id, question, roll }`. For `standard`, `roll` is `{ mode, values: [n,n,n], total, meaning }`; for `zodiac`, `{ mode, planet, sign, house }` where each is the resolved reference row (name, glyph, keywords, associations). The client animates the dice toward this result.

### Interpret a roll

```text
POST /api/astragalomancy/:readingId/interpret
```

Re-resolves the stored roll and asks Claude to read it in the second person — grounded only in the supplied meaning (standard) or the planet/sign/house keywords and associations (zodiac: planet = the situation, sign = the emotions, house = where the impact lands). Persists the result and returns `{ "interpretation": "..." }`. Requires `ANTHROPIC_API_KEY`.

Formatting is owned entirely by **Prettier** (`.prettierrc.json` at the repo root, shared by both packages); ESLint (`typescript-eslint` + the React Hooks rules) checks code quality only, with `eslint-config-prettier` switching off anything that would overlap. `format` rewrites, `format:check` just reports.

The root `package.json` fans the common tasks out to both packages:

```bash
npm run lint          # eslint, client + server
npm run format:check  # prettier --check, client + server
npm run check         # lint + stylelint + format:check — the full gate
npm run fix           # eslint --fix + stylelint --fix + prettier --write
npm run build         # client + server builds
npm run install:all   # npm install in both packages
```

Or run a package on its own:

Server — typecheck/build, lint, and format:

```bash
npm --prefix server run build
npm --prefix server run lint
npm --prefix server run format:check   # prettier --check "**/*.ts"
```

Client — TypeScript and Vite build:

```bash
npm --prefix client run build
```

Run ESLint (add `lint:fix` to auto-fix):

```bash
npm --prefix client run lint
```

Check / apply Prettier formatting (`.ts`, `.tsx`, `.css` under `src/`):

```bash
npm --prefix client run format:check
npm --prefix client run format
```

Run Stylelint for CSS (add `stylelint:fix` to auto-fix):

```bash
npm --prefix client run stylelint
```

## Current Limitations

- Claude interpretation requires an Anthropic API key and available API credits
- There are no automated tests yet (`server`'s `test` script is a placeholder)
- Readings, charts, transit readings, letter draws, and dice rolls are all stored, but there is not yet a history screen — a reload restores only the most recent view per section (from `localStorage`), not a browsable list
- Astrology charts use the entered wall-clock birth time as-is; historical timezone / DST offsets are not resolved from the coordinates
- Retained view state lives in the browser's `localStorage` (per-device, not synced); clearing site data resets it, and a stored reading id can 404 on interpret if the database is reseeded

## Next Steps

- Add additional spreads including custom spreads
- Add more oracle decks and divination systems
- Add additional language support starting with Brazilian Portuguese
- Add history and retrieval across all five sections (a list of past readings, not just the last one restored from `localStorage`)
- Resolve historical timezone offsets for astrology charts
- Add automated backend and frontend tests
- Improve error handling and loading states
- Add user accounts if readings need to persist per user
