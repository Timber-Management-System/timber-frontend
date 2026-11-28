import type {Trip, Log} from "../types/log-receiving.types";
export const initialTrips: Trip[] = [
  { id: 'TRIP-001', origin: 'North Forest Depot', vehicle: 'WP-CA-4821', driver: 'K. Perera', date: '2026-11-19', logIds: ['LOG-001','LOG-002','LOG-003'], received: [], rejected: [], status: 'Pending' },
  { id: 'TRIP-002', origin: 'Hillcrest Logging Site', vehicle: 'CP-BB-2314', driver: 'S. Fernando', date: '2026-11-19', logIds: ['LOG-004','LOG-005'], received: ['LOG-004'], rejected: [], status: 'In Progress' },
  { id: 'TRIP-003', origin: 'South Timber Collection', vehicle: 'SP-DA-9920', driver: 'N. Silva', date: '2026-11-18', logIds: ['LOG-006','LOG-007'], received: ['LOG-006','LOG-007'], rejected: [], status: 'Completed' },
  { id: 'TRIP-004', origin: 'Central Timber Depot', vehicle: 'WP-LK-4521', driver: 'R. Silva', date: '2026-11-20', logIds: ['LOG-008', 'LOG-009', 'LOG-010', 'LOG-011', 'LOG-012', 'LOG-013', 'LOG-014'], received: ['LOG-008', 'LOG-009', 'LOG-010', 'LOG-011', 'LOG-012', 'LOG-013', 'LOG-014'], rejected: [], status: 'Completed' }
];
export const logs: Record<string, Log> = {
  'LOG-001': { id:'LOG-001', treeId:'TREE-101', species:'Teak', diameter:42, length:4.5, volume:0.62, tripId:'TRIP-001' },
  'LOG-002': { id:'LOG-002', treeId:'TREE-102', species:'Mahogany', diameter:37, length:4.2, volume:0.45, tripId:'TRIP-001' },
  'LOG-003': { id:'LOG-003', treeId:'TREE-103', species:'Teak', diameter:46, length:5.0, volume:0.83, tripId:'TRIP-001' },
  'LOG-004': { id:'LOG-004', treeId:'TREE-104', species:'Jak', diameter:35, length:4.0, volume:0.38, tripId:'TRIP-002' },
  'LOG-005': { id:'LOG-005', treeId:'TREE-105', species:'Teak', diameter:41, length:4.8, volume:0.63, tripId:'TRIP-002' },
  'LOG-006': { id:'LOG-006', treeId:'TREE-106', species:'Mahogany', diameter:39, length:4.4, volume:0.53, tripId:'TRIP-003' },
  'LOG-007': { id:'LOG-007', treeId:'TREE-107', species:'Jak', diameter:33, length:3.8, volume:0.32, tripId:'TRIP-003' },
  'LOG-008': { id: 'LOG-008', treeId: 'TREE-108', species: 'Teak', diameter: 30, length: 3.6, volume: 0.254, tripId: 'TRIP-004' },
  'LOG-009': { id: 'LOG-009', treeId: 'TREE-109', species: 'Teak', diameter: 32, length: 3.73, volume: 0.3, tripId: 'TRIP-004' },
  'LOG-010': { id: 'LOG-010', treeId: 'TREE-110', species: 'Pine', diameter: 25, length: 3.67, volume: 0.18, tripId: 'TRIP-004' },
  'LOG-011': { id: 'LOG-011', treeId: 'TREE-111', species: 'Mahogany', diameter: 40, length: 4, volume: 0.503, tripId: 'TRIP-004' },
  'LOG-012': { id: 'LOG-012', treeId: 'TREE-112', species: 'Jak', diameter: 36, length: 4, volume: 0.407, tripId: 'TRIP-004' },
  'LOG-013': { id: 'LOG-013', treeId: 'TREE-113', species: 'Teak', diameter: 35, length: 4, volume: 0.385, tripId: 'TRIP-004' },
  'LOG-014': { id: 'LOG-014', treeId: 'TREE-114', species: 'Pine', diameter: 30, length: 4, volume: 0.283, tripId: 'TRIP-004' }
};
