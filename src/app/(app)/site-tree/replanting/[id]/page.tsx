import { ReplantingRecordDetails } from '@/modules/site-tree/fr-14-replanting';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <ReplantingRecordDetails recordId={id} />;
}