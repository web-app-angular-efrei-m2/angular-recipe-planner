import type { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Custom email validator with more strict validation than Angular's built-in.
 *
 * Requirements:
 * - Valid email format
 * - No consecutive dots
 * - No leading/trailing dots
 * - Valid domain with TLD
 *
 * @returns ValidatorFn that returns null if valid, or ValidationErrors if invalid
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // If no value, let 'required' validator handle it
    if (!value) {
      return null;
    }

    // Trim whitespace
    const trimmedValue = value.trim();

    // Basic email regex pattern
    // More strict than Angular's default
    const emailPattern = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;

    // Check if email matches pattern
    if (!emailPattern.test(trimmedValue)) {
      return {
        invalidEmail: {
          message: "Please enter a valid email address",
          value: trimmedValue,
        },
      };
    }

    // Check for consecutive dots
    if (/\.\./.test(trimmedValue)) {
      return {
        invalidEmail: {
          message: "Email cannot contain consecutive dots",
          value: trimmedValue,
        },
      };
    }

    // Check for leading or trailing dots in local part
    const [localPart] = trimmedValue.split("@");
    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      return {
        invalidEmail: {
          message: "Email cannot start or end with a dot",
          value: trimmedValue,
        },
      };
    }

    // All validations passed
    return null;
  };
}

/**
 * Custom validator to enforce password complexity requirements.
 *
 * Requirements:
 * - At least one uppercase letter (A-Z)
 * - At least one digit (0-9)
 *
 * @returns ValidatorFn that returns null if valid, or ValidationErrors if invalid
 */
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // If no value, let 'required' validator handle it
    if (!value) {
      return null;
    }

    // Trim whitespace
    const trimmedValue = value.trim();

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(trimmedValue)) {
      return {
        invalidPassword: {
          message: "Password must contain at least one uppercase letter and one digit",
          value: trimmedValue,
        },
      };
    }

    // Check for at least one digit
    if (!/\d/.test(trimmedValue)) {
      return {
        invalidPassword: {
          message: "Password must contain at least one uppercase letter and one digit",
          value: trimmedValue,
        },
      };
    }

    // All validations passed
    return null;
  };
}
