import type { NavGroup } from '@/shared/components/layout/Sidebar';

/**
 * Sidebar menu (navigation Option B). One link per requirement: each href is the route of
 * that FR's page in src/app/(app)/<domain>/<feature>/, which wraps src/modules/<domain>/fr-xx-<name>/.
 *
 * - `id` is also the i18n key (`nav.<id>`) and the badge key passed to <Sidebar badges={…} />.
 * - `label` is the English fallback until the i18n library is chosen.
 */
export const NAVIGATION: NavGroup[] = [
  {
    id: 'main',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: 'grid', href: '/dashboard', requirement: 'WR-02' }],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      {
        id: 'licence',
        label: 'Licence & Permit',
        icon: 'file',
        children: [
          {
            id: 'licence.company-licence',
            label: 'Company licences',
            href: '/licence-permit/company-licence',
            requirement: 'FR-04',
          },
          {
            id: 'licence.felling-permit',
            label: 'Felling permits',
            href: '/licence-permit/felling-permit',
            requirement: 'FR-05',
          },
          {
            id: 'licence.quota-tracking',
            label: 'Quota tracking',
            href: '/licence-permit/quota-tracking',
            requirement: 'FR-06',
          },
          {
            id: 'licence.expiry-alerts',
            label: 'Expiry alerts',
            href: '/licence-permit/expiry-alerts',
            requirement: 'FR-07',
          },
          {
            id: 'licence.transport-permit',
            label: 'Transport permits',
            href: '/licence-permit/transport-permit',
            requirement: 'FR-08',
          },
          {
            id: 'licence.permit-documents',
            label: 'Documents & compliance',
            href: '/licence-permit/permit-documents',
            requirement: 'FR-09',
          },
        ],
      },
      {
        id: 'site',
        label: 'Site & Trees',
        icon: 'tree',
        children: [
          { id: 'site.site-lot', label: 'Sites & lots', href: '/site-tree/site-lot', requirement: 'FR-10' },
          { id: 'site.tree-survey', label: 'Tree survey', href: '/site-tree/tree-survey', requirement: 'FR-11' },
          { id: 'site.tree-approval', label: 'Approval queue', href: '/site-tree/tree-approval', requirement: 'FR-12' },
          {
            id: 'site.protected-species',
            label: 'Protected species',
            href: '/site-tree/protected-species',
            requirement: 'FR-13',
          },
          { id: 'site.replanting', label: 'Replanting', href: '/site-tree/replanting', requirement: 'FR-14' },
        ],
      },
      {
        id: 'felling',
        label: 'Felling & Logs',
        icon: 'axe',
        children: [
          { id: 'felling.work-orders', label: 'Work orders', href: '/felling/work-orders', requirement: 'FR-15' },
          { id: 'felling.felled-trees', label: 'Felled trees', href: '/felling/felled-trees', requirement: 'FR-16' },
          { id: 'felling.log-tags', label: 'Log IDs & QR tags', href: '/felling/log-tags', requirement: 'FR-17' },
          {
            id: 'felling.equipment-safety',
            label: 'Equipment, labour & safety',
            href: '/felling/equipment-safety',
            requirement: 'FR-18',
          },
          {
            id: 'felling.offline-capture',
            label: 'Sync queue & conflicts',
            href: '/felling/offline-capture',
            requirement: 'FR-19',
          },
        ],
      },
      {
        id: 'transport',
        label: 'Transport',
        icon: 'truck',
        children: [
          { id: 'transport.trips', label: 'Trips', href: '/transport/trips', requirement: 'FR-20' },
          {
            id: 'transport.delivery-notes',
            label: 'Delivery notes',
            href: '/transport/delivery-notes',
            requirement: 'FR-21',
          },
          {
            id: 'transport.reconciliation',
            label: 'Arrival & reconciliation',
            href: '/transport/reconciliation',
            requirement: 'FR-22',
          },
          {
            id: 'transport.vehicles-drivers',
            label: 'Vehicles & drivers',
            href: '/transport/vehicles-drivers',
            requirement: 'FR-23',
          },
        ],
      },
      {
        id: 'sawmill',
        label: 'Production',
        icon: 'factory',
        children: [
          { id: 'sawmill.log-receiving', label: 'Log receipts', href: '/sawmill/log-receiving', requirement: 'FR-24' },
          {
            id: 'sawmill.processing-orders',
            label: 'Processing orders',
            href: '/sawmill/processing-orders',
            requirement: 'FR-25',
          },
          {
            id: 'sawmill.production-output',
            label: 'Output, yield & wastage',
            href: '/sawmill/production-output',
            requirement: 'FR-26',
          },
          {
            id: 'sawmill.machine-usage',
            label: 'Machine usage & downtime',
            href: '/sawmill/machine-usage',
            requirement: 'FR-27',
          },
          {
            id: 'sawmill.quality-grading',
            label: 'Quality grading',
            href: '/sawmill/quality-grading',
            requirement: 'FR-28',
          },
        ],
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: 'box',
        children: [
          {
            id: 'inventory.stock-overview',
            label: 'Stock overview',
            href: '/inventory/stock-overview',
            requirement: 'FR-29',
          },
          {
            id: 'inventory.stock-by-location',
            label: 'Stock by location',
            href: '/inventory/stock-by-location',
            requirement: 'FR-30',
          },
          {
            id: 'inventory.stock-movements',
            label: 'Stock movements',
            href: '/inventory/stock-movements',
            requirement: 'FR-31',
          },
          {
            id: 'inventory.stock-take-alerts',
            label: 'Stock take & low-stock alerts',
            href: '/inventory/stock-take-alerts',
            requirement: 'FR-32',
          },
          {
            id: 'inventory.traceability',
            label: 'Traceability',
            href: '/inventory/traceability',
            requirement: 'FR-33',
          },
          {
            id: 'inventory.stock-valuation',
            label: 'Stock valuation',
            href: '/inventory/stock-valuation',
            requirement: 'FR-34',
          },
        ],
      },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    items: [
      {
        id: 'sales',
        label: 'Customers & Sales',
        icon: 'cart',
        children: [
          { id: 'sales.customers', label: 'Customers', href: '/sales/customers', requirement: 'FR-35' },
          {
            id: 'sales.quotations-orders',
            label: 'Quotations & sales orders',
            href: '/sales/quotations-orders',
            requirement: 'FR-36',
          },
          { id: 'sales.pricing', label: 'Price lists & discounts', href: '/sales/pricing', requirement: 'FR-37' },
          { id: 'sales.dispatch', label: 'Delivery & dispatch', href: '/sales/dispatch', requirement: 'FR-38' },
          {
            id: 'sales.invoicing-payments',
            label: 'Invoices & payments',
            href: '/sales/invoicing-payments',
            requirement: 'FR-39',
          },
          { id: 'sales.credit-control', label: 'Credit control', href: '/sales/credit-control', requirement: 'FR-40' },
          {
            id: 'sales.returns-complaints',
            label: 'Returns & complaints',
            href: '/sales/returns-complaints',
            requirement: 'FR-41',
          },
          { id: 'sales.customer-portal', label: 'Customer portal', href: '/portal', requirement: 'FR-42' },
          { id: 'sales.export-sales', label: 'Export sales', href: '/sales/export-sales', requirement: 'FR-43' },
        ],
      },
      {
        id: 'procurement',
        label: 'Procurement',
        icon: 'clipboard',
        children: [
          {
            id: 'procurement.suppliers-purchase-orders',
            label: 'Suppliers & purchase orders',
            href: '/procurement/suppliers-purchase-orders',
            requirement: 'FR-44',
          },
          {
            id: 'procurement.goods-received',
            label: 'Goods received & payments',
            href: '/procurement/goods-received',
            requirement: 'FR-45',
          },
        ],
      },
      {
        id: 'finance',
        label: 'Finance & Costing',
        icon: 'wallet',
        children: [
          { id: 'finance.costing', label: 'Cost per log & m³', href: '/finance/costing', requirement: 'FR-46' },
          { id: 'finance.wages', label: 'Wage inputs', href: '/finance/wages', requirement: 'FR-47' },
          {
            id: 'finance.accounting-export',
            label: 'Accounting integration',
            href: '/finance/accounting-export',
            requirement: 'FR-48',
          },
          { id: 'finance.profitability', label: 'Profitability', href: '/finance/profitability', requirement: 'FR-49' },
        ],
      },
    ],
  },
  {
    id: 'insights',
    label: 'Insights & system',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        icon: 'chart',
        children: [
          { id: 'reports.hub', label: 'Reports hub', href: '/reports' },
          {
            id: 'reports.permit-utilization',
            label: 'Permit utilisation & expiry',
            href: '/reports/permit-utilization',
            requirement: 'FR-50',
          },
          {
            id: 'reports.felling-production',
            label: 'Felling, production & yield',
            href: '/reports/felling-production',
            requirement: 'FR-51',
          },
          {
            id: 'reports.inventory-ageing',
            label: 'Inventory & stock ageing',
            href: '/reports/inventory-ageing',
            requirement: 'FR-52',
          },
          {
            id: 'reports.sales-receivables',
            label: 'Sales & receivables',
            href: '/reports/sales-receivables',
            requirement: 'FR-53',
          },
          {
            id: 'reports.traceability-audit',
            label: 'Traceability & audit',
            href: '/reports/traceability-audit',
            requirement: 'FR-54',
          },
          {
            id: 'reports.export-scheduled',
            label: 'Scheduled exports',
            href: '/reports/export-scheduled',
            requirement: 'FR-55',
          },
        ],
      },
      {
        id: 'admin',
        label: 'Administration',
        icon: 'shield',
        children: [
          { id: 'admin.user-management', label: 'Users', href: '/user-access/user-management', requirement: 'FR-02' },
          { id: 'admin.roles', label: 'Roles & permissions', href: '/user-access/roles', requirement: 'FR-01' },
          { id: 'admin.audit-log', label: 'Audit log', href: '/audit-admin/audit-log', requirement: 'FR-03' },
          { id: 'admin.master-data', label: 'Master data', href: '/audit-admin/master-data', requirement: 'FR-57' },
          {
            id: 'admin.volume-settings',
            label: 'Volume & calculation settings',
            href: '/audit-admin/master-data/volume-settings',
            requirement: 'BR-13',
          },
          {
            id: 'admin.notifications',
            label: 'Notification settings',
            href: '/audit-admin/notifications',
            requirement: 'FR-56',
          },
          {
            id: 'admin.backup-config',
            label: 'Backup & configuration',
            href: '/audit-admin/backup-config',
            requirement: 'FR-58',
          },
        ],
      },
    ],
  },
];
