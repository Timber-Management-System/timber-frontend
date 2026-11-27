import styles from './ReplantingRecordsTable.module.css';
import { Button } from '@/shared/components/ui/Button';
import type { ReplantingRecord } from '../types/replanting.types';
import { useRouter } from 'next/navigation';


type ReplantingRecordsTableProps = {
  records: ReplantingRecord[];
};

export function ReplantingRecordsTable({
  records,
}: ReplantingRecordsTableProps) {
  const router = useRouter();
  return (
    <section className={styles.card} aria-label="Replanting records">
      <h2 className={styles.title}>Replanting Records List</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Record ID</th>
              <th scope="col">Planting Date</th>
              <th scope="col">Site / Location</th>
              <th scope="col">Tree Species</th>
              <th scope="col">No. of Trees</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  No replanting records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.plantingDate}</td>
                  <td>{record.site}</td>
                  <td>{record.species}</td>
                  <td>{record.treeCount}</td>

                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        record.status === 'Completed'
                          ? styles.completed
                          : record.status === 'In Progress'
                            ? styles.inProgress
                            : styles.pending
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          router.push(`/site-tree/replanting/${record.id}`)
                        }
                      >
                        View
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
