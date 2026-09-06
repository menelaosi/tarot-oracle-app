import Anthropic from '@anthropic-ai/sdk'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import { fileURLToPath } from 'node:url'
import { Pool, type PoolClient } from 'pg'

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

const app = express()
const port = Number(process.env.PORT ?? 3001)
const positions = ['Past', 'Present', 'Future'] as const

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      database: process.env.PGDATABASE ?? 'tarot_app',
      user: process.env.PGUSER ?? process.env.USER,
    })

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

function isThreeCardSpread(value: unknown): value is 'three_card' {
  return value === 'three_card'
}

async function rollback(client: PoolClient) {
  try {
    await client.query('ROLLBACK')
  } finally {
    client.release()
  }
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.post('/api/readings/draw', async (request: Request, response: Response) => {
  const { spreadType = 'three_card', question, includeReversals = true } = request.body as {
    spreadType?: unknown
    question?: unknown
    includeReversals?: unknown
  }

  if (!isThreeCardSpread(spreadType)) {
    response.status(400).json({ error: 'Unsupported spread type.' })
    return
  }

  if (question !== undefined && typeof question !== 'string') {
    response.status(400).json({ error: 'Question must be text.' })
    return
  }

  if (typeof includeReversals !== 'boolean') {
    response.status(400).json({ error: 'includeReversals must be boolean.' })
    return
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const readingResult = await client.query<{ id: string; question: string | null }>(
      'INSERT INTO readings (spread_type, question) VALUES ($1, $2) RETURNING id, question',
      [spreadType, question?.trim() || null],
    )
    const reading = readingResult.rows[0]
    if (!reading) throw new Error('The reading was not created.')

    const cardsResult = await client.query<{ id: number; name: string; image_path: string }>(
      'SELECT id, name, image_path FROM cards ORDER BY random() LIMIT 3',
    )

    for (const [index, card] of cardsResult.rows.entries()) {
      await client.query(
        'INSERT INTO reading_cards (reading_id, card_id, position, orientation) VALUES ($1, $2, $3, $4)',
        [
          reading.id,
          card.id,
          index + 1,
          includeReversals && Math.random() < 0.5 ? 'reversed' : 'upright',
        ],
      )
    }

    const result = await client.query(
      `SELECT c.id, c.name, c.image_path AS "imagePath", rc.orientation, rc.position
       FROM reading_cards rc
       JOIN cards c ON c.id = rc.card_id
       WHERE rc.reading_id = $1
       ORDER BY rc.position`,
      [reading.id],
    )
    await client.query('COMMIT')
    client.release()

    response.status(201).json({
      id: reading.id,
      spreadType,
      question: reading.question,
      cards: result.rows.map((card) => ({
        ...card,
        positionLabel: positions[card.position - 1],
      })),
    })
  } catch (error) {
    await rollback(client)
    console.error(error)
    response.status(500).json({ error: 'Could not draw the cards.' })
  }
})

app.post('/api/readings/:readingId/interpret', async (request: Request, response: Response) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    response.status(503).json({ error: 'ANTHROPIC_API_KEY is not configured.' })
    return
  }

  try {
    const result = await pool.query<{
      question: string | null
      position: number
      orientation: 'upright' | 'reversed'
      name: string
      meaning_upright: string
      meaning_reversed: string
      suit: string | null
      number: number | null
      element: string | null
      suit_positive: string[] | null
      suit_negative: string[] | null
      number_associations: string[] | null
      major_positive: string[] | null
      major_negative: string[] | null
      representations: string[] | null
    }>(
      `SELECT r.question, rc.position, rc.orientation, c.name,
              c.meaning_upright, c.meaning_reversed, c.suit, c.number,
              s.element, s.positive_associations AS suit_positive,
              s.negative_associations AS suit_negative,
              n.associations AS number_associations,
              m.positive_associations AS major_positive,
              m.negative_associations AS major_negative,
              m.representations
       FROM readings r
       JOIN reading_cards rc ON rc.reading_id = r.id
       JOIN cards c ON c.id = rc.card_id
       LEFT JOIN suit_correspondences s ON s.suit = c.suit
       LEFT JOIN numerology_correspondences n ON n.number = c.number
       LEFT JOIN major_arcana_correspondences m ON m.card_id = c.id
       WHERE r.id = $1
       ORDER BY rc.position`,
      [request.params.readingId],
    )

    if (result.rows.length !== 3) {
      response.status(404).json({ error: 'Reading not found.' })
      return
    }

    const firstRow = result.rows[0]
    const databaseContext = result.rows.map((card) => ({
      position: positions[card.position - 1],
      card: card.name,
      orientation: card.orientation,
      meaning: card.orientation === 'upright' ? card.meaning_upright : card.meaning_reversed,
      suit: card.suit,
      number: card.number,
      element: card.element,
      suitAssociations: [...(card.suit_positive ?? []), ...(card.suit_negative ?? [])],
      numerology: card.number_associations ?? [],
      majorArcanaAssociations: [
        ...(card.major_positive ?? []),
        ...(card.major_negative ?? []),
        ...(card.representations ?? []),
      ],
    }))

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-5',
      max_tokens: 700,
      system: 'You are a tarot interpreter. Use only the supplied database context. Do not use general tarot knowledge or invent meanings, correspondences, or facts. Synthesize the supplied meanings into a grounded, reflective reading. Clearly distinguish the three positions. Do not claim certainty or predict guaranteed events.',
      messages: [{
        role: 'user',
        content: JSON.stringify({ question: firstRow?.question ?? null, cards: databaseContext }),
      }],
    })
    const interpretation = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    await pool.query('UPDATE readings SET interpretation = $1 WHERE id = $2', [interpretation, request.params.readingId])
    response.json({ interpretation })
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Could not generate the interpretation.' })
  }
})

app.listen(port, () => {
  console.log(`Tarot API listening on http://localhost:${port}`)
})
