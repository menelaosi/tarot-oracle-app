# Tarot Oracle App

A tarot reading app built with React, TypeScript, Express, PostgreSQL, and the Anthropic Claude API.

The current version supports a three-card Past / Present / Future spread. Card meanings and correspondences are stored in PostgreSQL and supplied to Claude as grounding context for interpretations.

## Features

- Draw three tarot cards for Past, Present, and Future
- Optionally include reversed cards
- Display card images from `client/public/tarot`
- Store readings and drawn cards in PostgreSQL
- Generate database-grounded interpretations with Claude
- Preview sample Markdown interpretation text without making an API call
- Render Claude Markdown with `react-markdown`

## Project Structure

```text
client/   React and Vite frontend
server/   Express and TypeScript backend
```

Important files:

- `server/schema.sql`: PostgreSQL table definitions
- `server/seed.sql`: tarot cards, meanings, and correspondences
- `server/index.ts`: Express API routes
- `client/src/App.tsx`: frontend state and API orchestration
- `client/src/components/`: frontend components
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

### Health check

```text
GET /api/health
```

### Draw a reading

```text
POST /api/readings/draw
```

Example request:

```json
{
  "spreadType": "three_card",
  "question": "What should I focus on this week?",
  "includeReversals": true
}
```

### Generate an interpretation

```text
POST /api/readings/:readingId/interpret
```

This route loads the selected cards and their stored meanings, suit data, numerology, court-card data, and Major Arcana correspondences before calling Claude.

## Validation

Run frontend TypeScript and Vite checks:

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

- Only one three-card spread is available
- Claude interpretation requires an Anthropic API key and available API credits
- There are no automated tests yet
- Readings are stored, but there is not yet a reading history screen

## Next Steps

- Add more spread types
- Add reading history and retrieval
- Add automated backend and frontend tests
- Improve error handling and loading states
- Add user accounts if readings need to persist per user
