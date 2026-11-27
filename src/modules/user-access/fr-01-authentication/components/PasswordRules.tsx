'use client';

import { Icon } from '@/shared/components/ui/Icon';
import { useT } from '@/web-requirements/wr-08-multi-language';

import { PASSWORD_RULES } from '../schemas/password';

import styles from './Auth.module.css';

/** Live checklist under a new-password field (S-01.2). */
export function PasswordRules({ password, id }: { password: string; id?: string }) {
  const t = useT();
  return (
    <ul id={id} className={styles.rules} aria-label={t('auth.password.rulesTitle')}>
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <li key={rule.id} className={[styles.rule, ok && styles.ruleOk].filter(Boolean).join(' ')}>
            <Icon name={ok ? 'check' : 'info'} size={14} />
            <span>
              {t(rule.labelKey)}
              <span className="sr-only"> {ok ? t('auth.password.ruleMet') : t('auth.password.ruleNotMet')}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
