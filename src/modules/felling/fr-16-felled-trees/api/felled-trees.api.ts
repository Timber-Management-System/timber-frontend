import type {
  FelledTree,
  FelledTreeCreateInput,
  FelledTreeUpdateInput,
} from '../types/felled-trees.types';

// Temporary mock data until the backend API is ready.
const MOCK_ITEMS: FelledTree[] = [
  {
    id: '1',
    recordId: 'FR-001',
    fellingDate: '2026-11-20',
    siteLocation: 'Site A',
    treeId: 'TREE-001',
    permitId: 'PER-001',
    fellingTeam: 'Team A',
    actualLength: 12.5,
    actualDiameter: 45,
    status: 'COMPLETED',
    remarks: '',
  },
  {
    id: '2',
    recordId: 'FR-002',
    fellingDate: '2026-11-21',
    siteLocation: 'Site B',
    treeId: 'TREE-002',
    permitId: 'PER-002',
    fellingTeam: 'Team B',
    actualLength: 10.2,
    actualDiameter: 38,
    status: 'PENDING',
    remarks: '',
  },
];

// Get all felled tree records.
export async function listFelledTrees(): Promise<FelledTree[]> {
  return [...MOCK_ITEMS];
}

// Get a single felled tree record.
export async function getFelledTree(
  id: string
): Promise<FelledTree | undefined> {
  return MOCK_ITEMS.find((item) => item.id === id);
}

// Create a new felled tree record.
export async function createFelledTree(
  input: FelledTreeCreateInput
): Promise<FelledTree> {
  const newItem: FelledTree = {
    ...input,
    id: String(Date.now()),
    recordId: `FR-${String(MOCK_ITEMS.length + 1).padStart(3, '0')}`,
  };

  MOCK_ITEMS.push(newItem);

  return newItem;
}

// Update an existing felled tree record.
export async function updateFelledTree(
  id: string,
  input: FelledTreeUpdateInput
): Promise<FelledTree | undefined> {
  const index = MOCK_ITEMS.findIndex((item) => item.id === id);

  if (index === -1) {
    return undefined;
  }

  MOCK_ITEMS[index] = {
    ...MOCK_ITEMS[index],
    ...input,
  };

  return MOCK_ITEMS[index];
}