
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Icon } from '@/shared/components/ui/Icon';
import { Button } from '@/shared/components/ui/Button';

import type { Trip } from '../types/log-receiving.types';

import {
  getTrips,
  resetDemo,
} from '../api/receivingApi';

import ReceiptModal from './ReceiptModal';

import styles from './receiving.module.css';


// ==================================================
// FR-24 — Yard Receiving Dashboard
// ==================================================

export default function Dashboard() {

  // ---------- Dashboard State ----------

  const [trips, setTrips] = useState<Trip[]>([]);

  const [selectedReceipt, setSelectedReceipt] =
    useState<Trip | null>(null);


  // ---------- Load Delivery Trips ----------

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTrips(getTrips());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);


  // ---------- Calculate Delivery Statistics ----------

  const counts = {
    pending: trips.filter(
      (t) => t.status === 'Pending'
    ).length,

    progress: trips.filter(
      (t) => t.status === 'In Progress'
    ).length,

    completed: trips.filter(
      (t) => t.status === 'Completed'
    ).length,
  };


  // ---------- Dashboard UI ----------

  return (
    <div>
      <div className={styles.main}>

        {/* Top Navigation Bar */}

        <header className={styles.topbar}>
          <div>
            Operations <span>/ Yard Receiving</span>
          </div>

          <span className={styles['demo-label']}>
            DEMO DATA
          </span>
        </header>


        <div className={styles.content}>

          {/* Page Heading */}

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
              onClick={() => {
                resetDemo();
                setTrips(getTrips());
                setSelectedReceipt(null);
              }}
            >
              Reset demo
            </Button>
          </div>


          {/* Dashboard Statistics */}

          <section className={styles.stats}>

            {/* Pending Deliveries */}

            <div className={styles.stat}>
              <span className={styles['stat-icon']}>
                <Icon name="truck" size={22} />
              </span>

              <p>Pending Deliveries</p>

              <strong>{counts.pending}</strong>
            </div>


            {/* Deliveries In Progress */}

            <div className={styles.stat}>
              <span className={styles['stat-icon']}>
                <Icon name="calendar" size={22} />
              </span>

              <p>In Progress</p>

              <strong>{counts.progress}</strong>
            </div>


            {/* Completed Deliveries */}

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


            {/* Deliveries Table */}

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
                  {trips.map((t) => (
                    <tr key={t.id}>

                      <td className={styles.strong}>
                        {t.id}
                      </td>

                      <td>{t.origin}</td>

                      <td>{t.vehicle}</td>

                      <td>{t.logIds.length} logs</td>

                      <td>{t.received.length} logs</td>


                      {/* Delivery Status */}

                      <td>
                        <span
                          className={`${styles.status} ${
                            styles[
                              t.status
                                .toLowerCase()
                                .replace(' ', '-')
                            ]
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>


                      {/* Delivery Actions */}

                      <td>
                        {t.status === 'Completed' ? (

                          <button
                            type="button"
                            className={`${styles['table-action']} ${styles.receiptAction}`}
                            onClick={() => {
                              setSelectedReceipt(t);
                            }}
                          >
                            View Receipt

                            <Icon
                              name="chevronRight"
                              size={15}
                            />
                          </button>

                        ) : (

                          <Link
                            className={styles['table-action']}
                            href={`/sawmill/log-receiving/${t.id}`}
                          >
                            {t.status === 'In Progress'
                              ? 'Continue'
                              : 'Start Receiving'}

                            <Icon
                              name="chevronRight"
                              size={15}
                            />
                          </Link>

                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>


          {/* Prototype Information */}

          <p className={styles.hint}>
            <Icon name="box" size={16} />

            Sample trip and log data are stored in your
            browser for this prototype.
          </p>

        </div>
      </div>


      {/* Receipt Details Modal */}

      {selectedReceipt && (
        <ReceiptModal
          trip={selectedReceipt}
          onClose={() => {
            setSelectedReceipt(null);
          }}
        />
      )}

    </div>
  );
}
