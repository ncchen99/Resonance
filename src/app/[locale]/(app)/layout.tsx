import { AppHeader, HEADER_TOTAL_H } from '@/components/sections/AppHeader/AppHeader';
import { FloatingWriteButton } from '@/components/sections/AppHeader/FloatingWriteButton';
import { repos, CURRENT_USER_ID } from '@/lib/db';
import { setRequestLocale } from 'next-intl/server';

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [user, unreadCount] = await Promise.all([
    repos.user.getCurrent(),
    repos.notification.unreadCount(CURRENT_USER_ID),
  ]);
  if (!user) {
    // In MVP (mock) this cannot happen; placeholder for future real auth.
    throw new Error('No current user');
  }
  return (
    <>
      <AppHeader
        user={{ initials: user.initials, handle: user.handle, accentColor: user.accentColor }}
        unreadCount={unreadCount}
      />
      <main style={{ paddingTop: HEADER_TOTAL_H + 8, minHeight: '100vh' }}>{children}</main>
      <FloatingWriteButton />
    </>
  );
}
