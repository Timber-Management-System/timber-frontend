import { ApiError } from '@/shared/lib/api-client';
import { MockApiError } from '@/shared/lib/mock-store';

import type { AuthErrorCode } from '../types/auth.types';

const KNOWN: AuthErrorCode[] = [
  'INVALID_CREDENTIALS',
  'ACCOUNT_LOCKED',
  'ACCOUNT_DEACTIVATED',
  'INVALID_CODE',
  'PASSWORD_POLICY',
  'WRONG_CURRENT_PASSWORD',
  'ROLE_EXISTS',
];

/**
 * Turns any error from the auth APIs into a known code, so the UI can show
 * t(`auth.errors.${code}`). The backend is expected to send `{ "code": "ACCOUNT_LOCKED" }`.
 */
export function authErrorCode(error: unknown): AuthErrorCode {
  let code: unknown;
  if (error instanceof MockApiError) code = error.code;
  else if (error instanceof ApiError && typeof error.body === 'object' && error.body !== null) {
    code = (error.body as { code?: unknown }).code;
  }
  return KNOWN.includes(code as AuthErrorCode) ? (code as AuthErrorCode) : 'UNKNOWN';
}
