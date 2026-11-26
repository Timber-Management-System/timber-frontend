'use client';

import { useEffect, useState } from 'react';
import { getReplantingRecord } from '../api/replanting.api';
import type { ReplantingRecord } from '../types/replanting.types';

interface RecordState {
  id: string;
  record: ReplantingRecord | null;
  error: unknown;
}

export function useReplantingRecord(id: string) {
  const [state, setState] = useState<RecordState | null>(null);

  useEffect(() => {
    let cancelled = false;

    getReplantingRecord(id)
      .then((data) => {
        if (!cancelled) {
          setState({
            id,
            record: data,
            error: null,
          });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            id,
            record: null,
            error: err,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const loading = state === null || state.id !== id;

  return {
    record: loading ? null : state.record,
    loading,
    error: loading ? null : state.error,
  };
}