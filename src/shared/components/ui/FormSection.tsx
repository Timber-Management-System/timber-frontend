import { useId, type ReactNode } from 'react';

import styles from './FormSection.module.css';

/**
 * A numbered group of form fields, e.g. "01 Inspection information", laid out in columns.
 * Use inside a Dialog with bodyTone="sections", or on a full page.
 *
 *   <FormSection number="01" title={t('x.section.info')}>
 *     <TextField … />
 *     <SelectField … />
 *     <FullWidth><TextField label={t('x.note')} … /></FullWidth>
 *   </FormSection>
 */
export function FormSection({
  number,
  title,
  description,
  columns = 2,
  children,
}: {
  number?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Columns on wide screens; phones always use one column. */
  columns?: 1 | 2 | 3;
  children: ReactNode;
}) {
  const titleId = useId();
  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <header className={styles.head}>
        {number && (
          <span className={styles.number} aria-hidden="true">
            {number}
          </span>
        )}
        <div>
          <h3 id={titleId} className={styles.title}>
            {title}
          </h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </header>
      <div className={styles.grid} data-columns={columns}>
        {children}
      </div>
    </section>
  );
}

/** Makes one field span the whole row of a FormSection (notes, addresses, long selects). */
export function FullWidth({ children }: { children: ReactNode }) {
  return <div className={styles.full}>{children}</div>;
}
