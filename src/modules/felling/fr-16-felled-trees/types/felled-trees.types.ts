/**
 * Temporary frontend types for FR-16.
 * Update these types when the backend DTO is confirmed.
 */

export type FellingStatus = 'PENDING' | 'COMPLETED';

export interface FelledTree {
  id: string;
  recordId: string;
  fellingDate: string;
  siteLocation: string;
  treeId: string;
  permitId: string;
  fellingTeam: string;
  actualLength: number;
  actualDiameter: number;
  status: FellingStatus;
  remarks?: string;
}

export interface FelledTreeCreateInput {
  fellingDate: string;
  siteLocation: string;
  treeId: string;
  permitId: string;
  fellingTeam: string;
  actualLength: number;
  actualDiameter: number;
  status: FellingStatus;
  remarks?: string;
}

export type FelledTreeUpdateInput = FelledTreeCreateInput;