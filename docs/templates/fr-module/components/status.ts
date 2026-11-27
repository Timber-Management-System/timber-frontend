/** TEMPLATE – badge colour for each status (ok = green, warn = amber, crit = red). */
import type { BadgeTone } from '@/shared/components/ui/Badge';

import type { ExampleStatus } from '../types/example.types';

export const STATUS_TONE: Record<ExampleStatus, BadgeTone> = { PENDING: 'warn', APPROVED: 'ok', REJECTED: 'crit' };

/** i18n key for a status label, e.g. 'status.pending'. Add FR-specific statuses to your own namespace. */
export const statusKey = (status: ExampleStatus) => `status.${status.toLowerCase()}`;
