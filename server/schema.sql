CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    arcana TEXT NOT NULL CHECK (arcana IN ('major', 'minor')),
    suit TEXT,
    number INTEGER,
    image_path TEXT NOT NULL UNIQUE,
    meaning_upright TEXT NOT NULL,
    meaning_reversed TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        (arcana = 'major' AND suit IS NULL AND number IS NULL)
        OR
        (arcana = 'minor' AND suit IS NOT NULL AND number IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spread_type TEXT NOT NULL,
    question TEXT,
    interpretation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spread types are defined in server/spreads.ts, not constrained here, so new
-- spreads can be added without a migration. Drop the old allow-list if present.
ALTER TABLE readings DROP CONSTRAINT IF EXISTS readings_spread_type_check;

CREATE TABLE IF NOT EXISTS reading_cards (
    id SERIAL PRIMARY KEY,
    reading_id UUID NOT NULL REFERENCES readings(id) ON DELETE CASCADE,
    card_id INTEGER NOT NULL REFERENCES cards(id),
    position INTEGER NOT NULL CHECK (position >= 1),
    orientation TEXT NOT NULL CHECK (orientation IN ('upright', 'reversed')),

    UNIQUE (reading_id, position),
    UNIQUE (reading_id, card_id)
);

-- Widen the old "position BETWEEN 1 AND 3" bound for spreads with more cards.
ALTER TABLE reading_cards DROP CONSTRAINT IF EXISTS reading_cards_position_check;
ALTER TABLE reading_cards ADD CONSTRAINT reading_cards_position_check CHECK (position >= 1);

CREATE TABLE IF NOT EXISTS suit_correspondences (
    suit TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    element TEXT NOT NULL,
    polarity TEXT NOT NULL,
    planets TEXT[] NOT NULL DEFAULT '{}',
    signs TEXT[] NOT NULL DEFAULT '{}',
    positive_associations TEXT[] NOT NULL DEFAULT '{}',
    negative_associations TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS numerology_correspondences (
    number INTEGER PRIMARY KEY CHECK (number BETWEEN 1 AND 10),
    associations TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS court_rank_correspondences (
    rank TEXT PRIMARY KEY CHECK (rank IN ('page', 'knight', 'queen', 'king')),
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS court_suit_correspondences (
    rank TEXT NOT NULL REFERENCES court_rank_correspondences(rank) ON DELETE CASCADE,
    suit TEXT NOT NULL REFERENCES suit_correspondences(suit) ON DELETE CASCADE,
    orientation TEXT NOT NULL CHECK (orientation IN ('positive', 'negative')),
    associations TEXT[] NOT NULL DEFAULT '{}',
    PRIMARY KEY (rank, suit, orientation)
);

CREATE TABLE IF NOT EXISTS major_arcana_correspondences (
    card_id INTEGER PRIMARY KEY REFERENCES cards(id) ON DELETE CASCADE,
    element TEXT,
    planets TEXT[] NOT NULL DEFAULT '{}',
    signs TEXT[] NOT NULL DEFAULT '{}',
    representations TEXT[] NOT NULL DEFAULT '{}',
    positive_associations TEXT[] NOT NULL DEFAULT '{}',
    negative_associations TEXT[] NOT NULL DEFAULT '{}',
    notes TEXT
);

ALTER TABLE major_arcana_correspondences
    ADD COLUMN IF NOT EXISTS representations TEXT[] NOT NULL DEFAULT '{}';

COMMIT;