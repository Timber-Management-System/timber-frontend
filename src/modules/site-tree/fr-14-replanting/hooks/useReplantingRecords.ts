'use client';

import { useEffect, useState } from 'react';

import { listReplantingRecords } from '../api/replanting.api';
import type { ReplantingRecord } from '../types/replanting.types';

export function useReplantingRecords() {
  const [items, setItems] = useState<ReplantingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    listReplantingRecords()
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