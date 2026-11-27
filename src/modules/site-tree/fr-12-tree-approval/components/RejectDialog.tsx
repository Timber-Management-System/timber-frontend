'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import styles from './RejectDialog.module.css';

interface RejectDialogProps {
  treeCode: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export function RejectDialog({ treeCode, onConfirm, onClose }: RejectDialogProps) {
  const [reason, setReason] = useState('');

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h3 className={styles.title}>Reject {treeCode}</h3>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Reason for rejection"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className={styles.footer}>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onConfirm(reason)}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}