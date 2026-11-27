/**
 * TEMPLATE – backend calls for this FR. Components never call fetch directly; they use these functions.
 *
 * While NEXT_PUBLIC_USE_MOCK_API=true (the default) the functions use mock data kept in the
 * browser (src/shared/lib/mock-store.ts), so create / edit / approve work and survive a reload.
 * Replace ENDPOINT with the real path from the backend contract (docs/api/) – don't invent it.
 *
 * There is no delete function on purpose: records are never deleted, only adjusted or
 * cancelled with a reason (BR-09).
 */
import { api, USE_MOCK_API } from '@/shared/lib/api-client';
import { mockDelay, MockApiError, readMock, writeMock } from '@/shared/lib/mock-store';

import type { ExampleDecision, ExampleInput, ExampleItem } from '../types/example.types';

const ENDPOINT = '/example-items'; // TODO: real path from docs/api/
const MOCK_KEY = 'example-items'; // TODO: rename, e.g. 'replanting-records'

function seed(): ExampleItem[] {
  return [
    {
      id: '1',
      reference: 'EX-001',
      name: 'First sample',
      site: 'Site A',
      quantity: 12,
      status: 'PENDING',
      updatedAt: '2026-11-20T09:00:00Z',
    },
    {
      id: '2',
      reference: 'EX-002',
      name: 'Second sample',
      site: 'Site B',
      quantity: 30,
      status: 'APPROVED',
      decisionReason: 'Checked on site',
      updatedAt: '2026-11-21T14:30:00Z',
    },
    {
      id: '3',
      reference: 'EX-003',
      name: 'Third sample',
      site: 'Site A',
      quantity: 8,
      note: 'Waiting for the survey photos',
      status: 'PENDING',
      updatedAt: '2026-11-22T08:15:00Z',
    },
  ];
}

const readItems = () => readMock(MOCK_KEY, seed);

export async function listExampleItems(): Promise<ExampleItem[]> {
  if (!USE_MOCK_API) return api.get<ExampleItem[]>(ENDPOINT);
  await mockDelay();
  return readItems();
}

export async function createExampleItem(input: ExampleInput): Promise<ExampleItem> {
  if (!USE_MOCK_API) return api.post<ExampleItem>(ENDPOINT, input);
  await mockDelay();
  const items = readItems();
  const item: ExampleItem = {
    ...input,
    id: String(Date.now()),
    reference: `EX-${String(items.length + 1).padStart(3, '0')}`,
    status: 'PENDING',
    updatedAt: new Date().toISOString(),
  };
  writeMock(MOCK_KEY, [item, ...items]);
  return item;
}

export async function updateExampleItem(id: string, input: ExampleInput): Promise<ExampleItem> {
  if (!USE_MOCK_API) return api.put<ExampleItem>(`${ENDPOINT}/${id}`, input);
  await mockDelay();
  return changeMockItem(id, (item) => {
    // Decided records are locked; the backend should refuse this too.
    if (item.status !== 'PENDING') throw new MockApiError('NOT_EDITABLE', 409);
    return { ...item, ...input };
  });
}

/** Approve or reject a pending record. The reason is stored for the audit log (FR-03). */
export async function decideExampleItem(id: string, decision: ExampleDecision, reason: string): Promise<ExampleItem> {
  if (!USE_MOCK_API) {
    const action = decision === 'APPROVED' ? 'approve' : 'reject';
    return api.post<ExampleItem>(`${ENDPOINT}/${id}/${action}`, { reason });
  }
  await mockDelay();
  return changeMockItem(id, (item) => {
    if (item.status !== 'PENDING') throw new MockApiError('ALREADY_DECIDED', 409);
    return { ...item, status: decision, decisionReason: reason || undefined };
  });
}

function changeMockItem(id: string, change: (item: ExampleItem) => ExampleItem): ExampleItem {
  const items = readItems();
  const current = items.find((i) => i.id === id);
  if (!current) throw new MockApiError('NOT_FOUND', 404);
  const updated = { ...change(current), updatedAt: new Date().toISOString() };
  writeMock(
    MOCK_KEY,
    items.map((i) => (i.id === id ? updated : i)),
  );
  return updated;
}
