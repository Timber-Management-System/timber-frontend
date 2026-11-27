/** Validation for S-01.6 Add / edit user. Errors are i18n keys. */
import { isEmail } from '@/modules/user-access/fr-01-authentication';

import type { UserInput } from '../types/user.types';

export type UserFormErrors = Partial<Record<keyof UserInput, string>>;

const SL_MOBILE = /^\+?94\s?7\d(\s?\d){7}$|^07\d(\s?\d){7}$/;

export function validateUser(input: UserInput): UserFormErrors {
  const errors: UserFormErrors = {};
  if (input.fullName.trim().length < 3) errors.fullName = 'validation.required';
  if (!input.employeeId.trim()) errors.employeeId = 'validation.required';
  if (!isEmail(input.email)) errors.email = 'validation.email';
  if (input.mobile.trim() && !SL_MOBILE.test(input.mobile.trim())) errors.mobile = 'users.form.mobileInvalid';
  if (!input.role) errors.role = 'validation.required';
  if (!input.siteTeam.trim()) errors.siteTeam = 'validation.required';
  return errors;
}

/** MFA is mandatory for Administrators (NFR security). */
export function mfaForcedFor(role: UserInput['role']): boolean {
  return role === 'ADMIN';
}
