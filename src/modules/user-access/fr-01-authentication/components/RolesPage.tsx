'use client';

import { useState } from 'react';

import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { ACTIONS, AREAS, type Action, type Area, type PermissionSet } from '@/shared/lib/auth/permissions';
import type { RoleKey } from '@/shared/lib/auth/roles';
import { usePermission } from '@/shared/lib/auth/SessionProvider';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { saveRolePermissions } from '../api/roles.api';
import { useRoles } from '../hooks/useRoles';
import type { RoleSummary } from '../types/auth.types';

import { AdminTabs } from './AdminTabs';
import { NewRoleDialog } from './NewRoleDialog';
import styles from './RolesPage.module.css';
import { useRoleLabeller } from './useRoleLabel';

const ORDER = 'CRUA';

/** Adds or removes one action. Create/update/approve need read; removing read removes them too. */
function toggle(set: PermissionSet, area: Area, action: Action): PermissionSet {
  const current = new Set(set[area] ?? '');
  if (current.has(action)) {
    current.delete(action);
    if (action === 'R') current.clear();
  } else {
    current.add(action);
    current.add('R');
  }
  const value = [...ORDER].filter((a) => current.has(a)).join('');
  const next = { ...set };
  if (value) next[area] = value;
  else delete next[area];
  return next;
}

/** S-01.7 Roles & permissions (FR-01). Pre-filled from proposal section 12. */
export function RolesPage() {
  const t = useT();
  const roleLabel = useRoleLabeller();
  const canEdit = usePermission('users-settings', 'U');
  const canCreate = usePermission('users-settings', 'C');
  const { roles, loading, error, reload } = useRoles();
  const [selectedId, setSelectedId] = useState<RoleKey | null>(null);
  const [draft, setDraft] = useState<PermissionSet | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const selected: RoleSummary | undefined =
    roles.find((r) => r.id === selectedId) ?? roles.find((r) => r.id === 'COMPLIANCE') ?? roles[0];
  const permissions = draft ?? selected?.permissions ?? {};
  const dirty = draft !== null;
  const name = (r: RoleSummary) => (r.builtIn ? roleLabel(r.id) : r.label);

  const select = (id: RoleKey) => {
    setSelectedId(id);
    setDraft(null);
    setSaved(false);
  };

  async function save() {
    if (!selected || !draft) return;
    setSaving(true);
    try {
      await saveRolePermissions(selected.id, draft);
      setDraft(null);
      setSaved(true);
      reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumb={[{ label: t('admin.title') }, { label: t('roles.title') }]}
        title={t('roles.title')}
        actions={
          canCreate && (
            <Button leftIcon={<Icon name="plus" />} onClick={() => setNewOpen(true)}>
              {t('roles.new.title')}
            </Button>
          )
        }
      />
      <AdminTabs />

      {Boolean(error) && <Callout tone="crit">{t('common.loadError')}</Callout>}
      {loading && <p className={styles.muted}>{t('common.loading')}</p>}

      {!loading && selected && (
        <div className={styles.grid}>
          <Card title={t('roles.list')} flush>
            <ul className={styles.roleList}>
              {roles.map((r) => {
                const active = r.id === selected.id;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      className={[styles.role, active && styles.roleActive].filter(Boolean).join(' ')}
                      aria-pressed={active}
                      onClick={() => select(r.id)}
                    >
                      <span className={styles.roleName}>{name(r)}</span>
                      <span className={styles.roleMeta}>
                        {r.id === 'CUSTOMER'
                          ? t('roles.external')
                          : r.id === 'AUDITOR'
                            ? t('roles.readOnly')
                            : t(r.userCount === 1 ? 'roles.userCountOne' : 'roles.userCount', { count: r.userCount })}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card
            title={t('roles.matrixTitle', { role: name(selected) })}
            subtitle={t('roles.legend')}
            actions={
              canEdit &&
              dirty && (
                <>
                  <Button variant="secondary" size="sm" onClick={() => setDraft(null)} disabled={saving}>
                    {t('common.undo')}
                  </Button>
                  <Button size="sm" onClick={save} loading={saving}>
                    {t('common.saveChanges')}
                  </Button>
                </>
              )
            }
          >
            {saved && !dirty && <Callout tone="ok">{t('roles.saved')}</Callout>}
            {selected.id === 'CUSTOMER' && <Callout tone="info">{t('roles.customerNote')}</Callout>}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <caption className="sr-only">{t('roles.matrixTitle', { role: name(selected) })}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('roles.area')}</th>
                    {ACTIONS.map((a) => (
                      <th key={a} scope="col" className={styles.center}>
                        {t(`roles.actions.${a}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AREAS.map((area) => (
                    <tr key={area}>
                      <th scope="row">{t(`areas.${area}`)}</th>
                      {ACTIONS.map((action) => {
                        const isDelete = action === 'D';
                        const checked = !isDelete && Boolean(permissions[area]?.includes(action));
                        return (
                          <td key={action} className={styles.center}>
                            <input
                              type="checkbox"
                              className={styles.check}
                              checked={checked}
                              disabled={!canEdit || isDelete || saving}
                              title={isDelete ? t('roles.deleteOff') : undefined}
                              aria-label={`${t(`areas.${area}`)} – ${t(`roles.actions.${action}`)}`}
                              onChange={() => {
                                setSaved(false);
                                setDraft(toggle(permissions, area, action));
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>{t('roles.deleteNote')}</p>
          </Card>
        </div>
      )}

      <NewRoleDialog
        open={newOpen}
        roles={roles}
        onClose={() => setNewOpen(false)}
        onCreated={(id) => {
          reload();
          select(id);
        }}
      />
    </div>
  );
}
