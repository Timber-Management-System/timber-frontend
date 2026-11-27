/**
 * TEMPLATE – form validation for this FR.
 * A validation library is not decided yet (docs/decisions/), so this is a plain function.
 * Error values are i18n keys (WR-08), not English text: show them with t(error).
 */
import type { ExampleFormValues, ExampleInput } from '../types/example.types';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export const NAME_MAX = 120;

export function validateExample(values: ExampleFormValues): FieldErrors<ExampleFormValues> {
  const errors: FieldErrors<ExampleFormValues> = {};
  if (!values.name.trim()) errors.name = 'validation.required';
  else if (values.name.trim().length > NAME_MAX) errors.name = 'validation.tooLong';
  if (!values.site) errors.site = 'validation.required';
  const quantity = Number(values.quantity);
  if (!values.quantity.trim()) errors.quantity = 'validation.required';
  else if (!Number.isFinite(quantity) || quantity <= 0) errors.quantity = 'validation.positiveNumber';
  return errors;
}

/** Converts valid form values into what the API expects. */
export function toExampleInput(values: ExampleFormValues): ExampleInput {
  return {
    name: values.name.trim(),
    site: values.site,
    quantity: Number(values.quantity),
    note: values.note.trim() || undefined,
  };
}
