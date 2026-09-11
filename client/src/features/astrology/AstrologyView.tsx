import type { Horoscope } from 'circular-natal-horoscope-js';
import { useMemo, useState } from 'react';
import WorkspaceLayout from '../../components/WorkspaceLayout';
import { useBirthChart } from '../../hooks/useBirthChart';
import { useError } from '../../hooks/useError';
import { useRetainedState } from '../../hooks/useRetainedState';
import { messageFrom } from '../../lib/http';
import { interpretChart } from './api';
import './astrology.css';
import AstrologyReading from './components/AstrologyReading';
import BirthdayControl from './components/BirthdayControl';
import { buildChartSummary } from './lib/chartSummary';
import { getHoroscope } from './lib/horoscope';

type HoroscopeMemo = {
  horoscope: Horoscope | null;
  error: string;
};

/** Astrology section: birth form, the cast chart, and Claude's analysis. */
function AstrologyView() {
  const { birthMoment, setBirthMoment, place, setPlace } = useBirthChart();
  // The chart is derived from the birth inputs, not stored — but casting is an
  // explicit step, so a retained flag remembers that the user asked for it and
  // the wheel comes straight back on reload.
  const [hasCast, setHasCast] = useRetainedState('astrology:hasCast', false);
  const [interpretation, setInterpretation] = useRetainedState('astrology:interpretation', '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { error, setError, clearError, failWith } = useError();

  const { horoscope, error: castError } = useMemo<HoroscopeMemo>(() => {
    if (!hasCast || !birthMoment || !place) {
      return { horoscope: null, error: '' };
    }
    try {
      return {
        horoscope: getHoroscope(new Date(birthMoment), place),
        error: '',
      };
    } catch (chartError) {
      return {
        horoscope: null,
        error: messageFrom(chartError, 'Could not build the chart.'),
      };
    }
  }, [hasCast, birthMoment, place]);

  function castChart() {
    clearError();
    setInterpretation('');

    if (!birthMoment || !place) {
      setError('Enter a birth date, time, and place.');
      return;
    }

    setHasCast(true);
  }

  async function analyzeChart() {
    if (!horoscope || !place) return;

    setIsAnalyzing(true);
    clearError();

    try {
      const chart = buildChartSummary(horoscope, birthMoment, place);
      setInterpretation(await interpretChart(chart));
    } catch (analysisError) {
      failWith(analysisError);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <WorkspaceLayout
      controls={
        <BirthdayControl
          birthMoment={birthMoment}
          place={place}
          onBirthMomentChange={setBirthMoment}
          onPlaceChange={setPlace}
          onCast={castChart}
        />
      }
      main={
        horoscope ? (
          <AstrologyReading
            horoscope={horoscope}
            isAnalyzing={isAnalyzing}
            onAnalyze={analyzeChart}
          />
        ) : null
      }
      error={error || castError}
      onDismissError={clearError}
      pending={isAnalyzing}
      interpretationTitle="What the chart says"
      interpretation={interpretation}
    />
  );
}

export default AstrologyView;
