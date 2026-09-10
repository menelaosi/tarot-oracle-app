import ButtonComponent from '../../../components/ButtonComponent';
import ControlsSection from '../../../components/ControlsSection';
import type { Place } from '../lib/geocode';
import BirthInput from './BirthInput';
import DateInput from './DateInput';

type TransitControlProps = {
  birthMoment: string;
  place: Place | null;
  /** Day to read transits for, as a YYYY-MM-DD string. */
  day: string;
  /** Which coordinates the transit chart uses. */
  locationSource: 'birth' | 'current';
  /** Label for the location currently in effect. */
  locationLabel: string;
  isLocating: boolean;
  onBirthMomentChange: (value: string) => void;
  onPlaceChange: (value: Place | null) => void;
  onDayChange: (value: string) => void;
  /** Switch between birthplace and the browser's current location. */
  onToggleLocation: () => void;
  onCast: () => void;
};

/**
 * Birth details (shared with the Astrology tab) plus the two transit-only
 * inputs: which day to read, and whether to anchor the sky to the birthplace or
 * to where the user is right now.
 */
function TransitControl({
  birthMoment,
  place,
  day,
  locationSource,
  locationLabel,
  isLocating,
  onBirthMomentChange,
  onPlaceChange,
  onDayChange,
  onToggleLocation,
  onCast,
}: TransitControlProps) {
  return (
    <ControlsSection
      sectionClassName="birth-form"
      gridClassName="transit-grid"
      ariaLabel="Transit details"
      onSubmit={onCast}
      isSubmitting={false}
      submitText="Cast transits"
    >
      <BirthInput
        birthMoment={birthMoment}
        onBirthMomentChange={onBirthMomentChange}
        place={place}
        onPlaceChange={onPlaceChange}
      />

      <DateInput date={day} label="Day" onDateChange={onDayChange} />

      <label>
        <span>Transit location</span>
        <div className="transit-location">
          <span className="transit-location-name">{locationLabel}</span>
          <ButtonComponent
            className="link-button"
            onClick={onToggleLocation}
            buttonText={locationSource === 'current' ? 'Use birthplace' : 'Use my location'}
            loadingButtonText="Locating..."
            isLoading={isLocating}
            showIcon={false}
          />
        </div>
      </label>
    </ControlsSection>
  );
}

export default TransitControl;
