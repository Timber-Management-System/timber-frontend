import { LoginPage } from '@/modules/user-access/fr-01-authentication';

type Search = Promise<{ next?: string; reason?: string }>;

export default async function Page({ searchParams }: { searchParams: Search }) {
  const { next, reason } = await searchParams;
  return <LoginPage next={next} reason={reason} />;
}
