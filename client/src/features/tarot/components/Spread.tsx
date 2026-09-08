import ReadingPanel from '../../../components/ReadingPanel';
import TarotCard from './TarotCard';
import type { Reading } from '../types';

type SpreadProps = {
  reading: Reading;
  includeReversals: boolean;
  isInterpreting: boolean;
  onGenerateInterpretation: () => void;
};

/** The drawn cards plus the interpret action, in the shared ReadingPanel shell. */
function Spread({
  reading,
  includeReversals = false,
  isInterpreting,
  onGenerateInterpretation,
}: SpreadProps) {
  return (
    <ReadingPanel
      sectionClassName="spread-section"
      headingClassName="spread-heading"
      titleId="spread-title"
      title={reading.spreadLabel}
      onAnalyze={onGenerateInterpretation}
      isAnalyzing={isInterpreting}
      buttonText="Generate interpretation"
      loadingButtonText="Consulting the record..."
    >
      <div className="cards-grid">
        {reading.cards.map((card) => (
          <TarotCard card={card} includeReversals={includeReversals} key={card.id} />
        ))}
      </div>
    </ReadingPanel>
  );
}

export default Spread;
