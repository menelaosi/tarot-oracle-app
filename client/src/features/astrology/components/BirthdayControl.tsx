import ControlsSection from '../../../components/ControlsSection';
import type { Place } from '../lib/geocode';
import PlaceSearch from './PlaceSearch';

type BirthdayControlProps = {
  birthMoment: string;
  place: Place | null;
  onBirthMomentChange: (value: string) => void;
  onPlaceChange: (value: Place | null) => void;
  onCast: () => void;
};

/**
 * Birth date/time input + place autocomplete. `isSubmitting` is always false —
 * casting the chart is synchronous, so there's nothing to wait on.
 */
function BirthdayControl({
  birthMoment,
  place,
  onBirthMomentChange,
  onPlaceChange,
  onCast,
}: BirthdayControlProps) {
  return (
    <ControlsSection
      sectionClassName="birth-form"
      gridClassName="birth-grid"
      ariaLabel="Birth details"
      onSubmit={onCast}
      isSubmitting={false}
      submitText="Cast chart"
    >
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
    </ControlsSection>
  );
}

export default BirthdayControl;
