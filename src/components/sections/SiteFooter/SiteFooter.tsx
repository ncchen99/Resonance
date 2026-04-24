'use client';

import { SectionEdge } from '@/components/atoms/SectionEdge/SectionEdge';
import { ResonanceIcon } from '@/components/atoms/ResonanceIcon/ResonanceIcon';
import styles from './SiteFooter.module.css';

const LINKS = ['About', 'Contact', 'Privacy Policy', 'Terms of Service'];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <SectionEdge
        topColor="var(--color-terracotta)"
        seed={233}
        height={90}
        amplitude={0.14}
        steps={14}
        stroke="oklch(20% 0.03 60 / 0.5)"
        strokeWidth={1.3}
      />
      <div className={styles.container}>
        <div className={styles.brand}>
          <ResonanceIcon size={26} />
          <span className={styles.brandName}>Resonance</span>
        </div>
        <p className={styles.tagline}>&ldquo;Let lives influence lives&rdquo;</p>

        <div className={styles.links}>
          {LINKS.map((l) => (
            <a key={l} href="#" className={styles.link}>
              {l}
            </a>
          ))}
        </div>

        <div className={styles.divider} />

        <p className={styles.copyright}>© 2026 Resonance. All rights reserved.</p>
      </div>
    </footer>
  );
}
