import { redirect } from 'next/navigation';

/** "/" has no page of its own: send people to their dashboard (WR-02). */
export default function Home() {
  redirect('/dashboard');
}
