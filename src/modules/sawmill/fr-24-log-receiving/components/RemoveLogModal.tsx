'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';

import type { Log } from '../types/log-receiving.types';

import styles from './receiving.module.css';


// ---------- Component Props ----------

type RemoveLogModalProps = {
  log: Log;
  onClose: () => void;
  onConfirm: () => void;
};


// ==================================================
// Remove Log Confirmation Modal
// ==================================================

export default function RemoveLogModal({
  log,
  onClose,
  onConfirm,
}: RemoveLogModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);


  // ---------- Open Modal ----------

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);


  return (
    <dialog
      ref={dialogRef}
      className={`${styles.receiptModal} ${styles.removeModal}`}
      aria-labelledby="remove-log-title"
      aria-describedby="remove-log-description"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className={styles.modalContainer}>

        {/* Modal Header */}

        <header className={styles.modalHeader}>

          <div className={styles.removeHeading}>

            <span className={styles.removeIcon}>
              <Icon name="warning" size={24} />
            </span>

            <div>
              <h2 id="remove-log-title">
                Remove Log?
              </h2>

              <p className={styles.muted}>
                Confirm removal from this receipt.
              </p>
            </div>

          </div>

          <button
            type="button"
            className={styles.modalClose}
            aria-label="Close confirmation"
            onClick={onClose}
          >
            ×
          </button>

        </header>


        {/* Log Details */}

        <div className={styles.modalBody}>

          <div className={styles.removeDetails}>

            <div>
              <small>Log ID</small>
              <strong>{log.id}</strong>
            </div>

            <div>
              <small>Tree ID</small>
              <strong>{log.treeId}</strong>
            </div>

            <div>
              <small>Species</small>
              <strong>{log.species}</strong>
            </div>

            <div>
              <small>Trip No.</small>
              <strong>{log.tripId}</strong>
            </div>

            <div>
              <small>Diameter</small>
              <strong>{log.diameter} cm</strong>
            </div>

            <div>
              <small>Length</small>
              <strong>{log.length} m</strong>
            </div>

          </div>


          {/* Volume */}

          <div className={styles.removeVolume}>
            <span>Volume to be removed</span>

            <strong>
              {log.volume.toFixed(3)} m³
            </strong>
          </div>


          {/* Warning */}

          <div
            id="remove-log-description"
            className={styles.removeWarning}
          >
            This log will return to Unverified status.
            Its volume will be deducted from the receipt
            total. You can verify it again later.
          </div>

        </div>


        {/* Modal Actions */}

        <footer className={styles.modalFooter}>

          <Button
            variant="secondary"
            onClick={onClose}
            autoFocus
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
          >
            Remove Log
          </Button>

        </footer>

      </div>

    </dialog>
  );
}
