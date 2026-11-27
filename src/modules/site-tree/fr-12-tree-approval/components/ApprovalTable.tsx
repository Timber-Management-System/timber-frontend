'use client';

import { Button } from '@/shared/components/ui/Button';
import { useTrees } from '../hooks/useTrees';
import styles from './ApprovalTable.module.css';

export function ApprovalTable() {
  const { trees, loading, error, approve, reject } = useTrees();

  function handleReject(id: number) {
    const reason = window.prompt('Reason for rejection?');
    if (reason !== null) {
      reject(id, reason);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Tree approval queue</h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tree</th>
              <th>Species</th>
              <th>Lot</th>
              <th>Volume (m³)</th>
              <th>Permit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trees.map((tree) => (
              <tr key={tree.id}>
                <td>{tree.treeCode}</td>
                <td>{tree.species}</td>
                <td>{tree.lot}</td>
                <td>{tree.volumeM3}</td>
                <td>{tree.permitId}</td>
                <td>
                  <span
                    className={`${styles.badge} ${styles[tree.status.toLowerCase()]}`}
                  >
                    {tree.status}
                  </span>
                </td>
                <td>
                  {tree.status === 'PENDING' && (
                    <div className={styles.actions}>
                      <Button size="sm" onClick={() => approve(tree.id)}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(tree.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {tree.status === 'REJECTED' && tree.rejectReason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}