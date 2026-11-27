'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';

import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import en from '@/i18n/messages/en.json';
import si from '@/i18n/messages/si.json';
import ta from '@/i18n/messages/ta.json';

/**
 * WR-08 multi-language (English, Sinhala, Tamil) without an extra library.
 * Messages are nested JSON in src/i18n/messages/<locale>.json. A key missing in Sinhala or
 * Tamil falls back to English, then to the fallback text, so nothing ever shows blank.
 *
 *   const t = useT();
 *   t('auth.login.title')                          // "Sign in"
 *   t('users.showing', { from: 1, to: 6, total: 42 })  // "Showing 1–6 of 42"
 *
 * If an i18n library is chosen later (docs/decisions/), it can read the same JSON files.
 */
type Messages = { [key: string]: string | Messages };
type Params = Record<string, string | number>;

const MESSAGES: Record<Locale, Messages> = { en, si, ta };

function lookup(messages: Messages, key: string): string | undefined {
  let node: string | Messages | undefined = messages;
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = node[part];
  }
  return typeof node === 'string' ? node : undefined;
}

function format(text: string, params?: Params): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}

export interface Translator {
  /** Translate a key; params fill {placeholders}. */
  (key: string, params?: Params): string;
}

interface I18nContextValue {
  locale: Locale;
  t: Translator;
  /** (key, fallback) form used by the Sidebar's `t` prop. */
  tOr: (key: string, fallback: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const translate = useCallback(
    (key: string, params?: Params, fallback?: string) => {
      const text = lookup(MESSAGES[locale], key) ?? lookup(MESSAGES[DEFAULT_LOCALE], key) ?? fallback ?? key;
      return format(text, params);
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: (key, params) => translate(key, params),
      tOr: (key, fallback) => translate(key, undefined, fallback),
    }),
    [locale, translate],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used inside <I18nProvider>');
  return ctx;
}

/** `const t = useT();` then `t('common.save')`. */
export function useT(): Translator {
  return useI18n().t;
}

/** `(key, fallback)` translator - pass it to components such as <Sidebar t={…} />. */
export function useTranslateOr(): (key: string, fallback: string) => string {
  return useI18n().tOr;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
