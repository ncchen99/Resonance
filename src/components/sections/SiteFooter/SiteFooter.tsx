'use client';

import { useTranslations } from 'next-intl';
import { SectionEdge } from '@/components/atoms/SectionEdge/SectionEdge';
import { ResonanceIcon } from '@/components/atoms/ResonanceIcon/ResonanceIcon';
import styles from './SiteFooter.module.css';

const LINK_KEYS = ['about', 'contact', 'privacy', 'terms'] as const;

export function SiteFooter() {
  const t = useTranslations('footer');
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
        <p className={styles.tagline}>&ldquo;{t('tagline')}&rdquo;</p>

        <div className={styles.links}>
          {LINK_KEYS.map((k) => (
            <a key={k} href="#" className={styles.link}>
              {t(k)}
            </a>
          ))}
        </div>

        <div className={styles.divider} />

        <p className={styles.copyright}>{t('copyright')}</p>
      </div>
    </footer>
  );
}
