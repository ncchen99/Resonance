'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/molecules/Modal/Modal';
import { ResonanceIcon } from '@/components/atoms/ResonanceIcon/ResonanceIcon';
import { HandDrawnAvatar } from '@/components/atoms/HandDrawnAvatar/HandDrawnAvatar';
import { OrganicButton } from '@/components/atoms/OrganicButton/OrganicButton';
import { wavyLine } from '@/lib/design/wavyPath';
import { NAV_KEYS } from './SiteHeader';
import styles from './MobileNavModal.module.css';

export interface MobileNavModalProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavModal({ open, onClose }: MobileNavModalProps) {
  const dividerD = useMemo(() => wavyLine(260, 53, 1.3, 7), []);
  const t = useTranslations('nav');
  return (
    <Modal open={open} onClose={onClose} maxWidth={380} seed={53} ariaLabel={t('siteNav')} padding="24px 28px 28px">
      <div className={styles.brandRow}>
        <ResonanceIcon size={28} />
        <span className={styles.brandText}>Resonance</span>
      </div>

      <nav className={styles.nav}>
        {NAV_KEYS.map((key) => (
          <a key={key} href="#" onClick={onClose} className={styles.navLink}>
            {t(key)}
          </a>
        ))}
      </nav>

      <svg viewBox="0 0 260 6" preserveAspectRatio="none" aria-hidden="true" className={styles.divider}>
        <path
          d={dividerD}
          transform="translate(0,3)"
          stroke="oklch(55% 0.05 60 / 0.35)"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className={styles.footer}>
        <OrganicButton variant="outline" style={{ padding: '10px 22px', fontSize: 14 }}>
          {t('signIn')}
        </OrganicButton>
        <HandDrawnAvatar initials="YO" size={38} color="var(--color-terracotta-light)" seed={77} />
      </div>
    </Modal>
  );
}
