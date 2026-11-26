import { ResetPasswordPage } from '@/modules/user-access/fr-01-authentication';

/** Opened from the reset link an admin sends (S-18.2): /reset-password?email=…&code=… */
export default async function Page({ searchParams }: { searchParams: Promise<{ email?: string; code?: string }> }) {
  const { email, code } = await searchParams;
  return <ResetPasswordPage initialEmail={email} initialCode={code} />;
}
