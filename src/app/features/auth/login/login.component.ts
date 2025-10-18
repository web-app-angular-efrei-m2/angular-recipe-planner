import { Component, signal } from "@angular/core";
import { FormsModule, type NgForm } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { FieldComponent } from "@/shared/components/ui/form/field/field.component";
import { cn } from "@/utils/classes";

type FieldConfig = {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  errorKey: keyof LoginComponent["errors"];
  minlength?: number;
};

@Component({
  selector: "app-login",
  imports: [RouterLink, FormsModule, FieldComponent],
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
      </div>

      <!-- Form Section -->
      <div class="flex flex-1 flex-col p-6 gap-2">
        <!-- Register Form using Field Component -->
        <form (ngSubmit)="onSubmit(registerForm)" #registerForm="ngForm" class="flex flex-col gap-4">
          <!-- Dynamic Form Fields -->
          @for (field of formFields; track field.name) {
            <app-field
              [required]="field.required"
              [invalid]="errors[field.errorKey]() !== null"
              [errorText]="errors[field.errorKey]() || ''"
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
                  [name]="field.name"
                  ngModel
                  [minlength]="field.minlength ?? null"
                  [class]="
                    cn(
                      'input input-lg input-subtle pl-12 rounded-lg placeholder:text-gray-400',
                      !errors[field.errorKey]() && 'focus-visible:outline-purple-500'
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
  protected readonly cn = cn;

  // Form fields configuration
  formFields: FieldConfig[] = [
    {
      name: "email",
      type: "email",
      placeholder: "Email address",
      required: true,
      errorKey: "emailError",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      required: true,
      errorKey: "passwordError",
      minlength: 8,
    },
  ];

  // Error signals - only set on submit
  errors = {
    emailError: signal<string | null>(null),
    passwordError: signal<string | null>(null),
  };

  onSubmit(form: NgForm): void {
    // Get form values from Angular's NgForm
    const { name, email, password } = form.value;

    // Reset errors
    this.errors.emailError.set(null);
    this.errors.passwordError.set(null);

    // Validate
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      this.errors.emailError.set("Please enter a valid email address");
      isValid = false;
    }

    if (!password || password.length < 8) {
      this.errors.passwordError.set("Password must be at least 8 characters");
      isValid = false;
    }

    // If valid, submit
    if (isValid) {
      console.log("Registration submitted:", {
        name,
        email,
        password,
      });
      // Handle form submission (e.g., call API)
      // form.reset(); // Optionally reset form after successful submission
    }
  }
}
