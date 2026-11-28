import type {
  AgeingBucket,
  GroupByOption,
  InventoryFilterParams,
  InventorySummary,
  StockGroupSummary,
  StockItem,
  StorageZone,
} from '../types';

export const MOCK_STOCK_ITEMS: StockItem[] = [
  {
    id: 'LOG-2026-001',
    itemCode: 'LOG-2026-001',
    type: 'Raw log',
    species: 'Teak',
    grade: '—',
    size: '2.4 m',
    location: 'Yard A',
    reference: 'RCV-2026-0042',
    quantityM3: 0.193,
    ageDays: 2,
    status: 'Available',
    receivedDate: '2026-11-24',
    originChain: {
      permit: 'PER-2026-010',
      permitDesc: 'Teak felling permit · Coup 4',
      tree: 'TR-029',
      treeDesc: 'Block B · Girth 140cm',
      log: 'LOG-2026-001',
      logDesc: 'Teak · 2.4 m',
      receipt: 'RCV-2026-0042',
      receiptDate: '24 Nov 2026',
      processingOrder: 'Pending',
      processingDate: '—',
      finishedItem: '—',
      rack: 'Yard A',
    },
    movements: [
      {
        date: '24 Nov 2026',
        movement: 'Received',
        from: 'Kalutara Coup 4',
        to: 'Yard A',
        volumeM3: 0.193,
        by: 'Yard manager',
        reference: 'RCV-2026-0042',
      },
    ],
  },
  {
    id: 'LOG-2026-004',
    itemCode: 'LOG-2026-004',
    type: 'Raw log',
    species: 'Mahogany',
    grade: '—',
    size: '3.0 m',
    location: 'Yard A',
    reference: 'RCV-2026-0042',
    quantityM3: 0.305,
    ageDays: 2,
    status: 'Reserved',
    receivedDate: '2026-11-24',
  },
  {
    id: 'LOG-2026-007',
    itemCode: 'LOG-2026-007',
    type: 'In processing',
    species: 'Teak',
    grade: '—',
    size: '2.8 m',
    location: 'Sawmill A',
    reference: 'PO-2026-0042',
    quantityM3: 0.254,
    ageDays: 4,
    status: 'In processing',
    receivedDate: '2026-11-22',
  },
  {
    id: 'FT-2026-012',
    itemCode: 'FT-2026-012',
    type: 'Finished',
    species: 'Teak',
    grade: 'A',
    size: '2400×150×25',
    location: 'Rack 17',
    reference: 'PO-2026-0040',
    quantityM3: 0.180,
    ageDays: 5,
    status: 'Available',
    receivedDate: '2026-11-21',
    originChain: {
      permit: 'PER-2026-010',
      permitDesc: 'Teak felling permit',
      tree: 'TR-029',
      treeDesc: 'Block B',
      log: 'LOG-2026-017',
      logDesc: 'Teak · 2.6 m',
      receipt: 'RCV-2026-0031',
      receiptDate: '01 Nov 2026',
      processingOrder: 'PO-2026-0040',
      processingDate: 'Completed 08 Nov 2026',
      finishedItem: 'FT-2026-012',
      rack: 'Rack 17',
    },
    movements: [
      {
        date: '08 Nov 2026',
        movement: 'Produced',
        from: '—',
        to: 'Sawmill A',
        volumeM3: 0.180,
        by: 'Mill manager',
        reference: 'PO-2026-0040',
      },
      {
        date: '08 Nov 2026',
        movement: 'Transfer',
        from: 'Sawmill A',
        to: 'Rack 17',
        volumeM3: 0.180,
        by: 'Yard manager',
        reference: 'TRF-2026-011',
      },
      {
        date: '12 Nov 2026',
        movement: 'Stock take · no change',
        from: 'Rack 17',
        to: 'Rack 17',
        volumeM3: 0.180,
        by: 'Yard manager',
        reference: 'ST-2026-004',
      },
    ],
  },
  {
    id: 'FT-2026-013',
    itemCode: 'FT-2026-013',
    type: 'Finished',
    species: 'Mahogany',
    grade: 'B',
    size: '2400×100×100',
    location: 'Rack 18',
    reference: 'PO-2026-0040',
    quantityM3: 0.120,
    ageDays: 5,
    status: 'Low stock',
    receivedDate: '2026-11-21',
  },
  {
    id: 'BP-2026-003',
    itemCode: 'BP-2026-003',
    type: 'By-product',
    species: 'Teak',
    grade: 'N/A',
    size: 'N/A',
    location: 'Yard B',
    reference: 'PO-2026-0042',
    quantityM3: 0.054,
    ageDays: 4,
    status: 'Available',
    receivedDate: '2026-11-22',
  },
  {
    id: 'LOG-2026-089',
    itemCode: 'LOG-2026-089',
    type: 'Raw log',
    species: 'Jak',
    grade: 'A',
    size: '4.5 m',
    location: 'Yard A',
    reference: 'RCV-2026-0028',
    quantityM3: 1.250,
    ageDays: 25,
    status: 'Available',
    receivedDate: '2026-11-01',
  },
  {
    id: 'FT-2026-044',
    itemCode: 'FT-2026-044',
    type: 'Finished',
    species: 'Teak',
    grade: 'A',
    size: '3000×200×50',
    location: 'Rack 17',
    reference: 'PO-2026-0022',
    quantityM3: 0.420,
    ageDays: 42,
    status: 'Available',
    receivedDate: '2026-10-15',
  },
  {
    id: 'LOG-2026-102',
    itemCode: 'LOG-2026-102',
    type: 'Raw log',
    species: 'Mahogany',
    grade: 'B',
    size: '3.6 m',
    location: 'Yard B',
    reference: 'RCV-2026-0019',
    quantityM3: 0.880,
    ageDays: 47,
    status: 'Available',
    receivedDate: '2026-10-10',
  },
  {
    id: 'FT-2026-080',
    itemCode: 'FT-2026-080',
    type: 'Finished',
    species: 'Teak',
    grade: 'A',
    size: '2400×150×25',
    location: 'Rack 17',
    reference: 'PO-2026-0014',
    quantityM3: 0.350,
    ageDays: 70,
    status: 'Reserved',
    receivedDate: '2026-09-17',
  },
  {
    id: 'FT-2026-095',
    itemCode: 'FT-2026-095',
    type: 'Finished',
    species: 'Mahogany',
    grade: 'B',
    size: '2000×100×50',
    location: 'Rack 18',
    reference: 'PO-2026-0009',
    quantityM3: 0.290,
    ageDays: 95,
    status: 'Available',
    receivedDate: '2026-08-23',
  },
  {
    id: 'LOG-2026-112',
    itemCode: 'LOG-2026-112',
    type: 'Raw log',
    species: 'Teak',
    grade: 'B',
    size: '5.2 m',
    location: 'Yard A',
    reference: 'RCV-2026-0005',
    quantityM3: 1.480,
    ageDays: 112,
    status: 'Available',
    receivedDate: '2026-08-06',
  },
];

