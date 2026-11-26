/**
 * TEMPLATE – TypeScript types for this FR.
 * Match the field names to the backend DTO (docs/api/). Don't guess fields: ask the backend team.
 */
export type ExportSaleStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ExportSaleItem {
  id: string;
  /** Human-readable reference shown in JetBrains Mono, e.g. 'TREE-036'. */
  reference: string;
  name: string;
  status: ExportSaleStatus;
  updatedAt: string; // ISO date from the backend
}

export interface ExportSaleCreateInput {
  name: string;
}
