import ControlsSection from '../../components/ControlsSection';
import type { SpreadOption } from './types';

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
          {spreadOptions.map((option) => (
            <option value={option.id} key={option.id}>
              {option.label} · {option.positions.length}-card
            </option>
          ))}
        </select>
      </label>
      <label className="question-field">
        <span>
          Question <em>optional</em>
        </span>
        <input
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="What wants your attention?"
          maxLength={500}
        />
      </label>
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
