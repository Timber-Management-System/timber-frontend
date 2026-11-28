'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Icon } from '@/shared/components/ui/Icon';
import { TextField } from '@/shared/components/ui/TextField';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { requestPasswordReset, resetPassword } from '../api/auth.api';
import { authErrorCode } from '../api/errors';
import { isEmail, validateNewPassword } from '../schemas/password';
import type { AuthErrorCode } from '../types/auth.types';

import styles from './Auth.module.css';
import { AuthShell } from './AuthShell';
import { PasswordRules } from './PasswordRules';

type Step = 'request' | 'reset' | 'done';

/**
 * S-01.2 Reset password (FR-01, FR-02).
 *   1. Enter email → a code is sent (the screen never reveals whether the email exists).
 *   2. Enter the code and a new password that meets the policy.
 * An admin-triggered reset link (S-18.2) opens step 2 directly with email and code filled in.
 */
export function ResetPasswordPage({
  initialEmail = '',
  initialCode = '',
}: {
  initialEmail?: string;
  initialCode?: string;
}) {
  const t = useT();
  const [step, setStep] = useState<Step>(initialEmail && initialCode ? 'reset' : 'request');
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialCode);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ email?: string; code?: string; newPassword?: string; confirm?: string }>({});
  const [failure, setFailure] = useState<AuthErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onRequest(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setErrors({ email: t('validation.email') });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await requestPasswordReset(email);
      setStep('reset');
    } catch (error) {
      setFailure(authErrorCode(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function onReset(e: FormEvent) {
    e.preventDefault();
    const found = validateNewPassword(password, confirm);
    const next = {
      code: code.trim() ? undefined : t('validation.required'),
      newPassword: found.newPassword && t(found.newPassword),
      confirm: found.confirm && t(found.confirm),
    };
    setErrors(next);
    if (next.code || next.newPassword || next.confirm) return;

    setSubmitting(true);
    setFailure(null);
    try {
      await resetPassword({ email, code, newPassword: password });
      setStep('done');
    } catch (error) {
      setFailure(authErrorCode(error));
    } finally {
      setSubmitting(false);
    }
  }

  const back = (
    <Link href="/login" className={[styles.link, styles.back].join(' ')}>
      <Icon name="arrowLeft" size={14} />
      {t('auth.backToSignIn')}
    </Link>
  );

  if (step === 'done') {
    return (
      <AuthShell title={t('auth.reset.title')} footerText={t('auth.footer')}>
        <div className={styles.form}>
          <Callout tone="ok" title={t('auth.reset.doneTitle')}>
            {t('auth.reset.doneText')}
          </Callout>
          {back}
        </div>
      </AuthShell>
    );
  }

  if (step === 'request') {
    return (
      <AuthShell title={t('auth.reset.title')} intro={t('auth.reset.introRequest')} footerText={t('auth.footer')}>
        <form className={styles.form} onSubmit={onRequest} noValidate>
          {failure && <Callout tone="crit">{t(`auth.errors.${failure}`)}</Callout>}
          <TextField
            label={t('auth.reset.email')}
            type="email"
            icon="mail"
            autoComplete="email"
            placeholder="name@company.lk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />
          <Button type="submit" size="lg" fullWidth loading={submitting}>
            {t('auth.reset.sendCode')}
          </Button>
          {back}
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t('auth.reset.title')} intro={t('auth.reset.introCode', { email })} footerText={t('auth.footer')}>
      <form className={styles.form} onSubmit={onReset} noValidate>
        {failure && <Callout tone="crit">{t(`auth.errors.${failure}`)}</Callout>}
        <TextField
          label={t('auth.reset.code')}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          inputClassName={styles.code}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          error={errors.code}
          required
        />
        <TextField
          label={t('auth.password.new')}
          type="password"
          autoComplete="new-password"
          revealable
          revealLabel={t('auth.password.show')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.newPassword}
          aria-describedby="reset-rules"
          required
        />
        <PasswordRules password={password} id="reset-rules" />
        <TextField
          label={t('auth.password.confirm')}
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          required
        />
        <Button type="submit" size="lg" fullWidth loading={submitting}>
          {t('auth.reset.submit')}
        </Button>
        <div className={styles.row}>
          {back}
          <button
            type="button"
            className={[styles.link, styles.linkButton].join(' ')}
            onClick={() => {
              setStep('request');
              setFailure(null);
            }}
          >
            {t('auth.reset.resend')}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
