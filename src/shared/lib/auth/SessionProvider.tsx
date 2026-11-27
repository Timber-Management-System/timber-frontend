'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { can, type Action, type Area } from './permissions';
import type { SessionUser } from './session';

/**
 * Holds the signed-in user for every logged-in page (FR-01).
 * The functions that talk to the backend are passed in by src/app/(app)/layout.tsx from the
 * FR-01 module, so shared code never imports a module.
 */
interface SessionContextValue {
  user: SessionUser | null;
  loading: boolean;
  /** Reload the user from the backend (e.g. after changing the profile). */
  refresh: () => Promise<void>;
  /** Ends the session. `reason` is shown on the login page. */
  signOut: (reason?: SignOutReason) => Promise<void>;
}

/** Why the user left the app: no session yet, clicked Sign out, or inactivity (S-13.13). */
export type SignOutReason = 'noSession' | 'signedOut' | 'timeout';

const SessionContext = createContext<SessionContextValue | null>(null);

export interface SessionProviderProps {
  loadUser: () => Promise<SessionUser | null>;
  endSession: () => Promise<void>;
  /** Called when there is no valid session (e.g. redirect to /login). */
  onSignedOut: (reason: SignOutReason) => void;
  children: ReactNode;
}

export function SessionProvider({ loadUser, endSession, onSignedOut, children }: SessionProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await loadUser();
      setUser(next);
      if (!next) onSignedOut('noSession');
    } catch {
      setUser(null);
      onSignedOut('noSession');
    } finally {
      setLoading(false);
    }
  }, [loadUser, onSignedOut]);

  useEffect(() => {
    let active = true;
    loadUser()
      .then((next) => {
        if (!active) return;
        setUser(next);
        if (!next) onSignedOut('noSession');
      })
      .catch(() => {
        if (active) onSignedOut('noSession');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadUser, onSignedOut]);

  const signOut = useCallback(
    async (reason: SignOutReason = 'signedOut') => {
      try {
        await endSession();
      } finally {
        setUser(null);
        onSignedOut(reason);
      }
    },
    [endSession, onSignedOut],
  );

  const value = useMemo(() => ({ user, loading, refresh, signOut }), [user, loading, refresh, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}

/** `usePermission('users-settings', 'U')` - true if the signed-in user may do this. */
export function usePermission(area: Area, action: Action = 'R'): boolean {
  const { user } = useSession();
  return can(user?.permissions, area, action);
}
