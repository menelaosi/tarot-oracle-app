import ControlsSection from '../../../components/ControlsSection';
import type { Place } from '../lib/geocode';
import BirthInput from './BirthInput';

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
      <BirthInput
        birthMoment={birthMoment}
        onBirthMomentChange={onBirthMomentChange}
        place={place}
        onPlaceChange={onPlaceChange}
      />
    </ControlsSection>
  );
}

export default BirthdayControl;
