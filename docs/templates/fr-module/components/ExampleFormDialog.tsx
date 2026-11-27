'use client';

/**
 * TEMPLATE – create / edit popup with steps (matches the approved "New Quality Inspection" popup):
 *
 *   EYEBROW (module)            title + description                                  [x]
 *   ( 1 Information ) ——— ( 2 Details ) ——— ( 3 Review )        <- Stepper, doesn't scroll
 *   ┌ 01 Section ─────────────┐                                  <- FormSection cards, body scrolls
 *   │ field        field      │
 *   └─────────────────────────┘
 *   Cancel                               [Back] [Save as draft] [Continue]
 *
 * - "Continue" checks only the fields on the current step (STEP_FIELDS in the schema).
 * - "Save as draft" needs only a name, so people can stop and finish later (new or draft records).
 * - The last step shows everything for a final check, then saves.
 * - Pass `item` to edit; render it only while open (see ExamplePage), so it always starts fresh.
 *
 * Short forms (up to ~6 fields) don't need steps: keep ONE step and remove the Stepper.
 */
import { useState, type FormEvent } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';
import { Dialog } from '@/shared/components/ui/Dialog';
import { FormSection, FullWidth } from '@/shared/components/ui/FormSection';
import { SelectField } from '@/shared/components/ui/SelectField';
import { Stepper } from '@/shared/components/ui/Stepper';
import { TextField } from '@/shared/components/ui/TextField';
import { formatDate } from '@/shared/lib/format';
import { useLocale, useT } from '@/web-requirements/wr-08-multi-language';

import { createExampleItem, updateExampleItem } from '../api/example.api';
import {
  DRAFT_FIELDS,
  NAME_MAX,
  STEP_FIELDS,
  firstStepWithError,
  toExampleInput,
  validateExample,
  type FieldErrors,
} from '../schemas/example.schema';
import type { ExampleFormValues, ExampleItem } from '../types/example.types';

import styles from './ExamplePage.module.css';

/** TODO: load the real list from the API (e.g. the sites in FR-11) instead of a fixed list. */
const SITE_OPTIONS = ['Site A', 'Site B', 'Site C'].map((s) => ({ value: s, label: s }));

const FORM_ID = 'example-form';
const LAST_STEP = STEP_FIELDS.length - 1;

/** Today as YYYY-MM-DD in the user's own time zone (for the date input). */
function today(): string {
  const d = new Date();
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
}

export interface SavedInfo {
  created: boolean;
  draft: boolean;
}

