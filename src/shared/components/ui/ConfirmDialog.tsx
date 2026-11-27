'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';

import { useT } from '@/web-requirements/wr-08-multi-language';

import { Button } from './Button';
import { Callout } from './Callout';
import { Dialog } from './Dialog';
import { TextField } from './TextField';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  /**
   * Runs the action (approve, reject, cancel a record…). Receives the typed reason ('' when
   * there is no reason field). Resolve to close the dialog; throw to keep it open and show an error.
   */
  onConfirm: (reason: string) => Promise<void> | void;
  title: ReactNode;
  description?: ReactNode;
  /** Optional summary of the record (e.g. a <dl> with reference, site, quantity). */
  children?: ReactNode;
  confirmLabel: string;
  /** 'danger' for reject / cancel / deactivate, 'primary' for approve. */
  tone?: 'primary' | 'danger';
  /** Show a reason field. `required: true` for rejections (the reason goes to the audit log). */
  reason?: { label: string; required?: boolean; hint?: string };
  /** Message shown when onConfirm throws. Defaults to a general "could not save" message. */
  errorText?: string;
}

/**
 * Small confirmation popup for record decisions: Approve, Reject (with reason), Cancel record…
 * The user stays on the list page, so approving many records is fast.
 *
 *   <ConfirmDialog
 *     open={dialog?.kind === 'reject'}
 *     onClose={close}
 *     title={t('example.reject.title')}
 *     confirmLabel={t('common.reject')}
 *     tone="danger"
 *     reason={{ label: t('common.reason'), required: true }}
 *     onConfirm={(reason) => rejectItem(item.id, reason)}
 *   />
 *
 * There is no "delete" confirmation on purpose: records are never deleted (BR-09).
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmLabel,
  tone = 'primary',
  reason,
  errorText,
}: ConfirmDialogProps) {
  const t = useT();
  const formId = useId();
  const [text, setText] = useState('');
  const [fieldError, setFieldError] = useState<string>();
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  // Start clean every time the dialog opens.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setText('');
      setFieldError(undefined);
      setFailed(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (reason?.required && !text.trim()) {
      setFieldError(t('validation.required'));
      return;
    }
    setBusy(true);
    setFailed(false);
    try {
      await onConfirm(text.trim());
      onClose();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      title={title}
      description={description}
      closeLabel={t('common.close')}
      dismissible={!busy}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form={formId} variant={tone} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} noValidate style={{ display: 'contents' }}>
        {failed && <Callout tone="crit">{errorText ?? t('common.saveError')}</Callout>}
        {children}
        {reason && (
          <TextField
            label={reason.label}
            hint={reason.hint}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (fieldError) setFieldError(undefined);
            }}
            error={fieldError}
            required={reason.required}
            autoFocus
          />
        )}
      </form>
    </Dialog>
  );
}
