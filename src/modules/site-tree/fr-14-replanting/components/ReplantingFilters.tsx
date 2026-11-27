import styles from './ReplantingFilters.module.css';
import { Button } from '@/shared/components/ui/Button';
import type { FormEvent } from 'react';


type FilterValues = {
  dateFrom: string;
  dateTo: string;
  site: string;
  species: string;
  status: string;
  recordId: string;
};

type ReplantingFiltersProps = {
  onSearch: (filters: FilterValues) => void;
};

export function ReplantingFilters({
  onSearch,
}: ReplantingFiltersProps) {
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const dateFrom = String(formData.get('dateFrom') ?? '');
    const dateTo = String(formData.get('dateTo') ?? '');

if (dateFrom && dateTo && dateFrom > dateTo) {
  alert('Planting Date From cannot be later than Planting Date To.');
  return;
}

    onSearch({
      dateFrom: String(formData.get('dateFrom') ?? ''),
      dateTo: String(formData.get('dateTo') ?? ''),
      site: String(formData.get('site') ?? ''),
      species: String(formData.get('species') ?? ''),
      status: String(formData.get('status') ?? ''),
      recordId: String(formData.get('recordId') ?? ''),
    });
  }

  return (
    <section className={styles.card} aria-label="Replanting record filters">
      <h2 className={styles.title}>Search Filters</h2>

      <form
  className={styles.form}
  onSubmit={handleSearch}
  onReset={() =>
    onSearch({
      dateFrom: '',
      dateTo: '',
      site: '',
      species: '',
      status: '',
      recordId: '',
    })
  }
>
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
            <option value="Site A">Site A</option>
            <option value="Site B">Site B</option>
            <option value="Site C">Site C</option>
          </select>
        </label>

        <label className={styles.field}>
          Tree Species
          <select className={styles.input} name="species" defaultValue="">
            <option value="">All species</option>
            <option value="Teak">Teak</option>
            <option value="Mahogany">Mahogany</option>
            <option value="Pine">Pine</option>
          </select>
        </label>

        <label className={styles.field}>
          Status
          <select className={styles.input} name="status" defaultValue="">
          <option value="">All statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
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
        <div className={styles.actions}>
          <Button type="submit" variant="secondary">
    Search
  </Button>

  <Button type="reset" variant="secondary">
    Reset
  </Button>
</div>
      </form>
    </section>
  );
}
