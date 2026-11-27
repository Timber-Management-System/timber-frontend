'use client';

/**
 * TEMPLATE – list page where every record action happens in a popup (no page change):
 *
 *   New record → form popup        Reference / ••• › View → details popup (review)
 *   ••• › Edit → form popup        ••• › Approve / Reject → confirm popup (reason required to reject)
 *
 * The table updates in place after each save, so reviewing and approving many records is fast.
 * Use a full page instead when the form is long (more than ~8 fields or several sections), must
 * work offline in the field, or needs its own link to share/print. See docs/templates/fr-module/README.md.
 *
 * Every text goes through t() (WR-08): copy messages.en.json into src/i18n/messages/en.json.
 * Buttons and menu items only appear for roles that may use them (FR-01); the backend checks too.
 */
import { useState } from 'react';

import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { Icon } from '@/shared/components/ui/Icon';
import { RowMenu, type RowMenuItem } from '@/shared/components/ui/RowMenu';
import type { Area } from '@/shared/lib/auth/permissions';
import { usePermission } from '@/shared/lib/auth/SessionProvider';
import { formatDate } from '@/shared/lib/format';
import { useLocale, useT } from '@/web-requirements/wr-08-multi-language';

import { decideExampleItem } from '../api/example.api';
import { useExampleItems } from '../hooks/useExampleItems';
import type { ExampleDecision, ExampleItem } from '../types/example.types';

import { ExampleDetailsDialog } from './ExampleDetailsDialog';
import { ExampleFormDialog } from './ExampleFormDialog';
import styles from './ExamplePage.module.css';
import { STATUS_TONE, statusKey } from './status';

/** TODO: your FR's permission area (AREAS in src/shared/lib/auth/permissions.ts). */
const AREA: Area = 'trees-felling';

/** Which popup is open – only one at a time, `null` when none is. */
type Popup =
  | { kind: 'create' }
  | { kind: 'view'; item: ExampleItem }
  | { kind: 'edit'; item: ExampleItem }
  | { kind: 'approve'; item: ExampleItem }
  | { kind: 'reject'; item: ExampleItem }
  | null;

export function ExamplePage() {
  const t = useT();
  const locale = useLocale();
  const { items, loading, error, replace } = useExampleItems();
  const canCreate = usePermission(AREA, 'C');
  const canEdit = usePermission(AREA, 'U');
  const canApprove = usePermission(AREA, 'A');
  const [popup, setPopup] = useState<Popup>(null);
  const [message, setMessage] = useState('');

  const close = () => setPopup(null);
  const open = (next: Popup) => {
    setMessage('');
    setPopup(next);
  };

  /** Show a saved record in the table at once and confirm it to the user. */
  const saved = (item: ExampleItem, text: string) => {
    replace(item);
    setMessage(text);
  };

  async function decide(item: ExampleItem, decision: ExampleDecision, reason: string) {
    const updated = await decideExampleItem(item.id, decision, reason);
    saved(updated, t(decision === 'APPROVED' ? 'example.approvedMsg' : 'example.rejectedMsg', { ref: item.reference }));
  }

  function actionsFor(item: ExampleItem): RowMenuItem[] {
    const pending = item.status === 'PENDING';
    const actions: RowMenuItem[] = [
      { label: t('common.view'), icon: 'eye', onSelect: () => open({ kind: 'view', item }) },
    ];
    if (canEdit && pending)
      actions.push({ label: t('common.edit'), icon: 'edit', onSelect: () => open({ kind: 'edit', item }) });
    if (canApprove && pending) {
      actions.push(
        { label: t('common.approve'), icon: 'check', onSelect: () => open({ kind: 'approve', item }) },
        { label: t('common.reject'), icon: 'blocked', danger: true, onSelect: () => open({ kind: 'reject', item }) },
      );
    }
    return actions;
  }

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumb={[{ label: t('dashboard.home'), href: '/dashboard' }, { label: t('example.title') }]}
        title={t('example.title')}
        description={t('example.description')}
        actions={
          canCreate && (
            <Button leftIcon={<Icon name="plus" />} onClick={() => open({ kind: 'create' })}>
              {t('example.new')}
            </Button>
          )
        }
      />

      <div aria-live="polite" className={styles.message}>
        {message && <Callout tone="ok">{message}</Callout>}
      </div>

      <div className={styles.card}>
        {loading && <p className={styles.muted}>{t('common.loading')}</p>}
        {Boolean(error) && <Callout tone="crit">{t('common.loadError')}</Callout>}
        {!loading && !error && items.length === 0 && <p className={styles.muted}>{t('common.noRecords')}</p>}
        {!loading && !error && items.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{t('example.field.reference')}</th>
                  <th scope="col">{t('example.field.name')}</th>
                  <th scope="col">{t('example.field.site')}</th>
                  <th scope="col" className={styles.num}>
                    {t('example.field.quantity')}
                  </th>
                  <th scope="col">{t('example.field.status')}</th>
                  <th scope="col">{t('example.field.updatedAt')}</th>
                  <th scope="col">
                    <span className="sr-only">{t('common.actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {/* Clicking the reference opens the review popup – the quickest way to check a record. */}
                      <button type="button" className={styles.ref} onClick={() => open({ kind: 'view', item })}>
                        {item.reference}
                      </button>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.site}</td>
                    <td className={styles.num}>{item.quantity}</td>
                    <td>
                      <Badge tone={STATUS_TONE[item.status]}>{t(statusKey(item.status))}</Badge>
                    </td>
                    <td>{formatDate(item.updatedAt, locale)}</td>
                    <td className={styles.actions}>
                      <RowMenu label={t('common.moreActions', { name: item.reference })} items={actionsFor(item)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Popups: render each one only while it is open, so it always starts fresh. */}
      {(popup?.kind === 'create' || popup?.kind === 'edit') && (
        <ExampleFormDialog
          item={popup.kind === 'edit' ? popup.item : undefined}
          onClose={close}
          onSaved={(item, created) =>
            saved(item, t(created ? 'example.createdMsg' : 'example.updatedMsg', { ref: item.reference }))
          }
        />
      )}

      {popup?.kind === 'view' && (
        <ExampleDetailsDialog
          item={popup.item}
          onClose={close}
          onEdit={canEdit ? () => open({ kind: 'edit', item: popup.item }) : undefined}
          onApprove={canApprove ? () => open({ kind: 'approve', item: popup.item }) : undefined}
          onReject={canApprove ? () => open({ kind: 'reject', item: popup.item }) : undefined}
        />
      )}

      {popup?.kind === 'approve' && (
        <ConfirmDialog
          open
          onClose={close}
          title={t('example.approveTitle', { ref: popup.item.reference })}
          description={t('example.approveText')}
          confirmLabel={t('common.approve')}
          reason={{ label: t('example.field.decisionReason'), hint: t('example.reasonOptional') }}
          onConfirm={(reason) => decide(popup.item, 'APPROVED', reason)}
        />
      )}

      {popup?.kind === 'reject' && (
        <ConfirmDialog
          open
          onClose={close}
          title={t('example.rejectTitle', { ref: popup.item.reference })}
          description={t('example.rejectText')}
          confirmLabel={t('common.reject')}
          tone="danger"
          reason={{ label: t('common.reason'), required: true }}
          onConfirm={(reason) => decide(popup.item, 'REJECTED', reason)}
        />
      )}
    </div>
  );
}
