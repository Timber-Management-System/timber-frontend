/** Only allow redirects to pages inside this app (blocks "//evil.com" open redirects). */
export function safeNext(next: string | undefined, fallback = '/dashboard'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return fallback;
  return next;
}
