import type { CSSProperties } from 'react';
import type { Reading } from '../types';
import TarotCard from './TarotCard';

type SpreadProps = {
  reading: Reading;
  includeReversals: boolean;
  isInterpreting: boolean;
  onGenerateInterpretation: () => void;
  onShowSampleInterpretation: () => void;
};

function Spread({
  reading,
  includeReversals = false,
  isInterpreting,
  onGenerateInterpretation,
  onShowSampleInterpretation,
}: SpreadProps) {
  return (
    <section className="spread-section" aria-labelledby="spread-title">
      <div className="section-heading spread-heading">
        <h2 id="spread-title">{reading.spreadLabel}</h2>
        <span className="reading-id">Reading {reading.id.slice(0, 8)}</span>
      </div>
      <div
        className="cards-grid"
        style={{ '--card-columns': reading.cards.length } as CSSProperties}
      >
        {reading.cards.map((card) => (
          <TarotCard card={card} includeReversals={includeReversals} key={card.id} />
        ))}
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
