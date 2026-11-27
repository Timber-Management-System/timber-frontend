/**
 * Password policy (S-01.2 Reset password): at least 8 characters, one number, one symbol.
 * Used for reset, change password (S-13.7) and temporary passwords set by an admin (S-18.2).
 * The backend enforces the same policy; this only gives instant feedback.
 */
export interface PasswordRule {
  id: 'length' | 'number' | 'symbol';
  /** i18n key of the rule text. */
  labelKey: string;
  test: (password: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', labelKey: 'auth.password.ruleLength', test: (p) => p.length >= 8 },
  { id: 'number', labelKey: 'auth.password.ruleNumber', test: (p) => /\d/.test(p) },
  { id: 'symbol', labelKey: 'auth.password.ruleSymbol', test: (p) => /[^A-Za-z0-9\s]/.test(p) },
];

export function passwordMeetsPolicy(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

/** Errors are i18n keys. */
export function validateNewPassword(newPassword: string, confirm: string): { newPassword?: string; confirm?: string } {
  const errors: { newPassword?: string; confirm?: string } = {};
  if (!passwordMeetsPolicy(newPassword)) errors.newPassword = 'auth.password.notStrong';
  if (confirm !== newPassword) errors.confirm = 'auth.password.mismatch';
  return errors;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}
