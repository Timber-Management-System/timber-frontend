import { MfaPage } from '@/modules/user-access/fr-01-authentication';

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <MfaPage next={next} />;
}
