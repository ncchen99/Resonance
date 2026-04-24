import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CURRENT_USER_ID, repos } from '@/lib/db';
import { CardEditor } from '@/components/molecules/CardEditor/CardEditor';
import type { Locale } from '@/lib/db/types';

export default async function EditCardPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('write');
  const card = await repos.card.findById(id, CURRENT_USER_ID);
  if (!card || card.authorId !== CURRENT_USER_ID) notFound();
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
        {t('editTitle')}
      </h1>
      <CardEditor
        initial={{
          id: card.id,
          thoughtCore: card.thoughtCore,
          story: card.story,
          tags: card.tags,
          visibility: card.visibility,
        }}
        locale={locale as Locale}
      />
    </div>
  );
}
