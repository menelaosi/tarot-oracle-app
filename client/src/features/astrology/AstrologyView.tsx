import type { Horoscope } from 'circular-natal-horoscope-js';
import { useState } from 'react';
import WorkspaceLayout from '../../components/WorkspaceLayout';
import { useRetainedState } from '../../hooks/useRetainedState';
import { messageFrom } from '../../lib/http';
import './astrology.css';
import { interpretChart } from './api';
import AstrologyReading from './components/AstrologyReading';
import BirthdayControl from './components/BirthdayControl';
import { buildChartSummary } from './lib/chartSummary';
import type { Place } from './lib/geocode';
import { getHoroscope } from './lib/horoscope';

function AstrologyView() {
  const [birthMoment, setBirthMoment] = useRetainedState('astrology:birthMoment', '');
  const [place, setPlace] = useRetainedState<Place | null>('astrology:place', null);
  const [horoscope, setHoroscope] = useRetainedState<Horoscope | null>('astrology:horoscope', null);
  const [interpretation, setInterpretation] = useRetainedState('astrology:interpretation', '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  function castChart() {
    setError('');
    setInterpretation('');

    if (!birthMoment || !place) {
      setError('Enter a birth date, time, and place.');
      return;
    }

    try {
      setHoroscope(
        getHoroscope({
          date: new Date(birthMoment),
          latitude: place.latitude,
          longitude: place.longitude,
        }),
      );
    } catch (chartError) {
      setError(messageFrom(chartError, 'Could not build the chart.'));
    }
  }

  async function analyzeChart() {
    if (!horoscope || !place) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const chart = buildChartSummary(horoscope, {
        dateTime: birthMoment,
        latitude: place.latitude,
        longitude: place.longitude,
        placeLabel: place.label,
      });
      setInterpretation(await interpretChart(chart));
    } catch (analysisError) {
      setError(messageFrom(analysisError));
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
      error={error}
      interpretationTitle="What the chart says"
      interpretation={interpretation}
    />
  );
}

export default AstrologyView;
