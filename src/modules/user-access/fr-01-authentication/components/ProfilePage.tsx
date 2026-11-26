'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Card } from '@/shared/components/ui/Card';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { SelectField } from '@/shared/components/ui/SelectField';
import { TextField } from '@/shared/components/ui/TextField';
import { useSession } from '@/shared/lib/auth/SessionProvider';
import { setLocaleCookie, useT } from '@/web-requirements/wr-08-multi-language';

import { changePassword, getMyProfile, listSessions, saveMyProfile, signOutSession } from '../api/auth.api';
import { authErrorCode } from '../api/errors';
import { validateNewPassword } from '../schemas/password';
import type { AuthErrorCode, DeviceSession, MyProfile } from '../types/auth.types';

import { PasswordRules } from './PasswordRules';
import styles from './ProfilePage.module.css';
import { useRoleLabel } from './useRoleLabel';

/** S-13.7 My profile & change password (FR-01, FR-02). */
export function ProfilePage({ forceChange = false }: { forceChange?: boolean }) {
  const t = useT();
  const { user, refresh } = useSession();
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const mustChange = forceChange || Boolean(user?.mustChangePassword);

  useEffect(() => {
    let active = true;
    Promise.all([getMyProfile(), listSessions()])
      .then(([p, d]) => {
        if (!active) return;
        setProfile(p);
        setDevices(d);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <PageHeader title={t('profile.title')} />
      {mustChange && (
        <Callout tone="warn" title={t('profile.mustChangeTitle')}>
          {t('profile.mustChangeText')}
        </Callout>
      )}
      <div className={styles.grid}>
        <div className={styles.column}>
          {profile ? <DetailsCard profile={profile} onSaved={setProfile} /> : <Card>{t('common.loading')}</Card>}
        </div>
        <div className={styles.column}>
          <PasswordCard highlight={mustChange} onChanged={refresh} />
          <SessionsCard devices={devices} onSignedOut={(id) => setDevices((d) => d.filter((x) => x.id !== id))} />
        </div>
      </div>
    </div>
  );
}

function DetailsCard({ profile, onSaved }: { profile: MyProfile; onSaved: (p: MyProfile) => void }) {
  const t = useT();
  const router = useRouter();
  const roleLabel = useRoleLabel(profile.role);
  const [mobile, setMobile] = useState(profile.mobile);
  const [language, setLanguage] = useState(profile.language);
  const [notify, setNotify] = useState(profile.notify);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await saveMyProfile({ mobile, language, notify });
      onSaved({ ...profile, mobile, language, notify });
      setSaved(true);
      if (language !== profile.language) {
        setLocaleCookie(language);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title={t('profile.details')}>
      <form className={styles.form} onSubmit={onSubmit}>
        {saved && <Callout tone="ok">{t('common.savedOk')}</Callout>}
        <dl className={styles.facts}>
          <div>
            <dt>{t('profile.fullName')}</dt>
            <dd>{profile.fullName}</dd>
          </div>
          <div>
            <dt>{t('profile.employeeId')}</dt>
            <dd className={styles.mono}>{profile.employeeId}</dd>
          </div>
          <div>
            <dt>{t('profile.email')}</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt>{t('profile.role')}</dt>
            <dd>{roleLabel}</dd>
          </div>
          <div>
            <dt>{t('profile.siteTeam')}</dt>
            <dd>{profile.siteTeam}</dd>
          </div>
        </dl>
        <p className={styles.hint}>{t('profile.adminManaged')}</p>

        <TextField
          label={t('profile.mobile')}
          type="tel"
          autoComplete="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          hint={t('profile.mobileHint')}
        />
        <SelectField
          label={t('common.language')}
          value={language}
          onChange={(e) => setLanguage(e.target.value as MyProfile['language'])}
          options={[
            { value: 'en', label: 'English' },
            { value: 'si', label: 'සිංහල' },
            { value: 'ta', label: 'தமிழ்' },
          ]}
        />
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{t('profile.notifyBy')}</legend>
          <Checkbox
            label={t('profile.notifyInApp')}
            checked={notify.inApp}
            onChange={(e) => setNotify({ ...notify, inApp: e.target.checked })}
          />
          <Checkbox
            label={t('profile.notifyEmail')}
            checked={notify.email}
            onChange={(e) => setNotify({ ...notify, email: e.target.checked })}
          />
          <Checkbox
            label={t('profile.notifySms')}
            checked={notify.sms}
            onChange={(e) => setNotify({ ...notify, sms: e.target.checked })}
          />
        </fieldset>
        <div>
          <Button type="submit" loading={saving}>
            {t('common.saveChanges')}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function PasswordCard({ highlight, onChanged }: { highlight: boolean; onChanged: () => Promise<void> }) {
  const t = useT();
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ current?: string; newPassword?: string; confirm?: string }>({});
  const [failure, setFailure] = useState<AuthErrorCode | null>(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateNewPassword(password, confirm);
    const next = {
      current: current ? undefined : t('validation.required'),
      newPassword: found.newPassword && t(found.newPassword),
      confirm: found.confirm && t(found.confirm),
    };
    setErrors(next);
    if (next.current || next.newPassword || next.confirm) return;

    setSaving(true);
    setFailure(null);
    setDone(false);
    try {
      await changePassword({ currentPassword: current, newPassword: password });
      setCurrent('');
      setPassword('');
      setConfirm('');
      setDone(true);
      await onChanged();
    } catch (error) {
      setFailure(authErrorCode(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title={t('profile.changePassword')} className={highlight ? styles.highlight : undefined}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {done && <Callout tone="ok">{t('profile.passwordChanged')}</Callout>}
        {failure && <Callout tone="crit">{t(`auth.errors.${failure}`)}</Callout>}
        <TextField
          label={t('profile.currentPassword')}
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          error={errors.current}
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
          aria-describedby="profile-rules"
          required
        />
        <PasswordRules password={password} id="profile-rules" />
        <TextField
          label={t('auth.password.confirm')}
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          required
        />
        <div>
          <Button type="submit" loading={saving}>
            {t('profile.updatePassword')}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function SessionsCard({ devices, onSignedOut }: { devices: DeviceSession[]; onSignedOut: (id: string) => void }) {
  const t = useT();
  const [busy, setBusy] = useState<string | null>(null);

  async function signOut(id: string) {
    setBusy(id);
    try {
      await signOutSession(id);
      onSignedOut(id);
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card title={t('profile.sessions')} flush>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{t('profile.device')}</th>
              <th scope="col">{t('profile.location')}</th>
              <th scope="col">{t('profile.lastActive')}</th>
              <th scope="col">
                <span className="sr-only">{t('common.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr key={d.id}>
                <td>{d.device}</td>
                <td>{d.location}</td>
                <td>{t(`profile.when.${d.lastActive}`)}</td>
                <td className={styles.right}>
                  {d.current ? (
                    <span className={styles.muted}>{t('profile.thisDevice')}</span>
                  ) : (
                    <Button variant="ghost" size="sm" loading={busy === d.id} onClick={() => signOut(d.id)}>
                      {t('auth.signOut')}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
