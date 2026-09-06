import type { Reading } from '../types';
import TarotCard from './TarotCard';

type SpreadProps = {
  reading: Reading
  isInterpreting: boolean
  onGenerateInterpretation: () => void
  onShowSampleInterpretation: () => void
};

function Spread({
  reading,
  isInterpreting,
  onGenerateInterpretation,
  onShowSampleInterpretation,
}: SpreadProps) {
  return (
    <section className="spread-section" aria-labelledby="spread-title">
      <div className="section-heading spread-heading">
        <div>
          <p className="eyebrow">02 / The spread</p>
          <h2 id="spread-title">Past · Present · Future</h2>
        </div>
        <span className="reading-id">Reading {reading.id.slice(0, 8)}</span>
      </div>
      <div className="cards-grid">
        {reading.cards.map((card) => <TarotCard card={card} key={card.id} />)}
      </div>
      <div className="interpretation-actions">
        <button
          className="secondary-action"
          type="button"
          onClick={onGenerateInterpretation}
          disabled={isInterpreting}
        >
          {isInterpreting ? 'Consulting the record...' : 'Generate interpretation'}
          <span aria-hidden="true">✦</span>
        </button>
        <button className="sample-action" type="button" onClick={onShowSampleInterpretation}>
          Preview sample
        </button>
      </div>
    </section>
  );
}

export default Spread;
