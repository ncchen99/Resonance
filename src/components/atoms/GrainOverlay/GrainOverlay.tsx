'use client';

import { useId } from 'react';

export interface GrainOverlayProps {
  opacity?: number;
  extendTop?: number;
  extendBottom?: number;
}

export function GrainOverlay({ opacity = 0.06, extendTop = 0, extendBottom = 0 }: GrainOverlayProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: -extendTop,
        bottom: -extendBottom,
        width: '100%',
        height: `calc(100% + ${extendTop + extendBottom}px)`,
        pointerEvents: 'none',
        opacity,
        zIndex: 10,
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id={`grain-${id}`} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={4} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
    </svg>
  );
}
