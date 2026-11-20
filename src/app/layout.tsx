import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

import '@/styles/tokens/index.css';
import { fontVariables } from '@/styles/fonts';

/** UI languages (WR-08). The language switcher stores the choice in this cookie. */
const LOCALES = ['en', 'si', 'ta'] as const;
type Locale = (typeof LOCALES)[number];
const LOCALE_COOKIE = 'NEXT_LOCALE';

function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export const metadata: Metadata = {
  title: 'TimberTrack',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(saved) ? saved : 'en';

  return (
    <html lang={locale} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
