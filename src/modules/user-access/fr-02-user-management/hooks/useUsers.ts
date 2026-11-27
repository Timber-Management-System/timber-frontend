'use client';

import { useCallback, useEffect, useState } from 'react';

import { listUsers } from '../api/users.api';
import type { UserFilters, UserPage } from '../types/user.types';

const EMPTY: UserPage = { items: [], total: 0, page: 1, pageSize: 10, siteTeams: [] };

/** Loads one page of users for the given filters. `reload()` after a change. */
export function useUsers(filters: UserFilters) {
  const [data, setData] = useState<UserPage>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [version, setVersion] = useState(0);

  const { search, role, status, siteTeam, page, pageSize } = filters;
  useEffect(() => {
    let active = true;
    listUsers({ search, role, status, siteTeam, page, pageSize })
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
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
  }, [search, role, status, siteTeam, page, pageSize, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { data, loading, error, reload };
}
