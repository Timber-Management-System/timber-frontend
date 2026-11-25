/**
 * Shared result type for every business-rule check (BR-01 … BR-15).
 *
 * The backend always has the final say. Frontend checks only give the user an early, clear
 * message before they submit. A check never throws: it returns `pass()` or `fail(...)`.
 *
 *   const result = checkNoNegativeStock({ available: 10, requested: 12 });
 *   if (!result.ok) showError(t(result.messageKey, result.params));
 */
export type RuleId = `BR-${string}`;

export type RuleResult =
  | { ok: true }
  | {
      ok: false;
      /** Which rule failed, e.g. 'BR-05'. */
      rule: RuleId;
      /** Stable machine code, e.g. 'STOCK_WOULD_GO_NEGATIVE'. Use it in code and tests. */
      code: string;
      /** i18n key for the message shown to the user (WR-08), e.g. 'rules.br05.stockNegative'. */
      messageKey: string;
      /** Values for the message, e.g. { available: 10 }. */
      params?: Record<string, string | number>;
    };

export const pass = (): RuleResult => ({ ok: true });

export function fail(
  rule: RuleId,
  code: string,
  messageKey: string,
  params?: Record<string, string | number>,
): RuleResult {
  return { ok: false, rule, code, messageKey, params };
}
