import type { Horoscope } from 'circular-natal-horoscope-js';
import { useMemo } from 'react';
import ReadingPanel from '../../../components/ReadingPanel';
import type { TransitContact } from '../lib/transits';
import AstrologyChart from './AstrologyChart';

type TransitReadingProps = {
  natal: Horoscope; // The natal chart the transits are read against.
  transitNow: Horoscope; // Today's sky, drawn as the outer ring.
  contacts: readonly TransitContact[]; // Ranked transit→natal contacts, most significant first.
  day: string; // Day being read, as a YYYY-MM-DD string.
  isAnalyzing: boolean;
  onAnalyze: () => void;
};

const DAY_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};

/** "Monday, September 8" from a YYYY-MM-DD string, in the user's locale. */
function formatDay(day: string): string {
  const parsed = new Date(`${day}T12:00`);
  return Number.isNaN(parsed.getTime()) ? day : parsed.toLocaleDateString(undefined, DAY_FORMAT);
}

/** The bi-wheel for a given day plus the button that sends the transits to Claude. */
function TransitReading({
  natal,
  transitNow: horoscope,
  contacts,
  day,
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
      title={`Transits — ${formatDay(day)}`}
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
