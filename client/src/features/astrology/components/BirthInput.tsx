import type { Place } from '../lib/geocode';
import DateInput from './DateInput';
import PlaceSearch from './PlaceSearch';

type BirthInputProps = {
  birthMoment: string;
  onBirthMomentChange: (value: string) => void;
  place: Place | null;
  onPlaceChange: (value: Place | null) => void;
};

function BirthInput({ birthMoment, onBirthMomentChange, place, onPlaceChange }: BirthInputProps) {
  return (
    <>
      <DateInput
        date={birthMoment}
        label="Birth date"
        onDateChange={onBirthMomentChange}
      />

      <PlaceSearch value={place} onChange={onPlaceChange} />
    </>
  );
};

export default BirthInput;
