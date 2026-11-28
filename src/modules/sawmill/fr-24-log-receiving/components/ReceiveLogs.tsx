'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import { Dialog } from '@/shared/components/ui/Dialog';
import { FormSection } from '@/shared/components/ui/FormSection';
import { Stepper } from '@/shared/components/ui/Stepper';
import { TextField } from '@/shared/components/ui/TextField';
import { Callout } from '@/shared/components/ui/Callout';
import { Badge } from '@/shared/components/ui/Badge';

import type {
  Trip,
  Log,
} from '../types/log-receiving.types';

import { getReceiptNo } from '../types/log-receiving.types';

import {
  getTrip,
  saveTrip,
  verifyLog,
} from '../api/receivingApi';

import { logs } from '../api/mockReceivingData';

import RemoveLogModal from './RemoveLogModal';
import ReceiptModal from './ReceiptModal';

import styles from './receiving.module.css';


// Existing route compatibility

export default function ReceiveTrip({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  const [trip, setTrip] =
    useState<Trip | null | undefined>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTrip(getTrip(tripId));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [tripId]);

  if (!trip) {
    return (
      <p>
        {trip === null
          ? 'Loading trip...'
          : 'Trip not found.'}
      </p>
    );
  }

  return <LegacyReceipt trip={trip} />;
}


function LegacyReceipt({ trip }: { trip: Trip }) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Link href="/sawmill/log-receiving">
        Back to Dashboard
      </Link>

      {open && (
        trip.status === 'Completed' ? (
          <ReceiptModal
            trip={trip}
            onClose={() => setOpen(false)}
          />
        ) : (
          <ReceivingFormDialog
            trip={trip}
            onClose={() => setOpen(false)}
          />
        )
      )}
    </>
  );
}


// Receiving Form Dialog

interface ReceivingFormDialogProps {
  trip: Trip;
  onClose: () => void;
}


