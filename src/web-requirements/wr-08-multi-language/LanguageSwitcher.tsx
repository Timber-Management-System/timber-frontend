'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { LOCALE_COOKIE, LOCALES, type Locale } from '@/i18n/config';

import { useLocale, useT } from './I18nProvider';
import styles from './LanguageSwitcher.module.css';

/** Native names, so every user can find their own language whatever is selected. */
const NATIVE: Record<Locale, { short: string; name: string }> = {
  en: { short: 'EN', name: 'English' },
  si: { short: 'සිං', name: 'සිංහල' },
  ta: { short: 'தமி', name: 'தமிழ்' },
};

/** Saves the UI language for the next page load (read by src/app/layout.tsx). */
export function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

/**
 * Language switch for the top bar and the sign-in page (WR-08).
 *   variant="compact"  EN ▾ select (top bar)
 *   variant="links"    English · සිංහල · தமிழ் (sign-in page, as in S-01.1)
 */
export function LanguageSwitcher({ variant = 'compact' }: { variant?: 'compact' | 'links' }) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    setLocaleCookie(next);
    startTransition(() => router.refresh());
  };

  if (variant === 'links') {
    return (
      <div className={styles.links} role="group" aria-label={t('common.language')}>
        {LOCALES.map((l, i) => (
          <span key={l}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            <button
              type="button"
              lang={l}
              className={[styles.link, l === locale && styles.current].filter(Boolean).join(' ')}
              aria-pressed={l === locale}
              disabled={pending}
              onClick={() => change(l)}
            >
              {NATIVE[l].name}
            </button>
          </span>
        ))}
      </div>
    );
  }

  return (
    <label className={styles.compact}>
      <span className={styles.srOnly}>{t('common.language')}</span>
      <select
        className={styles.select}
        value={locale}
        disabled={pending}
        onChange={(e) => change(e.target.value as Locale)}
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} lang={l} title={NATIVE[l].name}>
            {NATIVE[l].short}
          </option>
        ))}
      </select>
    </label>
  );
}
