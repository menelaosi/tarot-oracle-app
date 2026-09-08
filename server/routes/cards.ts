import { Router } from 'express';
import { pool } from '../db/pool.js';
import { selectCardDetails, toCardDetails, type CardDetailsRow } from '../db/queries/cards.js';
import { HttpError, toHttpError } from '../lib/http-error.js';

const router = Router();

// GET /api/cards/:cardId — one card with its extended correspondences, loaded
// on demand when a drawn card is hovered/focused in the client.
router.get('/:cardId', async (request, response) => {
  const cardId = Number(request.params.cardId);
  if (!Number.isInteger(cardId)) {
    throw new HttpError(400, 'Card ID must be an integer.');
  }

  let result;
  try {
    result = await pool.query<CardDetailsRow>(selectCardDetails, [cardId]);
  } catch (error) {
    throw toHttpError(error, 'Could not load card details.');
  }

  const card = result.rows[0];
  if (!card) {
    throw new HttpError(404, 'Card not found.');
  }

  response.json(toCardDetails(card));
});

export default router;
