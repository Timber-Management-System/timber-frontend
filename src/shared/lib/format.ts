/**
 * Date and number formatting that follows the UI language (WR-08) and Sri Lankan conventions
 * (Asia/Colombo, dd/MM/yyyy). Use these instead of formatting by hand.
 */
const TIME_ZONE = process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Colombo';

/** Intl locale for a UI language: Sinhala / Tamil as used in Sri Lanka. */
export function intlLocale(locale: string): string {
  return locale === 'si' ? 'si-LK' : locale === 'ta' ? 'ta-LK' : 'en-LK';
}

export function formatTime(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

/** Whole days between two dates in Colombo time (0 = same day). */
function daysAgo(iso: string, now = new Date()): number {
  const day = (d: Date) => new Date(d.toLocaleDateString('en-CA', { timeZone: TIME_ZONE })).getTime();
  return Math.round((day(now) - day(new Date(iso))) / 86_400_000);
}

/**
 * "Today 08:42", "Yesterday", "3 days ago" (S-01.5 Last login).
 * `today` / `yesterday` are already-translated words.
 */
export function formatLastSeen(iso: string, locale: string, words: { today: string; yesterday: string }): string {
  const days = daysAgo(iso);
  if (days <= 0) return `${words.today} ${formatTime(iso, locale)}`;
  if (days === 1) return words.yesterday;
  return new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: 'auto' }).format(-days, 'day');
}
