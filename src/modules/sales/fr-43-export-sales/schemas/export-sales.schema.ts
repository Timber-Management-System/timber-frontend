/**
 * TEMPLATE – form validation for this FR.
 * A validation library is not decided yet (docs/decisions/), so this is a plain function.
 * Error values are i18n keys (WR-08), not English text.
 */
import type { ExportSaleCreateInput } from '../types/export-sales.types';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateExampleCreate(input: ExportSaleCreateInput): FieldErrors<ExportSaleCreateInput> {
  const errors: FieldErrors<ExportSaleCreateInput> = {};
  if (!input.name.trim()) errors.name = 'validation.required';
  else if (input.name.length > 120) errors.name = 'validation.tooLong';
  return errors;
}
