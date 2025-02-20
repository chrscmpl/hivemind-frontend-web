import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { mapValues } from 'lodash-es';

export const customValidationErrors = (
  validator: ValidatorFn,
  errors: ValidationErrors,
): ValidatorFn => {
  return (control) => {
    const result = validator(control);
    if (result) {
      return mapValues(result, (value, key) => errors[key] || value);
    }
    return result;
  };
};
