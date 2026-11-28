'use client';

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';

import styles from './Field.module.css';
import { Icon, type IconName } from './Icon';

/**
 * Text input with label, hint and error (all text passed in already translated).
 *
 *   <TextField label={t('auth.email')} type="email" value={email} onChange={…} error={errors.email} />
 *   <TextField label={t('auth.password')} type="password" revealable />   // eye button to show it
 */
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  hint?: ReactNode;
  error?: string;
  icon?: IconName;
  /** For type="password": adds a show / hide button. */
  revealable?: boolean;
  revealLabel?: string;
  /** Extra class for the <input> itself (className goes on the wrapper). */
  inputClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    hint,
    error,
    icon,
    revealable,
    revealLabel = 'Show password',
    inputClassName,
    id,
    type = 'text',
    required,
    className,
    'aria-describedby': extraDescribedBy,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [revealed, setRevealed] = useState(false);
  const describedBy =
    [extraDescribedBy, hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(' ') || undefined;
  const showToggle = revealable && type === 'password';

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className={styles.control}>
        {icon && <Icon name={icon} size={16} className={styles.icon} />}
        <input
          ref={ref}
          id={inputId}
          type={showToggle && revealed ? 'text' : type}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            styles.input,
            icon && styles.hasIcon,
            showToggle && styles.hasAction,
            error && styles.invalid,
            inputClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {showToggle && (
          <button
            type="button"
            className={styles.action}
            aria-label={revealLabel}
            aria-pressed={revealed}
            onClick={() => setRevealed((v) => !v)}
          >
            <Icon name={revealed ? 'eyeOff' : 'eye'} size={16} />
          </button>
        )}
      </div>
      {hint && (
        <span id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
