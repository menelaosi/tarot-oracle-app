import { useState } from 'react';
import type { CardDetails, DrawnCard } from '../types';

type TarotCardProps = {
  card: DrawnCard;
  includeReversals?: boolean;
};

type DetailValue = string | string[] | null | undefined;

function DetailLine({
  className = 'meta',
  label,
  value,
}: {
  className?: string;
  label?: string;
  value: DetailValue;
}) {
  const text = Array.isArray(value) ? value.slice(0, 4).join(' · ') : value;
  if (!text) return null;
  return <p className={`details-${className}`}>{label ? `${label}: ${text}` : text}</p>;
}

function TarotCard({ card, includeReversals = false }: TarotCardProps) {
  const [details, setDetails] = useState<CardDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const isUpright = card.orientation === 'upright' || !includeReversals;
  function pick<T>(upright: T, reversed: T) {
    return isUpright ? upright : reversed;
  }

  async function loadDetails() {
    if (details || isLoadingDetails) return;

    setIsLoadingDetails(true);
    setDetailsError('');

    try {
      const response = await fetch(`/api/cards/${card.id}`);
      if (!response.ok) throw new Error('Card details unavailable.');
      setDetails((await response.json()) as CardDetails);
    } catch (error) {
      setDetailsError(error instanceof Error ? error.message : 'Card details unavailable.');
    } finally {
      setIsLoadingDetails(false);
    }
  }

  function showDetails() {
    setIsDetailsVisible(true);
    void loadDetails();
  }

  function hideDetails() {
    setIsDetailsVisible(false);
  }

  return (
    <article
      className={`tarot-card ${card.orientation}`}
      tabIndex={0}
      onMouseEnter={showDetails}
      onMouseLeave={hideDetails}
      onFocus={showDetails}
      onBlur={hideDetails}
    >
      <div className="card-topline">
        <span>{String(card.position).padStart(2, '0')}</span>
        {includeReversals && <span>{card.orientation}</span>}
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
      {isDetailsVisible && (
        <div className="card-details" aria-live="polite">
          {isLoadingDetails && <p className="details-meta">Loading details...</p>}
          {detailsError && <p className="details-meta">{detailsError}</p>}
          {details && (
            <>
              <DetailLine
                className="meaning"
                value={pick(details.meaningUpright, details.meaningReversed)}
              />
              <DetailLine label="Element" value={details.element} />
              <DetailLine
                label="Number"
                value={details.numerologyAssociations}
              />
              <DetailLine
                label="Court"
                value={details.courtRank && `${details.courtRank} — ${details.courtDescription}`}
              />
              <DetailLine
                label="Court energy"
                value={pick(details.courtPositiveAssociations, details.courtNegativeAssociations)}
              />
              <DetailLine
                label="Arcana element"
                value={details.majorElement}
              />
              <DetailLine label="Planets" value={details.majorPlanets} />
              <DetailLine label="Signs" value={details.majorSigns} />
              <DetailLine
                label="Arcana energy"
                value={pick(details.majorPositiveAssociations, details.majorNegativeAssociations)}
              />
              <DetailLine
                label="Symbols"
                value={details.majorRepresentations}
              />
            </>
          )}
        </div>
      )}
    </article>
  );
}

export default TarotCard;
