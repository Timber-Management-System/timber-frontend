'use client';

import { useState, type FormEvent } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Dialog } from '@/shared/components/ui/Dialog';
import { SelectField } from '@/shared/components/ui/SelectField';
import { TextField } from '@/shared/components/ui/TextField';
import type { RoleKey } from '@/shared/lib/auth/roles';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { authErrorCode } from '../api/errors';
import { createRole } from '../api/roles.api';
import type { AuthErrorCode, RoleSummary } from '../types/auth.types';

import { useRoleLabeller } from './useRoleLabel';

/** S-18.1 New role (FR-01). Permissions are then set in the matrix (S-01.7). */
export function NewRoleDialog({
  open,
  roles,
  onClose,
  onCreated,
}: {
  open: boolean;
  roles: RoleSummary[];
  onClose: () => void;
  onCreated: (id: RoleKey) => void;
}) {
  const t = useT();
  const roleLabel = useRoleLabeller();
  const [name, setName] = useState('');
  const [copyFrom, setCopyFrom] = useState<RoleKey | ''>('YARD_MANAGER');
  const [description, setDescription] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [nameError, setNameError] = useState<string>();
  const [failure, setFailure] = useState<AuthErrorCode | null>(null);
  const [saving, setSaving] = useState(false);

  const close = () => {
    setName('');
    setDescription('');
    setMfaRequired(false);
    setNameError(undefined);
    setFailure(null);
    onClose();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 3) {
      setNameError(t('validation.minLength', { min: 3 }));
      return;
    }
    setNameError(undefined);
    setSaving(true);
    try {
      const id = await createRole({ name, copyFrom, description, mfaRequired });
      onCreated(id);
      close();
    } catch (error) {
      setFailure(authErrorCode(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title={t('roles.new.title')}
      description={t('roles.new.note')}
      closeLabel={t('common.close')}
      dismissible={!saving}
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="new-role-form" loading={saving}>
            {t('roles.new.create')}
          </Button>
        </>
      }
    >
      <form id="new-role-form" onSubmit={onSubmit} noValidate style={{ display: 'contents' }}>
        {failure && <Callout tone="crit">{t(`auth.errors.${failure}`)}</Callout>}
        <TextField
          label={t('roles.new.name')}
          placeholder={t('roles.new.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={nameError}
          required
          autoFocus
        />
        <SelectField
          label={t('roles.new.copyFrom')}
          value={copyFrom}
          onChange={(e) => setCopyFrom(e.target.value as RoleKey | '')}
          placeholder={t('roles.new.startEmpty')}
          options={roles.filter((r) => !r.external).map((r) => ({ value: r.id, label: roleLabel(r.id) }))}
        />
        <TextField
          label={t('roles.new.description')}
          placeholder={t('roles.new.descriptionPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Checkbox label={t('roles.new.mfa')} checked={mfaRequired} onChange={(e) => setMfaRequired(e.target.checked)} />
      </form>
    </Dialog>
  );
}
