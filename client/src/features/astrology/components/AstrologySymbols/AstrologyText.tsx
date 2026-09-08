import type { Point } from '../../types';

interface AstrologyTextProps {
  readonly text: string;
  readonly point: Point;
  readonly size: string | number;
  readonly color: string;
}

function AstrologyText({ text, point, size, color }: AstrologyTextProps) {
  const { x, y } = point;
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill={color}
      fontFamily='serif'
      dominantBaseline='central'
    >
      {text}
    </text>
  );
};

export default AstrologyText;
