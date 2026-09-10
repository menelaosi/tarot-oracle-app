import { useState } from 'react';
import DetailOverlay, { type DetailItem } from '../../../components/DetailOverlay';
import { getJson, messageFrom } from '../../../lib/http';
import type { CardDetails, DrawnCard } from '../types';

type TarotCardProps = {
  card: DrawnCard;
  includeReversals?: boolean;
};

/** A drawn card. Its extended correspondences load lazily from the API the first
 *  time the card is hovered or focused, then stay cached on the component and
 *  feed the shared hover panel. */
function TarotCard({ card, includeReversals = false }: TarotCardProps) {
  const { position, orientation, name, imagePath, positionLabel } = card;
  const [details, setDetails] = useState<CardDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  // When reversals are turned off, a card drawn reversed is still read upright.
  const isUpright = orientation === 'upright' || !includeReversals;
  function pick<T>(upright: T, reversed: T) {
    return isUpright ? upright : reversed;
  }

  async function loadDetails() {
    if (details || isLoadingDetails) return; // fetch once, on first reveal

    setIsLoadingDetails(true);
    setDetailsError('');

    try {
      setDetails(await getJson<CardDetails>(`/api/cards/${card.id}`, 'Card details unavailable.'));
    } catch (error) {
      setDetailsError(messageFrom(error, 'Card details unavailable.'));
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
      className={`tarot-card ${orientation}`}
      panelClassName="tarot-card-details"
      items={items}
      status={isLoadingDetails ? 'Loading details...' : detailsError || undefined}
      onReveal={loadDetails}
    >
      <div className="card-topline">
        <span>{String(position).padStart(2, '0')}</span>
        {includeReversals && <span>{orientation}</span>}
      </div>
      <div className="image-frame">
        <img
          src={imagePath}
          alt={`${name}, ${orientation}`}
          className={!isUpright ? 'reversed-image' : undefined}
        />
      </div>
      <p className="card-position">{positionLabel}</p>
      <h3>{name}</h3>
    </DetailOverlay>
  );
}

export default TarotCard;
