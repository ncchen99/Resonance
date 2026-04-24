import { getTranslations, setRequestLocale } from 'next-intl/server';
import { repos } from '@/lib/db';
import { SettingsClient } from './SettingsClient';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('settings');
  const user = await repos.user.getCurrent();
  if (!user) throw new Error('no user');
  return (
    <div
      style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: 'clamp(32px, 5vw, 56px) clamp(20px, 4vw, 48px) 80px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 36px)',
          fontWeight: 700,
          marginBottom: 32,
        }}
      >
        {t('title')}
      </h1>
      <SettingsClient
        initial={{
          handle: user.handle,
          bio: user.bio ?? '',
          region: user.region,
          primaryLocale: user.primaryLocale,
          autoTranslateTo: user.autoTranslateTo,
        }}
      />
    </div>
  );
}
