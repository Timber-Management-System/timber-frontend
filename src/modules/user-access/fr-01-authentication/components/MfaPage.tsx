'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { TextField } from '@/shared/components/ui/TextField';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { hasPendingMfa, verifyMfa } from '../api/auth.api';
import { authErrorCode } from '../api/errors';
import type { AuthErrorCode } from '../types/auth.types';

import styles from './Auth.module.css';
import { AuthShell } from './AuthShell';
import { safeNext } from './safe-next';

/** S-01.3 Admin MFA verification (NFR security: mandatory for Administrators). */
export function MfaPage({ next }: { next?: string }) {
  const t = useT();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [useBackup, setUseBackup] = useState(false);
  const [trust, setTrust] = useState(false);
  const [failure, setFailure] = useState<AuthErrorCode | null>(null);
  const [fieldError, setFieldError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  // Opened directly without signing in first: back to the login page.
  useEffect(() => {
    if (!hasPendingMfa()) router.replace('/login');
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const valid = useBackup ? code.trim().length >= 6 : /^\d{6}$/.test(code);
    if (!valid) {
      setFieldError(t(useBackup ? 'auth.mfa.backupInvalid' : 'auth.mfa.codeInvalid'));
      return;
    }
    setFieldError(undefined);
    setSubmitting(true);
    setFailure(null);
    try {
      await verifyMfa({ code, trustDevice: trust, backupCode: useBackup });
      router.replace(safeNext(next));
    } catch (error) {
      setFailure(authErrorCode(error));
      setCode('');
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title={t('auth.mfa.title')}
      intro={t(useBackup ? 'auth.mfa.introBackup' : 'auth.mfa.intro')}
      footerText={t('auth.footer')}
    >
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {failure && <Callout tone="crit">{t(`auth.errors.${failure}`)}</Callout>}

        <TextField
          key={useBackup ? 'backup' : 'app'}
          label={t(useBackup ? 'auth.mfa.backupLabel' : 'auth.mfa.codeLabel')}
          inputMode={useBackup ? 'text' : 'numeric'}
          autoComplete="one-time-code"
          maxLength={useBackup ? 12 : 6}
          inputClassName={useBackup ? undefined : styles.code}
          value={code}
          onChange={(e) => setCode(useBackup ? e.target.value : e.target.value.replace(/\D/g, ''))}
          error={fieldError}
          autoFocus
          required
        />

        <Checkbox label={t('auth.mfa.trust')} checked={trust} onChange={(e) => setTrust(e.target.checked)} />

        <Button type="submit" size="lg" fullWidth loading={submitting}>
          {t('auth.mfa.submit')}
        </Button>

        <div className={styles.row}>
          <button
            type="button"
            className={[styles.link, styles.linkButton].join(' ')}
            onClick={() => {
              setUseBackup((v) => !v);
              setCode('');
              setFieldError(undefined);
            }}
          >
            {t(useBackup ? 'auth.mfa.useApp' : 'auth.mfa.useBackup')}
          </button>
          <Link href="/login" className={styles.link}>
            {t('auth.backToSignIn')}
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
