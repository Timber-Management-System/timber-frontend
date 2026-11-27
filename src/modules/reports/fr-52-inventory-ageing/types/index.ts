export type StockType = 'Raw log' | 'In processing' | 'Finished' | 'By-product';

export type StockStatus = 'Available' | 'Reserved' | 'In processing' | 'Low stock' | 'Damaged';

export interface MovementRecord {
  date: string;
  movement: string;
  from: string;
  to: string;
  volumeM3: number;
  by: string;
  reference: string;
}

export interface OriginChainInfo {
  permit: string;
  permitDesc: string;
  tree: string;
  treeDesc: string;
  log: string;
  logDesc: string;
  receipt: string;
  receiptDate: string;
  processingOrder: string;
  processingDate: string;
  finishedItem: string;
  rack: string;
}

export interface StockItem {
  id: string;
  itemCode: string;
  type: StockType;
  species: string;
  grade: string;
  size: string;
  location: string;
  reference: string;
  quantityM3: number;
  ageDays: number;
  status: StockStatus;
  receivedDate: string;
  logTag?: string;
  originSite?: string;
  originChain?: OriginChainInfo;
  movements?: MovementRecord[];
}

export interface InventorySummary {
  rawLogsCount: number;
  wipCount: number;
  finishedVolumeM3: number;
  reservedVolumeM3: number;
  totalItems: number;
  totalVolumeM3: number;
}

export type AgeBucketId = '0-30' | '31-60' | '61-90' | '90+';

export interface AgeingBucket {
  id: AgeBucketId;
  label: string;
  volumeM3: number;
  percentage: number;
  itemCount: number;
}

export type GroupByOption = 'Species' | 'Grade' | 'Size' | 'Location';

export interface StockGroupSummary {
  groupKey: string;
  itemCount: number;
  volumeM3: number;
  percentage: number;
  avgAgeDays: number;
  oldestAgeDays: number;
}

export interface InventoryFilterParams {
  categoryTab: string; // 'All' | 'Raw logs' | 'In processing' | 'Finished' | 'By-products'
  searchQuery: string;
  species: string;
  grade: string;
  size: string;
  location: string;
}

export type ViewState = 'ready' | 'loading' | 'empty' | 'error';

export interface StorageZone {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  itemCount: number;
  volumeM3: number;
  oldestDays: number;
  ageBracket: AgeBucketId;
  description: string;
  reservedM3?: number;
}
