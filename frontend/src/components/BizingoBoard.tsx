import React from 'react';

type TriangleProps = {
  base: number;
  height: number;
  offset: number;
  yOffset?: number;
};

const Triangle: React.FC<TriangleProps> = ({ base, height, offset, yOffset = 0 }) => (
  <polygon
    points={`${offset},${height + yOffset} ${offset + base / 2},${yOffset} ${offset + base},${height + yOffset}`}
    fill="green"
  />
);

const UpsideDownTriangle: React.FC<TriangleProps & { yOffset?: number }> = ({
  base,
  height,
  offset,
  yOffset = 0,
}) => (
  <polygon
    points={`${offset + base / 2},${yOffset + height} ${offset + base},${yOffset} ${offset},${yOffset}`}
    fill="white"
  />
);

const BizingoBoard: React.FC = () => {
  const numTriangles = 11;
  const width = 600; // Width of the rectangle (numTriangles * base)
  const base = width / numTriangles; // Base of each equilateral triangle
  const height = (Math.sqrt(3) / 2) * base; // Height of each equilateral triangle

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height * 11}`}>
      <rect width={width} height={height * 11} fill="gray" />
      {Array.from({ length: numTriangles }).map((_, i) => (
        i > 3 && i < numTriangles - 4 && (
          <Triangle key={i} base={base} height={height} offset={i * base} />
        )
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        i > 3 && i < numTriangles - 5 && (
          <UpsideDownTriangle key={i} base={base} height={height} offset={(i * base) + (base / 2)} />
        )
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        i > 2 && i < numTriangles - 4 && (
          <Triangle key={i} base={base} height={height} offset={i * base + base / 2} yOffset={height} />
        )
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        i > 3 && i < numTriangles - 4 && (
          <UpsideDownTriangle key={i} base={base} height={height} offset={i * base} yOffset={height} />
        )
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        i > 2 && i < numTriangles - 3 && (
          <Triangle key={i} base={base} height={height} offset={i * base} yOffset={height * 2} />
        )
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        i > 2 && i < numTriangles - 4 && (
          <UpsideDownTriangle key={i} base={base} height={height} offset={(i * base) + (base / 2)} yOffset={height * 2} />
        )
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        i > 1 && i < numTriangles - 3 && (
          <Triangle key={i} base={base} height={height} offset={i * base + base / 2} yOffset={height * 3} />
        )
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        i > 2 && i < numTriangles - 3 && (
          <UpsideDownTriangle key={i} base={base} height={height} offset={i * base} yOffset={height * 3} />
        )
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        i > 1 && i < numTriangles - 2 && (
          <Triangle key={i} base={base} height={height} offset={i * base} yOffset={height * 4} />
        )
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        i > 1 && i < numTriangles - 3 && (
          <UpsideDownTriangle key={i} base={base} height={height} offset={(i * base) + (base / 2)} yOffset={height * 4} />
        )
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        i !== 0 && i !== numTriangles - 2 && (
          <Triangle key={i} base={base} height={height} offset={i * base + base / 2} yOffset={height * 5} />
        )
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        i > 1 && i < numTriangles - 2 && (
          <UpsideDownTriangle key={i} base={base} height={height} offset={i * base} yOffset={height * 5} />
        )
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        i !== 0 && i !== numTriangles - 1 && (
          <Triangle key={i} base={base} height={height} offset={i * base} yOffset={height * 6} />
        )
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        i !== 0 && i !== numTriangles - 2 && (
          <UpsideDownTriangle key={i} base={base} height={height} offset={(i * base) + (base / 2)} yOffset={height * 6} />
        )
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        <Triangle key={i} base={base} height={height} offset={i * base + base / 2} yOffset={height * 7} />
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        i !== 0 && i !== numTriangles - 1 && (
          <UpsideDownTriangle key={i} base={base} height={height} offset={i * base} yOffset={height * 7} />)
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        <Triangle key={i} base={base} height={height} offset={i * base} yOffset={height * 8} />
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        <UpsideDownTriangle key={i} base={base} height={height} offset={(i * base) + (base / 2)} yOffset={height * 8} />
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        <Triangle key={i} base={base} height={height} offset={i * base + base / 2} yOffset={height * 9} />
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        <UpsideDownTriangle key={i} base={base} height={height} offset={i * base} yOffset={height * 9} />
      ))}
      {Array.from({ length: numTriangles }).map((_, i) => (
        i !== 0 && i !== numTriangles - 1 && (
          <Triangle key={i} base={base} height={height} offset={i * base} yOffset={height * 10} />)
      ))}
      {Array.from({ length: numTriangles - 1 }).map((_, i) => (
        <UpsideDownTriangle key={i} base={base} height={height} offset={(i * base) + (base / 2)} yOffset={height * 10} />
      ))}
    </svg>
  );
};

export default BizingoBoard;
