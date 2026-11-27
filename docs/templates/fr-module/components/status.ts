/** TEMPLATE – status helpers: badge colour (ok = green, warn = amber, crit = red) and rules. */
import type { BadgeTone } from '@/shared/components/ui/Badge';

import type { ExampleStatus } from '../types/example.types';

export const STATUS_TONE: Record<ExampleStatus, BadgeTone> = {
  DRAFT: 'neutral',
  PENDING: 'warn',
  APPROVED: 'ok',
  REJECTED: 'crit',
};

/** i18n key for a status label, e.g. 'status.pending'. Add FR-specific statuses to your own namespace. */
export const statusKey = (status: ExampleStatus) => `status.${status.toLowerCase()}`;

/** Drafts and records waiting for approval can still be edited; decided records are locked. */
export const isEditable = (status: ExampleStatus) => status === 'DRAFT' || status === 'PENDING';
