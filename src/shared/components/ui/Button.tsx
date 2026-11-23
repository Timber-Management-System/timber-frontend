import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import styles from './Button.module.css';

/**
 * TimberTrack button (Option B).
 *
 *   variant   primary   amber – the ONE main action on a screen ("New permit", "Save")
 *             secondary white/cream with border – filters, export, cancel
 *             ghost     text-style link button – "Mark all as read", "View all"
 *             danger    red – destructive or blocking actions (needs a confirm dialog)
 *   size      sm 32px · md 40px (default) · lg 48px (field screens / large touch targets)
 *
 * Examples:
 *   <Button>Save</Button>
 *   <Button variant="secondary" leftIcon={<Icon name="sliders" />}>Filters</Button>
 *   <Button variant="ghost" size="sm">View all</Button>
 *   <Button iconOnly variant="secondary" aria-label="Notifications"><Icon name="bell" /></Button>
 *   <Button loading>Saving…</Button>
 *
 * Link that looks like a button (Next.js):
 *   <Link href="/permits/new" className={buttonClassName({ variant: 'primary' })}>New permit</Link>
 *
 * Icon-only buttons MUST have an aria-label. Button text must come from i18n, not be hard-coded.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square button that only shows an icon. Requires aria-label. */
  iconOnly?: boolean;
  /** Stretch to the full width of the parent (e.g. mobile forms). */
  fullWidth?: boolean;
  className?: string;
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, Omit<ButtonStyleOptions, 'className'> {
  /** Icon shown before the text, e.g. <Icon name="plus" />. */
  leftIcon?: ReactNode;
  /** Icon shown after the text, e.g. <Icon name="chevronDown" />. */
  rightIcon?: ReactNode;
  /** Shows a spinner and disables the button while an action is running. */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    iconOnly,
    fullWidth,
    leftIcon,
    rightIcon,
    loading = false,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClassName({ variant, size, iconOnly, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});
