import type { ReactNode } from 'react';

/** Customer portal (FR-42 / WR-09): customers see only their own orders, invoices and deliveries. */
export default function PortalLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
