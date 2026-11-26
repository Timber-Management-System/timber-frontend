import { api } from '@/shared/lib/api-client';

import type { ExportSaleCreateInput, ExportSaleItem } from '../types/export-sales.types';
const ENDPOINT = '/example-items'; // TODO: real path from docs/api/
const USE_MOCK = true; // TODO: set to false when the backend endpoint is ready

const MOCK_ITEMS: ExportSaleItem[] = [
  { id: '1', reference: 'EX-001', name: 'First sample', status: 'PENDING', updatedAt: '2026-11-20T09:00:00Z' },
  { id: '2', reference: 'EX-002', name: 'Second sample', status: 'APPROVED', updatedAt: '2026-11-21T14:30:00Z' },
];

export async function listExportSales(): Promise<ExportSaleItem[]> {
  if (USE_MOCK) return MOCK_ITEMS;
  return api.get<ExportSaleItem[]>(ENDPOINT);
}

export async function createExportSale(input: ExportSaleCreateInput): Promise<ExportSaleItem> {
  if (USE_MOCK) {
    return {
      id: String(Date.now()),
      reference: 'EX-NEW',
      name: input.name,
      status: 'PENDING',
      updatedAt: new Date().toISOString(),
    };
  }
  return api.post<ExportSaleItem>(ENDPOINT, input);
}
