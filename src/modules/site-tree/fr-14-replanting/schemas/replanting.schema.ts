import type { ReplantingCreateInput } from '../types/replanting.types';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateReplantingCreate(
  input: ReplantingCreateInput
): FieldErrors<ReplantingCreateInput> {
  const errors: FieldErrors<ReplantingCreateInput> = {};

  if (!input.plantingDate.trim()) {
    errors.plantingDate = 'validation.required';
  }

  if (!input.site.trim()) {
    errors.site = 'validation.required';
  }

  if (!input.species.trim()) {
    errors.species = 'validation.required';
  }

  if (!Number.isInteger(input.treeCount) || input.treeCount < 1) {
    errors.treeCount = 'validation.positiveInteger';
  }

  if (!input.responsibleTeam.trim()) {
    errors.responsibleTeam = 'validation.required';
  }

  if (!input.status.trim()) {
    errors.status = 'validation.required';
  }

  return errors;
}