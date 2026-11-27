import { ProfilePage } from '@/modules/user-access/fr-01-authentication';

export default async function Page({ searchParams }: { searchParams: Promise<{ changePassword?: string }> }) {
  const { changePassword } = await searchParams;
  return <ProfilePage forceChange={changePassword === '1'} />;
}
