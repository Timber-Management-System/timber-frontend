export type TreeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Tree {
  id: number;
  treeCode: string;
  species: string;
  lot: string;
  girthCm: number;
  volumeM3: number;
  status: TreeStatus;
  surveyedBy: string;
  permitId: string;
  rejectReason?: string;
}