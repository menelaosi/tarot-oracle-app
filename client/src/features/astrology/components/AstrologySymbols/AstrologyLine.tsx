import type { Point } from '../../types';

interface AstrologyLineProps {
  readonly startingPoint: Point;
  readonly endingPoint: Point;
  readonly stroke?: string;
  readonly strokeWidth?: number;
}

function AstrologyLine({ startingPoint, endingPoint, stroke, strokeWidth }: AstrologyLineProps) {
  const { x: x1, y: y1 } = startingPoint;
  const { x: x2, y: y2 } = endingPoint;
  return (
    <line
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};

export default AstrologyLine;
