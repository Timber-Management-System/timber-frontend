'use client';

import { useState, type FormEvent } from 'react';

import { AdminTabs, useRoleLabeller, useRoles } from '@/modules/user-access/fr-01-authentication';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Badge, type BadgeTone } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Icon } from '@/shared/components/ui/Icon';
import { SelectField } from '@/shared/components/ui/SelectField';
import { TextField } from '@/shared/components/ui/TextField';
import { usePermission } from '@/shared/lib/auth/SessionProvider';
import { formatLastSeen } from '@/shared/lib/format';
import { useLocale, useT } from '@/web-requirements/wr-08-multi-language';

import { listAllUsers } from '../api/users.api';
import { useUsers } from '../hooks/useUsers';
import type { User, UserFilters, UserStatus } from '../types/user.types';

import { ResetUserPasswordDialog } from './ResetUserPasswordDialog';
import { RowMenu } from './RowMenu';
import { UserFormDialog } from './UserFormDialog';
import styles from './UsersPage.module.css';
import { UserStatusDialog } from './UserStatusDialog';

const PAGE_SIZE = 10;
const STATUS_TONE: Record<UserStatus, BadgeTone> = { ACTIVE: 'ok', LOCKED: 'warn', DEACTIVATED: 'crit' };
const NO_FILTERS = { search: '', role: '', status: '', siteTeam: '' } as const;

type Dialog = { kind: 'form'; user: User | null } | { kind: 'reset'; user: User } | { kind: 'status'; user: User };

