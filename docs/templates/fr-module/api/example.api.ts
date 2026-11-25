/**
 * TEMPLATE – backend calls for this FR. Components never call fetch directly; they use these functions.
 *
 * Until the backend endpoint exists, set USE_MOCK = true and work with the mock data below.
 * Replace ENDPOINT with the real path from the backend contract (docs/api/) – don't invent it.
 */
import { api } from '@/shared/lib/api-client';

import type { ExampleCreateInput, ExampleItem } from '../types/example.types';

const ENDPOINT = '/example-items'; // TODO: real path from docs/api/
const USE_MOCK = true; // TODO: set to false when the backend endpoint is ready

const MOCK_ITEMS: ExampleItem[] = [
  { id: '1', reference: 'EX-001', name: 'First sample', status: 'PENDING', updatedAt: '2026-11-20T09:00:00Z' },
  { id: '2', reference: 'EX-002', name: 'Second sample', status: 'APPROVED', updatedAt: '2026-11-21T14:30:00Z' },
];

export async function listExampleItems(): Promise<ExampleItem[]> {
  if (USE_MOCK) return MOCK_ITEMS;
  return api.get<ExampleItem[]>(ENDPOINT);
}

export async function createExampleItem(input: ExampleCreateInput): Promise<ExampleItem> {
  if (USE_MOCK) {
    return {
      id: String(Date.now()),
      reference: 'EX-NEW',
      name: input.name,
      status: 'PENDING',
      updatedAt: new Date().toISOString(),
    };
  }
  return api.post<ExampleItem>(ENDPOINT, input);
}
