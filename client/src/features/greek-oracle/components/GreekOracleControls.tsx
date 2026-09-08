import ControlsSection from '../../../components/ControlsSection';
import QuestionInput from '../../../components/QuestionInput';

type GreekOracleControlsProps = {
  question: string;
  isDrawing: boolean;
  onQuestionChange: (value: string) => void;
  onDraw: () => void;
};

/** Optional question plus the draw button — the only inputs this oracle needs. */
function GreekOracleControls({
  question,
  isDrawing,
  onQuestionChange,
  onDraw,
}: GreekOracleControlsProps) {
  return (
    <ControlsSection
      sectionClassName="reading-controls"
      gridClassName="greek-controls-grid"
      ariaLabel="Oracle controls"
      onSubmit={onDraw}
      isSubmitting={isDrawing}
      submitText="Draw a letter"
      submittingText="Drawing..."
    >
      <QuestionInput question={question} onQuestionChange={onQuestionChange} />
    </ControlsSection>
  );
}

export default GreekOracleControls;
