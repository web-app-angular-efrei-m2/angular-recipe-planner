import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@/app/core/services/auth";
import { emailValidator, passwordValidator } from "@/app/shared/validators/auth";
import { FieldComponent } from "@/shared/components/ui/form/field/field.component";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-register",
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FieldComponent],
  template: `
    <div class="min-h-screen flex flex-1 flex-col break-words rounded-sm p-0 text-start font-semibold">
      <!-- Hero Image Section -->
      <div class="relative w-full h-[45vh] bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-50 overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-8xl">🍳</div>
          <!-- Decorative elements -->
          <div class="absolute top-12 left-8 text-2xl rotate-12">🥗</div>
          <div class="absolute bottom-16 right-12 text-3xl -rotate-12">🍝</div>
          <div class="absolute top-20 right-16 text-xl">🥘</div>
          <div class="absolute bottom-24 left-16 text-2xl rotate-45">🍲</div>
        </div>
      </div>

      <div class="flex flex-col gap-1.5 px-6 pt-6">
        <!-- Title -->
        <h2 class="text-2xl font-semibold text-gray-900">Let's get started!</h2>
        <p class="text-gray-400">Please enter your valid data in order to create an account.</p>
      </div>

      <!-- Form Section -->
      <div class="flex flex-1 flex-col p-6 gap-2">
        <!-- Register Form using Field Component -->
        <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <!-- Dynamic Form Fields -->
          @for (field of formFields; track field.name) {
            <app-field
              [required]="registrationForm.get(field.name)?.hasValidator(Validators.required)"
              [invalid]="registrationForm.get(field.name)?.invalid && submitted"
              [errorText]="getErrorMessage(field.name)"
            >
            <div class="relative isolate inline-flex justify-start gap-2 items-center">
              <div class="pointer-events-none absolute z-[2] flex h-full items-center justify-center pl-3 text-gray-400">
                  @if (field.name === 'email') {
                    <svg stroke="currentColor" fill="none" stroke-width="3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em] rounded-sm outline-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 6 9 17l-5-5"></path></svg>
                  }
                  @else if (field.name === 'password') {
                    <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
                  }
                </div>
                <input
                  [type]="field.type"
                  [formControlName]="field.name"
                  [class]="
                    cn(
                      'input input-lg input-subtle pl-12 rounded-lg placeholder:text-gray-400',
                      registrationForm.get(field.name)?.invalid && submitted && 'focus-visible:outline-purple-500'
                    )
                  "
                  [placeholder]="field.placeholder"
                />
              </div>
            </app-field>
          }
          <!-- Terms & Conditions -->
          <div class="mt-2">
            <label class="flex items-center gap-3 cursor-pointer group">
              <input
                [id]="'agreeToTerms'"
                type="checkbox"
                [formControlName]="'agreeToTerms'"
                [attr.aria-invalid]="registrationForm.get('agreeToTerms')?.invalid && submitted ? 'true' : null"
                [class]="
                  cn(
                    'input input-outline w-5 h-5 text-white border-2 rounded-md flex items-center justify-center checked:bg-purple-500 checked:border-purple-500 transition-colors duration-300 hover:outline-2 hover:-outline-offset-1',
                    registrationForm.get('agreeToTerms')?.invalid  && submitted ? 'outline-[var(--color-error)]' :'outline-purple-500'
                  )
                "
              />
              <span class="text-gray-400">
                I agree with the
                <mark href="#" class="text-purple-600 font-semibold bg-transparent">Terms of service</mark>
                & privacy policy.
              </span>
            </label>
            @if (registrationForm.get('agreeToTerms')?.invalid  && submitted) {
              <span class="text-xs text-[var(--color-error)] mt-1.5 ml-8 block font-medium">{{ getErrorMessage('agreeToTerms') }}</span>
            }
          </div>
          <!-- Submit Button -->
          <button
            type="submit"
            class="button button-lg button-solid bg-purple-600 rounded-lg font-semibold"
          >
            Continue
          </button>
        </form>
        <!-- Sign In Link -->
        <p class="text-center text-gray-400">
          Do you have an account?
          <a
            routerLink="/auth/login"
            class="button button-link align-baseline text-purple-600 font-semibold ml-1"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected readonly cn = cn;
  protected readonly Validators = Validators;
  private fb = inject(FormBuilder);

  // Track if form has been submitted
  protected submitted = false;

  // Form fields configuration
  protected formFields = [
    {
      name: "email",
      type: "email",
      placeholder: "Email address",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
    },
  ] as const;

  // Reactive Form Group with cross-field validation
  registrationForm = this.fb.group(
    {
      email: [
        "",
        [
          Validators.required,
          emailValidator(), // Custom email validator
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8), // Minimum 8 characters
          passwordValidator(), // Custom validator
        ],
      ],
      agreeToTerms: [false, [Validators.requiredTrue]],
    },
    {
      updateOn: "submit", // Only validate when form is submitted, not on every input change
    },
  );

  getErrorMessage(name: string): string | undefined {
    const control = this.registrationForm.get(name);
    if (control?.hasError("required")) {
      if (name === "agreeToTerms") {
        return "You must agree to the terms and privacy policy";
      }
      return `${name} is required`;
    }
    if (control?.hasError("invalidEmail")) {
      const error = control.getError("invalidEmail");
      return error.message || "Please enter a valid email address";
    }
    if (control?.hasError("minlength")) {
      const requiredLength = control.getError("minlength").requiredLength;
      return `Password must be at least ${requiredLength} characters`;
    }
    if (control?.hasError("invalidPassword")) {
      const error = control.getError("invalidPassword");
      return error.message || "Password must contain at least one uppercase letter and one digit";
    }
    if (control?.hasError("mustMatch")) {
      return "Passwords must match";
    }
    return undefined;
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    // Mark form as submitted
    this.submitted = true;

    console.log("🚀 Submitting registration form...");

    // Check if form is valid
    if (this.registrationForm.invalid) {
      console.warn("❌ Form is invalid. Please fix errors.");
      return;
    }

    // Get form values (type-safe!)
    const { email, password } = this.registrationForm.value;

    console.log("🔐 Registration attempt:", { email, password: "***" });

    // Call AuthService register method with HTTP POST
    this.authService
      .register({
        email: email as string,
        password: password as string,
      })
      .subscribe({
        next: (user) => {
          console.log("✅ Registration successful!", user);
          console.log("✅ User automatically logged in! Navigating to /recipes...");
          // Navigate to recipes page after successful registration
          this.router.navigate(["/recipes"]);
        },
        error: (err) => {
          console.error("❌ Registration error:", err);
          // TODO: Show error message to user
        },
      });
  }
}
