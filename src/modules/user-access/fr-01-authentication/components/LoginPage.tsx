'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { TextField } from '@/shared/components/ui/TextField';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { login } from '../api/auth.api';
import { authErrorCode } from '../api/errors';
import type { AuthErrorCode } from '../types/auth.types';

import styles from './Auth.module.css';
import { AuthShell } from './AuthShell';
import { safeNext } from './safe-next';

/**
 * S-01.1 Login (FR-01). After sign-in the user lands on the dashboard for their role (WR-02).
 * Administrators continue to MFA (S-01.3). The account locks after 5 failed attempts.
 */
export function LoginPage({ next, reason }: { next?: string; reason?: string }) {
  const t = useT();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [failure, setFailure] = useState<AuthErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (!identifier.trim()) found.identifier = t('validation.required');
    if (!password) found.password = t('validation.required');
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    setFailure(null);
    try {
      const result = await login({ identifier, password, remember });
      const target = safeNext(next);
      if (result.next === 'MFA') router.push(`/mfa?next=${encodeURIComponent(target)}`);
      else router.replace(target);
    } catch (error) {
      setFailure(authErrorCode(error));
      setPassword('');
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title={t('auth.login.title')} intro={t('auth.login.intro')} footerText={t('auth.footer')}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {reason === 'timeout' && !failure && <Callout tone="info">{t('auth.login.timedOut')}</Callout>}
        {reason === 'signedOut' && !failure && <Callout tone="ok">{t('auth.login.signedOut')}</Callout>}
        {failure && <Callout tone="crit">{t(`auth.errors.${failure}`)}</Callout>}

        <TextField
          label={t('auth.login.identifier')}
          placeholder="name@company.lk"
          autoComplete="username"
          icon="user"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          error={errors.identifier}
          required
        />
        <TextField
          label={t('auth.login.password')}
          type="password"
          autoComplete="current-password"
          icon="lock"
          revealable
          revealLabel={t('auth.password.show')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className={styles.row}>
          <Checkbox
            label={t('auth.login.remember')}
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Link href="/forgot-password" className={styles.link}>
            {t('auth.login.forgot')}
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth loading={submitting}>
          {t('auth.login.submit')}
        </Button>
      </form>
    </AuthShell>
  );
}
