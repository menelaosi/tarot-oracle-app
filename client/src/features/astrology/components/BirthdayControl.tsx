import { useState, type FormEvent } from 'react';
import type { Horoscope } from 'circular-natal-horoscope-js';
import type { Place } from '../lib/geocode';
import { getHoroscope } from '../lib/horoscope';
import AstrologyChart from './AstrologyChart';
import PlaceSearch from './PlaceSearch';

function BirthdayControl() {
  const [birthMoment, setBirthMoment] = useState('');
  const [place, setPlace] = useState<Place | null>(null);
  const [horoscope, setHoroscope] = useState<Horoscope | null>(null);
  const [error, setError] = useState('');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

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

  return (
    <>
      <form className="birth-form" onSubmit={onSubmit}>
        <div className="birth-grid">
          <label>
            <span>Birth date &amp; time</span>
            <input
              type="datetime-local"
              value={birthMoment}
              max="9999-12-31T23:59"
              onChange={(event) => setBirthMoment(event.target.value)}
            />
          </label>

          <label>
            <span>Birthplace</span>
            <PlaceSearch value={place} onChange={setPlace} />
          </label>

          <button className="primary-action" type="submit">
            Cast chart
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {horoscope && <AstrologyChart horoscope={horoscope} />}
    </>
  );
}

export default BirthdayControl;
