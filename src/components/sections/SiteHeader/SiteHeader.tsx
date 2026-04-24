'use client';

import { useEffect, useMemo, useState } from 'react';
import { ResonanceIcon } from '@/components/atoms/ResonanceIcon/ResonanceIcon';
import { HamburgerIcon } from '@/components/atoms/HamburgerIcon/HamburgerIcon';
import { HandDrawnAvatar } from '@/components/atoms/HandDrawnAvatar/HandDrawnAvatar';
import { OrganicButton } from '@/components/atoms/OrganicButton/OrganicButton';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { pointsToBezier, wavyPoints } from '@/lib/design/wavyPath';
import { MobileNavModal } from './MobileNavModal';
import styles from './SiteHeader.module.css';

const HEADER_BODY_H = 68;
const HEADER_WAVE_H = 14;
const HEADER_TOTAL_H = HEADER_BODY_H + HEADER_WAVE_H;

function buildHeaderPaths(seed: number) {
  const W = 1440;
  const baseY = HEADER_BODY_H + HEADER_WAVE_H * 0.35;
  const amp = 1.4;
  const steps = 12;
  const pts = wavyPoints(W, baseY, amp, seed, steps);
  const strokeD = pointsToBezier(pts);
  const f = (n: number) => +n.toFixed(2);
  const last = pts[pts.length - 1];
  let maskD = `M 0,0 L ${W},0 L ${f(last[0])},${f(last[1])}`;
  for (let i = pts.length - 2; i >= 0; i--) {
    const [x0, y0] = pts[i + 1];
    const [x1, y1] = pts[i];
    const midX = (x0 + x1) / 2;
    maskD += ` C ${f(midX)},${f(y0)} ${f(midX)},${f(y1)} ${f(x1)},${f(y1)}`;
  }
  maskD += ' Z';
  return { maskD, strokeD, W };
}

export const NAV_ITEMS = ['About', 'Explore', 'Stories'];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile(720);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  const { maskD, strokeD, W } = useMemo(() => buildHeaderPaths(211), []);

  const maskUrl = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${HEADER_TOTAL_H}' preserveAspectRatio='none'><path d='${maskD}' fill='white'/></svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [maskD, W]);

  return (
    <header className={styles.header} style={{ height: HEADER_TOTAL_H }}>
      <div
        aria-hidden="true"
        className={styles.bg}
        style={{
          opacity: scrolled ? 1 : 0,
          WebkitMaskImage: maskUrl,
          maskImage: maskUrl,
        }}
      />

      <svg
        aria-hidden="true"
        viewBox={`0 0 ${W} ${HEADER_TOTAL_H}`}
        preserveAspectRatio="none"
        className={styles.waveStroke}
        style={{ height: HEADER_TOTAL_H, opacity: scrolled ? 1 : 0 }}
      >
        <path
          d={strokeD}
          fill="none"
          stroke="oklch(55% 0.05 60 / 0.38)"
          strokeWidth="1.1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className={styles.row} style={{ height: HEADER_BODY_H }}>
        <a href="#" className={styles.logo}>
          <ResonanceIcon size={42} />
          <span className={styles.brand}>Resonance</span>
        </a>

        {isMobile ? (
          <button
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className={styles.menuBtn}
          >
            <HamburgerIcon size={26} />
          </button>
        ) : (
          <>
            <nav className={styles.nav}>
              {NAV_ITEMS.map((item) => (
                <a key={item} href="#" className={styles.navLink}>
                  {item}
                </a>
              ))}
            </nav>

            <div className={styles.account}>
              <OrganicButton variant="outline" style={{ padding: '9px 22px', fontSize: '14px' }}>
                Sign In
              </OrganicButton>
              <HandDrawnAvatar initials="YO" size={36} color="var(--color-terracotta-light)" seed={77} />
            </div>
          </>
        )}
      </div>

      <MobileNavModal open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
