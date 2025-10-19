import type { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Custom validator to ensure two form controls have matching values.
 * This is a FormGroup-level validator, not a FormControl-level validator.
 *
 * Common use case: Password confirmation fields
 *
 * @param controlName - The name of the first control (e.g., 'password')
 * @param matchingControlName - The name of the control that must match (e.g., 'confirmPassword')
 * @returns ValidatorFn that returns null if valid, or ValidationErrors if fields don't match
 */
export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    // Return null if controls are not found
    if (!control || !matchingControl) {
      return null;
    }

    // Return null if either control is empty (let required validator handle it)
    if (!control.value || !matchingControl.value) {
      return null;
    }

    // Check if the values match
    if (control.value !== matchingControl.value) {
      // Set error on the matching control
      matchingControl.setErrors({ mustMatch: true });
      return { mustMatch: true };
    }

    // If they match, clear any mustMatch errors on the matching control
    // (but preserve other errors if they exist)
    if (matchingControl.hasError("mustMatch")) {
      const errors = { ...matchingControl.errors };
      delete errors["mustMatch"];
      matchingControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }

    return null;
  };
}
