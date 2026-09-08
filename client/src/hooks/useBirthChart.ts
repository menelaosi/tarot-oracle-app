import type { Horoscope } from 'circular-natal-horoscope-js';
import type { Dispatch, SetStateAction } from 'react';
import type { Place } from '../features/astrology/lib/geocode';
import { useRetainedState } from './useRetainedState';

export type BirthChart = {
  birthMoment: string;
  setBirthMoment: Dispatch<SetStateAction<string>>;
  place: Place | null;
  setPlace: Dispatch<SetStateAction<Place | null>>;
  /** The cast natal chart, or null until birth details produce one. */
  horoscope: Horoscope | null;
  setHoroscope: Dispatch<SetStateAction<Horoscope | null>>;
};

/**
 * The natal chart, shared across the Astrology and Transits tabs. Backed by the
 * retained-state cache under stable `astrology:*` keys, so entering birth details
 * on one tab (or casting there) carries straight over to the other for the life
 * of the session.
 */
export function useBirthChart(): BirthChart {
  const [birthMoment, setBirthMoment] = useRetainedState('astrology:birthMoment', '');
  const [place, setPlace] = useRetainedState<Place | null>('astrology:place', null);
  const [horoscope, setHoroscope] = useRetainedState<Horoscope | null>('astrology:horoscope', null);

  return { birthMoment, setBirthMoment, place, setPlace, horoscope, setHoroscope };
}
