import { CommonModule } from "@angular/common";
import { Component, inject, type OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { register } from "@/app/core/state/auth/auth.actions";
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from "@/app/core/state/auth/auth.selectors";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-register",
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  template: `
    <div class="flex flex-col min-h-screen">
      <!-- Hero Section with Image -->
      <div class="relative h-[45vh] overflow-hidden bg-linear-to-br from-orange-100 via-amber-50 to-yellow-50">
        <div class="absolute inset-0 flex items-center justify-center">
          <!-- Recipe-themed illustration -->
          <div class="text-8xl">🍳</div>
        </div>
        <!-- Decorative elements -->
        <div class="absolute top-12 left-8 text-2xl opacity-60 rotate-12">🥗</div>
        <div class="absolute bottom-16 right-12 text-3xl opacity-60 -rotate-12">🍝</div>
        <div class="absolute top-20 right-16 text-xl opacity-60">🥘</div>
        <div class="absolute bottom-24 left-16 text-2xl opacity-60 rotate-45">🍲</div>
        <!-- Wave overlay -->
        <div class="absolute bottom-0 left-0 right-0 h-8 bg-white" style="border-radius: 50% 50% 0 0 / 100% 100% 0 0;"></div>
      </div>

      <!-- Content Card -->
      <div class="card flex-1 rounded-t-3xl -mt-6 relative z-10 w-full">
        <div class="card-body mx-auto">
          <h2 class="card-title text-2xl">Let's get started!</h2>
          <p class="text-muted">Please enter your valid data in order to create an account.</p>

          <!-- Error Message -->
          @if (authError$ | async; as error) {
            <div class="alert alert-error alert-soft mb-4">
              <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" x2="12" y1="8" y2="12"></line>
                <line x1="12" x2="12.01" y1="16" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>
          }

          <!-- Loading Indicator -->
          @if (authLoading$ | async) {
            <div class="loading loading-xl text-primary mx-auto"></div>
          }

          <!-- Register Form -->
          <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-5 w-dvw max-w-md">
            @for (field of [formFields.email, formFields.password]; track field.name) {
              <div>
                <label class="input input-lg input-soft validator w-full gap-4" [title]="field.title">
                  @if (field.name === 'password') {
                    <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-6 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="16" r="1"></circle><rect x="3" y="10" width="18" height="12" rx="2"></rect><path d="M7 10V7a5 5 0 0 1 10 0v3"></path></svg>
                  }
                  @else {
                    <svg stroke="currentColor" fill="none" stroke-width="3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-lh shrink-0 align-middle text-current leading-[1em] rounded-sm outline-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 6 9 17l-5-5"></path></svg>
                  }
                  <input
                    [type]="field.type"
                    [formControlName]="field.name"
                    [placeholder]="field.placeholder"
                    [pattern]="field.pattern"
                    required
                  />
                </label>
                <p class="validator-hint mt-2">{{ field.title }}</p>
              </div>
            }

            <!-- Terms & Conditions -->
            <div>
              <label class="validator flex items-center gap-3 cursor-pointer -mt-2" [title]="formFields['agreeToTerms']?.title">
              <input
                type="checkbox"
                formControlName="agreeToTerms"
                class="checkbox checkbox-primary checkbox-sm"
                required
              />
              <span class="text-muted text-sm">
                I agree with the
                <span class="text-primary font-semibold">Terms of service</span>
                & privacy policy.
              </span>
              </label>
              <p class="validator-hint mt-2">{{ formFields["agreeToTerms"]?.title }}</p>
            </div>

            <button type="submit" class="btn btn-lg btn-primary">
              Continue
            </button>
          </form>

          <p class="text-center text-muted mt-5">
            Already have an account?
            <a routerLink="/auth/login" class="btn btn-link text-primary align-baseline">Log in</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  protected readonly cn = cn;
  private fb = inject(FormBuilder);

  // Select authentication state from NgRx Store using async pipe
  protected isLoggedIn$ = this.store.select(selectIsAuthenticated);

  // Select error and loading state from NgRx Store
  protected authError$ = this.store.select(selectAuthError);
  protected authLoading$ = this.store.select(selectAuthLoading);

  // Track if form has been submitted
  protected submitted = false;

  // Form fields configuration
  protected formFields = {
    email: {
      name: "email",
      type: "email",
      placeholder: "Email address",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      title: "Please enter a valid email address",
    },
    password: {
      name: "password",
      type: "password",
      placeholder: "Password",
      pattern: "^(?=.*[A-Z])(?=.*\\d).{8,}$",
      title: "Password must be at least 8 characters and contain at least one uppercase letter and one digit",
    },
    agreeToTerms: {
      title: "You must agree to the terms and conditions to continue",
    },
  } as const;

  // Reactive Form Group - all validation is handled by HTML5 (required + pattern)
  registrationForm = this.fb.group({
    email: ["", [Validators.required]],
    password: ["", [Validators.required]],
    agreeToTerms: [false, [Validators.required]],
  });

  ngOnInit(): void {
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        console.log("✅ User is already logged in, redirecting...");
        this.router.navigate(["/"]);
      }
    });
  }

  /**
   * Handles form submission
   * Dispatches registration action to NgRx Store instead of calling service directly
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

    // Dispatch registration action to NgRx Store
    // The effect will handle the HTTP call and state updates
    this.store.dispatch(register({ email: email as string, password: password as string }));

    // No need to manually subscribe or navigate - effects handle that!
  }
}
