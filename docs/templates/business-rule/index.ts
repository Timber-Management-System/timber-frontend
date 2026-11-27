/**
 * TEMPLATE – a business-rule check. Copy into src/business-rules/br-xx-<name>/index.ts.
 * Worked example: BR-05 "Stock cannot go negative; sales can only use available stock."
 *
 * How every rule is written:
 *   1. Quote the rule from the proposal (README › Business rules) in this comment.
 *   2. One input type, one pure function. No API calls, no React, no side effects.
 *   3. Return pass() or fail(...) from '@/business-rules/rule-result'. Never throw.
 *   4. The message is an i18n key (WR-08), not English text.
 *   5. The backend enforces the same rule. This check only warns the user early.
 *
 * Used by (list the FRs that call it): FR-31 stock movements, FR-36 quotations & orders, FR-38 dispatch.
 */
import { fail, pass, type RuleResult } from '@/business-rules/rule-result';

export interface NoNegativeStockInput {
  /** Volume currently available for this product and location (m³). */
  available: number;
  /** Volume the user wants to issue, reserve or sell (m³). */
  requested: number;
}

export function checkNoNegativeStock({ available, requested }: NoNegativeStockInput): RuleResult {
  if (requested <= 0) {
    return fail('BR-05', 'QUANTITY_NOT_POSITIVE', 'rules.br05.quantityNotPositive');
  }
  if (requested > available) {
    return fail('BR-05', 'STOCK_WOULD_GO_NEGATIVE', 'rules.br05.stockWouldGoNegative', { available, requested });
  }
  return pass();
}

/*
 * Cases to test (write them as tests when the test runner is chosen):
 *   available 10, requested 4   -> ok
 *   available 10, requested 10  -> ok (exactly all stock)
 *   available 10, requested 12  -> STOCK_WOULD_GO_NEGATIVE
 *   available 10, requested 0   -> QUANTITY_NOT_POSITIVE
 */
