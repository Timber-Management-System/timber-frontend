import { Suspense } from 'react';
import { InventoryAgeingPage } from '@/modules/reports/fr-52-inventory-ageing';

export const metadata = {
  title: 'Inventory & Ageing Report | TimberTrack',
  description:
    'Real-time stock of logs, work-in-progress and finished timber, with stock ageing analysis.',
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading inventory report...</div>}>
      <InventoryAgeingPage />
    </Suspense>
  );
}
