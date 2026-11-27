'use client';

import { forwardRef, useId, type SelectHTMLAttributes } from 'react';

import styles from './Field.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

/**
 *   <SelectField label={t('users.role')} options={roleOptions} value={role} onChange={…} placeholder={t('common.select')} />
 */
export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  /** Shown as the first, empty option. */
  placeholder?: string;
  error?: string;
  hint?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, options, placeholder, error, hint, id, required, className, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const describedBy = [hint && `${selectId}-hint`, error && `${selectId}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={selectId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      <select
        ref={ref}
        id={selectId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={[styles.select, error && styles.invalid].filter(Boolean).join(' ')}
        {...rest}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <span id={`${selectId}-hint`} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={`${selectId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
