import type { ReactNode } from 'react';

/** Public company website (WR-10, optional). Code lives in src/site/. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
