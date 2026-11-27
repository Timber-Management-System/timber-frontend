import { StockItemDetailPage } from '@/modules/reports/fr-52-inventory-ageing/components/StockItemDetailPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  return {
    title: `Stock Item ${itemId} | TimberTrack`,
    description: `Detailed traceability, specifications, and movement timeline for ${itemId}.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  return <StockItemDetailPage itemId={itemId} />;
}
