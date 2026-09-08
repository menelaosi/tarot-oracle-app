import type { Horoscope } from 'circular-natal-horoscope-js';
import AstrologyChart from './AstrologyChart';

type AstrologyReadingProps = {
  horoscope: Horoscope;
  isAnalyzing: boolean;
  onAnalyze: () => void;
};

/** The cast chart plus the button that sends it to Claude for analysis. */
function AstrologyReading({ horoscope, isAnalyzing, onAnalyze }: AstrologyReadingProps) {
  return (
    <section className="astrology-reading" aria-label="Chart">
      <div className="astrology-reading-heading">
        <button
          className="secondary-action"
          type="button"
          onClick={onAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze chart'}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <AstrologyChart horoscope={horoscope} />
    </section>
  );
}

export default AstrologyReading;
