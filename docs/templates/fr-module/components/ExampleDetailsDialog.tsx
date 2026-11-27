'use client';

/**
 * TEMPLATE – view / review popup. Shows the record read-only; for a pending record the
 * reviewer can Edit, Reject or Approve straight from here. Leave a callback out to hide
 * that button (pass them only when the role has the permission).
 */
import type { ReactNode } from 'react';

import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Dialog } from '@/shared/components/ui/Dialog';
import { formatDate } from '@/shared/lib/format';
import { useLocale, useT } from '@/web-requirements/wr-08-multi-language';

import type { ExampleItem } from '../types/example.types';

import styles from './ExamplePage.module.css';
import { STATUS_TONE, isEditable, statusKey } from './status';

export function ExampleDetailsDialog({
  item,
  onClose,
  onEdit,
  onApprove,
  onReject,
}: {
  item: ExampleItem;
  onClose: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const t = useT();
  const locale = useLocale();
  const pending = item.status === 'PENDING';
  const editable = isEditable(item.status);

  const rows: [string, ReactNode][] = [
    [
      t('example.field.reference'),
      <span key="ref" className={styles.mono}>
        {item.reference}
      </span>,
    ],
    [t('example.field.date'), item.date ? formatDate(item.date, locale) : '—'],
    [t('example.field.name'), item.name],
    [t('example.field.site'), item.site || '—'],
    [t('example.field.quantity'), item.quantity ?? '—'],
    [
      t('example.field.status'),
      <Badge key="status" tone={STATUS_TONE[item.status]}>
        {t(statusKey(item.status))}
      </Badge>,
    ],
    [t('example.field.updatedAt'), formatDate(item.updatedAt, locale)],
  ];
  if (item.note) rows.push([t('example.field.note'), item.note]);
  if (item.decisionReason) rows.push([t('example.field.decisionReason'), item.decisionReason]);

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('example.viewTitle', { ref: item.reference })}
      closeLabel={t('common.close')}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t('common.close')}
          </Button>
          {editable && onEdit && (
            <Button variant="secondary" onClick={onEdit}>
              {t('common.edit')}
            </Button>
          )}
          {pending && onReject && (
            <Button variant="danger" onClick={onReject}>
              {t('common.reject')}
            </Button>
          )}
          {pending && onApprove && <Button onClick={onApprove}>{t('common.approve')}</Button>}
        </>
      }
    >
      <dl className={styles.details}>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Dialog>
  );
}
