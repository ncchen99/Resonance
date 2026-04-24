'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CardLinkGrid } from '@/components/molecules/CardLinkGrid/CardLinkGrid';
import type { Card, User } from '@/lib/db/types';

export type TabKey = 'published' | 'private' | 'draft' | 'resonated' | 'thoughtMap';

export interface ProfileTabsProps {
  tabs: TabKey[];
  data: Partial<Record<TabKey, Card[]>>;
  authors: Record<string, User>;
}

export function ProfileTabs({ tabs, data, authors }: ProfileTabsProps) {
  const [active, setActive] = useState<TabKey>(tabs[0]);
  const t = useTranslations('me');
  const list = data[active] ?? [];
  return (
    <div>
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 28,
          borderBottom: '1px solid oklch(80% 0.02 75)',
        }}
      >
        {tabs.map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={active === key}
            onClick={() => setActive(key)}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: active === key ? 600 : 500,
              color: active === key ? 'var(--color-terracotta)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              borderBottom:
                active === key
                  ? '2px solid var(--color-terracotta)'
                  : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {t(`tabs.${key}`)}
          </button>
        ))}
      </div>
      {active === 'thoughtMap' ? (
        <p style={{ color: 'var(--color-text-muted)', padding: '40px 0', textAlign: 'center' }}>
          {t('thoughtMapSoon')}
        </p>
      ) : list.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', padding: '40px 0', textAlign: 'center' }}>
          {t(
            active === 'published'
              ? 'emptyPublished'
              : active === 'private'
              ? 'emptyPrivate'
              : active === 'draft'
              ? 'emptyDraft'
              : 'emptyResonated'
          )}
        </p>
      ) : (
        <CardLinkGrid cards={list} authors={authors} />
      )}
    </div>
  );
}
