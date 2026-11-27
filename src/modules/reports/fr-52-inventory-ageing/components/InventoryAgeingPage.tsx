'use client';

import { useInventoryReport } from '../hooks/useInventoryReport';
import { AgeingSection } from './AgeingSection';
import { InventoryHeader } from './InventoryHeader';
import { StockFilters } from './StockFilters';
import { StockGroupSummarySection } from './StockGroupSummarySection';
import { StockSummaryCards } from './StockSummaryCards';
import { StockTable } from './StockTable';

export function InventoryAgeingPage() {
  const {
    filters,
    setFilters,
    data,
    viewState,
    errorMessage,
    groupBy,
    setGroupBy,
    activeGroupSummaries,
    setCategoryTab,
    applyFilters,
    resetFilters,
    retry,
    simulateState,
  } = useInventoryReport();

  const handleExportPdf = () => {
    window.print();
  };

  const handleExportExcel = () => {
    alert('Exporting inventory report dataset to Excel (.xlsx)...');
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      <InventoryHeader
        viewState={viewState}
        onSimulateState={simulateState}
      />

      <StockFilters
        filters={filters}
        onChange={setFilters}
        onCategoryTabChange={setCategoryTab}
        onApply={applyFilters}
        onReset={resetFilters}
        isLoading={viewState === 'loading'}
      />

      <StockSummaryCards
        summary={data?.summary ?? null}
        isLoading={viewState === 'loading'}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      <AgeingSection
        buckets={data?.ageingBuckets ?? []}
        isLoading={viewState === 'loading'}
      />

      <StockGroupSummarySection
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        summaries={activeGroupSummaries}
        isLoading={viewState === 'loading'}
      />

      <StockTable
        items={data?.items ?? []}
        viewState={viewState}
        errorMessage={errorMessage}
        totalItems={data?.summary?.totalItems ?? 248}
        totalVolumeM3={data?.summary?.totalVolumeM3 ?? 1240.0}
        reservedVolumeM3={data?.summary?.reservedVolumeM3 ?? 120.0}
        onResetFilters={resetFilters}
        onRetry={retry}
      />
    </div>
  );
}
