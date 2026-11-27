'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import type { StockItem } from '../types';
import styles from './StockItemDetailModal.module.css';

interface StockItemDetailModalProps {
  item: StockItem | null;
  onClose: () => void;
}

export function StockItemDetailModal({ item, onClose }: StockItemDetailModalProps) {
  if (!item) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.typeBadge}>{item.type}</span>
            <h2 id="modal-title" className={styles.title}>
              {item.itemCode}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>&times;</span>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Species</span>
              <span className={styles.detailValue}>{item.species}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Quality Grade</span>
              <span className={styles.detailValue}>{item.grade || 'Standard'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Dimensions / Size</span>
              <span className={styles.detailValue}>{item.size}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Volume (m³)</span>
              <span className={`${styles.detailValue} ${styles.monoValue}`}>
                {item.quantityM3.toFixed(2)} m³
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Storage Location</span>
              <span className={styles.detailValue}>{item.location}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Current Status</span>
              <span className={styles.statusPill}>{item.status}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Age in Stock</span>
              <span className={`${styles.detailValue} ${styles.monoValue}`}>
                {item.ageDays} days
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Date Received</span>
              <span className={styles.detailValue}>{item.receivedDate}</span>
            </div>
          </div>

          <div className={styles.traceSection}>
            <h3 className={styles.traceTitle}>Traceability Information</h3>
            <div className={styles.traceGrid}>
              <div className={styles.traceItem}>
                <span className={styles.traceLabel}>QR Log Tag</span>
                <span className={`${styles.traceValue} ${styles.monoValue}`}>
                  {item.logTag || 'N/A'}
                </span>
              </div>
              <div className={styles.traceItem}>
                <span className={styles.traceLabel}>Harvest / Origin Site</span>
                <span className={styles.traceValue}>{item.originSite || 'Commercial Lot'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <Link href={`/reports/inventory-ageing/${item.id}`}>
            <Button variant="primary">
              View full details &amp; timeline
            </Button>
          </Link>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
