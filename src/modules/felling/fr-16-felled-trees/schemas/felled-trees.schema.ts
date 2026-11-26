import type { FelledTreeCreateInput } from '../types/felled-trees.types';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

// Validate felled tree form inputs.
export function validateFelledTreeCreate(
  input: FelledTreeCreateInput
): FieldErrors<FelledTreeCreateInput> {
  const errors: FieldErrors<FelledTreeCreateInput> = {};

  if (!input.fellingDate.trim())
    errors.fellingDate = 'validation.required';

  if (!input.siteLocation.trim())
    errors.siteLocation = 'validation.required';

  if (!input.treeId.trim())
    errors.treeId = 'validation.required';

  if (!input.permitId.trim())
    errors.permitId = 'validation.required';

  if (!input.fellingTeam.trim())
    errors.fellingTeam = 'validation.required';

  if (!input.status)
    errors.status = 'validation.required';

  if (!Number.isFinite(input.actualLength) || input.actualLength <= 0)
    errors.actualLength = 'validation.positiveNumber';

  if (!Number.isFinite(input.actualDiameter) || input.actualDiameter <= 0)
    errors.actualDiameter = 'validation.positiveNumber';

  return errors;
}