export function ExampleFormDialog({
  item,
  onClose,
  onSaved,
}: {
  /** The record to edit; leave out to create a new one. */
  item?: ExampleItem;
  onClose: () => void;
  onSaved: (item: ExampleItem, info: SavedInfo) => void;
}) {
  const t = useT();
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ExampleFormValues>({
    date: item?.date ?? today(),
    name: item?.name ?? '',
    site: item?.site ?? '',
    quantity: item?.quantity === undefined ? '' : String(item.quantity),
    note: item?.note ?? '',
  });
  const [errors, setErrors] = useState<FieldErrors<ExampleFormValues>>({});
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState<'draft' | 'final' | null>(null);

  const isDraft = !item || item.status === 'DRAFT';
  const steps = [t('example.step.information'), t('example.step.details'), t('example.step.review')];

  const set = (field: keyof ExampleFormValues) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }));
  };
  const errorText = (field: keyof ExampleFormValues) => errors[field] && t(errors[field], { max: NAME_MAX });

  /** Check this step's fields, then move on. */
  function next() {
    const found = validateExample(values, STEP_FIELDS[step]);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep((s) => s + 1);
  }

  async function save(draft: boolean) {
    const found = validateExample(values, draft ? DRAFT_FIELDS : undefined);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStep(Math.max(0, firstStepWithError(found))); // show the step with the problem
      return;
    }
    setSaving(draft ? 'draft' : 'final');
    setFailed(false);
    try {
      const input = toExampleInput(values);
      const result = item
        ? await updateExampleItem(item.id, input, { draft })
        : await createExampleItem(input, { draft });
      onSaved(result, { created: !item, draft });
      onClose();
    } catch {
      setFailed(true);
    } finally {
      setSaving(null);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault(); // Enter in a field = Continue, or Save on the last step
    if (step < LAST_STEP) next();
    else void save(false);
  }

  const busy = saving !== null;
  const finalLabel = isDraft ? t('example.submit') : t('common.saveChanges');

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      bodyTone="sections"
      eyebrow={t('example.eyebrow')}
      title={item ? t('example.editTitle', { ref: item.reference }) : t('example.createTitle')}
      description={t('example.formDescription')}
      subheader={
        <Stepper
          steps={steps}
          current={step}
          label={t('common.progress')}
          completedLabel={t('common.completed')}
          onStepClick={busy ? undefined : setStep}
        />
      }
      closeLabel={t('common.close')}
      dismissible={!busy}
      footerStart={
        <Button variant="ghost" onClick={onClose} disabled={busy}>
          {t('common.cancel')}
        </Button>
      }
      footer={
        <>
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)} disabled={busy}>
              {t('common.back')}
            </Button>
          )}
          {isDraft && (
            <Button
              variant="secondary"
              onClick={() => void save(true)}
              loading={saving === 'draft'}
              disabled={saving === 'final'}
            >
              {t('common.saveDraft')}
            </Button>
          )}
          <Button type="submit" form={FORM_ID} loading={saving === 'final'} disabled={saving === 'draft'}>
            {step < LAST_STEP ? t('common.continue') : finalLabel}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} noValidate className={styles.form}>
        {failed && <Callout tone="crit">{t('common.saveError')}</Callout>}

        {step === 0 && (
          <>
            <FormSection number="01" title={t('example.section.record')}>
              <TextField
                label={t('example.field.reference')}
                value={item?.reference ?? t('example.autoRef')}
                readOnly
                hint={t('example.autoRefHint')}
                inputClassName={item ? styles.mono : undefined}
              />
              <TextField
                label={t('example.field.date')}
                type="date"
                value={values.date}
                onChange={set('date')}
                error={errorText('date')}
                required
                autoFocus
              />
            </FormSection>
            <FormSection number="02" title={t('example.section.where')}>
              <TextField
                label={t('example.field.name')}
                value={values.name}
                onChange={set('name')}
                error={errorText('name')}
                maxLength={NAME_MAX}
                required
              />
              <SelectField
                label={t('example.field.site')}
                options={SITE_OPTIONS}
                placeholder={t('example.selectSite')}
                value={values.site}
                onChange={set('site')}
                error={errorText('site')}
                required
              />
            </FormSection>
          </>
        )}

        {step === 1 && (
          <FormSection number="03" title={t('example.section.details')}>
            <TextField
              label={t('example.field.quantity')}
              type="number"
              inputMode="numeric"
              min={1}
              value={values.quantity}
              onChange={set('quantity')}
              error={errorText('quantity')}
              required
              autoFocus
            />
            <FullWidth>
              <TextField label={t('example.field.note')} value={values.note} onChange={set('note')} />
            </FullWidth>
          </FormSection>
        )}

        {step === LAST_STEP && (
          <FormSection
            number="04"
            title={t('example.section.review')}
            description={t('example.reviewHint')}
            columns={1}
          >
            <dl className={styles.details}>
              {[
                [t('example.field.date'), values.date ? formatDate(values.date, locale) : '—'],
                [t('example.field.name'), values.name || '—'],
                [t('example.field.site'), values.site || '—'],
                [t('example.field.quantity'), values.quantity || '—'],
                [t('example.field.note'), values.note || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </FormSection>
        )}
      </form>
    </Dialog>
  );
}
