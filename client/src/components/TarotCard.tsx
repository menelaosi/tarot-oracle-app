import { useState } from 'react';
import type { CardDetails, DrawnCard } from '../types';

type TarotCardProps = {
  card: DrawnCard;
};

function TarotCard({ card }: TarotCardProps) {
  const [details, setDetails] = useState<CardDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

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

  return (
    <article
      className={`tarot-card ${card.orientation}`}
      tabIndex={0}
      onMouseEnter={() => {
        setIsDetailsVisible(true);
        void loadDetails();
      }}
      onMouseLeave={() => setIsDetailsVisible(false)}
      onFocus={() => {
        setIsDetailsVisible(true);
        void loadDetails();
      }}
      onBlur={() => setIsDetailsVisible(false)}
    >
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
      {isDetailsVisible && (
        <div className="card-details" aria-live="polite">
          {isLoadingDetails && <p className="details-status">Loading details...</p>}
          {detailsError && <p className="details-status">{detailsError}</p>}
          {details && (
            <>
              <p className="details-meaning">
                {card.orientation === 'reversed' ? details.meaningReversed : details.meaningUpright}
              </p>
              {details.element && <p className="details-meta">Element: {details.element}</p>}
              {details.numerologyAssociations.length > 0 && (
                <p className="details-meta">
                  Number: {details.numerologyAssociations.slice(0, 4).join(' · ')}
                </p>
              )}
              {details.courtRank && (
                <p className="details-meta">
                  Court: {details.courtRank} — {details.courtDescription}
                </p>
              )}
              {(card.orientation === 'upright'
                ? details.courtPositiveAssociations
                : details.courtNegativeAssociations
              ).length > 0 && (
                <p className="details-meta">
                  Court energy:{' '}
                  {(card.orientation === 'upright'
                    ? details.courtPositiveAssociations
                    : details.courtNegativeAssociations
                  )
                    .slice(0, 4)
                    .join(' · ')}
                </p>
              )}
              {details.majorElement && (
                <p className="details-meta">Arcana element: {details.majorElement}</p>
              )}
              {details.majorPlanets.length > 0 && (
                <p className="details-meta">Planets: {details.majorPlanets.join(' · ')}</p>
              )}
              {details.majorSigns.length > 0 && (
                <p className="details-meta">Signs: {details.majorSigns.join(' · ')}</p>
              )}
              {(details.majorPositiveAssociations.length > 0 ||
                details.majorNegativeAssociations.length > 0) && (
                <p className="details-meta">
                  Arcana energy:{' '}
                  {(card.orientation === 'upright'
                    ? details.majorPositiveAssociations
                    : details.majorNegativeAssociations
                  )
                    .slice(0, 4)
                    .join(' · ')}
                </p>
              )}
              {details.majorRepresentations.length > 0 && (
                <p className="details-meta">
                  Symbols: {details.majorRepresentations.join(' · ')}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </article>
  );
}

export default TarotCard;
