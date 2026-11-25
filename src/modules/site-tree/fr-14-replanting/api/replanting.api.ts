import type { ReplantingRecord } from '../types/replanting.types';

const USE_MOCK = true;

const MOCK_RECORDS: ReplantingRecord[] = [
  {
    id: 'RP-001',
    plantingDate: '2026-11-20',
    site: 'Site A',
    species: 'Teak',
    treeCount: 150,
    status: 'Completed',
  },
  {
    id: 'RP-002',
    plantingDate: '2026-11-21',
    site: 'Site B',
    species: 'Mahogany',
    treeCount: 100,
    status: 'In Progress',
  },
  {
    id: 'RP-003',
    plantingDate: '2026-11-22',
    site: 'Site C',
    species: 'Pine',
    treeCount: 200,
    status: 'Pending',
  },
];

export async function listReplantingRecords(): Promise<ReplantingRecord[]> {
  if (USE_MOCK) return MOCK_RECORDS;

  throw new Error('Backend API is not available yet.');
}