import type { DrawnCard } from '../types';

type TarotCardProps = {
  card: DrawnCard;
};

function TarotCard({ card }: TarotCardProps) {
  return (
    <article className={`tarot-card ${card.orientation}`}>
      <div className="card-topline">
        <span>{String(card.position).padStart(2, '0')}</span>
        <span>{card.orientation}</span>
      </div>
      <div className="image-frame">
        <img
          src={card.imagePath}
          alt={`${card.name}, ${card.orientation}`}
          className={card.orientation === 'reversed' ? 'reversed-image' : undefined}
        />
      </div>
      <p className="card-position">{card.positionLabel}</p>
      <h3>{card.name}</h3>
    </article>
  );
}

export default TarotCard;
