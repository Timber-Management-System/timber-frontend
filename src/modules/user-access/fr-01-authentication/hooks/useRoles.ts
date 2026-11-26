'use client';

import { useCallback, useEffect, useState } from 'react';

import { listRoles } from '../api/roles.api';
import type { RoleSummary } from '../types/auth.types';

/** Loads the roles with their user counts and permissions. `reload()` after saving. */
export function useRoles() {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    listRoles()
      .then((data) => {
        if (active) {
          setRoles(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { roles, loading, error, reload };
}
