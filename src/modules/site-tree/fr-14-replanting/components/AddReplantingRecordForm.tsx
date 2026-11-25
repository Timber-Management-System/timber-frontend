'use client';

import { Button } from '@/shared/components/ui/Button';
import styles from './AddReplantingRecordForm.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ReplantingCreateInput } from '../types/replanting.types';
import {
  validateReplantingCreate,
  type FieldErrors,
} from '../schemas/replanting.schema';
import { createReplantingRecord } from '../api/replanting.api';

const FIELD_LABELS: Record<keyof ReplantingCreateInput, string> = {
  plantingDate: 'Planting Date',
  site: 'Site / Location',
  species: 'Tree Species',
  treeCount: 'No. of Trees',
  responsibleTeam: 'Responsible Team',
  status: 'Status',
};

export function AddReplantingRecordForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<
  FieldErrors<ReplantingCreateInput>
>({});

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (saving) return;

  const formData = new FormData(event.currentTarget);

  const input: ReplantingCreateInput = {
    plantingDate: String(formData.get('plantingDate') ?? ''),
    site: String(formData.get('site') ?? ''),
    species: String(formData.get('species') ?? ''),
    treeCount: Number(formData.get('treeCount')),
    responsibleTeam: String(formData.get('responsibleTeam') ?? ''),
    status: String(formData.get('status') ?? ''),
  };

  const validationErrors = validateReplantingCreate(input);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    return;
  }

 setSaving(true);

try {
  await createReplantingRecord(input);
  router.push('/site-tree/replanting');
} catch {
  alert('Could not save the replanting record.');
  setSaving(false);
}

}
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Add Replanting Record</h1>
        <p className={styles.description}>
          Enter the details of the replanting activity.
        </p>
      </header>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            Planting Date
            <input
              className={styles.input}
              type="date"
              name="plantingDate"
              required
            />
          </label>

          <label className={styles.field}>
            Site / Location
            <select
              className={styles.input}
              name="site"
              defaultValue=""
              required
            >
              <option value="">Select site</option>
              <option value="Site A">Site A</option>
              <option value="Site B">Site B</option>
              <option value="Site C">Site C</option>
            </select>
          </label>

          <label className={styles.field}>
            Tree Species
            <select
              className={styles.input}
              name="species"
              defaultValue=""
              required
            >
              <option value="">Select tree species</option>
              <option value="Teak">Teak</option>
              <option value="Mahogany">Mahogany</option>
              <option value="Pine">Pine</option>
            </select>
          </label>

          <label className={styles.field}>
            No. of Trees
            <input
              className={styles.input}
              type="number"
              name="treeCount"
              min="1"
              placeholder="Enter number of trees"
              required
            />
          </label>

          <label className={styles.field}>
            Responsible Team
            <input
              className={styles.input}
              type="text"
              name="responsibleTeam"
              placeholder="Enter responsible team"
              required
            />
          </label>

          <label className={styles.field}>
            Status
            <select
              className={styles.input}
              name="status"
              defaultValue=""
              required
            >
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

{Object.keys(errors).length > 0 && (
  <div role="alert" className={styles.validationErrors}>
    {Object.entries(errors).map(([field, message]) => (
      <p key={field}>
        {field === 'treeCount'
          ? 'Please enter a valid number of trees.'
          : `${FIELD_LABELS[field as keyof ReplantingCreateInput]}: ${
              message === 'validation.required'
                ? 'This field is required.'
                : message
            }`}
      </p>
    ))}
  </div>
)}

<div className={styles.actions}>
<Button
  type="button"
  variant="secondary"
  onClick={() => router.push('/site-tree/replanting')}
>
  Cancel
</Button>
<Button type="submit" disabled={saving}>
  {saving ? 'Saving...' : 'Save'}
</Button>
</div>
      </form>
      </div>
    </section>
  );
}
