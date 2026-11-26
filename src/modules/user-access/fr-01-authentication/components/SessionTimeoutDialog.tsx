'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { Dialog } from '@/shared/components/ui/Dialog';
import { SESSION_TIMEOUT_MINUTES } from '@/shared/lib/auth/session';
import { useT } from '@/web-requirements/wr-08-multi-language';

const WARN_SECONDS = 60;
const ACTIVITY = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/**
 * S-13.13 Session timeout. After NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES without activity the user
 * is warned for 60 seconds, then signed out. Unsaved field records stay on the device (WR-05).
 */
export function SessionTimeoutDialog({ onTimeout }: { onTimeout: () => void }) {
  const t = useT();
  const lastActivity = useRef(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const warning = secondsLeft !== null;

  useEffect(() => {
    lastActivity.current = Date.now();
    const limit = SESSION_TIMEOUT_MINUTES * 60_000;
    const markActive = () => {
      if (!warning) lastActivity.current = Date.now();
    };
    ACTIVITY.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    const timer = window.setInterval(() => {
      const remaining = Math.ceil((lastActivity.current + limit - Date.now()) / 1000);
      if (remaining <= 0) {
        window.clearInterval(timer);
        onTimeout();
      } else if (remaining <= WARN_SECONDS) {
        setSecondsLeft(remaining);
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
      ACTIVITY.forEach((e) => window.removeEventListener(e, markActive));
    };
  }, [onTimeout, warning]);

  const stay = () => {
    lastActivity.current = Date.now();
    setSecondsLeft(null);
  };

  return (
    <Dialog
      open={warning}
      onClose={stay}
      size="sm"
      title={t('auth.timeout.title')}
      closeLabel={t('common.close')}
      footer={
        <>
          <Button variant="secondary" onClick={onTimeout}>
            {t('auth.signOut')}
          </Button>
          <Button onClick={stay}>{t('auth.timeout.stay')}</Button>
        </>
      }
    >
      <p style={{ margin: 0 }} aria-live="polite">
        {t('auth.timeout.text', { seconds: secondsLeft ?? WARN_SECONDS })}
      </p>
    </Dialog>
  );
}
