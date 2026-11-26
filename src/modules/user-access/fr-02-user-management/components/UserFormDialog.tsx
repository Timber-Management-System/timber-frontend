'use client';

import { useState, type FormEvent } from 'react';

import { useRoleLabeller, type RoleSummary } from '@/modules/user-access/fr-01-authentication';
import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Checkbox, RadioGroup } from '@/shared/components/ui/Checkbox';
import { Dialog } from '@/shared/components/ui/Dialog';
import { SelectField } from '@/shared/components/ui/SelectField';
import { TextField } from '@/shared/components/ui/TextField';
import type { RoleKey } from '@/shared/lib/auth/roles';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { createUser, updateUser, userErrorCode } from '../api/users.api';
import { mfaForcedFor, validateUser, type UserFormErrors } from '../schemas/user.schema';
import type { User, UserErrorCode, UserInput } from '../types/user.types';

import styles from './UsersPage.module.css';

function initialInput(user: User | null): UserInput {
  return {
    fullName: user?.fullName ?? '',
    employeeId: user?.employeeId ?? '',
    email: user?.email ?? '',
    mobile: user?.mobile ?? '',
    role: user?.role ?? '',
    siteTeam: user?.siteTeam ?? '',
    language: user?.language ?? 'en',
    active: user ? user.status !== 'DEACTIVATED' : true,
    sendInvite: !user,
    forcePasswordChange: !user,
    requireMfa: user?.mfaEnabled ?? false,
  };
}

/**
 * S-01.6 Add / edit user (FR-02). Permissions come from the role (S-01.7);
 * per-user overrides are out of scope for Phase 1. MFA is mandatory for Administrators.
 * Render it with key={user?.id ?? 'new'} so the form resets for each user.
 */
export function UserFormDialog({
  open,
  user,
  roles,
  siteTeams,
  onClose,
  onSaved,
}: {
  open: boolean;
  user: User | null;
  roles: RoleSummary[];
  siteTeams: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useT();
  const roleLabel = useRoleLabeller();
  const [input, setInput] = useState<UserInput>(() => initialInput(user));
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [failure, setFailure] = useState<UserErrorCode | null>(null);
  const [saving, setSaving] = useState(false);
  const editing = Boolean(user);
  const mfaForced = mfaForcedFor(input.role) || Boolean(roles.find((r) => r.id === input.role)?.mfaRequired);

  const set = <K extends keyof UserInput>(key: K, value: UserInput[K]) => setInput((v) => ({ ...v, [key]: value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateUser(input);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    setFailure(null);
    const payload = { ...input, requireMfa: input.requireMfa || mfaForced };
    try {
      if (user) await updateUser(user.id, payload);
      else await createUser(payload);
      onSaved();
    } catch (error) {
      setFailure(userErrorCode(error));
    } finally {
      setSaving(false);
    }
  }

  const err = (key: keyof UserInput) => (errors[key] ? t(errors[key]!) : undefined);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title={editing ? t('users.form.editTitle', { name: user!.fullName }) : t('users.form.addTitle')}
      description={t('users.form.note')}
      closeLabel={t('common.close')}
      dismissible={!saving}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="user-form" loading={saving}>
            {editing ? t('common.saveChanges') : t('users.form.create')}
          </Button>
        </>
      }
    >
      <form id="user-form" className={styles.formGrid} onSubmit={onSubmit} noValidate>
        {failure && (
          <div className={styles.span2}>
            <Callout tone="crit">{t(`users.errors.${failure}`)}</Callout>
          </div>
        )}
        <TextField
          label={t('users.form.fullName')}
          placeholder="e.g. Nimal Perera"
          value={input.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          error={err('fullName')}
          required
          autoFocus
        />
        <TextField
          label={t('users.form.employeeId')}
          placeholder="EMP-0042"
          value={input.employeeId}
          onChange={(e) => set('employeeId', e.target.value.toUpperCase())}
          error={err('employeeId')}
          required
        />
        <TextField
          label={t('users.form.email')}
          type="email"
          placeholder="name@company.lk"
          value={input.email}
          onChange={(e) => set('email', e.target.value)}
          error={err('email')}
          required
        />
        <TextField
          label={t('users.form.mobile')}
          type="tel"
          placeholder="+94 7X XXX XXXX"
          value={input.mobile}
          onChange={(e) => set('mobile', e.target.value)}
          error={err('mobile')}
        />
        <SelectField
          label={t('users.form.role')}
          value={input.role}
          onChange={(e) => set('role', e.target.value as RoleKey | '')}
          placeholder={t('users.form.selectRole')}
          options={roles.map((r) => ({ value: r.id, label: r.builtIn ? roleLabel(r.id) : r.label }))}
          error={err('role')}
          required
        />
        <TextField
          label={t('users.form.siteTeam')}
          list="user-site-teams"
          placeholder={t('users.form.selectSite')}
          value={input.siteTeam}
          onChange={(e) => set('siteTeam', e.target.value)}
          error={err('siteTeam')}
          required
        />
        <datalist id="user-site-teams">
          {siteTeams.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <SelectField
          label={t('users.form.language')}
          value={input.language}
          onChange={(e) => set('language', e.target.value as UserInput['language'])}
          options={[
            { value: 'en', label: 'English' },
            { value: 'si', label: 'සිංහල' },
            { value: 'ta', label: 'தமிழ்' },
          ]}
        />
        <RadioGroup
          legend={t('users.form.status')}
          name="user-status"
          inline
          value={input.active ? 'active' : 'inactive'}
          onChange={(v) => set('active', v === 'active')}
          options={[
            { value: 'active', label: t('users.status.ACTIVE') },
            { value: 'inactive', label: t('users.form.inactive') },
          ]}
        />

        <fieldset className={[styles.span2, styles.fieldset].join(' ')}>
          <legend className={styles.legend}>{t('users.form.security')}</legend>
          {!editing && (
            <Checkbox
              label={t('users.form.sendInvite')}
              checked={input.sendInvite}
              onChange={(e) => set('sendInvite', e.target.checked)}
            />
          )}
          <Checkbox
            label={t('users.form.forceChange')}
            checked={input.forcePasswordChange}
            onChange={(e) => set('forcePasswordChange', e.target.checked)}
          />
          <Checkbox
            label={t('users.form.requireMfa')}
            description={mfaForced ? t('users.form.mfaMandatory') : undefined}
            checked={input.requireMfa || mfaForced}
            disabled={mfaForced}
            onChange={(e) => set('requireMfa', e.target.checked)}
          />
        </fieldset>
      </form>
    </Dialog>
  );
}
