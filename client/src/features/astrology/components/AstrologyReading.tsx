import {
  AstrologyChart,
  Planet,
  SIGN_EMOJI,
  getCelestialBody,
  type ZodiacSign,
} from '@menelaos/react-natal-chart';
import type { Horoscope } from 'circular-natal-horoscope-js';
import ReadingPanel from '../../../components/ReadingPanel';

type AstrologyReadingProps = {
  horoscope: Horoscope;
  isAnalyzing: boolean;
  onAnalyze: () => void;
};

/** "Aquarius" -> "Aquarius ♒"; passes through anything not a known sign. */
function withEmoji(sign: string | undefined): string | undefined {
  if (!sign) return undefined;
  const emoji = SIGN_EMOJI[sign as ZodiacSign];
  return `${sign}${emoji ? ` ${emoji}` : ''}`;
}

/** "Sun in Aquarius ♒, Moon in Gemini ♊, Libra ♎ rising", or a plain fallback. */
function getTitle(horoscope: Horoscope): string {
  const sun = withEmoji(horoscope.SunSign?.label);
  const moon = withEmoji(getCelestialBody(horoscope, Planet.Moon)?.Sign?.label);
  const ascendant = withEmoji(horoscope.Ascendant?.Sign?.label);

  return sun && moon && ascendant
    ? `Sun in ${sun}, Moon in ${moon}, ${ascendant} rising`
    : 'Birth chart';
}

/** The cast chart, a one-line summary of it, and the button that sends it to Claude. */
function AstrologyReading({ horoscope, isAnalyzing, onAnalyze }: AstrologyReadingProps) {
  return (
    <ReadingPanel
      sectionClassName="reading-column astrology-reading"
      headingClassName="astrology-reading-heading"
      titleId="astrology-reading-title"
      title={getTitle(horoscope)}
      onAnalyze={onAnalyze}
      isAnalyzing={isAnalyzing}
      buttonText="Analyze chart"
      loadingButtonText="Analyzing..."
    >
      <AstrologyChart horoscope={horoscope} />
    </ReadingPanel>
  );
}

export default AstrologyReading;
