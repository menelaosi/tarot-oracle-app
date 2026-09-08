import type { Point } from '../../types';

type CircleProps = {
  readonly point: Point;
  readonly radius: number;
  readonly stroke: string;
  readonly strokeWidth: number;
  readonly fill?: string;
};

/** SVG <circle> primitive; `fill` defaults to none so callers get an outline. */
function AstrologyCircle({
  point,
  radius,
  stroke,
  strokeWidth,
  fill = 'none',
}: CircleProps) {
  const { x, y } = point;
  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
    />
  );
};

export default AstrologyCircle;
