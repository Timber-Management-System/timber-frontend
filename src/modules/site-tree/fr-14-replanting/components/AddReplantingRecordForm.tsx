
import { Button } from '@/shared/components/ui/Button';
import styles from './AddReplantingRecordForm.module.css';

export function AddReplantingRecordForm() {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Add Replanting Record</h1>
        <p className={styles.description}>
          Enter the details of the replanting activity.
        </p>
      </header>

      <div className={styles.card}>
        <form className={styles.form}>
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

          <div className={styles.actions}>
            <Button type="button" variant="secondary" disabled>
              Cancel
            </Button>

            <Button type="submit" disabled>
              Save
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
