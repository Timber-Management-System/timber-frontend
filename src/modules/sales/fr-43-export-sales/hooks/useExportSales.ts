'use client';

/**
 * TEMPLATE – loads this FR's data for a component.
 * A data-fetching library is not decided yet (docs/decisions/), so this is a small hook with
 * loading and error states. Keep the same return shape if a library is added later.
 */
import { useEffect, useState } from 'react';

import { listExportSales } from '../api/export-sales.api';
import type { ExportSaleItem } from '../types/export-sales.types';

export function useExportSales() {
  const [items, setItems] = useState<ExportSaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    listExportSales()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading, error };
}
