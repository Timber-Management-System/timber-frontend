'use client';

import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import type { InventoryFilterParams } from '../types';
import styles from './StockFilters.module.css';

interface StockFiltersProps {
  filters: InventoryFilterParams;
  onChange: (newFilters: InventoryFilterParams) => void;
  onCategoryTabChange: (tab: string) => void;
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

const CATEGORY_TABS = [
  { id: 'All', label: 'All (248)' },
  { id: 'Raw logs', label: 'Raw logs (120)' },
  { id: 'In processing', label: 'In processing (14)' },
  { id: 'Finished', label: 'Finished (110)' },
  { id: 'By-products', label: 'By-products (4)' },
];

const SPECIES_OPTIONS = ['All species', 'Teak', 'Mahogany', 'Jak', 'Pine', 'Eucalyptus'];
const GRADE_OPTIONS = ['All grades', 'A', 'B', 'C'];
const SIZE_OPTIONS = ['All sizes', '2.4 m', '2.8 m', '3.0 m', '2400×150×25', '2400×100×100'];
const LOCATION_OPTIONS = [
  'All locations',
  'Yard A',
  'Yard B',
  'Sawmill A',
  'Rack 17',
  'Rack 18',
  'Rack 19',
];

export function StockFilters({
  filters,
  onChange,
  onCategoryTabChange,
  onApply,
  onReset,
  isLoading = false,
}: StockFiltersProps) {
  const handleChange = (field: keyof InventoryFilterParams, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  return (
    <form className={styles.filterCard} onSubmit={handleSubmit}>
      <div className={styles.cardHeader}>
        <span className={styles.headerTitle}>Filters</span>
      </div>

      {/* Category Filter Tabs */}
      <div className={styles.categoryPills} role="tablist" aria-label="Inventory Category Filters">
        {CATEGORY_TABS.map((tab) => {
          const isActive = filters.categoryTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.categoryPill} ${isActive ? styles.categoryPillActive : ''}`}
              onClick={() => onCategoryTabChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Dropdowns Row */}
      <div className={styles.grid}>
        <div className={`${styles.fieldGroup} ${styles.searchField}`}>
          <label htmlFor="filter-search" className={styles.label}>
            Search
          </label>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>
              <Icon name="search" size={15} />
            </span>
            <input
              id="filter-search"
              type="text"
              className={styles.input}
              placeholder="Log ID or species"
              value={filters.searchQuery}
              onChange={(e) => handleChange('searchQuery', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="filter-species" className={styles.label}>
            Species
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="filter-species"
              className={styles.select}
              value={filters.species}
              onChange={(e) => handleChange('species', e.target.value)}
              disabled={isLoading}
            >
              {SPECIES_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="filter-grade" className={styles.label}>
            Grade
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="filter-grade"
              className={styles.select}
              value={filters.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              disabled={isLoading}
            >
              {GRADE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="filter-size" className={styles.label}>
            Size
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="filter-size"
              className={styles.select}
              value={filters.size}
              onChange={(e) => handleChange('size', e.target.value)}
              disabled={isLoading}
            >
              {SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="filter-location" className={styles.label}>
            Storage location
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="filter-location"
              className={styles.select}
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={isLoading}
            >
              {LOCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Button type="submit" variant="primary" loading={isLoading}>
            Apply
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onReset}
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>
      </div>
    </form>
  );
}
