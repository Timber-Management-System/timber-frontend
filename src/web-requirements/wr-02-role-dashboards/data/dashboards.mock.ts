/**
 * Mock dashboards for WR-02, one per role, taken from the confirmed wireframes
 * (S-01.4, S-13.1–13.5, S-17.1–17.6). Values are examples until the backend sends real ones.
 */
import type { Dashboard, Tone } from '../types/dashboard.types';

const badge = (text: string, tone: Tone) => ({ badge: text, tone });
const link = (text: string, href: string) => ({ link: text, href });
const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const SPECIES = {
  type: 'donut' as const,
  title: 'Stock by species',
  slices: [
    { label: 'Teak', value: 45 },
    { label: 'Mahogany', value: 25 },
    { label: 'Jak', value: 18 },
    { label: 'Other', value: 12 },
  ],
};

export type DashboardId =
  | 'management'
  | 'admin'
  | 'owner'
  | 'compliance'
  | 'yard'
  | 'transport'
  | 'sales'
  | 'accountant'
  | 'forestry'
  | 'sawmill'
  | 'purchasing'
  | 'auditor'
  | 'field';

export const DASHBOARDS: Record<DashboardId, Dashboard> = {
  // S-01.4 Role-based dashboard (Management)
  management: {
    screen: 'S-01.4',
    title: 'Dashboard',
    intro: 'Permits, stock, production and sales across all sites.',
    quickActions: [
      { label: 'View reports', hint: 'Permit, production and sales reports', href: '/reports', icon: 'chart' },
      {
        label: 'Check inventory',
        hint: 'Stock by species, grade and location',
        href: '/inventory/stock-overview',
        icon: 'box',
      },
      {
        label: 'Permit expiry',
        hint: 'Permits and licences that need renewal',
        href: '/licence-permit/expiry-alerts',
        icon: 'file',
      },
      {
        label: 'Sales & receivables',
        hint: 'Sales, overdue payments and customers',
        href: '/reports/sales-receivables',
        icon: 'wallet',
      },
    ],
    kpis: [
      {
        label: 'Active permits',
        value: '12',
        hint: '2 expiring in 30 days',
        tone: 'warn',
        href: '/licence-permit/felling-permit',
      },
      {
        label: 'Quota used',
        value: '80%',
        hint: 'PER-010 · 20 m³ left',
        tone: 'warn',
        href: '/licence-permit/quota-tracking',
      },
      { label: 'Logs in yard', value: '248', hint: '36 m³ WIP', href: '/inventory/stock-overview' },
      { label: 'Finished stock', value: '1,240 m³', hint: '120 m³ reserved', href: '/inventory/stock-overview' },
      {
        label: 'Sales (month)',
        value: 'Rs. 4.2M',
        hint: '+8% vs last month',
        tone: 'ok',
        href: '/reports/sales-receivables',
      },
      { label: 'Pending sync', value: '10', hint: 'from 3 field devices', href: '/felling/offline-capture' },
    ],
    widgets: [
      {
        type: 'bars',
        title: 'Production yield % (last 6 months)',
        span: 'wide',
        labels: MONTHS,
        unit: '%',
        series: [{ name: 'Yield', values: [58, 61, 60, 64, 63, 66] }],
      },
      {
        type: 'alerts',
        title: 'Alerts',
        viewAllHref: '/audit-admin/notifications',
        items: [
          {
            title: 'Logs missing at sawmill',
            text: 'TRP-014: 2 logs were not received.',
            tone: 'crit',
            time: '45 min ago',
          },
          { title: 'Permit expiring soon', text: 'Permit PER-010 expires in 7 days.', tone: 'warn', time: 'Today' },
          {
            title: 'Quota nearing limit',
            text: 'PER-010 has used 80% of its quota (20 m³ left).',
            tone: 'warn',
            time: 'Today',
          },
          {
            title: 'Low stock',
            text: 'Teak 25 mm Grade A is below its reorder level.',
            tone: 'warn',
            time: 'Yesterday',
          },
        ],
      },
      {
        type: 'table',
        title: 'Recent activity',
        span: 'wide',
        columns: ['Time', 'User', 'Activity', 'Reference'],
        rows: [
          ['09:12', 'K. Perera (Field)', 'Felling recorded', 'TREE-025 / LOG-001'],
          ['09:40', 'S. Silva (Transport)', 'Trip dispatched', 'TRP-014'],
          ['10:05', 'N. Fernando (Yard)', 'Logs received via QR scan', 'TRP-014'],
          ['10:30', 'A. Jayasinghe (Sales)', 'Stock reserved 20 m³ Teak', 'SO-118'],
        ],
      },
      SPECIES,
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-17.2 Dashboard – Administrator (user numbers are filled in live by the dashboard API)
  admin: {
    screen: 'S-17.2',
    title: 'Administration dashboard',
    intro: 'Users, roles, security and system health.',
    quickActions: [
      {
        label: 'Manage users',
        hint: 'Add, unlock, reset or deactivate users',
        href: '/user-access/user-management',
        icon: 'users',
      },
      { label: 'Roles & permissions', hint: 'Who can see and change what', href: '/user-access/roles', icon: 'shield' },
      { label: 'Audit log', hint: 'Who changed what and when', href: '/audit-admin/audit-log', icon: 'clipboard' },
      {
        label: 'Backup & configuration',
        hint: 'Backups, restore and system settings',
        href: '/audit-admin/backup-config',
        icon: 'refresh',
      },
    ],
    kpis: [
      { label: 'Active users', value: '42', href: '/user-access/user-management' },
      { label: 'Locked accounts', value: '1', tone: 'warn', href: '/user-access/user-management' },
      { label: 'Failed logins (24 h)', value: '7' },
      { label: 'Last backup', value: '02:00 · OK', tone: 'ok', href: '/audit-admin/backup-config' },
      { label: 'Devices pending sync', value: '3' },
      { label: 'Uptime (30 days)', value: '99.7%', tone: 'ok' },
    ],
    widgets: [
      {
        type: 'table',
        title: 'Users needing action',
        span: 'wide',
        viewAllHref: '/user-access/user-management',
        columns: ['User', 'Role', 'Issue', 'Action'],
        rows: [
          [
            'Ruwan Jayasinghe',
            'Sales Officer',
            'Locked after 5 failed logins',
            link('Unlock', '/user-access/user-management'),
          ],
          ['New: P. Bandara', 'Driver', 'Invite not accepted (3 days)', link('Resend', '/user-access/user-management')],
          ['Admin 2', 'Administrator', 'MFA not set up', link('Remind', '/user-access/user-management')],
        ],
      },
      {
        type: 'list',
        title: 'System health',
        items: [
          { text: 'Application server', meta: 'Running', tone: 'ok' },
          { text: 'Database', meta: 'Running · 2.4 GB', tone: 'ok' },
          { text: 'Email gateway', meta: 'Running', tone: 'ok' },
          { text: 'SMS gateway', meta: 'Balance low – 120 SMS left', tone: 'warn' },
          { text: 'Background jobs', meta: '1 failed report schedule', tone: 'crit' },
        ],
      },
      {
        type: 'table',
        title: 'Recent audit events',
        span: 'wide',
        viewAllHref: '/audit-admin/audit-log',
        columns: ['Time', 'User', 'Action', 'Record'],
        rows: [
          ['09:01', 'Admin', 'Role changed', 'USR-018'],
          ['08:55', 'N. Perera', 'Permit quota updated', 'PER-010'],
          ['02:00', 'System', 'Backup completed', 'BKP-1113'],
        ],
      },
      {
        type: 'list',
        title: 'Open set-up items',
        items: [
          { text: 'Species and protected list loaded', tone: 'ok' },
          { text: 'Volume method locked (Smalian, under-bark)', tone: 'ok' },
          { text: 'Tax rates confirmed by accountant', tone: 'ok' },
          { text: 'Label printer registered for Site C', tone: 'ok' },
        ],
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-17.1 Dashboard – Company Owner
  owner: {
    screen: 'S-17.1',
    title: 'Owner overview',
    intro: 'Revenue, margin, stock value and the risks that need your decision.',
    quickActions: [
      {
        label: 'Profitability',
        hint: 'Margin by site, product and customer',
        href: '/finance/profitability',
        icon: 'wallet',
      },
      {
        label: 'Traceability & audit',
        hint: 'Trace any timber back to its tree and permit',
        href: '/reports/traceability-audit',
        icon: 'search',
      },
      {
        label: 'Credit control',
        hint: 'Customers over their credit limit',
        href: '/sales/credit-control',
        icon: 'cart',
      },
      { label: 'Reports hub', hint: 'All standard reports', href: '/reports', icon: 'chart' },
    ],
    kpis: [
      { label: 'Revenue (YTD)', value: 'Rs. 48.2M' },
      { label: 'Gross margin', value: '27.2%', tone: 'ok' },
      { label: 'Stock value', value: 'Rs. 196.4M' },
      { label: 'Receivables', value: 'Rs. 18.6M' },
      { label: 'Compliance status', value: '2 risks', tone: 'warn' },
      { label: 'Yield (YTD)', value: '63%' },
    ],
    widgets: [
      {
        type: 'bars',
        title: 'Revenue vs cost (Rs. M)',
        span: 'wide',
        labels: MONTHS,
        series: [
          { name: 'Revenue', values: [7.2, 7.8, 8.1, 8.6, 7.9, 8.6] },
          { name: 'Cost', values: [5.3, 5.6, 5.9, 6.2, 5.8, 6.3] },
        ],
      },
      {
        type: 'alerts',
        title: 'Risks that need a decision',
        items: [
          { text: 'PER-010 expires in 7 days – 20 m³ unused', tone: 'warn' },
          { text: 'TRP-014: 2 logs unaccounted (1.26 m³)', tone: 'crit' },
          { text: '2 customers over credit limit – Rs. 1.74M overdue', tone: 'warn' },
          { text: 'Price change waiting for approval', tone: 'warn' },
        ],
      },
      {
        type: 'table',
        title: 'Profitability by site',
        span: 'wide',
        viewAllHref: '/finance/profitability',
        columns: ['Site', 'Revenue', 'Margin %'],
        rows: [
          ['Site A', 'Rs. 21.4M', badge('30.4%', 'ok')],
          ['Site B', 'Rs. 14.0M', badge('22.9%', 'ok')],
          ['Site C', 'Rs. 4.6M', badge('15.2%', 'warn')],
        ],
      },
      SPECIES,
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-13.1 Dashboard – Compliance Officer
  compliance: {
    screen: 'S-13.1',
    title: 'Compliance dashboard',
    intro: 'Permits, quotas, protected species and regulator deadlines.',
    quickActions: [
      {
        label: 'Add a permit',
        hint: 'Felling permit with species and quota',
        href: '/licence-permit/felling-permit',
        icon: 'plus',
      },
      {
        label: 'Quota tracking',
        hint: 'Volume used and remaining per permit',
        href: '/licence-permit/quota-tracking',
        icon: 'chart',
      },
      {
        label: 'Expiry alerts',
        hint: 'Licences and permits expiring soon',
        href: '/licence-permit/expiry-alerts',
        icon: 'warning',
      },
      {
        label: 'Permit documents',
        hint: 'Upload documents, compliance reports',
        href: '/licence-permit/permit-documents',
        icon: 'file',
      },
    ],
    kpis: [
      { label: 'Active permits', value: '12', href: '/licence-permit/felling-permit' },
      { label: 'Expiring ≤ 30 days', value: '2', tone: 'warn', href: '/licence-permit/expiry-alerts' },
      { label: 'Quota used (all)', value: '61%', href: '/licence-permit/quota-tracking' },
      { label: 'Blocked attempts (month)', value: '4', tone: 'crit' },
      { label: 'Trees awaiting approval', value: '9', href: '/site-tree/tree-approval' },
    ],
    widgets: [
      {
        type: 'bars',
        title: 'Quota used % by permit',
        span: 'wide',
        unit: '%',
        labels: ['PER-010', 'PER-011', 'PER-012', 'PER-013', 'PER-008'],
        series: [{ name: 'Quota used', values: [80, 25, 100, 40, 55] }],
      },
      {
        type: 'alerts',
        title: 'Alerts',
        items: [
          { text: 'PER-010 expires in 7 days', tone: 'warn' },
          { text: 'Felling blocked: TREE-036 exceeds PER-012 quota', tone: 'crit' },
          { text: 'Protected species attempt: TREE-033 (Ebony)', tone: 'crit' },
          { text: 'TP-0453 not linked to a trip yet', tone: 'warn' },
        ],
      },
      {
        type: 'table',
        title: 'Permits needing action',
        span: 'wide',
        viewAllHref: '/licence-permit/felling-permit',
        columns: ['Permit', 'Issue', 'Valid until', 'Remaining', 'Action'],
        rows: [
          [
            'PER-010',
            badge('Expires in 7 days', 'warn'),
            '12 Nov 2026',
            '20 m³',
            link('Renew', '/licence-permit/felling-permit'),
          ],
          [
            'PER-012',
            badge('Quota fully used', 'crit'),
            '20 Dec 2026',
            '0 m³',
            link('Amend', '/licence-permit/felling-permit'),
          ],
          [
            'LIC-002',
            badge('Licence expires in 28 days', 'warn'),
            '15 Dec 2026',
            '—',
            link('Renew', '/licence-permit/company-licence'),
          ],
        ],
      },
      {
        type: 'list',
        title: 'Regulator deadlines',
        items: [
          { text: 'Monthly felling return', meta: '30 Nov' },
          { text: 'LIC-002 renewal', meta: '15 Dec' },
          { text: 'Annual replanting report', meta: '31 Dec' },
        ],
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-13.2 Dashboard – Yard / Mill Manager
  yard: {
    screen: 'S-13.2',
    title: 'Yard & mill dashboard',
    intro: 'Log arrivals, processing and stock in the yard.',
    quickActions: [
      {
        label: 'Receive logs',
        hint: 'Scan arriving logs against the delivery note',
        href: '/sawmill/log-receiving',
        icon: 'plus',
      },
      {
        label: 'Stock movements',
        hint: 'Receive, transfer, issue or adjust stock',
        href: '/inventory/stock-movements',
        icon: 'box',
      },
      {
        label: 'Stock take',
        hint: 'Count stock and check low-stock alerts',
        href: '/inventory/stock-take-alerts',
        icon: 'clipboard',
      },
      { label: 'Processing orders', hint: 'Logs to sawn timber', href: '/sawmill/processing-orders', icon: 'factory' },
    ],
    kpis: [
      { label: 'Logs in yard', value: '248', hint: '162.4 m³', href: '/inventory/stock-overview' },
      { label: 'Trips arriving today', value: '2', href: '/transport/trips' },
      { label: 'Open processing orders', value: '5', href: '/sawmill/processing-orders' },
      { label: 'Yield (week)', value: '63%' },
      { label: 'Low-stock items', value: '3', tone: 'warn', href: '/inventory/stock-take-alerts' },
      { label: 'Downtime (week)', value: '4.5 h', tone: 'warn' },
    ],
    widgets: [
      {
        type: 'table',
        title: 'Expected arrivals',
        span: 'wide',
        columns: ['Trip', 'From', 'Logs', 'ETA', 'Status'],
        rows: [
          ['TRP-015', 'Site B', '28', '11:30', badge('In transit', 'warn')],
          ['TRP-016', 'Site A', '—', '15:00', badge('Planned', 'neutral')],
        ],
      },
      {
        type: 'alerts',
        title: 'Attention',
        items: [
          { text: 'RCV-087: 2 logs missing from TRP-014', tone: 'crit' },
          { text: 'Band saw 2 down – blade change', tone: 'warn' },
          { text: 'Low stock: Mahogany B 50×100', tone: 'warn' },
        ],
      },
      {
        type: 'table',
        title: 'Processing orders in progress',
        span: 'wide',
        viewAllHref: '/sawmill/processing-orders',
        columns: ['Order', 'Input', 'Machine', 'Operator', 'Status'],
        rows: [
          ['PO-061', '12 logs · 7.40 m³', 'Band saw 1', 'M. Rathnayake', badge('In progress', 'warn')],
          ['PO-062', '2 logs · 1.23 m³', 'Band saw 1', 'M. Rathnayake', badge('Planned', 'neutral')],
        ],
      },
      {
        type: 'bars',
        title: 'Daily sawn output (m³)',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        series: [{ name: 'Output', values: [5.1, 6.3, 5.8, 6.9, 5.3, 3.2] }],
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-13.3 Dashboard – Transport Coordinator
  transport: {
    screen: 'S-13.3',
    title: 'Transport dashboard',
    intro: 'Trips, permits, vehicles and deliveries.',
    quickActions: [
      {
        label: 'Create a trip',
        hint: 'Vehicle, driver, logs and transport permit',
        href: '/transport/trips',
        icon: 'plus',
      },
      {
        label: 'Delivery notes',
        hint: 'Print delivery notes with permit reference',
        href: '/transport/delivery-notes',
        icon: 'file',
      },
      {
        label: 'Arrival & reconciliation',
        hint: 'Loaded vs received check',
        href: '/transport/reconciliation',
        icon: 'truck',
      },
      {
        label: 'Vehicles & drivers',
        hint: 'Licences, service and fuel',
        href: '/transport/vehicles-drivers',
        icon: 'clipboard',
      },
    ],
    kpis: [
      { label: 'Trips today', value: '4', href: '/transport/trips' },
      { label: 'In transit', value: '3' },
      { label: 'Discrepancies open', value: '1', tone: 'crit', href: '/transport/reconciliation' },
      { label: 'Vehicles available', value: '3 / 6', href: '/transport/vehicles-drivers' },
      { label: 'Permits expiring ≤ 7 days', value: '2', tone: 'warn', href: '/licence-permit/transport-permit' },
    ],
    widgets: [
      {
        type: 'table',
        title: 'Today',
        span: 'full',
        viewAllHref: '/transport/trips',
        columns: ['Trip', 'Vehicle', 'Driver', 'Route', 'Permit', 'Status'],
        rows: [
          ['TRP-015', 'WP LM-2210', 'N. Dias', 'Site B → Sawmill 1', 'TP-0452', badge('In transit', 'warn')],
          ['TRP-016', 'SG KA-9921', 'R. Kumar', 'Site A → Yard 2', 'TP-0455', badge('Planned', 'neutral')],
          ['TRP-014', 'WP LK-4512', 'S. Silva', 'Site A → Sawmill 1', 'TP-0451', badge('Discrepancy', 'crit')],
        ],
      },
      {
        type: 'placeholder',
        title: 'Live map – trips & checkpoints',
        span: 'wide',
        text: 'The live map is part of the map view.',
        requirement: 'WR-06',
      },
      {
        type: 'table',
        title: 'Vehicle & driver reminders',
        columns: ['Item', 'Reminder', 'Due'],
        rows: [
          ['SG KA-9921', 'Full service', badge('Overdue', 'crit')],
          ['WP LM-2210', 'Revenue licence', '05 Dec'],
          ['N. Dias', 'Driving licence renewal', '20 Dec'],
        ],
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-13.4 Dashboard – Sales Officer
  sales: {
    screen: 'S-13.4',
    title: 'Sales dashboard',
    intro: 'Quotations, orders, stock to sell and deliveries.',
    quickActions: [
      {
        label: 'New quotation',
        hint: 'Check stock and reserve it on a quote',
        href: '/sales/quotations-orders',
        icon: 'plus',
      },
      { label: 'Customers', hint: 'Contacts, credit and history', href: '/sales/customers', icon: 'users' },
      {
        label: 'Delivery & dispatch',
        hint: 'Plan deliveries and print dispatch notes',
        href: '/sales/dispatch',
        icon: 'truck',
      },
      { label: 'Price lists', hint: 'Prices by species, grade and size', href: '/sales/pricing', icon: 'file' },
    ],
    kpis: [
      { label: 'Sales (month)', value: 'Rs. 4.2M', tone: 'ok' },
      { label: 'Open quotations', value: '7', href: '/sales/quotations-orders' },
      { label: 'Orders to dispatch', value: '5', href: '/sales/dispatch' },
      { label: 'On credit hold', value: '2', tone: 'warn', href: '/sales/credit-control' },
      { label: 'Open complaints', value: '1', href: '/sales/returns-complaints' },
    ],
    widgets: [
      {
        type: 'bars',
        title: 'Monthly sales (Rs. M)',
        span: 'wide',
        labels: MONTHS,
        series: [{ name: 'Sales', values: [3.1, 3.6, 3.4, 4.0, 3.9, 4.2] }],
      },
      {
        type: 'table',
        title: 'Stock available to sell',
        columns: ['Product', 'Grade', 'Available'],
        rows: [
          ['Teak 25×100×3000', 'A', '30.0 m³'],
          ['Teak 50×150×3000', 'A', badge('0 m³', 'crit')],
          ['Mahogany 50×100×2400', 'B', badge('3.0 m³', 'warn')],
          ['Jak 25×150×3000', 'A', '22.0 m³'],
        ],
      },
      {
        type: 'table',
        title: 'Quotations to follow up',
        span: 'wide',
        viewAllHref: '/sales/quotations-orders',
        columns: ['Quote', 'Customer', 'Amount', 'Valid until', 'Status'],
        rows: [
          ['QT-0233', 'ABC Constructions', 'Rs. 5.33M', '27 Nov', badge('Sent', 'ok')],
          ['QT-0231', 'Green Homes Ltd', 'Rs. 0.64M', '20 Nov', badge('Expiring', 'warn')],
          ['QT-0229', 'Walk-in', 'Rs. 0.10M', '18 Nov', badge('Draft', 'neutral')],
        ],
      },
      {
        type: 'table',
        title: 'Deliveries this week',
        columns: ['Day', 'Order', 'Customer', 'Status'],
        rows: [
          ['Mon 16', 'SO-118', 'ABC Constructions', badge('Scheduled', 'ok')],
          ['Wed 18', 'SO-115', 'Lanka Furniture Mart', badge('On hold', 'warn')],
        ],
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-13.5 Dashboard – Accountant
  accountant: {
    screen: 'S-13.5',
    title: 'Finance dashboard',
    intro: 'Invoices, payments, receivables and costs.',
    quickActions: [
      {
        label: 'Invoices & payments',
        hint: 'Issue invoices from dispatches, record payments',
        href: '/sales/invoicing-payments',
        icon: 'file',
      },
      {
        label: 'Credit control',
        hint: 'Overdue balances and credit holds',
        href: '/sales/credit-control',
        icon: 'wallet',
      },
      {
        label: 'Cost per log & m³',
        hint: 'Felling, transport, processing and overhead',
        href: '/finance/costing',
        icon: 'chart',
      },
      {
        label: 'Accounting export',
        hint: 'Send invoices and payments to accounts',
        href: '/finance/accounting-export',
        icon: 'download',
      },
    ],
    kpis: [
      { label: 'Receivables', value: 'Rs. 18.6M', href: '/reports/sales-receivables' },
      { label: 'Overdue', value: 'Rs. 2.5M', tone: 'crit', href: '/sales/credit-control' },
      { label: 'Payables due (week)', value: 'Rs. 1.2M' },
      { label: 'Cash received (month)', value: 'Rs. 3.4M', tone: 'ok' },
      { label: 'Avg. cost / m³', value: 'Rs. 182,500', href: '/finance/costing' },
      { label: 'Margin (YTD)', value: '27.2%' },
    ],
    widgets: [
      {
        type: 'bars',
        title: 'Receivables ageing (Rs. M)',
        labels: ['Current', '31–60', '61–90', '90+'],
        series: [{ name: 'Receivables', values: [12.1, 4.0, 1.6, 0.9] }],
      },
      {
        type: 'table',
        title: 'Invoices to issue',
        span: 'wide',
        viewAllHref: '/sales/invoicing-payments',
        columns: ['Dispatch', 'Customer', 'Amount', 'Action'],
        rows: [
          ['DSP-045', 'ABC Constructions', 'Rs. 2,973,600', link('Create invoice', '/sales/invoicing-payments')],
          ['DSP-046', 'Green Homes Ltd', 'Rs. 755,200', link('Create invoice', '/sales/invoicing-payments')],
        ],
      },
      {
        type: 'table',
        title: 'Waiting for my approval',
        span: 'wide',
        columns: ['Type', 'Reference', 'Amount', 'Action'],
        rows: [
          ['Credit override', 'Lanka Furniture Mart', 'Rs. 640,000 overdue', link('Review', '/sales/credit-control')],
          ['Supplier payment', 'GRN-0062', 'Rs. 3,773,000', link('Review', '/procurement/goods-received')],
          ['Write-off', 'ADJ-014', '0.8 m³', link('Review', '/inventory/stock-movements')],
        ],
      },
      {
        type: 'donut',
        title: 'Cost split (Nov)',
        slices: [
          { label: 'Processing', value: 40 },
          { label: 'Felling', value: 31 },
          { label: 'Transport', value: 18 },
          { label: 'Overhead', value: 11 },
        ],
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-17.3 Dashboard – Forestry Supervisor
  forestry: {
    screen: 'S-17.3',
    title: 'Forestry dashboard',
    intro: 'Tree surveys, approvals and felling work orders.',
    quickActions: [
      { label: 'Tree survey', hint: 'Record a tree with GPS and photo', href: '/site-tree/tree-survey', icon: 'plus' },
      { label: 'Approval queue', hint: 'Approve trees for felling', href: '/site-tree/tree-approval', icon: 'check' },
      { label: 'Work orders', hint: 'Felling teams, dates and equipment', href: '/felling/work-orders', icon: 'axe' },
      {
        label: 'Replanting',
        hint: 'Replanting and reforestation records',
        href: '/site-tree/replanting',
        icon: 'tree',
      },
    ],
    kpis: [
      { label: 'Trees surveyed (month)', value: '64', href: '/site-tree/tree-survey' },
      { label: 'Awaiting my approval', value: '9', tone: 'warn', href: '/site-tree/tree-approval' },
      { label: 'Work orders in progress', value: '3', href: '/felling/work-orders' },
      { label: 'Felled (month)', value: '31 trees', hint: '48.6 m³' },
      { label: 'Protected blocked', value: '3', tone: 'crit' },
    ],
    widgets: [
      {
        type: 'table',
        title: 'Approval queue',
        span: 'wide',
        viewAllHref: '/site-tree/tree-approval',
        columns: ['Tree', 'Species', 'Est. vol', 'Permit', 'Check', 'Action'],
        rows: [
          ['TREE-031', 'Teak', '2.54 m³', 'PER-010', badge('OK', 'ok'), link('Review', '/site-tree/tree-approval')],
          ['TREE-032', 'Mahogany', '1.10 m³', 'PER-011', badge('OK', 'ok'), link('Review', '/site-tree/tree-approval')],
          [
            'TREE-036',
            'Teak',
            '3.10 m³',
            'PER-012',
            badge('Over quota', 'crit'),
            link('Review', '/site-tree/tree-approval'),
          ],
        ],
      },
      {
        type: 'alerts',
        title: 'Field alerts',
        items: [
          { text: 'TREE-031 felling record due in 1 day (BR-10)', tone: 'warn' },
          { text: 'Incident INC-008 reported at Site A', tone: 'crit' },
          { text: '3 devices have records waiting to sync', tone: 'warn' },
        ],
      },
      {
        type: 'table',
        title: 'Work orders',
        span: 'wide',
        viewAllHref: '/felling/work-orders',
        columns: ['Work order', 'Site', 'Team', 'Progress', 'Status'],
        rows: [
          ['WO-118', 'Site A / Lot 4', 'Team 2', '2 / 6', badge('In progress', 'warn')],
          ['WO-120', 'Site B / Lot 1', 'Team 1', '0 / 4', badge('Planned', 'neutral')],
          ['WO-121', 'Site C / Lot 2', 'Team 3', '0 / 8', badge('Planned', 'neutral')],
        ],
      },
      {
        type: 'placeholder',
        title: 'Map – sites, surveyed trees and teams',
        text: 'The map is part of the map view.',
        requirement: 'WR-06',
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-17.4 Dashboard – Sawmill Manager
  sawmill: {
    screen: 'S-17.4',
    title: 'Sawmill dashboard',
    intro: 'Processing orders, yield, wastage and machines.',
    quickActions: [
      {
        label: 'Processing orders',
        hint: 'Logs to sawn timber, planks and beams',
        href: '/sawmill/processing-orders',
        icon: 'plus',
      },
      {
        label: 'Output, yield & wastage',
        hint: 'Record output and see yield per log',
        href: '/sawmill/production-output',
        icon: 'chart',
      },
      {
        label: 'Machine usage',
        hint: 'Usage, downtime and operators',
        href: '/sawmill/machine-usage',
        icon: 'factory',
      },
      {
        label: 'Quality grading',
        hint: 'Grading and inspection records',
        href: '/sawmill/quality-grading',
        icon: 'check',
      },
    ],
    kpis: [
      { label: 'Orders in progress', value: '2', href: '/sawmill/processing-orders' },
      { label: 'Input today', value: '8.6 m³' },
      { label: 'Output today', value: '5.3 m³' },
      { label: 'Yield today', value: '61.6%' },
      { label: 'Downtime today', value: '3.0 h', tone: 'warn', href: '/sawmill/machine-usage' },
      { label: 'Rejects (week)', value: '7 pcs', href: '/sawmill/quality-grading' },
    ],
    widgets: [
      {
        type: 'table',
        title: 'Processing orders',
        span: 'wide',
        viewAllHref: '/sawmill/processing-orders',
        columns: ['Order', 'Input', 'Machine', 'Operator', 'Yield', 'Status'],
        rows: [
          ['PO-061', '7.40 m³ Teak', 'Band saw 1', 'M. Rathnayake', '—', badge('In progress', 'warn')],
          ['PO-062', '1.23 m³ Teak', 'Band saw 1', 'M. Rathnayake', '—', badge('Planned', 'neutral')],
          ['PO-060', '5.10 m³ Mahogany', 'Band saw 2', 'J. Silva', '61%', badge('Completed', 'ok')],
        ],
      },
      {
        type: 'bars',
        title: 'Yield % by machine (week)',
        unit: '%',
        labels: ['Band saw 1', 'Band saw 2', 'Edger'],
        series: [{ name: 'Yield', values: [64, 58, 71] }],
      },
      {
        type: 'table',
        title: 'Machines',
        span: 'wide',
        viewAllHref: '/sawmill/machine-usage',
        columns: ['Machine', 'Operator', 'Status'],
        rows: [
          ['Band saw 1', 'M. Rathnayake', badge('Running', 'ok')],
          ['Band saw 2', 'J. Silva', badge('Down', 'crit')],
          ['Edger', 'P. Kumara', badge('Idle', 'neutral')],
        ],
      },
      {
        type: 'donut',
        title: 'Wastage split (week)',
        slices: [
          { label: 'Sawdust', value: 35 },
          { label: 'Slabs', value: 30 },
          { label: 'Offcuts', value: 19 },
          { label: 'Defects', value: 16 },
        ],
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-17.5 Dashboard – Purchasing Officer
  purchasing: {
    screen: 'S-17.5',
    title: 'Purchasing dashboard',
    intro: 'Low stock, purchase orders and supplier payments.',
    quickActions: [
      {
        label: 'Purchase orders',
        hint: 'Order from suppliers',
        href: '/procurement/suppliers-purchase-orders',
        icon: 'plus',
      },
      {
        label: 'Goods received',
        hint: 'Record deliveries and supplier payments',
        href: '/procurement/goods-received',
        icon: 'box',
      },
      {
        label: 'Low stock',
        hint: 'Items below their reorder level',
        href: '/inventory/stock-take-alerts',
        icon: 'warning',
      },
      { label: 'Reports hub', hint: 'Purchases and inventory reports', href: '/reports', icon: 'chart' },
    ],
    kpis: [
      { label: 'Low-stock items', value: '3', tone: 'warn', href: '/inventory/stock-take-alerts' },
      { label: 'Open purchase orders', value: '3', href: '/procurement/suppliers-purchase-orders' },
      { label: 'Deliveries due (week)', value: '2', href: '/procurement/goods-received' },
      { label: 'Payable', value: 'Rs. 5.3M' },
      { label: 'Overdue to suppliers', value: 'Rs. 0.2M', tone: 'crit' },
    ],
    widgets: [
      {
        type: 'table',
        title: 'Low stock – needs ordering',
        span: 'wide',
        columns: ['Item', 'Available', 'Reorder level', 'Action'],
        rows: [
          [
            'Mahogany B 50×100',
            badge('3.0 m³', 'warn'),
            '10 m³',
            link('Create PO', '/procurement/suppliers-purchase-orders'),
          ],
          ['Teak A 25×150', badge('0 m³', 'crit'), '8 m³', link('Create PO', '/procurement/suppliers-purchase-orders')],
          [
            'Raw logs – Teak',
            badge('42 m³', 'warn'),
            '50 m³',
            link('Create PO', '/procurement/suppliers-purchase-orders'),
          ],
        ],
      },
      {
        type: 'bars',
        title: 'Purchases by category (Rs. M)',
        labels: ['Logs', 'Fuel', 'Spares'],
        series: [{ name: 'Purchases', values: [3.8, 0.9, 0.6] }],
      },
      {
        type: 'table',
        title: 'Open purchase orders',
        span: 'wide',
        viewAllHref: '/procurement/suppliers-purchase-orders',
        columns: ['PO', 'Supplier', 'Expected', 'Status'],
        rows: [
          ['PUR-0091', 'Ratnapura Log Traders', '20 Nov', badge('Pending approval', 'warn')],
          ['PUR-0090', 'Lanka Saw Blades', '18 Nov', badge('Sent', 'ok')],
          ['PUR-0089', 'Ceylon Fuel Co.', '15 Nov', badge('Sent', 'ok')],
        ],
      },
      {
        type: 'table',
        title: 'Supplier payments due',
        columns: ['Supplier', 'Due', 'Amount'],
        rows: [
          ['Ceylon Fuel Co.', badge('Overdue', 'crit'), 'Rs. 186,400'],
          ['Lanka Saw Blades', '02 Dec', 'Rs. 87,000'],
          ['Ratnapura Log Traders', '13 Dec', 'Rs. 3,773,000'],
        ],
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // S-17.6 Dashboard – Auditor / Regulator (read-only)
  auditor: {
    screen: 'S-17.6',
    title: 'Audit & traceability overview',
    intro: 'Read-only view of permits, traceability and blocked attempts.',
    quickActions: [
      {
        label: 'Traceability & audit',
        hint: 'Trace timber back to its tree and permit',
        href: '/reports/traceability-audit',
        icon: 'search',
      },
      {
        label: 'Permit utilisation',
        hint: 'Quota used and expiry per permit',
        href: '/reports/permit-utilization',
        icon: 'file',
      },
      {
        label: 'Inventory & ageing',
        hint: 'Stock by species, grade and age',
        href: '/reports/inventory-ageing',
        icon: 'box',
      },
      { label: 'Reports hub', hint: 'All standard reports', href: '/reports', icon: 'chart' },
    ],
    notice: 'Read-only access. You can view, search and export. Nothing can be changed from this role.',
    kpis: [
      { label: 'Active permits', value: '12' },
      { label: 'Felled vs quota', value: '247 / 460 m³' },
      { label: 'Blocked attempts (YTD)', value: '11', tone: 'warn' },
      { label: 'Unaccounted volume', value: '1.26 m³', tone: 'crit' },
      { label: 'Protected species felled', value: '0', tone: 'ok' },
    ],
    widgets: [
      {
        type: 'trace',
        title: 'Trace any item',
        span: 'full',
        placeholder: 'Invoice, timber item, log, tree or permit',
      },
      {
        type: 'table',
        title: 'Permit reconciliation (m³)',
        span: 'full',
        viewAllHref: '/reports/traceability-audit',
        columns: ['Permit', 'Quota', 'Felled', 'Received', 'Sold', 'Unaccounted', 'Status'],
        rows: [
          ['PER-010', '100', '80.00', '78.74', '52.40', '1.26', badge('Investigation', 'crit')],
          ['PER-011', '60', '15.00', '6.00', '0.00', '0.00', badge('Reconciled', 'ok')],
          ['PER-012', '40', '40.00', '31.50', '0.00', '0.00', badge('Reconciled', 'ok')],
        ],
      },
      {
        type: 'table',
        title: 'Blocked attempts',
        span: 'full',
        columns: ['Date', 'Rule', 'Record', 'User'],
        rows: [
          ['12 Nov', badge('BR-01 quota', 'crit'), 'TREE-036', 'A. Silva'],
          ['11 Nov', badge('BR-02 protected', 'crit'), 'TREE-033', 'A. Silva'],
          ['02 Nov', badge('BR-06 expired permit', 'crit'), 'FEL-198', 'K. Perera'],
        ],
      },
      { type: 'actions', title: 'Quick actions', span: 'full' },
    ],
  },

  // Field team: the full mobile home is S-04.1 (FR-15–19). Until then, quick links to field work.
  field: {
    screen: 'S-04.1',
    title: 'My field work',
    kpis: [],
    widgets: [
      {
        type: 'links',
        title: 'Start a task',
        span: 'full',
        links: [
          { label: 'Tree survey', href: '/site-tree/tree-survey', description: 'Record a tree with GPS and photo' },
          { label: 'Felled trees', href: '/felling/felled-trees', description: 'Record a felled tree' },
          { label: 'Log IDs & QR tags', href: '/felling/log-tags', description: 'Create and print log tags' },
          {
            label: 'Sync queue & conflicts',
            href: '/felling/offline-capture',
            description: 'Send records saved offline',
          },
        ],
      },
    ],
  },
};
