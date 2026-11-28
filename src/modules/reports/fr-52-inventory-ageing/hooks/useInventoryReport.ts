'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  computeGroupSummary,
  fetchInventoryReport,
  type InventoryReportResponse,
} from '../api/inventoryReportApi';
import type { GroupByOption, InventoryFilterParams, ViewState } from '../types';

export const INITIAL_FILTERS: InventoryFilterParams = {
  categoryTab: 'All',
  searchQuery: '',
  species: 'All species',
  grade: 'All grades',
  size: 'All sizes',
  location: 'All locations',
};

export function useInventoryReport() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location');

  const getInitialFilters = (): InventoryFilterParams => {
    if (locationParam) {
      return {
        ...INITIAL_FILTERS,
        location: locationParam,
      };
    }
    return INITIAL_FILTERS;
  };

  const [filters, setFilters] = useState<InventoryFilterParams>(getInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState<InventoryFilterParams>(getInitialFilters);
  const [data, setData] = useState<InventoryReportResponse | null>(null);
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forceError, setForceError] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupByOption>('Species');

  const [prevLocationParam, setPrevLocationParam] = useState(locationParam);
  if (locationParam !== prevLocationParam) {
    setPrevLocationParam(locationParam);
    const newLoc = locationParam || 'All locations';
    setFilters((prev) => ({ ...prev, location: newLoc }));
    setAppliedFilters((prev) => ({ ...prev, location: newLoc }));
  }

  useEffect(() => {
    let isCancelled = false;

    async function execute() {
      try {
        const response = await fetchInventoryReport(appliedFilters, forceError);
        if (!isCancelled) {
          setData(response);
          if (response.items.length === 0) {
            setViewState('empty');
          } else {
            setViewState('ready');
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : 'An unexpected error occurred while loading inventory data.'
          );
          setViewState('error');
        }
      }
    }

    execute();

    return () => {
      isCancelled = true;
    };
  }, [appliedFilters, forceError]);

  const applyFilters = () => {
    setViewState('loading');
    setAppliedFilters({ ...filters });
  };

  const setCategoryTab = (tab: string) => {
    const updated = { ...filters, categoryTab: tab };
    setFilters(updated);
    setViewState('loading');
    setAppliedFilters(updated);
  };

  const resetFilters = () => {
    setViewState('loading');
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
  };

  const retry = () => {
    setViewState('loading');
    setForceError(false);
  };

  const simulateState = (state: ViewState) => {
    if (state === 'loading') {
      setViewState('loading');
    } else if (state === 'empty') {
      setViewState('empty');
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: [],
              stockGroupSummaries: [],
              summary: {
                rawLogsCount: 0,
                wipCount: 0,
                finishedVolumeM3: 0,
                reservedVolumeM3: 0,
                totalItems: 0,
                totalVolumeM3: 0,
              },
            }
          : null
      );
    } else if (state === 'error') {
      setForceError(true);
      setViewState('error');
      setErrorMessage('Simulated error: unable to reach the inventory reporting service.');
    } else {
      setForceError(false);
      setViewState('loading');
      setAppliedFilters({ ...filters });
    }
  };

  // Dynamically compute group summary based on active groupBy selection
  const activeGroupSummaries = data
    ? computeGroupSummary(data.items, groupBy)
    : [];

  return {
    filters,
    setFilters,
    appliedFilters,
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
    isFilterActive:
      appliedFilters.categoryTab !== 'All' ||
      appliedFilters.species !== 'All species' ||
      appliedFilters.grade !== 'All grades' ||
      appliedFilters.size !== 'All sizes' ||
      appliedFilters.location !== 'All locations' ||
      Boolean(appliedFilters.searchQuery),
  };
}
