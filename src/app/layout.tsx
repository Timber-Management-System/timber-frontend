import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

import '@/styles/tokens/index.css';
import './globals.css';
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from '@/i18n/config';
import { fontVariables } from '@/styles/fonts';
import { I18nProvider } from '@/web-requirements/wr-08-multi-language';

export const metadata: Metadata = {
  title: 'TimberTrack',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : DEFAULT_LOCALE;

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
