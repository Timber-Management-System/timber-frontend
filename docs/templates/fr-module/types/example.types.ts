/**
 * TEMPLATE – TypeScript types for this FR.
 * Match the field names to the backend DTO (docs/api/). Don't guess fields: ask the backend team.
 */
export type ExampleStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ExampleItem {
  id: string;
  /** Human-readable reference shown in JetBrains Mono, e.g. 'TREE-036'. */
  reference: string;
  name: string;
  site: string;
  quantity: number;
  note?: string;
  status: ExampleStatus;
  /** Reason given when the record was approved or rejected (goes to the audit log, FR-03). */
  decisionReason?: string;
  updatedAt: string; // ISO date from the backend
}

/** What the create / edit popup sends to the API. */
export interface ExampleInput {
  name: string;
  site: string;
  quantity: number;
  note?: string;
}

/** The form's own values: inputs always hold text, so numbers are converted on save. */
export interface ExampleFormValues {
  name: string;
  site: string;
  quantity: string;
  note: string;
}

export type ExampleDecision = 'APPROVED' | 'REJECTED';
