'use client';

import { ReactNode, useMemo, useRef } from 'react';
import { HandDrawnBorder } from '../HandDrawnBorder/HandDrawnBorder';
import { useElementSize } from '@/lib/hooks/useElementSize';
import styles from './TagPill.module.css';

export interface TagPillProps {
  children: ReactNode;
  color?: string;
  seed?: number;
}

export function TagPill({ children, color = 'var(--color-yellow)', seed }: TagPillProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { w, h } = useElementSize(ref, 90, 22);
  const autoSeed = useMemo(() => {
    if (seed != null) return seed;
    const s = String(children);
    let hash = 7;
    for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
    return (Math.abs(hash) % 9973) + 1;
  }, [children, seed]);
  const R = h > 0 ? h * 0.5 : 11;

  return (
    <span ref={ref} className={styles.pill}>
      <HandDrawnBorder
        w={w}
        h={h}
        R={R}
        seed={autoSeed}
        mag={Math.min(w, h) * 0.055}
        fillColor={color}
        strokeColor="oklch(32% 0.05 60 / 0.45)"
        strokeWidth={1.2}
        segmentsH={[3, 4]}
        segmentsV={1}
        curve={2.0}
        cornerJitter={1.8}
        cornerOffset={Math.min(w, h) * 0.04}
      />
      <span className={styles.label}>{children}</span>
    </span>
  );
}
