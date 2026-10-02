import {
  buildChartSummary,
  buildTransitSummary,
  getHoroscope,
  type TransitFrame,
} from '@menelaos/react-natal-chart';
import type { Horoscope } from 'circular-natal-horoscope-js';
import { useMemo, useState } from 'react';
import WorkspaceLayout from '../../components/WorkspaceLayout';
import { useBirthChart } from '../../hooks/useBirthChart';
import { useError } from '../../hooks/useError';
import { useRetainedState } from '../../hooks/useRetainedState';
import { interpretTransits } from './api';
import './astrology.css';
import TransitControl from './components/TransitControl';
import TransitReading from './components/TransitReading';
import { dateFromDateTimeLocal } from './lib/dateTimeLocal';
import type { Place } from './lib/geocode';
import { requestCurrentLocation, type Coordinates } from './lib/geolocation';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Now, as a datetime-local value (YYYY-MM-DDTHH:mm) — the default moment, and what "Cast transits" resets to. */
function nowAsDateTimeLocal(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

type TransitChart = {
  now: Horoscope;
  next: Horoscope;
  summary: ReturnType<typeof buildTransitSummary>;
  frame: TransitFrame;
};

/**
 * Transits section: the natal chart (shared with the Astrology tab) against the
 * sky at a chosen moment. The chart is derived straight from the inputs — no
 * cast step — so the tab shows the current moment's bi-wheel as soon as birth
 * details exist. The "Cast transits" button just jumps the moment back to now.
 */
function TransitView() {
  const { birthMoment, setBirthMoment, place, setPlace } = useBirthChart();
  const [transitMoment, setTransitMoment] = useRetainedState(
    'transits:moment',
    nowAsDateTimeLocal(),
  );
  const [locationSource, setLocationSource] = useRetainedState<'birth' | 'current'>(
    'transits:locationSource',
    'birth',
  );
  const [currentCoords, setCurrentCoords] = useRetainedState<Coordinates | null>(
    'transits:coords',
    null,
  );
  const [interpretation, setInterpretation] = useRetainedState('transits:interpretation', '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { error, setError, clearError, failWith } = useError();

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
      return getHoroscope(dateFromDateTimeLocal(birthMoment), place);
    } catch {
      return null; // unparseable birth input — the form still shows
    }
  }, [birthMoment, place]);

  // react-hooks/preserve-manual-memoization: the experimental React Compiler
  // can't verify this memo, for a reason we couldn't pin down (bisected in
  // isolation — merely removing an unrelated, truly-unused piece of local
  // state elsewhere in this component makes an otherwise-identical memo fail
  // the same way). This is a missed-optimization warning only, not a
  // correctness issue: the useMemo below is valid, ordinary React and runs
  // exactly as written whether or not the compiler can also auto-optimize it.
  const { summary, frame, now } =
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    useMemo<TransitChart | null>(() => {
      if (!natal || !location) return null;
      try {
        const at = dateFromDateTimeLocal(transitMoment);
        const now = getHoroscope(at, location);
        const next = getHoroscope(new Date(at.getTime() + DAY_MS), location);
        const frame: TransitFrame = {
          at: at.toISOString(),
          date: transitMoment.slice(0, 10),
          location,
        };
        const summary = buildTransitSummary(natal, now, next, frame);
        return { now, next, frame, summary };
      } catch {
        return null;
      }
    }, [natal, location, transitMoment]) ?? {};
  // frame isn't read directly (TransitReading is given transitMoment itself to
  // format) — destructured anyway so react-hooks/exhaustive-deps doesn't flag it.
  void frame;

  function castTransits() {
    clearError();
    if (!birthMoment || !place) {
      setError('Enter your birth date, time, and place first.');
      return;
    }
    setTransitMoment(nowAsDateTimeLocal());
  }

  async function toggleLocation() {
    clearError();
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
    if (!natal || !now || !summary || !place) return;

    setIsAnalyzing(true);
    clearError();
    try {
      const natalSummary = buildChartSummary(natal, birthMoment, place);
      setInterpretation(await interpretTransits(natalSummary, summary));
    } catch (analysisError) {
      failWith(analysisError);
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
          moment={transitMoment}
          locationSource={locationSource}
          locationLabel={locationLabel}
          isLocating={isLocating}
          onBirthMomentChange={setBirthMoment}
          onPlaceChange={setPlace}
          onMomentChange={setTransitMoment}
          onToggleLocation={toggleLocation}
          onCast={castTransits}
        />
      }
      main={
        natal && now && summary ? (
          <TransitReading
            natal={natal}
            transitNow={now}
            contacts={summary.contacts}
            moment={transitMoment}
            isAnalyzing={isAnalyzing}
            onAnalyze={analyzeTransits}
          />
        ) : null
      }
      error={error}
      onDismissError={clearError}
      pending={isAnalyzing}
      interpretationTitle="What today holds"
      interpretation={interpretation}
    />
  );
}

export default TransitView;
