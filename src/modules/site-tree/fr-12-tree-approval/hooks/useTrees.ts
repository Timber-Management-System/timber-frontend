'use client';

import { useEffect, useState } from 'react';
import type { Tree } from '../types/tree';
import { approveTree, getTrees, rejectTree } from '../api/trees';

export function useTrees() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getTrees().then((data) => {
      if (active) {
        setTrees([...data]);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function refresh() {
    const data = await getTrees();
    setTrees([...data]);
  }

  async function approve(id: number) {
    try {
      setError(null);
      await approveTree(id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  async function reject(id: number, reason: string) {
    try {
      setError(null);
      await rejectTree(id, reason);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  return { trees, loading, error, approve, reject };
}