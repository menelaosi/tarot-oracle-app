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
    <section className="reading-controls" aria-labelledby="reading-controls-title">
      <div className="control-grid">
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
        <button className="primary-action" type="button" onClick={onDraw} disabled={isDrawing}>
          {isDrawing ? 'Drawing...' : 'Draw cards'}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  );
}

export default ReadingControls;
