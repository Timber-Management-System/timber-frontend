/**
 * The ONE place that talks to the backend (Spring Boot REST API).
 * Module code calls these helpers from its own `api/` folder, never `fetch` directly.
 *
 *   import { api } from '@/shared/lib/api-client';
 *   const permits = await api.get<Permit[]>('/licence-permit/felling-permits');
 *
 * Endpoint paths come from the backend contract in docs/api/. Don't invent them: ask the backend team.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * true = every module uses its built-in mock data (no backend needed).
 * Controlled by NEXT_PUBLIC_USE_MOCK_API in .env.local / Vercel. Anything except "false" means mock.
 */
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false';
const TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 30000);

/** Thrown when the backend answers with an error status (4xx / 5xx). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    /** Parsed error body from the backend, if any. */
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body' | 'method'> & {
  /** Sent as JSON. */
  json?: unknown;
  /** Added to the URL as ?key=value. Empty values are skipped. */
  query?: Record<string, string | number | boolean | undefined>;
};

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const { json, query, headers, ...rest } = options;

  const url = new URL(
    `${BASE_URL}${path}`,
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin,
  );
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    ...rest,
    method,
    credentials: 'include', // the backend login session travels as a cookie
    headers: {
      Accept: 'application/json',
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
    signal: rest.signal ?? AbortSignal.timeout(TIMEOUT_MS),
  });

  const text = await response.text();
  const data: unknown = text ? safeJson(text) : undefined;

  if (!response.ok) {
    throw new ApiError(response.status, `${method} ${path} failed with ${response.status}`, data);
  }
  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * There is intentionally no `delete` helper: records tied to a permit can't be deleted (BR-09).
 * Corrections are logged adjustments, so use `post` to the adjustment endpoint instead.
 */
export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, json?: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, json }),
  put: <T>(path: string, json?: unknown, options?: RequestOptions) => request<T>('PUT', path, { ...options, json }),
  patch: <T>(path: string, json?: unknown, options?: RequestOptions) => request<T>('PATCH', path, { ...options, json }),
};
