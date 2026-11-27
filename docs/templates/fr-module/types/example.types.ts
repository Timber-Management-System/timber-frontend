/**
 * TEMPLATE – TypeScript types for this FR.
 * Match the field names to the backend DTO (docs/api/). Don't guess fields: ask the backend team.
 */

/** DRAFT = saved with "Save as draft", not sent for approval yet. */
export type ExampleStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ExampleItem {
  id: string;
  /** Human-readable reference shown in JetBrains Mono, e.g. 'TREE-036'. Set by the backend. */
  reference: string;
  /** Record date, 'YYYY-MM-DD' (may be empty on a draft). */
  date: string;
  name: string;
  site: string;
  /** May be missing on a draft. */
  quantity?: number;
  note?: string;
  status: ExampleStatus;
  /** Reason given when the record was approved or rejected (goes to the audit log, FR-03). */
  decisionReason?: string;
  updatedAt: string; // ISO date-time from the backend
}

/** What the form popup sends to the API. */
export interface ExampleInput {
  date: string;
  name: string;
  site: string;
  quantity?: number;
  note?: string;
}

/** The form's own values: inputs always hold text, so numbers are converted on save. */
export interface ExampleFormValues {
  date: string;
  name: string;
  site: string;
  quantity: string;
  note: string;
}

export type ExampleDecision = 'APPROVED' | 'REJECTED';
