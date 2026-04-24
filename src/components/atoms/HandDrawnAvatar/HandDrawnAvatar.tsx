'use client';

import { HandDrawnBorder } from '../HandDrawnBorder/HandDrawnBorder';

export interface HandDrawnAvatarProps {
  initials?: string;
  size?: number;
  color?: string;
  seed?: number;
}

export function HandDrawnAvatar({
  initials = '?',
  size = 36,
  color = 'var(--color-terracotta-light)',
  seed = 1,
}: HandDrawnAvatarProps) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <HandDrawnBorder
        w={size}
        h={size}
        R={size * 0.4}
        seed={seed}
        mag={size * 0.022}
        fillColor={color}
        strokeColor="oklch(36% 0.06 60 / 0.55)"
        strokeWidth={1.5}
        segmentsH={1}
        segmentsV={1}
        curve={1.3}
        cornerJitter={3.2}
        cornerOffset={size * 0.06}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: size * 0.35,
          color: 'var(--color-text)',
          userSelect: 'none',
        }}
      >
        {initials}
      </span>
    </div>
  );
}
