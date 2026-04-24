'use client';

import { CSSProperties, useMemo } from 'react';
import { pointsToBezier, wavyPoints } from '@/lib/design/wavyPath';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export interface SectionEdgeProps {
  topColor: string;
  seed?: number;
  height?: number;
  amplitude?: number;
  steps?: number;
  zIndex?: number;
  style?: CSSProperties;
  stroke?: string;
  strokeWidth?: number;
}

export function SectionEdge({
  topColor,
  seed = 1,
  height = 80,
  amplitude = 0.15,
  steps = 14,
  zIndex = 1,
  style = {},
  stroke,
  strokeWidth = 1.2,
}: SectionEdgeProps) {
  const W = 1440;
  const isMobile = useIsMobile(640);
  const effSteps = isMobile ? Math.max(4, Math.round(steps * 0.45)) : steps;
  const effSeed = isMobile ? seed + 9173 : seed;

  const { fillD, strokeD } = useMemo(() => {
    const amp = height * amplitude;
    const baseY = height * 0.78;
    const pts = wavyPoints(W, baseY, amp, effSeed, effSteps);
    const strokeD = pointsToBezier(pts);
    const f = (n: number) => +n.toFixed(2);
    const last = pts[pts.length - 1];
    let fillD = `M 0,-1 L ${W},-1 L ${f(last[0])},${f(last[1])}`;
    for (let i = pts.length - 2; i >= 0; i--) {
      const [x0, y0] = pts[i + 1];
      const [x1, y1] = pts[i];
      const midX = (x0 + x1) / 2;
      fillD += ` C ${f(midX)},${f(y0)} ${f(midX)},${f(y1)} ${f(x1)},${f(y1)}`;
    }
    fillD += ' Z';
    return { fillD, strokeD };
  }, [effSeed, height, amplitude, effSteps]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height,
        pointerEvents: 'none',
        zIndex,
        ...style,
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}
      >
        <path d={fillD} fill={topColor} />
        {stroke && (
          <path
            d={strokeD}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}
