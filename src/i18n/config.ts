/** UI languages (WR-08). Text for each language lives in src/i18n/messages/<locale>.json. */
export const LOCALES = ['en', 'si', 'ta'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** The language switcher stores the chosen language in this cookie. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}
