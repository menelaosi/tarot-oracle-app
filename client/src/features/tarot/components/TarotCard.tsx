import { useState } from 'react';
import DetailOverlay, { type DetailItem } from '../../../components/DetailOverlay';
import type { CardDetails, DrawnCard } from '../types';

type TarotCardProps = {
  card: DrawnCard;
  includeReversals?: boolean;
};

/** A drawn card. Its extended correspondences load lazily from the API the first
 *  time the card is hovered or focused, then stay cached on the component and
 *  feed the shared hover panel. */
function TarotCard({ card, includeReversals = false }: TarotCardProps) {
  const [details, setDetails] = useState<CardDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  // When reversals are turned off, a card drawn reversed is still read upright.
  const isUpright = card.orientation === 'upright' || !includeReversals;
  function pick<T>(upright: T, reversed: T) {
    return isUpright ? upright : reversed;
  }

  async function loadDetails() {
    if (details || isLoadingDetails) return; // fetch once, on first reveal

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

  // Empty / absent values are dropped by DetailOverlay, so sparse cards just
  // show fewer rows.
  const items: DetailItem[] = details
    ? [
      { value: pick(details.meaningUpright, details.meaningReversed), lead: true },
      { label: 'Element', value: details.element },
      { label: 'Number', value: details.numerologyAssociations },
      {
        label: 'Court',
        value: details.courtRank && `${details.courtRank} — ${details.courtDescription}`,
      },
      {
        label: 'Court energy',
        value: pick(details.courtPositiveAssociations, details.courtNegativeAssociations),
      },
      { label: 'Arcana element', value: details.majorElement },
      { label: 'Planets', value: details.majorPlanets },
      { label: 'Signs', value: details.majorSigns },
      { label: 'Core theme', value: details.majorCoreTheme },
      { label: 'Symbols', value: details.majorRepresentations },
    ]
    : [];

  return (
    <DetailOverlay
      className={`tarot-card ${card.orientation}`}
      panelClassName="tarot-card-details"
      items={items}
      status={isLoadingDetails ? 'Loading details...' : detailsError || undefined}
      onReveal={loadDetails}
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
    </DetailOverlay>
  );
}

export default TarotCard;
