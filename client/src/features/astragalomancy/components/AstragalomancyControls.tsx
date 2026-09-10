import ControlsSection from '../../../components/ControlsSection';
import QuestionInput from '../../../components/QuestionInput';
import type { AstragalomancyMode } from '../types';

type AstragalomancyControlsProps = {
  mode: AstragalomancyMode;
  question: string;
  isRolling: boolean;
  onModeChange: (mode: AstragalomancyMode) => void;
  onQuestionChange: (value: string) => void;
  onRoll: () => void;
};

const MODES: { value: AstragalomancyMode; label: string }[] = [
  { value: 'zodiac', label: 'Zodiac dice' },
  { value: 'standard', label: 'Standard dice' },
];

/** Dice-set radio (Zodiac by default), the optional question, and the roll button. */
function AstragalomancyControls({
  mode,
  question,
  isRolling,
  onModeChange,
  onQuestionChange,
  onRoll,
}: AstragalomancyControlsProps) {
  return (
    <ControlsSection
      sectionClassName="reading-controls"
      gridClassName="astragalomancy-controls-grid"
      ariaLabel="Dice controls"
      onSubmit={onRoll}
      isSubmitting={isRolling}
      submitText="Roll the dice"
      submittingText="Rolling..."
    >
      <fieldset className="dice-mode">
        <legend>Dice</legend>
        {MODES.map(({ label, value }) => (
          <label key={value} className="dice-mode-option">
            <input
              type="radio"
              name="dice-mode"
              value={value}
              checked={mode === value}
              onChange={() => onModeChange(value)}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <QuestionInput question={question} onQuestionChange={onQuestionChange} />
    </ControlsSection>
  );
}

export default AstragalomancyControls;