export const MOCK_STORAGE_ZONES: StorageZone[] = [
  {
    id: 'yard-a',
    name: 'Yard A',
    subtitle: 'Log yard',
    type: 'Raw logs',
    itemCount: 96,
    volumeM3: 298.4,
    oldestDays: 112,
    ageBracket: '90+',
    description: 'Main log arrival area for newly received timber from Sinharaja and Ratnapura.',
    reservedM3: 0.0,
  },
  {
    id: 'yard-b',
    name: 'Yard B',
    subtitle: 'Logs and by-products',
    type: 'Secondary storage',
    itemCount: 40,
    volumeM3: 62.0,
    oldestDays: 47,
    ageBracket: '31-60',
    description: 'Buffer yard holding assorted off-cuts, firewood, and secondary log reserves.',
    reservedM3: 0.0,
  },
  {
    id: 'sawmill-a',
    name: 'Sawmill A',
    subtitle: 'In processing',
    type: 'Production',
    itemCount: 14,
    volumeM3: 3.6,
    oldestDays: 6,
    ageBracket: '0-30',
    description: 'Bandsaw lines, break-down carriages, and resaws currently in active operation.',
    reservedM3: 0.0,
  },
  {
    id: 'rack-17',
    name: 'Rack 17',
    subtitle: 'Finished timber',
    type: 'Warehouse bay 1',
    itemCount: 52,
    volumeM3: 410.0,
    oldestDays: 70,
    ageBracket: '61-90',
    description: 'High-grade seasoned Teak planks and structural beams ready for dispatch.',
    reservedM3: 90.0,
  },
  {
    id: 'rack-18',
    name: 'Rack 18',
    subtitle: 'Finished timber',
    type: 'Warehouse bay 2',
    itemCount: 38,
    volumeM3: 290.0,
    oldestDays: 95,
    ageBracket: '90+',
    description: 'Mahogany boards, joinery components, and special profiled mouldings.',
    reservedM3: 30.0,
  },
  {
    id: 'rack-19',
    name: 'Rack 19',
    subtitle: 'Finished timber',
    type: 'Warehouse bay 3',
    itemCount: 8,
    volumeM3: 176.0,
    oldestDays: 20,
    ageBracket: '0-30',
    description: 'Fast-moving Jak and Nedun inventory earmarked for upcoming contractor orders.',
    reservedM3: 0.0,
  },
];

