'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import { getStockItemById } from '../api/inventoryReportApi';
import styles from './StockItemDetailPage.module.css';

interface StockItemDetailPageProps {
  itemId: string;
}

export function StockItemDetailPage({ itemId }: StockItemDetailPageProps) {
  const item = getStockItemById(itemId);

  if (!item) {
    return (
      <div className={styles.notFoundWrapper}>
        <h2>Stock Item Not Found</h2>
        <p>No inventory record matching identifier &ldquo;{itemId}&rdquo; was found.</p>
        <Link href="/reports/inventory-ageing">
          <Button variant="primary">Back to report</Button>
        </Link>
      </div>
    );
  }

  const origin = item.originChain || {
    permit: 'PER-2026-010',
    permitDesc: 'Teak felling permit',
    tree: 'TR-029',
    treeDesc: 'Block B',
    log: 'LOG-2026-017',
    logDesc: 'Teak · 2.6 m',
    receipt: 'RCV-2026-0031',
    receiptDate: '01 Nov 2026',
    processingOrder: 'PO-2026-0040',
    processingDate: 'Completed 08 Nov 2026',
    finishedItem: item.itemCode,
    rack: item.location,
  };

  const movements = item.movements || [
    {
      date: '08 Nov 2026',
      movement: 'Produced',
      from: '—',
      to: 'Sawmill A',
      volumeM3: item.quantityM3,
      by: 'Mill manager',
      reference: item.reference,
    },
    {
      date: '08 Nov 2026',
      movement: 'Transfer',
      from: 'Sawmill A',
      to: item.location,
      volumeM3: item.quantityM3,
      by: 'Yard manager',
      reference: 'TRF-2026-011',
    },
    {
      date: '12 Nov 2026',
      movement: 'Stock take · no change',
      from: item.location,
      to: item.location,
      volumeM3: item.quantityM3,
      by: 'Yard manager',
      reference: 'ST-2026-004',
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Top Breadcrumb & Timestamp */}
      <div className={styles.topBar}>
        <div className={styles.breadcrumb}>
          <Link href="/reports" className={styles.crumbLink}>
            Reports
          </Link>
          <span className={styles.crumbSep}>/</span>
          <Link href="/reports/inventory-ageing" className={styles.crumbLink}>
            Inventory &amp; Ageing
          </Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbActive}>{item.itemCode}</span>
        </div>
        <div className={styles.timestampBadge}>
          Updated 13 Nov 2026, 10:32
        </div>
      </div>

      {/* Title & Actions */}
      <div className={styles.titleSection}>
        <div>
          <h1 className={styles.title}>Stock Item {item.itemCode}</h1>
          <p className={styles.subtitle}>
            {item.type} · {item.species} · Grade {item.grade} · {item.size} mm.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/reports/inventory-ageing">
            <Button variant="secondary" leftIcon={<Icon name="arrowUpRight" />}>
              Back to report
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => window.print()}
            leftIcon={<Icon name="file" />}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Two Column Cards: Item details & Age */}
      <div className={styles.overviewGrid}>
        {/* Item Details Card */}
        <div className={styles.card}>
          <h2 className={styles.cardHeading}>Item details</h2>
          <div className={styles.detailsGrid}>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Item code</span>
              <div className={`${styles.fieldBox} ${styles.monoVal}`}>{item.itemCode}</div>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Type</span>
              <div className={styles.fieldBox}>{item.type}</div>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Species</span>
              <div className={styles.fieldBox}>{item.species}</div>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Grade</span>
              <div className={styles.fieldBox}>{item.grade}</div>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Size (mm)</span>
              <div className={styles.fieldBox}>{item.size}</div>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Volume (m³)</span>
              <div className={`${styles.fieldBox} ${styles.monoVal}`}>{item.quantityM3.toFixed(3)}</div>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Storage location</span>
              <div className={styles.fieldBox}>{item.location}</div>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Reference</span>
              <div className={`${styles.fieldBox} ${styles.monoVal}`}>{item.reference}</div>
            </div>
            <div className={styles.fieldItem}>
              <span className={styles.fieldLabel}>Status</span>
              <div className={styles.fieldBox}>
                <span className={styles.statusPill}>{item.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Age Card */}
        <div className={styles.card}>
          <h2 className={styles.cardHeading}>Age</h2>
          <div className={styles.ageValue}>{item.ageDays} days</div>
          <div className={styles.ageBucketBadge}>
            {item.ageDays <= 30
              ? '0–30 days'
              : item.ageDays <= 60
              ? '31–60 days'
              : item.ageDays <= 90
              ? '61–90 days'
              : '90+ days'}
          </div>

          <div className={styles.ageSourceSection}>
            <span className={styles.fieldLabel}>Age counted from</span>
            <div className={styles.fieldBox}>
              Order completion date · {item.receivedDate}
            </div>
            <span className={styles.footnote}>
              Logs: counted from the receipt date.
            </span>
          </div>
        </div>
      </div>

      {/* Origin Chain (Traceability · FR-33) */}
      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.cardHeading}>Origin chain</h2>
          <span className={styles.refTag}>Traceability · FR-33</span>
        </div>

        <div className={styles.chainContainer}>
          <div className={styles.chainNode}>
            <span className={styles.nodeCategory}>Permit</span>
            <span className={styles.nodeId}>{origin.permit}</span>
            <span className={styles.nodeMeta}>{origin.permitDesc}</span>
          </div>

          <span className={styles.chainArrow}>&rarr;</span>

          <div className={styles.chainNode}>
            <span className={styles.nodeCategory}>Tree</span>
            <span className={styles.nodeId}>{origin.tree}</span>
            <span className={styles.nodeMeta}>{origin.treeDesc}</span>
          </div>

          <span className={styles.chainArrow}>&rarr;</span>

          <div className={styles.chainNode}>
            <span className={styles.nodeCategory}>Log</span>
            <span className={styles.nodeId}>{origin.log}</span>
            <span className={styles.nodeMeta}>{origin.logDesc}</span>
          </div>

          <span className={styles.chainArrow}>&rarr;</span>

          <div className={styles.chainNode}>
            <span className={styles.nodeCategory}>Receipt</span>
            <span className={styles.nodeId}>{origin.receipt}</span>
            <span className={styles.nodeMeta}>{origin.receiptDate}</span>
          </div>

          <span className={styles.chainArrow}>&rarr;</span>

          <div className={styles.chainNode}>
            <span className={styles.nodeCategory}>Processing order</span>
            <span className={styles.nodeId}>{origin.processingOrder}</span>
            <span className={styles.nodeMeta}>{origin.processingDate}</span>
          </div>

          <span className={styles.chainArrow}>&rarr;</span>

          <div className={`${styles.chainNode} ${styles.chainNodeActive}`}>
            <span className={styles.nodeCategory}>Finished item</span>
            <span className={styles.nodeId}>{origin.finishedItem}</span>
            <span className={styles.nodeMeta}>{origin.rack}</span>
          </div>
        </div>
      </div>

      {/* Movement Timeline (Stock movements · FR-31) */}
      <div className={styles.card}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.cardHeading}>Movement timeline</h2>
          <span className={styles.refTag}>Stock movements · FR-31</span>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Date</th>
                <th>Movement</th>
                <th>From</th>
                <th>To</th>
                <th className={styles.alignRight}>Volume (m³)</th>
                <th>By</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m, idx) => (
                <tr key={`${m.reference}-${idx}`}>
                  <td>{m.date}</td>
                  <td className={styles.movementName}>{m.movement}</td>
                  <td>{m.from}</td>
                  <td>{m.to}</td>
                  <td className={`${styles.alignRight} ${styles.monoVal}`}>
                    {m.volumeM3.toFixed(3)}
                  </td>
                  <td>{m.by}</td>
                  <td className={styles.monoVal}>{m.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
