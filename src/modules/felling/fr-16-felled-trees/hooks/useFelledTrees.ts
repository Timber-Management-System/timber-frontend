'use client';

import { useEffect, useState } from 'react';

import { listFelledTrees } from '../api/felled-trees.api';
import type { FelledTree } from '../types/felled-trees.types';

// Load felled tree records and manage loading and error states.
export function useFelledTrees() {
  const [items, setItems] = useState<FelledTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    listFelledTrees()
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