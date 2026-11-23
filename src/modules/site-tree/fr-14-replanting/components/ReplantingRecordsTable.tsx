import styles from './ReplantingRecordsTable.module.css';

type ReplantingRecord = {
  id: string;
  plantingDate: string;
  site: string;
  species: string;
  treeCount: number;
  status: string;
};

type ReplantingRecordsTableProps = {
  records: ReplantingRecord[];
};

export function ReplantingRecordsTable({
  records,
}: ReplantingRecordsTableProps) {
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
                  <td>{record.status}</td>
                  <td>—</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
