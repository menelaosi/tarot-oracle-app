import { ASPECT_COLOR, NEUTRAL_ASPECT_COLOR, aspectLineStyle } from '../lib/aspectStyle';
import { BLACK, FULL_CIRCLE, LIGHT_GRAY, getPointPosition } from '../lib/horoscope';
import { transitAspectMaxOrb, type TransitContact } from '../lib/transits';
import {
  ZODIAC_SIGNS,
  type CelestialBodyPosition,
  type LocatedPoint,
  type Planet,
  type Point,
} from '../types';
import AstrologyCircle from './AstrologySymbols/AstrologyCircle';
import AstrologyLine from './AstrologySymbols/AstrologyLine';
import AstrologySegment from './AstrologySymbols/AstrologySegment';
import PlanetGlyph from './AstrologySymbols/PlanetGlyph';

type AstrologyTransitsProps = {
  readonly point: Point;
  /** Inner circle — where the transit→natal chords anchor, shared with the natal aspects. */
  readonly hubRadius: number;
  /** Natal wheel edge — the transit band starts just outside this. */
  readonly wheelRadius: number;
  /** Centre line of the band the transiting glyphs sit on. */
  readonly ringRadius: number;
  readonly shift: number;
  /** Transiting-body longitudes, keyed by Planet value. */
  readonly transitPositions: Record<Planet, CelestialBodyPosition | undefined>;
  /** Natal longitudes, keyed by Planet value plus 'ascendant' / 'midheaven'. */
  readonly natalLongitudes: Record<string, number>;
  /** Collision-spread glyph positions for the transiting bodies, at ringRadius. */
  readonly locatedPoints: readonly LocatedPoint[];
  /** Transit→natal contacts, already ranked most-significant-first. */
  readonly contacts: readonly TransitContact[];
};

/** Half the width of the light band the transit glyphs sit on. */
const RING_HALF_WIDTH = 16;
const SIGN_ARC = FULL_CIRCLE / ZODIAC_SIGNS.length;

/**
 * The transit overlay: a light band of the currently-transiting planets hugging
 * the outside of the natal wheel, split into the twelve signs so it reads as
 * part of the wheel rather than a floating ring, plus dashed chords from each
 * transiting body to the natal point it contacts. Dashed (vs. the solid natal
 * aspect chords) keeps the two aspect sets distinct on the shared inner circle;
 * each glyph gets a pale halo so it holds up over the band.
 */
function AstrologyTransits({
  point,
  hubRadius,
  wheelRadius,
  ringRadius,
  shift,
  transitPositions,
  natalLongitudes,
  locatedPoints,
  contacts,
}: AstrologyTransitsProps) {
  const innerRadius = ringRadius - RING_HALF_WIDTH;
  const outerRadius = ringRadius + RING_HALF_WIDTH;

  return (
    <g id="transits">
      <AstrologySegment point={point} radius={outerRadius} thickness={innerRadius} />
      <AstrologyCircle point={point} radius={outerRadius} stroke={LIGHT_GRAY} strokeWidth={1} />

      {ZODIAC_SIGNS.map((sign, index) => (
        <AstrologyLine
          key={sign}
          startingPoint={getPointPosition(point, wheelRadius, shift + index * SIGN_ARC)}
          endingPoint={getPointPosition(point, outerRadius, shift + index * SIGN_ARC)}
          stroke={LIGHT_GRAY}
          strokeWidth={1}
        />
      ))}

      {contacts.map((contact, index) => {
        const fromLongitude = transitPositions[contact.transiting as Planet]?.longitude;
        const toLongitude = natalLongitudes[contact.natal];
        if (fromLongitude === undefined || toLongitude === undefined) return null;

        return (
          <AstrologyLine
            key={index}
            startingPoint={getPointPosition(point, hubRadius, fromLongitude + shift)}
            endingPoint={getPointPosition(point, hubRadius, toLongitude + shift)}
            stroke={ASPECT_COLOR[contact.type] ?? NEUTRAL_ASPECT_COLOR}
            dashed
            {...aspectLineStyle(contact.orb, transitAspectMaxOrb(contact.type))}
          />
        );
      })}

      {locatedPoints.map((located) => {
        const longitude = transitPositions[located.planetName]?.longitude ?? -1;
        // Short spoke from the wheel rim to the true degree, so a nudged glyph
        // still points back to where the planet actually is.
        const spokeEnd = getPointPosition(point, innerRadius, longitude + shift);

        return (
          <g key={located.planetName}>
            <AstrologyLine
              startingPoint={getPointPosition(point, wheelRadius, longitude + shift)}
              endingPoint={spokeEnd}
              strokeWidth={0.75}
            />
            <PlanetGlyph
              planet={located.planetName}
              point={located.point}
              longitude={longitude}
              halo={BLACK}
            />
          </g>
        );
      })}
    </g>
  );
}

export default AstrologyTransits;
