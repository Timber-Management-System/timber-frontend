'use client';

/**
 * TEMPLATE – loads this FR's records for the list page.
 * A data-fetching library is not decided yet (docs/decisions/), so this is a small hook with
 * loading and error states. Keep the same return shape if a library is added later.
 *
 * `replace(item)` swaps in the record the API returned after a popup saved it, so the table
 * updates at once without reloading the whole page or list.
 */
import { useCallback, useEffect, useState } from 'react';

import { listExampleItems } from '../api/example.api';
import type { ExampleItem } from '../types/example.types';

export function useExampleItems() {
  const [items, setItems] = useState<ExampleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    listExampleItems()
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

  /** Insert a new record at the top, or replace an existing one with the same id. */
  const replace = useCallback((item: ExampleItem) => {
    setItems((list) =>
      list.some((i) => i.id === item.id) ? list.map((i) => (i.id === item.id ? item : i)) : [item, ...list],
    );
  }, []);

  return { items, loading, error, replace };
}
