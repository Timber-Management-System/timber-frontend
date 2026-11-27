'use client';

import { useEffect, useState, type FormEvent } from 'react';

import { useRoleLabel } from '@/modules/user-access/fr-01-authentication';
import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Dialog } from '@/shared/components/ui/Dialog';
import { TextField } from '@/shared/components/ui/TextField';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { getOpenItems, setUserActive, userErrorCode } from '../api/users.api';
import type { OpenItem, User, UserErrorCode } from '../types/user.types';

import styles from './UsersPage.module.css';

/**
 * S-13.9 Confirm – deactivate user (FR-02), and the matching reactivate confirmation.
 * Users are never deleted: records and audit history stay unchanged (BR-09, FR-03).
 * Render with key={user.id}.
 */
export function UserStatusDialog({
  user,
  onClose,
  onDone,
}: {
  user: User | null;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const t = useT();
  const roleLabel = useRoleLabel(user?.role);
  const deactivating = user?.status !== 'DEACTIVATED';
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState<string>();
  const [openItems, setOpenItems] = useState<OpenItem[] | null>(null);
  const [failure, setFailure] = useState<UserErrorCode | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !deactivating) return;
    let active = true;
    getOpenItems(user.id)
      .then((items) => {
        if (active) setOpenItems(items);
      })
      .catch(() => {
        if (active) setOpenItems([]);
      });
    return () => {
      active = false;
    };
  }, [user, deactivating]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (deactivating && reason.trim().length < 3) {
      setReasonError(t('validation.required'));
      return;
    }
    setSaving(true);
    setFailure(null);
    try {
      await setUserActive(user.id, !deactivating, reason.trim());
      onDone(t(deactivating ? 'users.status.deactivatedMsg' : 'users.status.reactivatedMsg', { name: user.fullName }));
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
      size="sm"
      title={t(deactivating ? 'users.status.deactivateTitle' : 'users.status.reactivateTitle')}
      description={
        user && t(deactivating ? 'users.status.deactivateText' : 'users.status.reactivateText', { name: user.fullName })
      }
      closeLabel={t('common.close')}
      dismissible={!saving}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="user-status-form" variant={deactivating ? 'danger' : 'primary'} loading={saving}>
            {t(deactivating ? 'users.status.deactivate' : 'users.status.reactivate')}
          </Button>
        </>
      }
    >
      <form id="user-status-form" onSubmit={onSubmit} noValidate style={{ display: 'contents' }}>
        {failure && <Callout tone="crit">{t(`users.errors.${failure}`)}</Callout>}
        {user && (
          <dl className={styles.summary}>
            <div>
              <dt>{t('users.col.name')}</dt>
              <dd>{user.fullName}</dd>
            </div>
            <div>
              <dt>{t('users.col.role')}</dt>
              <dd>{roleLabel}</dd>
            </div>
            {deactivating && (
              <div>
                <dt>{t('users.status.openItems')}</dt>
                <dd>
                  {openItems === null
                    ? t('common.loading')
                    : openItems.length === 0
                      ? t('users.status.noOpenItems')
                      : openItems.map((i) => t(i.label, { count: i.count })).join(', ')}
                </dd>
              </div>
            )}
          </dl>
        )}
        {deactivating && (
          <TextField
            label={t('users.status.reason')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={reasonError}
            required
            autoFocus
          />
        )}
      </form>
    </Dialog>
  );
}
