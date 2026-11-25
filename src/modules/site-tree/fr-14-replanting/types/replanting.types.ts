export type ReplantingRecord = {
  id: string;
  plantingDate: string;
  site: string;
  species: string;
  treeCount: number;
  responsibleTeam?: string;
  status: string;
};

export interface ReplantingCreateInput {
  plantingDate: string;
  site: string;
  species: string;
  treeCount: number;
  responsibleTeam: string;
  status: string;
}