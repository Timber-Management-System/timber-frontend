'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_STORAGE_ZONES } from '../api/inventoryReportApi';
import { StorageZone } from '../types';
import styles from './StorageLocationsPage.module.css';
import { Icon } from '@/shared/components/ui/Icon';

export function StorageLocationsPage() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('rack-17');

  const selectedZone =
    MOCK_STORAGE_ZONES.find((z) => z.id === selectedZoneId) ||
    MOCK_STORAGE_ZONES[3];

  const getBracketClass = (bracket: StorageZone['ageBracket']) => {
    switch (bracket) {
      case '0-30':
        return styles.bracket0To30;
      case '31-60':
        return styles.bracket31To60;
      case '61-90':
        return styles.bracket61To90;
      case '90+':
        return styles.bracket90Plus;
      default:
        return styles.bracket0To30;
    }
  };

  const handleExportPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const topRowZones = MOCK_STORAGE_ZONES.slice(0, 3);
  const bottomRowZones = MOCK_STORAGE_ZONES.slice(3, 6);

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/reports">Reports</Link>
        <span>/</span>
        <Link href="/reports/inventory-ageing">Inventory & Ageing</Link>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>Storage locations</span>
      </nav>

      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Storage Locations</h1>
            <span className={styles.optionalBadge}>Optional page</span>
          </div>
          <p className={styles.subtitle}>
            Schematic view of yards, sawmill and racks. Optional · confirm zones with the
            Inventory team (FR-30, FR-57).
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/reports/inventory-ageing" className={styles.btnSecondary}>
            Back to report
          </Link>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleExportPdf}
          >
            <Icon name="file" size={14} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Top 2-Column Section: Map + Selected Zone details */}
      <div className={styles.topGrid}>
        {/* Left: Schematic Site Layout */}
        <div className={styles.mapCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Site layout</h2>
            <span className={styles.cardHint}>Shade = oldest item in the location</span>
          </div>

          <div className={styles.schematicLayout}>
            {/* Top row: Yard A, Yard B, Sawmill A */}
            <div className={styles.schematicRowTop}>
              {topRowZones.map((zone) => {
                const isSelected = zone.id === selectedZone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    className={`${styles.zoneBox} ${getBracketClass(zone.ageBracket)} ${
                      isSelected ? styles.zoneBoxSelected : ''
                    }`}
                    onClick={() => setSelectedZoneId(zone.id)}
                    aria-pressed={isSelected}
                  >
                    <div className={styles.zoneTop}>
                      <span className={styles.zoneName}>{zone.name}</span>
                      <span className={styles.zoneSubtitle}>{zone.subtitle}</span>
                    </div>
                    <div className={styles.zoneBottom}>
                      <span className={styles.zoneMeta}>
                        {zone.itemCount} items · {zone.volumeM3.toFixed(1)} m³
                      </span>
                      <span className={styles.zoneOldest}>
                        Oldest {zone.oldestDays} days
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom row: Rack 17, Rack 18, Rack 19 */}
            <div className={styles.schematicRowBottom}>
              {bottomRowZones.map((zone) => {
                const isSelected = zone.id === selectedZone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    className={`${styles.zoneBox} ${getBracketClass(zone.ageBracket)} ${
                      isSelected ? styles.zoneBoxSelected : ''
                    }`}
                    onClick={() => setSelectedZoneId(zone.id)}
                    aria-pressed={isSelected}
                  >
                    <div className={styles.zoneTop}>
                      <span className={styles.zoneName}>{zone.name}</span>
                      <span className={styles.zoneSubtitle}>{zone.subtitle}</span>
                    </div>
                    <div className={styles.zoneBottom}>
                      <span className={styles.zoneMeta}>
                        {zone.itemCount} items · {zone.volumeM3.toFixed(1)} m³
                      </span>
                      <span className={styles.zoneOldest}>
                        Oldest {zone.oldestDays} days
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Age Legend */}
          <div className={styles.legend}>
            <span className={styles.legendLabel}>Oldest item:</span>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <span
                  className={styles.legendSwatch}
                  style={{ backgroundColor: '#f7f3ed' }}
                />
                <span>0–30 days</span>
              </div>
              <div className={styles.legendItem}>
                <span
                  className={styles.legendSwatch}
                  style={{ backgroundColor: '#eae1d3' }}
                />
                <span>31–60</span>
              </div>
              <div className={styles.legendItem}>
                <span
                  className={styles.legendSwatch}
                  style={{ backgroundColor: '#c9bbae' }}
                />
                <span>61–90</span>
              </div>
              <div className={styles.legendItem}>
                <span
                  className={styles.legendSwatch}
                  style={{ backgroundColor: '#52443a' }}
                />
                <span>90+ days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Zone Details Card */}
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <h2 className={styles.detailTitle}>{selectedZone.name}</h2>
            <span className={styles.selectedPill}>Selected location</span>
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Type</span>
            <div className={styles.fieldValueBox}>{selectedZone.type}</div>
          </div>

          <div className={styles.fieldGrid2}>
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Items</span>
              <div className={styles.fieldValueBox}>{selectedZone.itemCount}</div>
            </div>
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Volume (m³)</span>
              <div className={styles.fieldValueBox}>
                {selectedZone.volumeM3.toFixed(1)}
              </div>
            </div>
          </div>

          <div className={styles.fieldGrid2}>
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Oldest item (days)</span>
              <div className={styles.fieldValueBox}>{selectedZone.oldestDays}</div>
            </div>
            <div className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Reserved (m³)</span>
              <div className={styles.fieldValueBox}>
                {(selectedZone.reservedM3 ?? 0).toFixed(1)}
              </div>
            </div>
          </div>

          <div className={styles.detailActions}>
            <Link
              href={`/reports/inventory-ageing?location=${encodeURIComponent(
                selectedZone.name
              )}`}
              className={styles.btnPrimary}
            >
              View items in this location
            </Link>
            <Link
              href="/reports/inventory-ageing"
              className={styles.btnSecondary}
              style={{ justifyContent: 'center' }}
            >
              Open in stock details
            </Link>
          </div>

          <div className={styles.helperTextGroup}>
            <span>Click a zone on the map to select it.</span>
            <span>Zones are schematic, not GPS positions.</span>
          </div>
        </div>
      </div>

      {/* Bottom Card: Locations Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderRow}>
          <h2 className={styles.cardTitle}>Locations</h2>
          <span className={styles.tableCount}>
            {MOCK_STORAGE_ZONES.length} locations
          </span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Location</th>
                <th>Type</th>
                <th>Items</th>
                <th>Volume (m³)</th>
                <th>Oldest (days)</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STORAGE_ZONES.map((zone) => {
                const isSelected = zone.id === selectedZone.id;
                return (
                  <tr
                    key={zone.id}
                    className={isSelected ? styles.rowSelected : ''}
                    onClick={() => setSelectedZoneId(zone.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className={styles.locationNameCell}>{zone.name}</td>
                    <td>{zone.subtitle || zone.type}</td>
                    <td className={styles.numberCell}>{zone.itemCount}</td>
                    <td className={styles.numberCell}>{zone.volumeM3.toFixed(1)}</td>
                    <td className={styles.numberCell}>{zone.oldestDays}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className={styles.btnTableView}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedZoneId(zone.id);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
