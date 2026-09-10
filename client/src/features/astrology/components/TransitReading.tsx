import type { Horoscope } from 'circular-natal-horoscope-js';
import ReadingPanel from '../../../components/ReadingPanel';
import type { TransitContact } from '../lib/transits';
import AstrologyChart from './AstrologyChart';

type TransitReadingProps = {
  /** The natal chart the transits are read against. */
  natal: Horoscope;
  /** Today's sky, drawn as the outer ring. */
  transitNow: Horoscope;
  /** Ranked transit→natal contacts, most significant first. */
  contacts: readonly TransitContact[];
  /** Day being read, as a YYYY-MM-DD string. */
  day: string;
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
  transitNow,
  contacts,
  day,
  isAnalyzing,
  onAnalyze,
}: TransitReadingProps) {
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
      <AstrologyChart horoscope={natal} transit={{ horoscope: transitNow, contacts }} />
    </ReadingPanel>
  );
}

export default TransitReading;
