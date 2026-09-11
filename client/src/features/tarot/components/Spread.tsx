import ReadingPanel from '../../../components/ReadingPanel';
import type { Reading } from '../types';
import TarotCard from './TarotCard';

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
  const { spreadLabel, cards } = reading;

  return (
    <ReadingPanel
      sectionClassName="reading-column spread-section"
      headingClassName="spread-heading"
      titleId="spread-title"
      title={spreadLabel}
      onAnalyze={onGenerateInterpretation}
      isAnalyzing={isInterpreting}
      buttonText="Generate interpretation"
      loadingButtonText="Consulting the record..."
    >
      <div className="cards-grid">
        {cards.map((card) => (
          <TarotCard card={card} includeReversals={includeReversals} key={card.id} />
        ))}
      </div>
    </ReadingPanel>
  );
}

export default Spread;
