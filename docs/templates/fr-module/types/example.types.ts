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
  status: ExampleStatus;
  updatedAt: string; // ISO date from the backend
}

export interface ExampleCreateInput {
  name: string;
}
