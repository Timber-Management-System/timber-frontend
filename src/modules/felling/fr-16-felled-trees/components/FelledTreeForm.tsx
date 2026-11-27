'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/shared/components/ui/Button';
import type {
  FelledTreeCreateInput,
  FellingStatus,
} from '../types/felled-trees.types';
import { validateFelledTreeCreate } from '../schemas/felled-trees.schema';
import styles from './FelledTreeForm.module.css';

interface FelledTreeFormProps {
  initialValues?: FelledTreeCreateInput;
  onSubmit: (values: FelledTreeCreateInput) => Promise<void>;
  onCancel: () => void;
  mode: 'add' | 'edit';
}

// Default values for a new record
const DEFAULT_VALUES: FelledTreeCreateInput = {
  fellingDate: '',
  fellingTeam: '',
  siteLocation: '',
  treeId: '',
  permitId: '',
  actualLength: 0,
  actualDiameter: 0,
  status: 'PENDING',
  remarks: '',
};

export function FelledTreeForm({
  initialValues,
  onSubmit,
  onCancel,
  mode,
}: FelledTreeFormProps) {
  const [values, setValues] = useState<FelledTreeCreateInput>(
    initialValues ?? DEFAULT_VALUES,
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof FelledTreeCreateInput, string>>
  >({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Update form values
  function handleChange<K extends keyof FelledTreeCreateInput>(
    field: K,
    value: FelledTreeCreateInput[K],
  ) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  // Validate and submit the form
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    const validationErrors = validateFelledTreeCreate(values);
    setErrors(validationErrors);
    setSubmitError('');

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSubmitting(true);
      await onSubmit(values);
    } catch {
      setSubmitError('Unable to save the record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // Display user-friendly validation messages
  function renderError(field: keyof FelledTreeCreateInput) {
    const error = errors[field];

    if (!error) return null;

    const message =
      error === 'validation.required'
        ? 'This field is required.'
        : error === 'validation.positiveNumber'
          ? 'Enter a number greater than zero.'
          : error;

    return (
      <span className={styles.fieldError} role="alert">
        {message}
      </span>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className={styles.title}>
        {mode === 'add' ? 'Add Felled Tree' : 'Edit Felled Tree'}
      </h2>

      <div className={styles.grid}>
        <label className={styles.field}>
          Felling Date *
          <input
            type="date"
            required
            value={values.fellingDate}
            onChange={(e) =>
              handleChange('fellingDate', e.target.value)
            }
          />
          {renderError('fellingDate')}
        </label>

        <label className={styles.field}>
          Felling Team *
          <input
            type="text"
            required
            placeholder="Enter felling team"
            value={values.fellingTeam}
            onChange={(e) =>
              handleChange('fellingTeam', e.target.value)
            }
          />
          {renderError('fellingTeam')}
        </label>

        <label className={styles.field}>
          Site / Location *
          <input
            type="text"
            required
            placeholder="Enter site or location"
            value={values.siteLocation}
            onChange={(e) =>
              handleChange('siteLocation', e.target.value)
            }
          />
          {renderError('siteLocation')}
        </label>

        <label className={styles.field}>
          Tree ID *
          <input
            type="text"
            required
            placeholder="e.g. TREE-001"
            value={values.treeId}
            onChange={(e) =>
              handleChange('treeId', e.target.value)
            }
          />
          {renderError('treeId')}
        </label>

        <label className={styles.field}>
          Permit ID *
          <input
            type="text"
            required
            placeholder="e.g. PER-001"
            value={values.permitId}
            onChange={(e) =>
              handleChange('permitId', e.target.value)
            }
          />
          {renderError('permitId')}
        </label>

        <label className={styles.field}>
          Felling Status *
          <select
            required
            value={values.status}
            onChange={(e) =>
              handleChange(
                'status',
                e.target.value as FellingStatus,
              )
            }
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {renderError('status')}
        </label>

        <label className={styles.field}>
          Actual Length (m) *
          <input
            type="number"
            required
            min="0"
            step="any"
            placeholder="Enter length"
            value={values.actualLength || ''}
            onChange={(e) =>
              handleChange('actualLength', Number(e.target.value))
            }
          />
          {renderError('actualLength')}
        </label>

        <label className={styles.field}>
          Actual Diameter (cm) *
          <input
            type="number"
            required
            min="0"
            step="any"
            placeholder="Enter diameter"
            value={values.actualDiameter || ''}
            onChange={(e) =>
              handleChange('actualDiameter', Number(e.target.value))
            }
          />
          {renderError('actualDiameter')}
        </label>

        <label className={`${styles.field} ${styles.fullWidth}`}>
          Remarks (Optional)
          <textarea
            rows={4}
            placeholder="Enter additional remarks"
            value={values.remarks ?? ''}
            onChange={(e) =>
              handleChange('remarks', e.target.value)
            }
          />
        </label>
      </div>

      {submitError && (
        <p className={styles.submitError} role="alert">
          {submitError}
        </p>
      )}

      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={submitting}
          disabled={submitting}
        >
          {mode === 'add' ? 'Save Record' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}