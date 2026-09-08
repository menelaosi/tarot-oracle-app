import type { Horoscope } from 'circular-natal-horoscope-js';
import { useState } from 'react';
import Interpretation from '../../components/Interpretation';
import { useRetainedState } from '../../hooks/useRetainedState';
import './astrology.css';
import AstrologyReading from './components/AstrologyReading';
import BirthdayControl from './components/BirthdayControl';
import { buildChartSummary } from './lib/chartSummary';
import type { Place } from './lib/geocode';
import { getHoroscope } from './lib/horoscope';

function AstrologyView() {
  // Retained across tab switches so the cast chart and its analysis are still
  // here when you come back.
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
      setError(chartError instanceof Error ? chartError.message : 'Could not build the chart.');
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

      const response = await fetch('/api/astrology/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'The analysis could not be generated.');
      }

      const payload = (await response.json()) as { interpretation: string };
      setInterpretation(payload.interpretation);
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'Something went wrong.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <section className="astrology-section" aria-labelledby="astrology-title">
      <BirthdayControl
        birthMoment={birthMoment}
        place={place}
        onBirthMomentChange={setBirthMoment}
        onPlaceChange={setPlace}
        onCast={castChart}
      />

      <div className="workspace">
        <div className="workspace-left">
          {horoscope && (
            <AstrologyReading
              horoscope={horoscope}
              isAnalyzing={isAnalyzing}
              onAnalyze={analyzeChart}
            />
          )}
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="workspace-right">
          {interpretation && <Interpretation title="What the chart says" text={interpretation} />}
        </div>
      </div>
    </section>
  );
}

export default AstrologyView;
