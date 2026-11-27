/**
 * TEMPLATE – form validation for this FR.
 * A validation library is not decided yet (docs/decisions/), so this is a plain function.
 * Error values are i18n keys (WR-08), not English text: show them with t(error).
 */
import type { ExampleFormValues, ExampleInput } from '../types/example.types';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
type Field = keyof ExampleFormValues;

export const NAME_MAX = 120;

/**
 * The fields on each step of the form popup. "Continue" checks only the current step;
 * the last step (review) has none. Keep this in the same order as the steps in the form.
 */
export const STEP_FIELDS: Field[][] = [['date', 'name', 'site'], ['quantity', 'note'], []];

/** A draft only needs a name, so people can save early and finish later. */
export const DRAFT_FIELDS: Field[] = ['name'];

export function validateExample(
  values: ExampleFormValues,
  fields: Field[] = STEP_FIELDS.flat(),
): FieldErrors<ExampleFormValues> {
  const errors: FieldErrors<ExampleFormValues> = {};
  const checks = (field: Field) => fields.includes(field);

  if (checks('date') && !values.date) errors.date = 'validation.required';
  if (checks('name')) {
    if (!values.name.trim()) errors.name = 'validation.required';
    else if (values.name.trim().length > NAME_MAX) errors.name = 'validation.tooLong';
  }
  if (checks('site') && !values.site) errors.site = 'validation.required';
  if (checks('quantity')) {
    const quantity = Number(values.quantity);
    if (!values.quantity.trim()) errors.quantity = 'validation.required';
    else if (!Number.isFinite(quantity) || quantity <= 0) errors.quantity = 'validation.positiveNumber';
  }
  return errors;
}

/** The step that holds the first error, so the form can jump there. -1 if none. */
export function firstStepWithError(errors: FieldErrors<ExampleFormValues>): number {
  return STEP_FIELDS.findIndex((fields) => fields.some((field) => errors[field]));
}

/** Converts form values into what the API expects (drafts may have empty fields). */
export function toExampleInput(values: ExampleFormValues): ExampleInput {
  const quantity = values.quantity.trim();
  return {
    date: values.date,
    name: values.name.trim(),
    site: values.site,
    quantity: quantity ? Number(quantity) : undefined,
    note: values.note.trim() || undefined,
  };
}
