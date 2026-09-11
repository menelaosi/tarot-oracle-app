import type { Dispatch, SetStateAction } from 'react';
import type { Place } from '../features/astrology/lib/geocode';
import { useRetainedState } from './useRetainedState';

type BirthChart = {
  birthMoment: string;
  setBirthMoment: Dispatch<SetStateAction<string>>;
  place: Place | null;
  setPlace: Dispatch<SetStateAction<Place | null>>;
};

/**
 * The birth inputs, shared across the Astrology and Transits tabs. Backed by the
 * retained-state store under stable `astrology:*` keys, so entering birth details
 * on one tab carries over to the other and survives a reload. Each tab casts its
 * own `Horoscope` from these inputs — the chart object is derived, never stored.
 */
export function useBirthChart(): BirthChart {
  const [birthMoment, setBirthMoment] = useRetainedState('astrology:birthMoment', '');
  const [place, setPlace] = useRetainedState<Place | null>('astrology:place', null);

  return { birthMoment, setBirthMoment, place, setPlace };
}
