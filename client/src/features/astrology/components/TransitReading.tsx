import { AstrologyChart, type TransitContact } from '@menelaos/react-natal-chart';
import type { Horoscope } from 'circular-natal-horoscope-js';
import { useMemo } from 'react';
import ReadingPanel from '../../../components/ReadingPanel';

type TransitReadingProps = {
  natal: Horoscope; // The natal chart the transits are read against.
  transitNow: Horoscope; // The sky at `moment`, drawn as the outer ring.
  contacts: readonly TransitContact[]; // Ranked transit→natal contacts, most significant first.
  moment: string; // Moment being read, as a datetime-local string.
  isAnalyzing: boolean;
  onAnalyze: () => void;
};

const MOMENT_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
};

/**
 * "Monday, September 8, 3:00 PM" from a datetime-local string. Formats the raw
 * string's own wall-clock digits (construct + read both default to the current
 * runtime's timezone and so cancel out) rather than an already-converted ISO
 * instant, so this always matches what was actually typed in the moment field,
 * regardless of the viewer's or the transit location's timezone.
 */
function formatMoment(moment: string): string {
  const parsed = new Date(moment);
  return Number.isNaN(parsed.getTime()) ? moment : parsed.toLocaleString(undefined, MOMENT_FORMAT);
}

/** The bi-wheel for a given moment plus the button that sends the transits to Claude. */
function TransitReading({
  natal,
  transitNow: horoscope,
  contacts,
  moment,
  isAnalyzing,
  onAnalyze,
}: TransitReadingProps) {
  // Stable across re-renders that don't touch horoscope/contacts, so AstrologyChart's
  // memo isn't defeated by a fresh object literal on every render (e.g. isAnalyzing).
  const transit = useMemo(() => ({ horoscope, contacts }), [horoscope, contacts]);

  return (
    <ReadingPanel
      sectionClassName="reading-column astrology-reading"
      headingClassName="astrology-reading-heading"
      titleId="transit-reading-title"
      title={`Transits — ${formatMoment(moment)}`}
      onAnalyze={onAnalyze}
      isAnalyzing={isAnalyzing}
      buttonText="Analyze day"
      loadingButtonText="Analyzing..."
    >
      <AstrologyChart horoscope={natal} transit={transit} />
    </ReadingPanel>
  );
}

export default TransitReading;
