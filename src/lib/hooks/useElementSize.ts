'use client';

import { RefObject, useLayoutEffect, useState, useEffect } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useElementSize<T extends HTMLElement>(
  ref: RefObject<T | null>,
  defaultW = 160,
  defaultH = 48,
  deps: unknown[] = []
) {
  const [dims, setDims] = useState({ w: defaultW, h: defaultH });
  useIsoLayoutEffect(() => {
    if (!ref.current) return;
    const update = () => {
      if (ref.current) setDims({ w: ref.current.offsetWidth, h: ref.current.offsetHeight });
    };
    const ro = new ResizeObserver(update);
    ro.observe(ref.current);
    update();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return dims;
}