export interface InventoryReportResponse {
  items: StockItem[];
  summary: InventorySummary;
  ageingBuckets: AgeingBucket[];
  stockGroupSummaries: StockGroupSummary[];
  storageZones: StorageZone[];
  totalVolumeM3: number;
}

export function computeGroupSummary(
  items: StockItem[],
  groupBy: GroupByOption
): StockGroupSummary[] {
  const groups: Record<
    string,
    { count: number; volume: number; ages: number[] }
  > = {};

  const totalVol = items.reduce((sum, i) => sum + i.quantityM3, 0) || 1;

  for (const item of items) {
    let key = 'Other';
    if (groupBy === 'Species') key = item.species || 'Other';
    else if (groupBy === 'Grade') key = item.grade || 'Standard';
    else if (groupBy === 'Size') key = item.size || 'Standard';
    else if (groupBy === 'Location') key = item.location || 'Unassigned';

    if (!groups[key]) {
      groups[key] = { count: 0, volume: 0, ages: [] };
    }
    groups[key].count += 1;
    groups[key].volume += item.quantityM3;
    groups[key].ages.push(item.ageDays);
  }

  return Object.entries(groups).map(([groupKey, data]) => {
    const avgAge =
      data.ages.length > 0
        ? Math.round(data.ages.reduce((a, b) => a + b, 0) / data.ages.length)
        : 0;
    const oldest = data.ages.length > 0 ? Math.max(...data.ages) : 0;

    return {
      groupKey,
      itemCount: data.count,
      volumeM3: Number(data.volume.toFixed(1)),
      percentage: Number(((data.volume / totalVol) * 100).toFixed(1)),
      avgAgeDays: avgAge,
      oldestAgeDays: oldest,
    };
  });
}

