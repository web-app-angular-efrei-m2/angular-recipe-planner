import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { login } from "@/app/core/state/auth/auth.actions";
import { selectAuthError, selectAuthLoading } from "@/app/core/state/auth/auth.selectors";
import { emailValidator, passwordValidator } from "@/app/shared/validators/auth";
import { FieldComponent } from "@/shared/components/ui/form/field/field.component";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-login",
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
        <h2 class="text-2xl font-semibold text-gray-900">Welcome back!</h2>
        <p class="text-gray-400">Log in with your data that you entered during your registration.</p>
        <!-- Error Message from Store -->
        @if (authError$ | async; as error) {
          <div class="alert alert-error font-semibold mt-2">
            <span class="inline-flex items-center justify-center flex-shrink-0">
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
            </span>
            <span>{{ error }}</span>
          </div>
        }
        <!-- Loading Indicator -->
        @if (authLoading$ | async) {
          <div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-600">⏳ Logging in...</p>
          </div>
        }
      </div>

      <!-- Form Section -->
      <div class="flex flex-1 flex-col p-6 gap-2">
        <!-- Register Form using Field Component -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <!-- Dynamic Form Fields -->
          @for (field of formFields; track field.name) {
            <app-field
              [required]="loginForm.get(field.name)?.hasValidator(Validators.required)"
              [invalid]="loginForm.get(field.name)?.invalid && submitted"
              [errorText]="getErrorMessage(field.name)"
            >
            <div class="relative isolate inline-flex justify-start gap-2 items-center">
              <div class="pointer-events-none absolute z-[2] flex h-full items-center justify-center pl-3 text-gray-400">
                  @if (field.name === 'password') {
                    <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
                  }
                  @else {
                    <svg stroke="currentColor" fill="none" stroke-width="3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em] rounded-sm outline-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 6 9 17l-5-5"></path></svg>
                  }
                </div>
                <input
                  [type]="field.type"
                  [formControlName]="field.name"
                  [class]="
                    cn(
                      'input input-lg input-subtle pl-12 rounded-lg placeholder:text-gray-400',
                      loginForm.get(field.name)?.invalid && 'focus-visible:outline-purple-500'
                    )
                  "
                  [placeholder]="field.placeholder"
                />
              </div>
            </app-field>
          }
          <!-- Forgot Password -->
           <button
           type="button"
           class="button button-md button-ghost text-purple-500 font-semibold self-center rounded-lg"
           >
            Forgot Password
           </button>
          <!-- Spacer -->
          <!-- Submit Button -->
          <button
            type="submit"
            class="button button-lg button-solid bg-purple-600 rounded-lg font-semibold"
          >
            Log in
          </button>
        </form>
        <!-- Sign In Link -->
        <p class="text-center text-gray-400">
          Don't have an account?
          <a
            routerLink="/auth/register"
            class="button button-link align-baseline text-purple-600 font-semibold ml-1"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private store = inject(Store);
  protected readonly cn = cn;
  protected readonly Validators = Validators;
  private fb = inject(FormBuilder);

  // Select error and loading state from NgRx Store
  protected authError$ = this.store.select(selectAuthError);
  protected authLoading$ = this.store.select(selectAuthLoading);

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

  // Reactive Form Group
  loginForm = this.fb.group(
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
    },
    {
      updateOn: "submit", // Only validate when form is submitted, not on every input change
    },
  );

  getErrorMessage(name: string): string | undefined {
    const control = this.loginForm.get(name);
    if (control?.hasError("required")) {
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
    return undefined;
  }

  /**
   * Handles form submission
   * Dispatches login action to NgRx Store instead of calling service directly
   */
  onSubmit(): void {
    // Mark form as submitted
    this.submitted = true;

    console.log("🚀 Submitting login form...");

    // Check if form is valid
    if (this.loginForm.invalid) {
      console.warn("❌ Form is invalid. Please fix errors.");
      return;
    }

    // Get form values (type-safe!)
    const { email, password } = this.loginForm.value;

    console.log("🔐 Login attempt:", { email, password: "***" });

    // Dispatch login action to NgRx Store
    // The effect will handle the HTTP call and state updates
    this.store.dispatch(login({ email: email as string, password: password as string }));

    // No need to manually subscribe or navigate - effects handle that!
  }
}
