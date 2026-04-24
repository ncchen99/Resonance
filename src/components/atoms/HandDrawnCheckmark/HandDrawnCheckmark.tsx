'use client';

import { CSSProperties } from 'react';

export interface HandDrawnCheckmarkProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  title?: string;
  style?: CSSProperties;
}

export function HandDrawnCheckmark({
  size = 14,
  color = 'var(--color-sage, oklch(55% 0.13 140))',
  strokeWidth = 1.8,
  title = 'Verified',
  style,
}: HandDrawnCheckmarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      role="img"
      aria-label={title}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      <title>{title}</title>
      <path
        d="M2.5 8.6 C 3.4 9.2, 4.8 10.1, 5.8 11.4 C 7.0 9.4, 9.5 5.6, 13.2 3.6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