export async function fetchInventoryReport(
  filters: InventoryFilterParams,
  simulateError = false
): Promise<InventoryReportResponse> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (simulateError) {
    throw new Error('Failed to load inventory report from server. Please retry.');
  }

  const filtered = MOCK_STOCK_ITEMS.filter((item) => {
    if (filters.categoryTab && filters.categoryTab !== 'All') {
      if (filters.categoryTab === 'Raw logs' && item.type !== 'Raw log') return false;
      if (filters.categoryTab === 'In processing' && item.type !== 'In processing') return false;
      if (filters.categoryTab === 'Finished' && item.type !== 'Finished') return false;
      if (filters.categoryTab === 'By-products' && item.type !== 'By-product') return false;
    }
    if (filters.species && filters.species !== 'All' && filters.species !== 'All species' && item.species !== filters.species) {
      return false;
    }
    if (filters.grade && filters.grade !== 'All' && filters.grade !== 'All grades' && item.grade !== filters.grade) {
      return false;
    }
    if (filters.size && filters.size !== 'All' && filters.size !== 'All sizes' && item.size !== filters.size) {
      return false;
    }
    if (filters.location && filters.location !== 'All' && filters.location !== 'All locations' && item.location !== filters.location) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      const match =
        item.itemCode.toLowerCase().includes(q) ||
        item.species.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.reference.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const ageingBuckets: AgeingBucket[] = [
    { id: '0-30', label: '0–30 days', volumeM3: 412.5, percentage: 33.3, itemCount: 96 },
    { id: '31-60', label: '31–60 days', volumeM3: 318.2, percentage: 25.7, itemCount: 71 },
    { id: '61-90', label: '61–90 days', volumeM3: 190.4, percentage: 15.3, itemCount: 38 },
    { id: '90+', label: '90+ days', volumeM3: 318.9, percentage: 25.7, itemCount: 43 },
  ];

  const stockGroupSummaries: StockGroupSummary[] = [
    { groupKey: 'Teak', itemCount: 142, volumeM3: 640.0, percentage: 51.6, avgAgeDays: 21, oldestAgeDays: 118 },
    { groupKey: 'Mahogany', itemCount: 71, volumeM3: 360.0, percentage: 29.0, avgAgeDays: 18, oldestAgeDays: 96 },
    { groupKey: 'Jak', itemCount: 25, volumeM3: 150.0, percentage: 12.1, avgAgeDays: 25, oldestAgeDays: 104 },
    { groupKey: 'Other', itemCount: 10, volumeM3: 90.0, percentage: 7.3, avgAgeDays: 12, oldestAgeDays: 45 },
  ];

  const summary: InventorySummary = {
    rawLogsCount: 120,
    wipCount: 14,
    finishedVolumeM3: 960.0,
    reservedVolumeM3: 120.0,
    totalItems: 248,
    totalVolumeM3: 1240.0,
  };

  return {
    items: filtered,
    summary,
    ageingBuckets,
    stockGroupSummaries,
    storageZones: MOCK_STORAGE_ZONES,
    totalVolumeM3: 1240.0,
  };
}

export function getStockItemById(id: string): StockItem | null {
  const found = MOCK_STOCK_ITEMS.find(
    (item) => item.id.toLowerCase() === id.toLowerCase() || item.itemCode.toLowerCase() === id.toLowerCase()
  );
  if (found) return found;

  // Fallback realistic item for any ID requested
  return {
    id,
    itemCode: id,
    type: 'Finished',
    species: 'Teak',
    grade: 'A',
    size: '2400×150×25',
    location: 'Rack 17',
    reference: 'PO-2026-0040',
    quantityM3: 0.180,
    ageDays: 5,
    status: 'Available',
    receivedDate: '2026-11-21',
    originChain: {
      permit: 'PER-2026-010',
      permitDesc: 'Teak felling permit',
      tree: 'TR-029',
      treeDesc: 'Block B',
      log: 'LOG-2026-017',
      logDesc: 'Teak · 2.6 m',
      receipt: 'RCV-2026-0031',
      receiptDate: '01 Nov 2026',
      processingOrder: 'PO-2026-0040',
      processingDate: 'Completed 08 Nov 2026',
      finishedItem: id,
      rack: 'Rack 17',
    },
    movements: [
      {
        date: '08 Nov 2026',
        movement: 'Produced',
        from: '—',
        to: 'Sawmill A',
        volumeM3: 0.180,
        by: 'Mill manager',
        reference: 'PO-2026-0040',
      },
      {
        date: '08 Nov 2026',
        movement: 'Transfer',
        from: 'Sawmill A',
        to: 'Rack 17',
        volumeM3: 0.180,
        by: 'Yard manager',
        reference: 'TRF-2026-011',
      },
      {
        date: '12 Nov 2026',
        movement: 'Stock take · no change',
        from: 'Rack 17',
        to: 'Rack 17',
        volumeM3: 0.180,
        by: 'Yard manager',
        reference: 'ST-2026-004',
      },
    ],
  };
}
