import { convertShiftInDegrees, WHITE } from '../../lib/horoscope';
import type { Point } from '../../types';

type AstrologySegmentProps = {
  readonly point: Point;
  readonly radius: number;
  readonly angleFrom?: number;
  readonly angleTo?: number;
  readonly thickness: number;
  readonly lFlag?: number;
  readonly sFlag?: number;
  readonly stroke?: string;
  readonly strokeWidth?: number;
};

/**
 * A ring (donut) segment: the wedge between radii `thickness`..`radius` and
 * angles `angleFrom`..`angleTo`, as a single <path> (two lines + two arcs). Used
 * for the wheel backgrounds and the 12 zodiac-band slices. `lFlag`/`sFlag` are
 * the SVG arc large-arc / sweep flags for spans over 180°.
 */
function AstrologySegment({
  point,
  radius,
  angleFrom = 0,
  angleTo = 359.99,
  thickness,
  lFlag = 1,
  sFlag = 0,
  stroke,
  strokeWidth,
}: AstrologySegmentProps) {
  // Some constants for angles in degress and radius minus thickness
  const angleFromShift = convertShiftInDegrees(angleFrom);
  const angleToShift = convertShiftInDegrees(angleTo);
  const radiusMinusThickness = radius - thickness;

  // Some constants for cos and sin for angleFrom and angleTo
  const cosineAngleFromShift = Math.cos(angleFromShift);
  const sineAngleFromShift = Math.sin(angleFromShift);
  const cosineAngleToShift = Math.cos(angleToShift);
  const sineAngleToShift = Math.sin(angleToShift);

  // Define the points for the SVG

  const point1 = {
    x: point.x + thickness * cosineAngleFromShift,
    y: point.y + thickness * sineAngleFromShift,
  };

  const point2 = {
    x: radiusMinusThickness * cosineAngleFromShift,
    y: radiusMinusThickness * sineAngleFromShift,
  };

  const point3 = {
    x: point.x + radius * cosineAngleToShift,
    y: point.y + radius * sineAngleToShift,
  };

  const point4 = {
    x: radiusMinusThickness * -cosineAngleToShift,
    y: radiusMinusThickness * -sineAngleToShift,
  };

  // Draw the path based on the constants we've created
  return (
    <path
      d={`
		M ${point1.x}, ${point1.y}
		l ${point2.x}, ${point2.y}
		A ${radius}, ${radius},0 ,${lFlag}, ${sFlag}, ${point3.x}, ${point3.y}
		l ${point4.x}, ${point4.y}
		A ${thickness}, ${thickness},0 ,${lFlag}, 1, ${point1.x}, ${point1.y}
		`}
      fill={WHITE}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

export default AstrologySegment;
