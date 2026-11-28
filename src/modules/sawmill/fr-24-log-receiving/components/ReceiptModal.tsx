
'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/shared/components/ui/Button';

import type { Trip } from '../types/log-receiving.types';

import {
  getReceiptNo,
} from '../types/log-receiving.types';

import { logs } from '../api/mockReceivingData';

import styles from './receiving.module.css';


// ==================================================
// Receipt Modal Props
// ==================================================

type ReceiptModalProps = {
  trip: Trip;
  onClose: () => void;
};


// ==================================================
// Receipt Modal Component
// ==================================================

export default function ReceiptModal({
  trip,
  onClose,
}: ReceiptModalProps) {

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


  // ---------- Receipt Calculations ----------

  const receiptNo = getReceiptNo(trip);

  const unresolved = trip.logIds.filter(
    (id) =>
      !trip.received.includes(id) &&
      !trip.rejected.includes(id)
  );

  const totalVolume = trip.received.reduce(
    (sum, id) => sum + (logs[id]?.volume ?? 0),
    0
  );


  // ==================================================
  // Receipt Modal UI
  // ==================================================

  return (
    <dialog
      ref={dialogRef}
      className={styles.receiptModal}
      aria-labelledby="receipt-modal-title"
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

          <div>
            <p className={styles.eyebrow}>
              FR-24 · COMPLETED RECEIPT
            </p>

            <h2 id="receipt-modal-title">
              Receipt Details
            </h2>

            <p className={styles.muted}>
              {receiptNo} · {trip.date}
            </p>
          </div>

          <div className={styles.modalHeaderActions}>

            <span
              className={`${styles.status} ${styles.completed}`}
            >
              Completed
            </span>

            <button
              type="button"
              className={styles.modalClose}
              aria-label="Close receipt"
              onClick={onClose}
            >
              ×
            </button>

          </div>
        </header>


        {/* Modal Content */}

        <div className={styles.modalBody}>

          {/* Receipt and Delivery Information */}

          <section className={styles.panel}>

            <div className={styles['panel-heading']}>
              <h2>Delivery Information</h2>

              <span className={styles['count-chip']}>
                {trip.id}
              </span>
            </div>

            <div className={styles['details-grid']}>

              <div>
                <small>Receipt No.</small>

                <span className={styles.receiptNumber}>
                  {receiptNo}
                </span>
              </div>

              <div>
                <small>Trip / Delivery No.</small>
                <strong>{trip.id}</strong>
              </div>

              <div>
                <small>Source</small>
                <strong>{trip.origin}</strong>
              </div>

              <div>
                <small>Vehicle</small>
                <strong>{trip.vehicle}</strong>
              </div>

              <div>
                <small>Driver</small>
                <strong>{trip.driver}</strong>
              </div>

              <div>
                <small>Delivery Date</small>
                <strong>{trip.date}</strong>
              </div>

              <div>
                <small>Expected Logs</small>
                <strong>{trip.logIds.length}</strong>
              </div>

            </div>
          </section>


          {/* Receipt Summary */}

          <section className={styles.panel}>

            <div className={styles['panel-heading']}>
              <div>
                <h2>Receipt Summary</h2>

                <p className={styles.muted}>
                  Review the delivery reconciliation.
                </p>
              </div>
            </div>


            {/* Summary Statistics */}

            <div className={styles['summary-grid']}>

              <div>
                <small>Expected</small>
                <strong>{trip.logIds.length}</strong>
              </div>

              <div>
                <small>Accepted</small>
                <strong>{trip.received.length}</strong>
              </div>

              <div>
                <small>Rejected</small>
                <strong>{trip.rejected.length}</strong>
              </div>

              <div>
                <small>Unverified</small>
                <strong>{unresolved.length}</strong>
              </div>

            </div>


            {/* Receipt Logs Table */}

            <div className={styles['table-wrap']}>
              <table className={styles.scannedTable}>

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Log ID</th>
                    <th>Tree ID</th>
                    <th>Species</th>
                    <th>Dia. (cm)</th>
                    <th>Length (m)</th>
                    <th>Volume (m³)</th>
                    <th>Result</th>
                  </tr>
                </thead>

                <tbody>
                  {trip.logIds.map((id, index) => {

                    const log = logs[id];

                    const result = trip.received.includes(id)
                      ? 'Accepted'
                      : trip.rejected.includes(id)
                        ? 'Rejected'
                        : 'Unverified';

                    return (
                      <tr key={id}>

                        <td>{index + 1}</td>

                        <td className={styles.strong}>
                          {id}
                        </td>

                        <td>
                          {log?.treeId ?? 'N/A'}
                        </td>

                        <td>
                          {log?.species ?? 'N/A'}
                        </td>

                        <td>
                          {log?.diameter ?? 'N/A'}
                        </td>

                        <td>
                          {log?.length ?? 'N/A'}
                        </td>

                        <td>
                          {log
                            ? log.volume.toFixed(3)
                            : 'N/A'}
                        </td>

                        <td>
                          <span
                            className={`${styles.status} ${
                              styles[result.toLowerCase()]
                            }`}
                          >
                            {result}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </section>


          {/* Receipt Totals */}

          <section className={styles.receiptTotals}>

            <div className={styles.totalItem}>
              <small>Total Logs</small>

              <strong>
                {trip.received.length}/{trip.logIds.length}
              </strong>
            </div>

            <div className={styles.totalItem}>
              <small>Total Volume</small>

              <strong>
                {totalVolume.toFixed(3)} m³
              </strong>
            </div>

          </section>


          {/* Completed Receipt Notice */}

          <div
            className={`${styles.notice} ${styles.success}`}
          >
            Receipt completed. This prototype does
            not update real inventory.
          </div>

        </div>


        {/* Modal Footer */}

        <footer className={styles.modalFooter}>
          <Button
            variant="primary"
            onClick={onClose}
          >
            Close
          </Button>
        </footer>

      </div>
    </dialog>
  );
}
