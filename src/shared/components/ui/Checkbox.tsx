'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import styles from './Field.module.css';

/**
 *   <Checkbox label={t('auth.rememberDevice')} checked={remember} onChange={(e) => setRemember(e.target.checked)} />
 */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, ...rest },
  ref,
) {
  return (
    <label className={[styles.check, className].filter(Boolean).join(' ')}>
      <input ref={ref} type="checkbox" {...rest} />
      <span className={styles.checkText}>
        <span>{label}</span>
        {description && <span className={styles.checkDescription}>{description}</span>}
      </span>
    </label>
  );
});

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface RadioGroupProps {
  legend: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  /** Show options side by side instead of stacked. */
  inline?: boolean;
}

export function RadioGroup({ legend, name, options, value, onChange, inline }: RadioGroupProps) {
  return (
    <fieldset className={[styles.group, inline && styles.groupRow].filter(Boolean).join(' ')}>
      <legend className={[styles.label, styles.legend].join(' ')}>{legend}</legend>
      {options.map((o) => (
        <label key={o.value} className={styles.check}>
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          <span className={styles.checkText}>
            <span>{o.label}</span>
            {o.description && <span className={styles.checkDescription}>{o.description}</span>}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
