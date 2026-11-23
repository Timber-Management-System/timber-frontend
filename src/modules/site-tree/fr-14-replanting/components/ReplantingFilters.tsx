import styles from './ReplantingFilters.module.css';

export function ReplantingFilters() {
  return (
    <section className={styles.card} aria-label="Replanting record filters">
      <h2 className={styles.title}>Search Filters</h2>

      <form className={styles.form}>
        <label className={styles.field}>
          Planting Date From
          <input className={styles.input} type="date" name="dateFrom" />
        </label>

        <label className={styles.field}>
          Planting Date To
          <input className={styles.input} type="date" name="dateTo" />
        </label>

        <label className={styles.field}>
          Site / Location
          <select className={styles.input} name="site" defaultValue="">
            <option value="">All sites</option>
          </select>
        </label>

        <label className={styles.field}>
          Tree Species
          <select className={styles.input} name="species" defaultValue="">
            <option value="">All species</option>
          </select>
        </label>

        <label className={styles.field}>
          Status
          <select className={styles.input} name="status" defaultValue="">
            <option value="">All statuses</option>
          </select>
        </label>

        <label className={styles.field}>
          Record ID
          <input
            className={styles.input}
            type="search"
            name="recordId"
            placeholder="e.g. RP-001"
          />
        </label>
      </form>
    </section>
  );
}
