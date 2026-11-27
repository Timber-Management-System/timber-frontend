'use client';

import { useState, type FormEvent } from 'react';

import { PasswordRules, passwordMeetsPolicy } from '@/modules/user-access/fr-01-authentication';
import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Checkbox, RadioGroup } from '@/shared/components/ui/Checkbox';
import { Dialog } from '@/shared/components/ui/Dialog';
import { TextField } from '@/shared/components/ui/TextField';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { adminResetPassword, userErrorCode } from '../api/users.api';
import type { User, UserErrorCode } from '../types/user.types';

/** S-18.2 Reset user password (FR-02). Render with key={user.id} so it resets per user. */
export function ResetUserPasswordDialog({
  user,
  onClose,
  onDone,
}: {
  user: User | null;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const t = useT();
  const [method, setMethod] = useState<'link' | 'temporary'>('link');
  const [temporary, setTemporary] = useState('');
  const [unlock, setUnlock] = useState(user?.status === 'LOCKED');
  const [forceChange, setForceChange] = useState(true);
  const [error, setError] = useState<string>();
  const [failure, setFailure] = useState<UserErrorCode | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (method === 'temporary' && !passwordMeetsPolicy(temporary)) {
      setError(t('auth.password.notStrong'));
      return;
    }
    setError(undefined);
    setSaving(true);
    setFailure(null);
    try {
      await adminResetPassword(user.id, { method, temporaryPassword: temporary, unlock, forceChange });
      onDone(t(method === 'link' ? 'users.reset.linkSent' : 'users.reset.tempSet', { name: user.fullName }));
    } catch (err) {
      setFailure(userErrorCode(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={Boolean(user)}
      onClose={onClose}
      title={t('users.reset.title', { name: user?.fullName ?? '' })}
      closeLabel={t('common.close')}
      dismissible={!saving}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="reset-user-form" loading={saving}>
            {t('users.reset.submit')}
          </Button>
        </>
      }
    >
      <form id="reset-user-form" onSubmit={onSubmit} noValidate style={{ display: 'contents' }}>
        {failure && <Callout tone="crit">{t(`users.errors.${failure}`)}</Callout>}
        <RadioGroup
          legend={t('users.reset.method')}
          name="reset-method"
          value={method}
          onChange={(v) => setMethod(v as 'link' | 'temporary')}
          options={[
            {
              value: 'link',
              label: t('users.reset.methodLink'),
              description: t('users.reset.sendTo', { email: user?.email ?? '' }),
            },
            { value: 'temporary', label: t('users.reset.methodTemp') },
          ]}
        />
        {method === 'temporary' && (
          <>
            <TextField
              label={t('users.reset.tempPassword')}
              type="password"
              autoComplete="new-password"
              revealable
              revealLabel={t('auth.password.show')}
              value={temporary}
              onChange={(e) => setTemporary(e.target.value)}
              error={error}
              aria-describedby="temp-rules"
              required
            />
            <PasswordRules password={temporary} id="temp-rules" />
          </>
        )}
        <Checkbox
          label={t('users.reset.unlock')}
          description={user?.status === 'LOCKED' ? t('users.reset.isLocked') : undefined}
          checked={unlock}
          onChange={(e) => setUnlock(e.target.checked)}
        />
        <Checkbox
          label={t('users.reset.forceChange')}
          checked={forceChange || method === 'temporary'}
          disabled={method === 'temporary'}
          onChange={(e) => setForceChange(e.target.checked)}
        />
      </form>
    </Dialog>
  );
}
