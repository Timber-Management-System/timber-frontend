'use client';

import { Dialog } from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Callout } from '@/shared/components/ui/Callout';

import type { Log } from '../types/log-receiving.types';

import styles from './receiving.module.css';

interface RemoveLogModalProps {
  log: Log;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveLogModal({
  log,
  onClose,
  onConfirm,
}: RemoveLogModalProps) {
  const details = {
    'Log ID': log.id,
    'Tree ID': log.treeId,
    Species: log.species,
    Diameter: `${log.diameter} cm`,
    Length: `${log.length} m`,
    Volume: `${log.volume.toFixed(3)} m³`,
  };

  return (
    <Dialog
      open
      size="sm"
      title="Remove verified log?"
      description="Review the log details before removing."
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
          >
            Remove Log
          </Button>
        </>
      }
    >
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

      <Callout tone="warn">
        This log will be removed from the receipt
        and must be verified again before completion.
      </Callout>
    </Dialog>
  );
}