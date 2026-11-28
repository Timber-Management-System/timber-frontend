'use client';

import { Dialog } from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Callout } from '@/shared/components/ui/Callout';

import {
  getReceiptNo,
  type Trip,
} from '../types/log-receiving.types';

import { logs } from '../api/mockReceivingData';

import styles from './receiving.module.css';

interface ReceiptModalProps {
  trip: Trip;
  onClose: () => void;
}

export default function ReceiptModal({
  trip,
  onClose,
}: ReceiptModalProps) {
  const totalVolume = trip.received.reduce(
    (sum, id) => sum + (logs[id]?.volume ?? 0),
    0
  );

  const details = {
    'Receipt No.': getReceiptNo(trip),
    'Trip No.': trip.id,
    Source: trip.origin,
    Vehicle: trip.vehicle,
    Driver: trip.driver,
    'Delivery Date': trip.date,
    'Expected Logs': trip.logIds.length,
    'Verified Logs': trip.received.length,
    'Rejected Logs': trip.rejected.length,
    'Total Volume': `${totalVolume.toFixed(3)} m³`,
  };

  return (
    <Dialog
      open
      size="lg"
      eyebrow="FR-24 · LOG RECEIVING"
      title="Receipt Details"
      description={getReceiptNo(trip)}
      onClose={onClose}
      footer={
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      }
    >
      <div className={styles.dialogContent}>

        <div className={styles.dialogStatus}>
          <Badge tone="ok">
            Completed
          </Badge>
        </div>

        {/* Receipt Details */}

        <section className={styles.panel}>
          <div className={styles['panel-heading']}>
            <h2>Receipt Information</h2>
          </div>

          <dl className={styles.dialogDetails}>
            {Object.entries(details).map(
              ([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              )
            )}
          </dl>
        </section>

        {/* Verified Logs */}

        <section className={styles.panel}>
          <div className={styles['panel-heading']}>
            <div>
              <h2>Scanned Logs</h2>

              <p className={styles.muted}>
                Verified logs included in this receipt.
              </p>
            </div>

            <Badge tone="neutral">
              {trip.received.length} logs
            </Badge>
          </div>

          <div className={styles['table-wrap']}>
            <table className={styles.scannedTable}>
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Tree ID</th>
                  <th>Species</th>
                  <th>Dia. (cm)</th>
                  <th>Length (m)</th>
                  <th>Volume (m³)</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {trip.received.map((id) => {
                  const log = logs[id];

                  return (
                    <tr key={id}>
                      <td className={styles.strong}>
                        {id}
                      </td>

                      <td>{log?.treeId ?? 'N/A'}</td>
                      <td>{log?.species ?? 'N/A'}</td>
                      <td>{log?.diameter ?? 'N/A'}</td>
                      <td>{log?.length ?? 'N/A'}</td>

                      <td>
                        {log
                          ? log.volume.toFixed(3)
                          : 'N/A'}
                      </td>

                      <td>
                        <Badge tone="ok">
                          Verified
                        </Badge>
                      </td>
                    </tr>
                  );
                })}

                {trip.received.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className={styles.emptyState}
                    >
                      No verified logs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <Callout tone="ok">
          Receipt completed. This prototype does
          not update real inventory.
        </Callout>
      </div>
    </Dialog>
  );
}