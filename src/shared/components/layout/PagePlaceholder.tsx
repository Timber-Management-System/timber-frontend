import styles from './PagePlaceholder.module.css';

/**
 * Temporary content for a page that has not been built yet.
 * When you build the feature, replace the page body with your module's component, e.g.
 *
 *   import { QuotaTrackingPage } from '@/modules/licence-permit/fr-06-quota-tracking';
 *   export default function Page() { return <QuotaTrackingPage />; }
 */
export interface PagePlaceholderProps {
  title: string;
  /** Requirement ID from the proposal, e.g. 'FR-06'. */
  requirement?: string;
  /** Folder where the feature code goes, e.g. 'src/modules/licence-permit/fr-06-quota-tracking'. */
  codeFolder?: string;
}

export function PagePlaceholder({ title, requirement, codeFolder }: PagePlaceholderProps) {
  return (
    <section className={styles.wrap} aria-labelledby="page-title">
      {requirement && <p className={styles.kicker}>{requirement}</p>}
      <h1 id="page-title" className={styles.title}>
        {title}
      </h1>
      <p className={styles.text}>This page has not been built yet.</p>
      {codeFolder && (
        <p className={styles.text}>
          Build it in <code className={styles.code}>{codeFolder}</code>
        </p>
      )}
    </section>
  );
}
