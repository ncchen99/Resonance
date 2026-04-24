'use client';

import { OrganiBlob } from '@/components/atoms/OrganiBlob/OrganiBlob';
import { SectionEdge } from '@/components/atoms/SectionEdge/SectionEdge';
import { OrganicButton } from '@/components/atoms/OrganicButton/OrganicButton';
import styles from './CTASection.module.css';

export function CTASection() {
  return (
    <section className={styles.section}>
      <SectionEdge
        topColor="var(--color-cream-dark)"
        seed={137}
        height={100}
        amplitude={0.13}
        steps={14}
        stroke="oklch(40% 0.12 45 / 0.35)"
        strokeWidth={1.3}
      />

      <div className={styles.blobTop}>
        <OrganiBlob variant={2} fill="oklch(98% 0.01 75)" size={280} />
      </div>
      <div className={styles.blobBottom}>
        <OrganiBlob variant={0} fill="oklch(98% 0.01 75)" size={220} />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>Share your story and let the world hear your voice</h2>
        <p className={styles.description}>
          Every story matters. Yours could be the one that changes someone&apos;s day.
        </p>
        <div className={styles.ctaRow}>
          <OrganicButton variant="ctaLight">Start Sharing</OrganicButton>
          <OrganicButton variant="ctaGhost">Create a Story</OrganicButton>
        </div>
      </div>
    </section>
  );
}
