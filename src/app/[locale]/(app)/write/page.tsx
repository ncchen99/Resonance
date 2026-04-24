import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CardEditor } from '@/components/molecules/CardEditor/CardEditor';
import type { Locale } from '@/lib/db/types';

export default async function WritePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('write');
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
          marginBottom: 28,
        }}
      >
        {t('title')}
      </h1>
      <CardEditor locale={locale as Locale} />
    </div>
  );
}
