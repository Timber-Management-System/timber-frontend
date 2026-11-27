/**
 * Tiny mock database for working without the backend (NEXT_PUBLIC_USE_MOCK_API=true).
 * Data lives in the browser's localStorage, so changes survive a page reload during a demo.
 * Clear it from the browser dev tools (Application › Local storage) to start fresh.
 *
 * Never import this from components: only from a module's `api/` files.
 *
 * Never store passwords, codes, tokens or personal IDs here: localStorage is plain text that
 * any script on the page can read (CodeQL blocks the pull request). Keep such mock data in
 * memory instead, like src/shared/lib/mock/users.mock.ts does.
 */

const PREFIX = 'tms-mock:';

function isBrowser() {
  return typeof window !== 'undefined';
}

/** Read a stored collection, or seed it the first time. */
export function readMock<T>(key: string, seed: () => T): T {
  if (!isBrowser()) return seed();
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // storage blocked or corrupt: fall back to the seed
  }
  const value = seed();
  writeMock(key, value);
  return value;
}

export function writeMock<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore: mock data is best-effort
  }
}

/** Delete a stored collection (e.g. one an older version of the app saved). */
export function forgetMock(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

/** Simulates network latency so loading states are visible. */
export function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Error thrown by mock APIs. `code` mirrors what the backend will send. */
export class MockApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status = 400,
  ) {
    super(code);
    this.name = 'MockApiError';
  }
}
