'use client';

import { LinkTabs } from '@/shared/components/ui/LinkTabs';
import { useT } from '@/web-requirements/wr-08-multi-language';

/** Users | Roles & permissions | Audit log - the tabs on S-01.5 and S-01.7. */
export function AdminTabs() {
  const t = useT();
  return (
    <LinkTabs
      label={t('admin.sections')}
      tabs={[
        { href: '/user-access/user-management', label: t('users.title') },
        { href: '/user-access/roles', label: t('roles.title') },
        { href: '/audit-admin/audit-log', label: t('admin.auditLog') },
      ]}
    />
  );
}
