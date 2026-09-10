import type { Horoscope } from 'circular-natal-horoscope-js';
import { useMemo, useState } from 'react';
import WorkspaceLayout from '../../components/WorkspaceLayout';
import { useBirthChart } from '../../hooks/useBirthChart';
import { useRetainedState } from '../../hooks/useRetainedState';
import { messageFrom } from '../../lib/http';
import { interpretTransits } from './api';
import './astrology.css';
import TransitControl from './components/TransitControl';
import TransitReading from './components/TransitReading';
import { buildChartSummary } from './lib/chartSummary';
import type { Place } from './lib/geocode';
import { requestCurrentLocation, type Coordinates } from './lib/geolocation';
import { getHoroscope } from './lib/horoscope';
import { buildTransitSummary, type TransitFrame } from './lib/transitSummary';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local calendar day as YYYY-MM-DD (what an <input type="date"> expects). */
function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/** Instant to cast for: the current moment if the day is today, else local noon. */
function instantForDay(day: string): Date {
  return day === todayIso() ? new Date() : new Date(`${day}T12:00`);
}

type TransitChart = {
  now: Horoscope;
  next: Horoscope;
  summary: ReturnType<typeof buildTransitSummary>;
  frame: TransitFrame;
};

/**
 * Transits section: the natal chart (shared with the Astrology tab) against a
 * chosen day's sky. The chart is derived straight from the inputs — no cast
 * step — so the tab shows today's bi-wheel as soon as birth details exist. The
 * "Cast transits" button only forces a re-read of the clock / current location.
 */
function TransitView() {
  const { birthMoment, setBirthMoment, place, setPlace } = useBirthChart();
  const [day, setDay] = useRetainedState('transits:day', todayIso());
  const [locationSource, setLocationSource] = useRetainedState<'birth' | 'current'>(
    'transits:locationSource',
    'birth',
  );
  const [currentCoords, setCurrentCoords] = useRetainedState<Coordinates | null>(
    'transits:coords',
    null,
  );
  const [interpretation, setInterpretation] = useRetainedState('transits:interpretation', '');
  const [castNonce, setCastNonce] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');

  const usingCurrent = locationSource === 'current' && currentCoords !== null;
  const locationLabel = usingCurrent ? 'Current location' : (place?.label ?? 'Set a birthplace');

  const location = useMemo<Place | null>(() => {
    if (usingCurrent && currentCoords) {
      return { ...currentCoords, label: 'Current location' };
    }
    return place ?? null;
  }, [usingCurrent, currentCoords, place]);

  const natal = useMemo<Horoscope | null>(() => {
    if (!birthMoment || !place) return null;
    try {
      return getHoroscope(new Date(birthMoment), place);
    } catch {
      return null; // unparseable birth input — the form still shows
    }
  }, [birthMoment, place]);

  const chart = useMemo<TransitChart | null>(() => {
    if (!natal || !location) return null;
    // castNonce is read only to re-run this when the user asks for a fresh cast.
    void castNonce;
    try {
      const at = instantForDay(day);
      const now = getHoroscope(at, location);
      const next = getHoroscope(new Date(at.getTime() + DAY_MS), location);
      const frame: TransitFrame = { at: at.toISOString(), date: day, location };
      const summary = buildTransitSummary(natal, now, next, frame);
      return { now, next, frame, summary };
    } catch {
      return null;
    }
  }, [natal, location, day, castNonce]);

  function castTransits() {
    setError('');
    if (!birthMoment || !place) {
      setError('Enter your birth date, time, and place first.');
      return;
    }
    setCastNonce((nonce) => nonce + 1);
  }

  async function toggleLocation() {
    setError('');
    if (locationSource === 'current') {
      setLocationSource('birth');
      return;
    }
    setIsLocating(true);
    const coords = await requestCurrentLocation();
    setIsLocating(false);
    if (!coords) {
      setError('Could not get your location — still using your birthplace.');
      return;
    }
    setCurrentCoords(coords);
    setLocationSource('current');
  }

  async function analyzeTransits() {
    if (!natal || !chart || !place) return;

    setIsAnalyzing(true);
    setError('');
    try {
      const natalSummary = buildChartSummary(natal, {
        dateTime: birthMoment,
        latitude: place.latitude,
        longitude: place.longitude,
        placeLabel: place.label,
      });
      setInterpretation(await interpretTransits(natalSummary, chart.summary));
    } catch (analysisError) {
      setError(messageFrom(analysisError));
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <WorkspaceLayout
      controls={
        <TransitControl
          birthMoment={birthMoment}
          place={place}
          day={day}
          locationSource={locationSource}
          locationLabel={locationLabel}
          isLocating={isLocating}
          onBirthMomentChange={setBirthMoment}
          onPlaceChange={setPlace}
          onDayChange={setDay}
          onToggleLocation={toggleLocation}
          onCast={castTransits}
        />
      }
      main={
        natal && chart ? (
          <TransitReading
            natal={natal}
            transitNow={chart.now}
            contacts={chart.summary.contacts}
            day={chart.frame.date}
            isAnalyzing={isAnalyzing}
            onAnalyze={analyzeTransits}
          />
        ) : null
      }
      error={error}
      interpretationTitle="What today holds"
      interpretation={interpretation}
    />
  );
}

export default TransitView;
