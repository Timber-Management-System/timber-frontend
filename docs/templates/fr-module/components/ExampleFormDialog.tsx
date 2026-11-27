'use client';

/**
 * TEMPLATE – create / edit popup. One component for both: pass `item` to edit it.
 * Render it only while it is open (see ExamplePage), so the form always starts fresh.
 * Keep popups short: if your form needs more than ~8 fields or several sections, use a page.
 */
import { useState, type FormEvent } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Dialog } from '@/shared/components/ui/Dialog';
import { SelectField } from '@/shared/components/ui/SelectField';
import { TextField } from '@/shared/components/ui/TextField';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { createExampleItem, updateExampleItem } from '../api/example.api';
import { NAME_MAX, toExampleInput, validateExample, type FieldErrors } from '../schemas/example.schema';
import type { ExampleFormValues, ExampleItem } from '../types/example.types';

import styles from './ExamplePage.module.css';

/** TODO: load the real list from the API (e.g. the sites in FR-11) instead of a fixed list. */
const SITE_OPTIONS = ['Site A', 'Site B', 'Site C'].map((s) => ({ value: s, label: s }));

const FORM_ID = 'example-form';

export function ExampleFormDialog({
  item,
  onClose,
  onSaved,
}: {
  /** The record to edit; leave out to create a new one. */
  item?: ExampleItem;
  onClose: () => void;
  onSaved: (item: ExampleItem, created: boolean) => void;
}) {
  const t = useT();
  const [values, setValues] = useState<ExampleFormValues>({
    name: item?.name ?? '',
    site: item?.site ?? '',
    quantity: item ? String(item.quantity) : '',
    note: item?.note ?? '',
  });
  const [errors, setErrors] = useState<FieldErrors<ExampleFormValues>>({});
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof ExampleFormValues) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }));
  };
  const errorText = (field: keyof ExampleFormValues) => errors[field] && t(errors[field], { max: NAME_MAX });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateExample(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    setFailed(false);
    try {
      const input = toExampleInput(values);
      const result = item ? await updateExampleItem(item.id, input) : await createExampleItem(input);
      onSaved(result, !item);
      onClose();
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={item ? t('example.editTitle', { ref: item.reference }) : t('example.createTitle')}
      closeLabel={t('common.close')}
      dismissible={!saving}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form={FORM_ID} loading={saving}>
            {item ? t('common.saveChanges') : t('common.save')}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} noValidate className={styles.form}>
        {failed && <Callout tone="crit">{t('common.saveError')}</Callout>}
        <TextField
          label={t('example.field.name')}
          value={values.name}
          onChange={set('name')}
          error={errorText('name')}
          maxLength={NAME_MAX}
          required
          autoFocus
        />
        <div className={styles.formRow}>
          <SelectField
            label={t('example.field.site')}
            options={SITE_OPTIONS}
            placeholder={t('example.selectSite')}
            value={values.site}
            onChange={set('site')}
            error={errorText('site')}
            required
          />
          <TextField
            label={t('example.field.quantity')}
            type="number"
            inputMode="numeric"
            min={1}
            value={values.quantity}
            onChange={set('quantity')}
            error={errorText('quantity')}
            required
          />
        </div>
        <TextField label={t('example.field.note')} value={values.note} onChange={set('note')} />
      </form>
    </Dialog>
  );
}
