'use client';

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

export function NextIntlProvider({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
