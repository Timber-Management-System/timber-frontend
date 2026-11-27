import type {
  ReplantingRecord,
  ReplantingCreateInput,
} from '../types/replanting.types';

const USE_MOCK = true;

const MOCK_RECORDS: ReplantingRecord[] = [
  {
    id: 'RP-001',
    plantingDate: '2026-11-20',
    site: 'Site A',
    species: 'Teak',
    treeCount: 150,
    responsibleTeam: 'Team A',
    status: 'Completed',
  },
  {
    id: 'RP-002',
    plantingDate: '2026-11-21',
    site: 'Site B',
    species: 'Mahogany',
    treeCount: 100,
    responsibleTeam: 'Team B',
    status: 'In Progress',
  },
  {
    id: 'RP-003',
    plantingDate: '2026-11-22',
    site: 'Site C',
    species: 'Pine',
    treeCount: 200,
    responsibleTeam: 'Team C',
    status: 'Pending',
  },
];

export async function listReplantingRecords(): Promise<ReplantingRecord[]> {
  if (USE_MOCK) return MOCK_RECORDS;

  throw new Error('Backend API is not available yet.');
}

export async function createReplantingRecord(
  input: ReplantingCreateInput
): Promise<ReplantingRecord> {
  if (USE_MOCK) {
    const newRecord: ReplantingRecord = {
      ...input,
      id: `RP-${String(MOCK_RECORDS.length + 1).padStart(3, '0')}`,
    };

    MOCK_RECORDS.push(newRecord);

    return newRecord;
  }

  throw new Error('Backend API is not available yet.');
}

export async function getReplantingRecord(
  id: string
): Promise<ReplantingRecord | null> {
  if (USE_MOCK) {
    return MOCK_RECORDS.find((record) => record.id === id) ?? null;
  }

  throw new Error('Backend API is not available yet.');
}