export function ReceivingFormDialog({
  trip: initialTrip,
  onClose,
}: ReceivingFormDialogProps) {
  const [trip, setTrip] = useState(initialTrip);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');

  const [candidate, setCandidate] =
    useState<Log | null>(null);

  const [removeCandidate, setRemoveCandidate] =
    useState<Log | null>(null);

  const [rejectCandidate, setRejectCandidate] =
    useState<Log | null>(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  const receiptDetails = {
    'Receipt No.': receiptNo,
    'Trip No.': trip.id,
    Source: trip.origin,
    Vehicle: trip.vehicle,
    Driver: trip.driver,
    'Delivery Date': trip.date,
    'Expected Logs': String(trip.logIds.length),
  };


  // Find and Verify Log

  function findLog() {
    const result = verifyLog(trip, input);

    setCandidate(result.log || null);
    setError(result.error || '');
    setMessage('');
  }


  // Accept or Reject Log

  function updateLog(
    field: 'received' | 'rejected'
  ) {
    if (!candidate || trip.status === 'Completed') {
      return;
    }

    const result = verifyLog(trip, candidate.id);

    if (result.error) {
      setError(result.error);
      setCandidate(null);
      return;
    }

    const updated: Trip = {
      ...trip,
      receiptNo,
      [field]: [...trip[field], candidate.id],
      status: 'In Progress',
    };

    setTrip(saveTrip(updated));

    setMessage(
      `${candidate.id} ${
        field === 'received'
          ? 'verified'
          : 'rejected'
      } successfully.`
    );

    setCandidate(null);
    setInput('');
    setError('');
  }


  // Remove Verified Log

  function removeLog() {
    if (
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


  // Save Receipt Progress

  function saveProgress() {
    if (trip.status === 'Completed') {
      return;
    }

    const updated: Trip = {
      ...trip,
      receiptNo,
      status: 'In Progress',
    };

    saveTrip(updated);
    onClose();
  }


  // Complete Receipt

  function completeReceipt() {
    if (unresolved.length > 0) {
      setError(
        `${unresolved.length} expected log(s) are still unverified.`
      );

      return;
    }

    const updated: Trip = {
      ...trip,
      receiptNo,
      status: 'Completed',
    };

    saveTrip(updated);
    onClose();
  }


  // Verified Logs Table

  function renderScannedLogs(
    allowRemoval: boolean
  ) {
    return (
      <section className={styles.panel}>
        <div className={styles['panel-heading']}>
          <div>
            <h2>Scanned Logs</h2>

            <p className={styles.muted}>
              Verified logs added to this receipt.
            </p>
          </div>

          <Badge tone="neutral">
            {trip.received.length} / {trip.logIds.length}
          </Badge>
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

                {allowRemoval && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
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
                      <Badge tone="ok">
                        Verified
                      </Badge>
                    </td>

                    {allowRemoval && (
                      <td>
                        {log && (
                          <Button
                            variant="ghost"
                            size="sm"
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

              {trip.received.length === 0 && (
                <tr>
                  <td
                    colSpan={allowRemoval ? 9 : 8}
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
    );
  }


  // Dialog Interface

  return (
    <>
      <Dialog
        open
        size="lg"
        bodyTone="sections"
        eyebrow="FR-24 · LOG RECEIVING"
        title={
          initialTrip.status === 'Pending'
            ? 'New Receipt'
            : 'Edit Receipt'
        }
        description={`${receiptNo} · ${trip.id}`}
        onClose={onClose}
        subheader={
          <Stepper
            steps={[
              'Receipt details',
              'Verify logs',
              'Review',
            ]}
            current={step}
            label="Receipt progress"
            completedLabel="Completed"
            onStepClick={setStep}
          />
        }
        footerStart={
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Close
          </Button>
        }
        footer={
          <>
            {step > 0 && (
              <Button
                variant="secondary"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={saveProgress}
            >
              Save Progress
            </Button>

            {step < 2 ? (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={unresolved.length > 0}
                onClick={completeReceipt}
              >
                Complete Receipt
              </Button>
            )}
          </>
        }
      >
        <div
          className={`${styles.main} ${styles.dialogContent}`}
        >

          {/* Step 1 — Receipt Details */}

          {step === 0 && (
            <FormSection
              number="01"
              title="Receipt details"
            >
              {Object.entries(receiptDetails).map(
                ([label, value]) => (
                  <TextField
                    key={label}
                    label={label}
                    value={value}
                    readOnly
                  />
                )
              )}
            </FormSection>
          )}


          {/* Step 2 — Verify Logs */}

          {step === 1 && (
            <>
              <FormSection
                number="02"
                title="Scan or find a log"
              >
                <div className={styles.fullWidth}>
                  <div className={styles.lookupRow}>
                    <TextField
                      label="Log ID"
                      placeholder="e.g. LOG-001"
                      value={input}
                      onChange={(event) => {
                        setInput(event.target.value);
                        setCandidate(null);
                        setError('');
                        setMessage('');
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          findLog();
                        }
                      }}
                    />

                    <Button
                      variant="secondary"
                      onClick={findLog}
                      leftIcon={
                        <Icon
                          name="search"
                          size={17}
                        />
                      }
                    >
                      Find Log
                    </Button>

                    <Button
                      variant="secondary"
                      disabled
                    >
                      Scan QR Code
                    </Button>
                  </div>

                  <p className={styles.lookupHint}>
                    QR scanning is currently unavailable.
                    Use manual Log ID entry.
                  </p>
                </div>

                {error && (
                  <div className={styles.fullWidth}>
                    <Callout tone="crit">
                      {error}
                    </Callout>
                  </div>
                )}

                {message && (
                  <div className={styles.fullWidth}>
                    <Callout tone="ok">
                      {message}
                    </Callout>
                  </div>
                )}
              </FormSection>


              {/* Log Verification Details */}

              {candidate && (
                <section className={styles.panel}>
                  <div className={styles['panel-heading']}>
                    <div>
                      <h2>Log Verification</h2>

                      <p className={styles.muted}>
                        Review the log before adding.
                      </p>
                    </div>

                    <Badge tone="ok">
                      Verified
                    </Badge>
                  </div>

                  <div className={styles.verification}>
                    <dl className={styles.dialogDetails}>
                      <div>
                        <dt>Log ID</dt>
                        <dd>{candidate.id}</dd>
                      </div>

                      <div>
                        <dt>Tree ID</dt>
                        <dd>{candidate.treeId}</dd>
                      </div>

                      <div>
                        <dt>Species</dt>
                        <dd>{candidate.species}</dd>
                      </div>

                      <div>
                        <dt>Trip No.</dt>
                        <dd>{candidate.tripId}</dd>
                      </div>

                      <div>
                        <dt>Diameter</dt>
                        <dd>{candidate.diameter} cm</dd>
                      </div>

                      <div>
                        <dt>Length</dt>
                        <dd>{candidate.length} m</dd>
                      </div>
                    </dl>

                    <div className={styles.volumeHighlight}>
                      <span>Volume</span>

                      <strong>
                        {candidate.volume.toFixed(3)} m³
                      </strong>
                    </div>

                    <Callout tone="ok">
                      Matched to this trip.
                      Not previously received.
                    </Callout>

                    <div className={styles.actions}>
                      <Button
                        variant="danger"
                        onClick={() =>
                          setRejectCandidate(candidate)
                        }
                      >
                        Reject
                      </Button>

                      <Button
                        variant="primary"
                        onClick={() =>
                          updateLog('received')
                        }
                      >
                        Add to Receipt
                      </Button>
                    </div>
                  </div>
                </section>
              )}

              {renderScannedLogs(true)}

              <div className={styles.receiptTotals}>
                <div className={styles.totalItem}>
                  <small>Total Logs</small>

                  <strong>
                    {trip.received.length}/
                    {trip.logIds.length}
                  </strong>
                </div>

                <div className={styles.totalItem}>
                  <small>Total Volume</small>

                  <strong>
                    {totalVolume.toFixed(3)} m³
                  </strong>
                </div>
              </div>
            </>
          )}


          {/* Step 3 — Review Receipt */}

          {step === 2 && (
            <>
              <FormSection
                number="03"
                title="Review receipt"
              >
                <TextField
                  label="Receipt No."
                  value={receiptNo}
                  readOnly
                />

                <TextField
                  label="Trip No."
                  value={trip.id}
                  readOnly
                />

                <TextField
                  label="Expected Logs"
                  value={String(trip.logIds.length)}
                  readOnly
                />

                <TextField
                  label="Verified Logs"
                  value={String(trip.received.length)}
                  readOnly
                />

                <TextField
                  label="Rejected Logs"
                  value={String(trip.rejected.length)}
                  readOnly
                />

                <TextField
                  label="Unverified Logs"
                  value={String(unresolved.length)}
                  readOnly
                />

                <TextField
                  label="Total Volume"
                  value={`${totalVolume.toFixed(3)} m³`}
                  readOnly
                />
              </FormSection>

              {renderScannedLogs(false)}

              {unresolved.length > 0 ? (
                <Callout tone="warn">
                  {unresolved.length} expected log(s)
                  are still unverified. Return to the
                  verification step before completing
                  this receipt.
                </Callout>
              ) : (
                <Callout tone="ok">
                  All expected logs have been reconciled.
                  This receipt is ready to complete.
                </Callout>
              )}
            </>
          )}
        </div>
      </Dialog>


      {/* Remove Log Confirmation */}

      {removeCandidate && (
        <RemoveLogModal
          log={removeCandidate}
          onClose={() => setRemoveCandidate(null)}
          onConfirm={removeLog}
        />
      )}


      {/* Reject Log Confirmation */}

      {rejectCandidate && (
        <Dialog
          open
          size="sm"
          title="Reject log?"
          onClose={() => setRejectCandidate(null)}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setRejectCandidate(null)}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  updateLog('rejected');
                  setRejectCandidate(null);
                }}
              >
                Reject
              </Button>
            </>
          }
        >
          <dl className={styles.dialogDetails}>
            <div>
              <dt>Log ID</dt>
              <dd>{rejectCandidate.id}</dd>
            </div>

            <div>
              <dt>Species</dt>
              <dd>{rejectCandidate.species}</dd>
            </div>

            <div>
              <dt>Volume</dt>
              <dd>
                {rejectCandidate.volume.toFixed(3)} m³
              </dd>
            </div>
          </dl>

          <Callout tone="warn">
            This log will be recorded as rejected
            and will not be included in the received
            timber volume.
          </Callout>
        </Dialog>
      )}
    </>
  );
}