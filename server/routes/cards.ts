import { Router } from 'express';
import { selectCardDetails, toCardDetails, type CardDetailsRow } from '../db/queries/cards.js';
import { loadRow } from '../lib/db.js';
import { badRequest } from '../lib/http-error.js';

const router = Router();

// GET /api/cards/:cardId — one card with its extended correspondences, loaded
// on demand when a drawn card is hovered/focused in the client.
router.get('/:cardId', async ({ params }, response) => {
  const cardId = Number(params.cardId);
  if (!Number.isInteger(cardId)) throw badRequest('Card ID must be an integer.');

  const card = await loadRow<CardDetailsRow>(selectCardDetails, [cardId], 'Card not found.');
  response.json(toCardDetails(card));
});

export default router;
