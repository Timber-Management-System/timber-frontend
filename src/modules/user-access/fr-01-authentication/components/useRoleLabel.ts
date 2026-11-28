'use client';

import { isRoleId, ROLES, type RoleKey } from '@/shared/lib/auth/roles';
import { useTranslateOr } from '@/web-requirements/wr-08-multi-language';

/** "custom-quality-inspector" → "Quality inspector" (custom roles keep the admin's wording). */
function customRoleName(role: string): string {
  const words = role.replace(/^custom-/, '').replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Returns a function that gives the translated name of any role. */
export function useRoleLabeller(): (role: RoleKey) => string {
  const tOr = useTranslateOr();
  return (role) => (isRoleId(role) ? tOr(`roles.${role}`, ROLES[role].label) : customRoleName(role));
}

/** Translated name of one role. */
export function useRoleLabel(role: RoleKey | undefined): string {
  const label = useRoleLabeller();
  return role ? label(role) : '';
}
