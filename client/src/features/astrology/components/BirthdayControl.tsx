import type { FormEvent } from 'react';
import type { Place } from '../lib/geocode';
import PlaceSearch from './PlaceSearch';

type BirthdayControlProps = {
  birthMoment: string;
  place: Place | null;
  onBirthMomentChange: (value: string) => void;
  onPlaceChange: (value: Place | null) => void;
  onCast: () => void;
};

function BirthdayControl({
  birthMoment,
  place,
  onBirthMomentChange,
  onPlaceChange,
  onCast,
}: BirthdayControlProps) {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCast();
  }

  return (
    <form className="birth-form" onSubmit={onSubmit}>
      <div className="birth-grid">
        <label>
          <span>Birth date &amp; time</span>
          <input
            type="datetime-local"
            value={birthMoment}
            max="9999-12-31T23:59"
            onChange={(event) => onBirthMomentChange(event.target.value)}
          />
        </label>

        <label>
          <span>Birthplace</span>
          <PlaceSearch value={place} onChange={onPlaceChange} />
        </label>

        <button className="primary-action" type="submit">
          Cast chart
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}

export default BirthdayControl;
