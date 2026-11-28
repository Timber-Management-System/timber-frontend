'use client';

import { useEffect, useState } from 'react';

import { Icon } from '@/shared/components/ui/Icon';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';

import type { Trip } from '../types/log-receiving.types';

import {
  getTrips,
  resetDemo,
} from '../api/receivingApi';

import { ReceivingFormDialog } from './ReceiveLogs';
import ReceiptModal from './ReceiptModal';

import styles from './receiving.module.css';

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [editing, setEditing] = useState<Trip | null>(null);

  const [selectedReceipt, setSelectedReceipt] =
    useState<Trip | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTrips(getTrips());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const counts = {
    pending: trips.filter(
      (trip) => trip.status === 'Pending'
    ).length,

    progress: trips.filter(
      (trip) => trip.status === 'In Progress'
    ).length,

    completed: trips.filter(
      (trip) => trip.status === 'Completed'
    ).length,
  };

  function closeReceivingDialog() {
    setEditing(null);
    setTrips(getTrips());
  }

  function reset() {
    resetDemo();
    setTrips(getTrips());
    setEditing(null);
    setSelectedReceipt(null);
  }

  return (
    <div className={styles.main}>
      <header className={styles.topbar}>
        <div>
          Operations <span>/ Yard Receiving</span>
        </div>

        <span className={styles['demo-label']}>
          DEMO DATA
        </span>
      </header>

      <div className={styles.content}>
        <div className={styles['page-title']}>
          <div>
            <p className={styles.eyebrow}>
              FR-24 · LOG INTAKE
            </p>

            <h1>Yard Receiving</h1>

            <p className={styles.muted}>
              Track arriving deliveries, verify logs and
              complete yard receipts.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={reset}
          >
            Reset demo
          </Button>
        </div>

        {/* Dashboard Statistics */}

        <section className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles['stat-icon']}>
              <Icon name="truck" size={22} />
            </span>

            <p>Pending Deliveries</p>
            <strong>{counts.pending}</strong>
          </div>

          <div className={styles.stat}>
            <span className={styles['stat-icon']}>
              <Icon name="calendar" size={22} />
            </span>

            <p>In Progress</p>
            <strong>{counts.progress}</strong>
          </div>

          <div className={styles.stat}>
            <span className={styles['stat-icon']}>
              <Icon name="check" size={22} />
            </span>

            <p>Completed</p>
            <strong>{counts.completed}</strong>
          </div>
        </section>

        {/* Incoming Deliveries */}

        <section className={styles.panel}>
          <div className={styles['panel-heading']}>
            <div>
              <h2>Incoming Deliveries</h2>

              <p className={styles.muted}>
                Select a trip to start or continue receiving.
              </p>
            </div>

            <span className={styles['count-chip']}>
              {trips.length} trips
            </span>
          </div>

          <div className={styles['table-wrap']}>
            <table>
              <thead>
                <tr>
                  <th>Trip No.</th>
                  <th>Origin</th>
                  <th>Vehicle</th>
                  <th>Expected</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id}>
                    <td className={styles.strong}>
                      {trip.id}
                    </td>

                    <td>{trip.origin}</td>
                    <td>{trip.vehicle}</td>
                    <td>{trip.logIds.length} logs</td>
                    <td>{trip.received.length} logs</td>

                    <td>
                      <Badge
                        tone={
                          trip.status === 'Completed'
                            ? 'ok'
                            : trip.status === 'In Progress'
                              ? 'warn'
                              : 'neutral'
                        }
                      >
                        {trip.status}
                      </Badge>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`${styles['table-action']} ${styles.receiptAction}`}
                        onClick={() => {
                          if (trip.status === 'Completed') {
                            setSelectedReceipt(trip);
                          } else {
                            setEditing(trip);
                          }
                        }}
                      >
                        {trip.status === 'Completed'
                          ? 'View Receipt'
                          : trip.status === 'In Progress'
                            ? 'Continue'
                            : 'Start Receiving'}

                        <Icon
                          name="chevronRight"
                          size={15}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className={styles.hint}>
          <Icon name="box" size={16} />

          Sample trip and log data are stored in your
          browser for this prototype.
        </p>
      </div>

      {/* Start or Edit Receipt Dialog */}

      {editing && (
        <ReceivingFormDialog
          key={editing.id}
          trip={editing}
          onClose={closeReceivingDialog}
        />
      )}

      {/* View Completed Receipt Dialog */}

      {selectedReceipt && (
        <ReceiptModal
          trip={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}