import { BLACK, COLLISION_RADIUS, CUSPS_STROKE, DARK_GRAY, POINTS_TEXT_SIZE, getDescriptionPosition, getDignities, getPointPosition } from '../lib/horoscope';
import type { CelestialBodyPosition, LocatedPoint, Planet, Point } from '../types';
import AstrologyLine from './AstrologySymbols/AstrologyLine';
import AstrologyText from './AstrologySymbols/AstrologyText';
import PlanetGlyph from './AstrologySymbols/PlanetGlyph';

interface AstrologyPlanetsProps {
  readonly point: Point;
  readonly radius: number;
  readonly planets: Record<Planet, CelestialBodyPosition | undefined>;
  readonly locatedPoints: LocatedPoint[];
  readonly rulerRadius: number;
  readonly pointRadius: number;
  readonly shift: number;
}

function AstrologyPlanets({
  point,
  radius,
  planets,
  locatedPoints,
  rulerRadius,
  pointRadius,
  shift,
}: AstrologyPlanetsProps) {
  // The pointer marks a planet's true degree just inside the ruler; when the
  // glyph is nudged inward to dodge a neighbour, a connector links the two.
  const pointerRadius = radius - rulerRadius;

  const pointerLine = (from: Point, to: Point) => (
    <AstrologyLine
      startingPoint={from}
      endingPoint={to}
      stroke={DARK_GRAY}
      strokeWidth={CUSPS_STROKE}
    />
  );

  return (
    <g id='points'>
      {locatedPoints.map((locatedPoint) => {
        const { planetName, angle } = locatedPoint;
        const body = planets[planetName];
        // -1 marks a body missing from the horoscope data; it still renders, obviously wrong.
        const planetAngle = body?.longitude ?? -1;
        const planetShift = planetAngle + shift;

        const pointerStart = getPointPosition(point, pointerRadius, planetShift);
        const pointerEnd = getPointPosition(point, pointerRadius + (rulerRadius / 2), planetShift);
        const isDisplaced = planetShift !== angle;

        const texts = [
          Math.round(planetAngle % 30).toString(),
          ...(body?.retrograde ? ['R'] : []),
          ...getDignities(planetName, planetAngle),
        ];

        return (
          <g key={planetName}>
            {pointerLine(pointerStart, pointerEnd)}
            {isDisplaced && pointerLine(
              pointerEnd,
              getPointPosition(point, pointRadius - COLLISION_RADIUS, angle),
            )}
            <PlanetGlyph planet={planetName} point={locatedPoint.point} longitude={planetAngle} />
            {getDescriptionPosition(locatedPoint, texts).map((description, i) => (
              <AstrologyText
                key={i}
                text={description.text}
                point={description.point}
                size={POINTS_TEXT_SIZE}
                color={BLACK}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}

export default AstrologyPlanets;
