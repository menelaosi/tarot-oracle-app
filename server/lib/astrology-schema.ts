// The two payloads the astrology routes accept, as zod schemas — the single
// source of truth for their shape. The TS types are inferred from these
// (z.infer), and the assert helpers validate a request body, throwing 400 on a
// bad shape. The client builds these payloads in
// client/src/features/astrology/lib/{chartSummary,transitSummary}.ts.

import { z } from 'zod';
import { HttpError } from './http-error.js';

const angleSummary = z.object({
  sign: z.string(),
  degree: z.number(),
});

const placement = z.object({
  body: z.string(),
  sign: z.string(),
  house: z.number().nullable(),
  degree: z.number(),
  degreeInSign: z.number(),
  retrograde: z.boolean(),
});

const aspectSummary = z.object({
  from: z.string(),
  to: z.string(),
  type: z.string(),
  orb: z.number(),
});

const chartSummary = z.object({
  birth: z.object({
    dateTime: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    placeLabel: z.string(),
  }),
  placements: z.array(placement).min(1),
  angles: z.object({
    ascendant: angleSummary,
    midheaven: angleSummary,
    descendant: angleSummary,
    imumCoeli: angleSummary,
  }),
  aspects: z.array(aspectSummary),
});

const transitingPlacement = z.object({
  body: z.string(),
  sign: z.string(),
  degreeInSign: z.number(),
  retrograde: z.boolean(),
  natalHouse: z.number().nullable(),
});

const transitContact = z.object({
  transiting: z.string(),
  natal: z.string(),
  type: z.string(),
  orb: z.number(),
  applying: z.boolean(),
});

const transitSummary = z.object({
  at: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    label: z.string().nullable(),
  }),
  transitingPlacements: z.array(transitingPlacement).min(1),
  contacts: z.array(transitContact),
});

export type AngleSummary = z.infer<typeof angleSummary>;
export type Placement = z.infer<typeof placement>;
export type AspectSummary = z.infer<typeof aspectSummary>;
export type ChartSummary = z.infer<typeof chartSummary>;
export type TransitingPlacement = z.infer<typeof transitingPlacement>;
export type TransitContact = z.infer<typeof transitContact>;
export type TransitSummary = z.infer<typeof transitSummary>;

export function assertChartSummary(value: unknown): asserts value is ChartSummary {
  if (!chartSummary.safeParse(value).success) {
    throw new HttpError(400, 'A valid chart summary is required.');
  }
}

export function assertTransitSummary(value: unknown): asserts value is TransitSummary {
  if (!transitSummary.safeParse(value).success) {
    throw new HttpError(400, 'A valid transit summary is required.');
  }
}