/** S-01.5 Users (FR-02). Users are never deleted, so the audit history stays complete (FR-03). */
export function UsersPage() {
  const t = useT();
  const locale = useLocale();
  const roleLabel = useRoleLabeller();
  const canCreate = usePermission('users-settings', 'C');
  const canEdit = usePermission('users-settings', 'U');
  const { roles } = useRoles();

  const [draft, setDraft] = useState<Omit<UserFilters, 'page' | 'pageSize'>>({ ...NO_FILTERS });
  const [filters, setFilters] = useState<UserFilters>({ ...NO_FILTERS, page: 1, pageSize: PAGE_SIZE });
  const { data, loading, error, reload } = useUsers(filters);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const pages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const from = data.total === 0 ? 0 : (filters.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(filters.page * PAGE_SIZE, data.total);

  function apply(e: FormEvent) {
    e.preventDefault();
    setFilters({ ...draft, page: 1, pageSize: PAGE_SIZE });
  }

  function finish(text: string) {
    setDialog(null);
    setMessage(text);
    reload();
  }

  async function exportCsv() {
    setExporting(true);
    try {
      const rows = await listAllUsers(filters);
      const header = ['name', 'email', 'role', 'siteTeam', 'lastLogin', 'mfa', 'status'].map((k) =>
        t(`users.col.${k}`),
      );
      const lines = rows.map((u) => [
        u.fullName,
        u.email,
        roleLabel(u.role),
        u.siteTeam,
        u.lastLoginAt ?? '',
        u.mfaEnabled ? t('common.on') : t('common.off'),
        t(`users.status.${u.status}`),
      ]);
      const csv = [header, ...lines]
        .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');
      const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.builtIn ? roleLabel(r.id) : r.label }));

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumb={[{ label: t('admin.title') }, { label: t('users.title') }]}
        title={t('users.title')}
        actions={
          <>
            <Button variant="secondary" leftIcon={<Icon name="download" />} loading={exporting} onClick={exportCsv}>
              {t('common.export')}
            </Button>
            {canCreate && (
              <Button leftIcon={<Icon name="plus" />} onClick={() => setDialog({ kind: 'form', user: null })}>
                {t('users.add')}
              </Button>
            )}
          </>
        }
      />
      <AdminTabs />

      {message && (
        <div className={styles.message}>
          <Callout tone="ok">{message}</Callout>
        </div>
      )}

      <form className={styles.filters} onSubmit={apply} role="search">
        <TextField
          label={t('common.search')}
          icon="search"
          placeholder={t('users.searchPlaceholder')}
          value={draft.search}
          onChange={(e) => setDraft({ ...draft, search: e.target.value })}
        />
        <SelectField
          label={t('users.col.role')}
          value={draft.role}
          onChange={(e) => setDraft({ ...draft, role: e.target.value as UserFilters['role'] })}
          placeholder={t('common.all')}
          options={roleOptions}
        />
        <SelectField
          label={t('users.col.status')}
          value={draft.status}
          onChange={(e) => setDraft({ ...draft, status: e.target.value as UserFilters['status'] })}
          placeholder={t('common.all')}
          options={(['ACTIVE', 'LOCKED', 'DEACTIVATED'] as const).map((s) => ({
            value: s,
            label: t(`users.status.${s}`),
          }))}
        />
        <SelectField
          label={t('users.col.siteTeam')}
          value={draft.siteTeam}
          onChange={(e) => setDraft({ ...draft, siteTeam: e.target.value })}
          placeholder={t('common.all')}
          options={data.siteTeams.map((s) => ({ value: s, label: s }))}
        />
        <Button type="submit" className={styles.apply}>
          {t('common.apply')}
        </Button>
      </form>

      {Boolean(error) && <Callout tone="crit">{t('common.loadError')}</Callout>}

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table} aria-busy={loading}>
            <caption className="sr-only">{t('users.title')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('users.col.name')}</th>
                <th scope="col">{t('users.col.email')}</th>
                <th scope="col">{t('users.col.role')}</th>
                <th scope="col">{t('users.col.siteTeam')}</th>
                <th scope="col">{t('users.col.lastLogin')}</th>
                <th scope="col">{t('users.col.mfa')}</th>
                <th scope="col">{t('users.col.status')}</th>
                <th scope="col">
                  <span className="sr-only">{t('common.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading && data.items.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.empty}>
                    {t('users.empty')}
                  </td>
                </tr>
              )}
              {data.items.map((u) => (
                <tr key={u.id}>
                  <th scope="row" className={styles.name}>
                    {u.fullName}
                  </th>
                  <td>{u.email}</td>
                  <td>{roleLabel(u.role)}</td>
                  <td>{u.siteTeam}</td>
                  <td>
                    {u.lastLoginAt
                      ? formatLastSeen(u.lastLoginAt, locale, {
                          today: t('time.today'),
                          yesterday: t('time.yesterday'),
                        })
                      : t('users.neverSignedIn')}
                  </td>
                  <td>{u.mfaEnabled ? t('common.on') : '–'}</td>
                  <td>
                    <Badge tone={STATUS_TONE[u.status]}>{t(`users.status.${u.status}`)}</Badge>
                  </td>
                  <td className={styles.actionsCell}>
                    {canEdit && (
                      <RowMenu
                        label={t('users.menuFor', { name: u.fullName })}
                        items={[
                          {
                            label: t('common.edit'),
                            icon: 'edit',
                            onSelect: () => setDialog({ kind: 'form', user: u }),
                          },
                          {
                            label: t('users.reset.action'),
                            icon: 'key',
                            onSelect: () => setDialog({ kind: 'reset', user: u }),
                          },
                          u.status === 'DEACTIVATED'
                            ? {
                                label: t('users.status.reactivate'),
                                icon: 'refresh',
                                onSelect: () => setDialog({ kind: 'status', user: u }),
                              }
                            : {
                                label: t('users.status.deactivate'),
                                icon: 'blocked',
                                danger: true,
                                onSelect: () => setDialog({ kind: 'status', user: u }),
                              },
                        ]}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pager}>
          <span>{t('users.showing', { from, to, total: data.total })}</span>
          <nav className={styles.pages} aria-label={t('common.pagination')}>
            <Button
              variant="ghost"
              size="sm"
              disabled={filters.page <= 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            >
              ‹ {t('common.prev')}
            </Button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === filters.page ? 'secondary' : 'ghost'}
                size="sm"
                aria-current={p === filters.page ? 'page' : undefined}
                onClick={() => setFilters({ ...filters, page: p })}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              disabled={filters.page >= pages}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            >
              {t('common.next')} ›
            </Button>
          </nav>
        </div>
      </div>

      {dialog?.kind === 'form' && (
        <UserFormDialog
          key={dialog.user?.id ?? 'new'}
          open
          user={dialog.user}
          roles={roles}
          siteTeams={data.siteTeams}
          onClose={() => setDialog(null)}
          onSaved={() => finish(dialog.user ? t('users.form.updated') : t('users.form.created'))}
        />
      )}
      {dialog?.kind === 'reset' && (
        <ResetUserPasswordDialog
          key={dialog.user.id}
          user={dialog.user}
          onClose={() => setDialog(null)}
          onDone={finish}
        />
      )}
      {dialog?.kind === 'status' && (
        <UserStatusDialog key={dialog.user.id} user={dialog.user} onClose={() => setDialog(null)} onDone={finish} />
      )}
    </div>
  );
}
