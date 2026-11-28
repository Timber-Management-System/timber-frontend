import type { Tree } from '../types/tree';

// TEMPORARY mock data. Replace with real backend calls later.
const PROTECTED_SPECIES = ['Ebony'];
const PERMIT_QUOTA: Record<string, number> = { 'PRM-001': 10, 'PRM-002': 5 };

const trees: Tree[] = [
  { id: 1, treeCode: 'TREE-025', species: 'Teak', lot: 'Lot A', girthCm: 142, volumeM3: 3.2, status: 'PENDING', surveyedBy: 'Surveyor 1', permitId: 'PRM-001' },
  { id: 2, treeCode: 'TREE-026', species: 'Mahogany', lot: 'Lot A', girthCm: 160, volumeM3: 4.1, status: 'PENDING', surveyedBy: 'Surveyor 1', permitId: 'PRM-001' },
  { id: 3, treeCode: 'TREE-027', species: 'Ebony', lot: 'Lot B', girthCm: 120, volumeM3: 2.5, status: 'PENDING', surveyedBy: 'Surveyor 2', permitId: 'PRM-002' },
  { id: 4, treeCode: 'TREE-028', species: 'Teak', lot: 'Lot A', girthCm: 170, volumeM3: 5.0, status: 'PENDING', surveyedBy: 'Surveyor 1', permitId: 'PRM-001' },
];

export async function getTrees(): Promise<Tree[]> {
  return trees;
}

export async function approveTree(id: number): Promise<Tree> {
  const tree = trees.find((t) => t.id === id);
  if (!tree) throw new Error('Tree not found');

  if (PROTECTED_SPECIES.includes(tree.species)) {
    throw new Error('BR-02: Protected species cannot be approved for felling');
  }

  const used = trees
    .filter((t) => t.permitId === tree.permitId && t.status === 'APPROVED')
    .reduce((sum, t) => sum + t.volumeM3, 0);
  if (used + tree.volumeM3 > (PERMIT_QUOTA[tree.permitId] ?? 0)) {
    throw new Error('BR-01: Permit quota exceeded');
  }

  tree.status = 'APPROVED';
  return tree;
}

export async function rejectTree(id: number, reason: string): Promise<Tree> {
  const tree = trees.find((t) => t.id === id);
  if (!tree) throw new Error('Tree not found');
  if (!reason.trim()) throw new Error('Reject reason is required');

  tree.status = 'REJECTED';
  tree.rejectReason = reason;
  return tree;
}
