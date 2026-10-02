import ButtonComponent from '../../../components/ButtonComponent';
import ControlsSection from '../../../components/ControlsSection';
import type { Place } from '../lib/geocode';
import BirthInput from './BirthInput';
import DateInput from './DateInput';

type TransitControlProps = {
  birthMoment: string;
  place: Place | null;
  moment: string; // Moment to read transits for, as a datetime-local string.
  locationSource: 'birth' | 'current'; // Which coordinates the transit chart uses.
  locationLabel: string; // Label for the location currently in effect.
  isLocating: boolean;
  onBirthMomentChange: (value: string) => void;
  onPlaceChange: (value: Place | null) => void;
  onMomentChange: (value: string) => void;
  onToggleLocation: () => void; // Switch between birthplace and the browser's current location.
  onCast: () => void;
};

/**
 * Birth details (shared with the Astrology tab) plus the two transit-only
 * inputs: which moment to read, and whether to anchor the sky to the birthplace
 * or to where the user is right now.
 */
function TransitControl({
  birthMoment,
  place,
  moment,
  locationSource,
  locationLabel,
  isLocating,
  onBirthMomentChange,
  onPlaceChange,
  onMomentChange,
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

      <DateInput
        date={moment}
        label="Transit"
        type="datetime-local"
        onDateChange={onMomentChange}
      />

      <label>
        <span>Transit location</span>
        <div className="transit-location">
          <span className="transit-location-name">{locationLabel}</span>
          <ButtonComponent
            className="link-button"
            onClick={onToggleLocation}
            buttonText={`Use ${locationSource === 'current' ? 'birthplace' : 'my location'}`}
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
