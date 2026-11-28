
'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

import { Icon } from '@/shared/components/ui/Icon';
import { Button } from '@/shared/components/ui/Button';

import type { Trip, Log } from '../types/log-receiving.types';
import { getReceiptNo } from '../types/log-receiving.types';

import {
  getTrip,
  saveTrip,
  verifyLog,
} from '../api/receivingApi';

import { logs } from '../api/mockReceivingData';

import RemoveLogModal from './RemoveLogModal';

import styles from './receiving.module.css';


// ==================================================
// FR-24 — Receive Logs
// ==================================================

export default function ReceiveTrip({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  const [trip, setTrip] =
    useState<Trip | null | undefined>(null);

  const [input, setInput] = useState('');

  const [candidate, setCandidate] =
    useState<Log | null>(null);

  const [removeCandidate, setRemoveCandidate] =
    useState<Log | null>(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  // ---------- Load Trip ----------

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTrip(getTrip(tripId));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [tripId]);


  // ---------- Find Log ----------

  function find(id: string) {
    if (!trip || trip.status === 'Completed') {
      return;
    }

    const result = verifyLog(trip, id);

    setCandidate(result.log || null);
    setError(result.error || '');
    setMessage('');
    setInput(id);
  }


  // ---------- Accept or Reject Log ----------

  function update(field: 'received' | 'rejected') {
    if (!candidate || !trip || trip.status === 'Completed') {
      return;
    }

    const result = verifyLog(trip, candidate.id);

    if (result.error) {
      setError(result.error);
      setCandidate(null);
      return;
    }

    if (
      field === 'rejected' &&
      !window.confirm('Reject this log?')
    ) {
      return;
    }

    const updated: Trip = {
      ...trip,
      receiptNo: getReceiptNo(trip),
      [field]: [...trip[field], candidate.id],
      status: 'In Progress',
    };

    setTrip(saveTrip(updated));

    setMessage(
      `${candidate.id} ${
        field === 'received' ? 'verified' : 'rejected'
      } successfully.`
    );

    setCandidate(null);
    setInput('');
    setError('');
  }


  // ---------- Remove Verified Log ----------

  function removeLog() {
    if (
      !trip ||
      !removeCandidate ||
      trip.status === 'Completed' ||
      !trip.received.includes(removeCandidate.id)
    ) {
      return;
    }

    const id = removeCandidate.id;

    const updated: Trip = {
      ...trip,
      received: trip.received.filter(
        (logId) => logId !== id
      ),
      status: 'In Progress',
    };

    setTrip(saveTrip(updated));

    setMessage(
      `${id} was removed from the receipt.`
    );

    setRemoveCandidate(null);
    setCandidate(null);
    setInput('');
    setError('');
  }


  // ---------- Complete Receipt ----------

  function complete() {
    if (!trip || trip.status === 'Completed') {
      return;
    }

    const unresolved = trip.logIds.filter(
      (id) =>
        !trip.received.includes(id) &&
        !trip.rejected.includes(id)
    );

    if (unresolved.length > 0) {
      setError(
        `${unresolved.length} expected log(s) are still unverified.`
      );

      setMessage('');
      return;
    }

    const updated: Trip = {
      ...trip,
      receiptNo: getReceiptNo(trip),
      status: 'Completed',
    };

    setTrip(saveTrip(updated));

    setMessage('Receipt completed successfully.');
    setCandidate(null);
    setError('');
  }


  // ---------- Loading State ----------

  if (!trip) {
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          <p>
            {trip === null
              ? 'Loading trip...'
              : 'Trip not found.'}
          </p>

          <Link href="/sawmill/log-receiving">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }


  // ---------- Receipt Calculations ----------

  const done = trip.status === 'Completed';

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
  // Page UI
  // ==================================================

  return (
    <div className={styles.main}>

      {/* Top Navigation */}

      <header className={styles.topbar}>
        <div>
          Operations
          <span> / Yard Receiving / {trip.id}</span>
        </div>

        <span className={styles['demo-label']}>
          DEMO DATA
        </span>
      </header>


      <div className={styles.content}>

        <Link
          href="/sawmill/log-receiving"
          className={styles.back}
        >
          Back to Dashboard
        </Link>


        {/* Page Heading */}

        <div className={styles['page-title']}>
          <div>
            <p className={styles.eyebrow}>
              FR-24 · RECEIVING SESSION
            </p>

            <h1>
              {done ? 'Receipt Details' : 'Receive Logs'}
            </h1>

            <p className={styles.muted}>
              Verify logs against the selected delivery trip.
            </p>
          </div>

          <span
            className={`${styles.status} ${
              styles[
                trip.status.toLowerCase().replace(' ', '-')
              ]
            }`}
          >
            {trip.status}
          </span>
        </div>


        {/* Receipt Details */}

        <section className={styles.panel}>
          <div className={styles['panel-heading']}>
            <h2>Receipt Details</h2>

            <span className={styles['count-chip']}>
              {trip.id}
            </span>
          </div>

          <div className={styles.receiptDetailsGrid}>

            <div>
              <small>Receipt No.</small>

              <strong className={styles.receiptId}>
                {receiptNo}
              </strong>
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


        {/* Scan or Find a Log */}

        {!done && (
          <section className={styles.panel}>

            <div className={styles['panel-heading']}>
              <div>
                <h2>Scan or Find a Log</h2>

                <p className={styles.muted}>
                  Verify a log using its unique Log ID.
                </p>
              </div>
            </div>

            <div className={styles.lookupSection}>

              <label
                htmlFor="log-id"
                className={styles.lookupLabel}
              >
                Log ID
              </label>

              <div className={styles.lookupRow}>

                <input
                  id="log-id"
                  placeholder="e.g. LOG-001"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setCandidate(null);
                    setError('');
                    setMessage('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      find(input);
                    }
                  }}
                />

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => find(input)}
                  leftIcon={
                    <Icon name="search" size={17} />
                  }
                >
                  Find Log
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  disabled
                  title="Camera scanning is not implemented yet"
                >
                  Scan QR Code
                </Button>

              </div>

              <p className={styles.lookupHint}>
                QR scanning is currently unavailable.
                Use manual Log ID entry.
              </p>

            </div>


            {/* Error Message */}

            {error && (
              <div
                role="alert"
                className={`${styles.notice} ${styles.error}`}
              >
                <Icon name="warning" size={18} />

                {error}
              </div>
            )}


            {/* Success Message */}

            {message && (
              <div
                role="status"
                className={`${styles.notice} ${styles.success}`}
              >
                <Icon name="check" size={18} />

                {message}
              </div>
            )}


            {/* Log Verification */}

            {candidate && (
              <div className={styles.verification}>

                <div className={styles['verification-title']}>
                  <div>
                    <h3>Log Verification</h3>

                    <p className={styles.muted}>
                      Review the log details before adding.
                    </p>
                  </div>

                  <span
                    className={`${styles.status} ${styles.verified}`}
                  >
                    Verified
                  </span>
                </div>

                <div
                  className={`${styles['details-grid']} ${styles.verificationGrid}`}
                >

                  <div>
                    <small>Log ID</small>
                    <strong>{candidate.id}</strong>
                  </div>

                  <div>
                    <small>Tree ID</small>
                    <strong>{candidate.treeId}</strong>
                  </div>

                  <div>
                    <small>Species</small>
                    <strong>{candidate.species}</strong>
                  </div>

                  <div>
                    <small>Trip No.</small>
                    <strong>{candidate.tripId}</strong>
                  </div>

                  <div>
                    <small>Diameter</small>
                    <strong>{candidate.diameter} cm</strong>
                  </div>

                  <div>
                    <small>Length</small>
                    <strong>{candidate.length} m</strong>
                  </div>

                </div>

                <div className={styles.volumeHighlight}>
                  <span>Volume</span>

                  <strong>
                    {candidate.volume.toFixed(3)} m³
                  </strong>
                </div>

                <p className={styles.verificationMessage}>
                  <Icon name="check" size={16} />

                  Matched to this trip · Not previously received
                </p>

                <div className={styles.actions}>

                  <Button
                    variant="danger"
                    onClick={() => update('rejected')}
                  >
                    Reject
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => update('received')}
                  >
                    Add to Receipt
                  </Button>

                </div>

              </div>
            )}

          </section>
        )}


        {/* Scanned Logs Table */}

        <section className={styles.panel}>

          <div className={styles['panel-heading']}>
            <div>
              <h2>Scanned Logs</h2>

              <p className={styles.muted}>
                Verified logs added to this receipt.
              </p>
            </div>

            <span className={styles['count-chip']}>
              {trip.received.length} / {trip.logIds.length} verified
            </span>
          </div>

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
                  <th>Status</th>

                  {!done && <th>Action</th>}
                </tr>
              </thead>

              <tbody>

                {/* Display Only Verified Logs */}

                {trip.received.map((id, index) => {
                  const log = logs[id];

                  return (
                    <tr key={id}>

                      <td>{index + 1}</td>

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
                        <span
                          className={`${styles.status} ${styles.verified}`}
                        >
                          Verified
                        </span>
                      </td>

                      {!done && (
                        <td>
                          {log && (
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={`Remove ${id}`}
                              onClick={() =>
                                setRemoveCandidate(log)
                              }
                            >
                              <span className={styles.removeAction}>
                                Remove
                              </span>
                            </Button>
                          )}
                        </td>
                      )}

                    </tr>
                  );
                })}


                {/* Empty Table State */}

                {trip.received.length === 0 && (
                  <tr>
                    <td
                      colSpan={done ? 8 : 9}
                      className={styles.emptyState}
                    >
                      No verified logs have been added
                      to this receipt yet.
                    </td>
                  </tr>
                )}

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

          {!done && (
            <Button
              variant="primary"
              disabled={unresolved.length > 0}
              onClick={complete}
            >
              Complete Receipt
            </Button>
          )}

          {!done && (
            <p className={styles.completionHint}>
              Complete after all expected logs have been
              accepted or rejected.
            </p>
          )}

        </section>


        {/* Completed Receipt Notice */}

        {done && (
          <div
            className={`${styles.notice} ${styles.success}`}
          >
            <Icon name="check" size={18} />

            Receipt completed. This prototype does not
            update real inventory.
          </div>
        )}

      </div>


      {/* Remove Log Confirmation Modal */}

      {removeCandidate && (
        <RemoveLogModal
          log={removeCandidate}
          onClose={() => setRemoveCandidate(null)}
          onConfirm={removeLog}
        />
      )}

    </div>
  );
}
