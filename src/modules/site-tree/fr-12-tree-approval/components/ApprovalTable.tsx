'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { useTrees } from '../hooks/useTrees';
import type { Tree } from '../types/tree';
import { RejectDialog } from './RejectDialog';
import styles from './ApprovalTable.module.css';

export function ApprovalTable() {
  const { trees, loading, error, approve, reject } = useTrees();
  const [rejectTarget, setRejectTarget] = useState<Tree | null>(null);

  function handleConfirmReject(reason: string) {
    if (rejectTarget) {
      reject(rejectTarget.id, reason);
      setRejectTarget(null);
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
                        onClick={() => setRejectTarget(tree)}
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

      {rejectTarget && (
        <RejectDialog
          treeCode={rejectTarget.treeCode}
          onConfirm={handleConfirmReject}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}