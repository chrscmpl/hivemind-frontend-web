import { AbstractControl, ValidatorFn } from '@angular/forms';

export function confirmPasswordValidator(
  passwordControlGetter: () => AbstractControl | undefined,
): ValidatorFn {
  return (confirmControl: AbstractControl) =>
    confirmControl.value &&
    confirmControl.value === passwordControlGetter()?.value
      ? null
      : { passwordMismatch: 'Passwords do not match' };
}
