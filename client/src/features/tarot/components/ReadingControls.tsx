import ControlsSection from '../../../components/ControlsSection';
import QuestionInput from '../../../components/QuestionInput';
import type { SpreadOption } from '../types';

type ReadingControlsProps = {
  spreadType: string;
  question: string;
  includeReversals: boolean;
  spreadOptions: SpreadOption[];
  isDrawing: boolean;
  onSpreadTypeChange: (value: string) => void;
  onQuestionChange: (value: string) => void;
  onIncludeReversalsChange: (value: boolean) => void;
  onDraw: () => void;
};

/** Spread picker, optional question, reversals toggle, and the draw button. */
function ReadingControls({
  spreadType,
  question,
  includeReversals,
  spreadOptions,
  isDrawing,
  onSpreadTypeChange,
  onQuestionChange,
  onIncludeReversalsChange,
  onDraw,
}: ReadingControlsProps) {
  return (
    <ControlsSection
      sectionClassName="reading-controls"
      gridClassName="control-grid"
      ariaLabel="Reading controls"
      onSubmit={onDraw}
      isSubmitting={isDrawing}
      submitText="Draw cards"
      submittingText="Drawing..."
    >
      <label>
        <span>Spread type</span>
        <select
          value={spreadType}
          onChange={(event) => onSpreadTypeChange(event.target.value)}
          disabled={spreadOptions.length === 0}
        >
          {spreadOptions.map(({ id, label, positions }) => (
            <option value={id} key={id}>
              {label} · {positions.length}-card
            </option>
          ))}
        </select>
      </label>
      <QuestionInput question={question} onQuestionChange={onQuestionChange} />
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={includeReversals}
          onChange={(event) => onIncludeReversalsChange(event.target.checked)}
        />
        <span>Include reversals</span>
      </label>
    </ControlsSection>
  );
}

export default ReadingControls;
