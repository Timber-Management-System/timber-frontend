import { StorageLocationsPage } from '@/modules/reports/fr-52-inventory-ageing';

export const metadata = {
  title: 'Storage Locations | TimberTrack',
  description:
    'Schematic yard, sawmill, and rack layout showing stock volume, items, and age heatmap.',
};

export default function Page() {
  return <StorageLocationsPage />;
}
