import { CommonModule, Location } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as AuthActions from "@/app/core/state/auth/auth.actions";
import { selectAuthError, selectAuthLoading, selectUser } from "@/app/core/state/auth/auth.selectors";

@Component({
  selector: "app-profile-edit",
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="relative flex flex-1 flex-col h-[calc(100dvh-97px)] wrap-break-word rounded-sm text-start font-semibold">
      <!-- Header -->
       <div class="sticky inset-0 z-10 flex items-center justify-between shrink-0 h-(--header-height) px-6 pt-0 bg-white">
        <button type="button" (click)="goBack()" class="btn btn-sm btn-ghost rounded-full p-0">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        </button>
        <h2 class="text-sm text-gray-800 font-semibold">Edit Profile</h2>
        <div class="btn-sm p-0"></div>
      </div>

      @if (user(); as currentUser) {
        <div class="flex flex-col items-center px-6 py-8">
         <!-- Profile Photo -->

          <div class="avatar avatar-placeholder">
            <div class="bg-base-300 text-neutral-content w-32 rounded-full">
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-16 text-gray-400" xmlns="http://www.w3.org/2000/svg"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <button
              type="button"
              class="avatar-badge bottom-[15%] right-[15%] size-10 bg-primary rounded-full flex items-center justify-center shadow-lg tooltip tooltip-animated"
              data-tip="Coming soon - Feature not yet implemented"
            >
              <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-5 text-white" xmlns="http://www.w3.org/2000/svg"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>
            </button>
          </div>


          <div class="mb-8 h-5"></div>

          <!-- User Info Form -->
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="w-full max-w-md flex flex-col gap-4">
            <!-- Name -->
            <label class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Name</span>
              <input
                type="text"
                formControlName="name"
                class="text-end text-sm font-semibold pl-12"
              />
            </label>

            <!-- Date of birth -->
            <label class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Date of birth</span>
              <input
                type="date"
                formControlName="dateOfBirth"
                class="text-sm font-semibold justify-end pr-0"
              />
            </label>

            <!-- Phone Number -->
            <label class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Phone number</span>
              <input
                type="tel"
                formControlName="phone"
                pattern="[0-9 ]+"
                class="text-end text-sm font-semibold"
              />
            </label>

            <!-- Gender -->
            <div class="popover popover-animated popover-base-100 popover-bottom input input-lg input-flushed justify-between w-full relative">
              <div class="popover-content w-dvw max-w-md shadow-sm overflow-hidden">
                <div class="card w-full">
                  <input type="radio" formControlName="gender" value="male" aria-label="Male" class="popover-close btn btn-primary btn-sm btn-ghost justify-start" />
                  <input type="radio" formControlName="gender" value="female" aria-label="Female" class="popover-close btn btn-primary btn-sm btn-ghost justify-start" />
                  <input type="radio" formControlName="gender" value="other" aria-label="Other" class="popover-close btn btn-primary btn-sm btn-ghost justify-start" />
                </div>
              </div>
              <span class="text-sm text-gray-400">Gender</span>
                <input
                type="text"
                readonly
                class="text-end text-sm font-semibold cursor-pointer"
                [defaultValue]="profileForm.get('gender')?.value"
              />
            </div>

            <!-- Email -->
            <label class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Email</span>
              <input
                type="email"
                formControlName="email"
                class="text-end text-sm font-semibold pl-12"
              />
            </label>

            <!-- Submit Button -->
            <div class="mt-14">
              @if (error()) {
                <div class="alert alert-error mb-4">
                  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-6" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>{{ error() }}</span>
                </div>
              }
              <button
                type="submit"
                [disabled]="loading() || !profileForm.valid"
                class="btn btn-lg btn-solid btn-primary w-full rounded-lg font-semibold"
              >
                @if (loading()) {
                  <span class="loading loading-spinner loading-sm"></span>
                  Updating...
                } @else {
                  Done
                }
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes bounce-in {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes bounce-out {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }


    [popover]:popover-open {
      animation: bounce-in var(--tw-duration) cubic-bezier(0.66,-0.01,0.15,1.57);
    }

    [popover]:not(:popover-open) {
      animation: bounce-out var(--tw-duration) cubic-bezier(0.29,-0.81,0.67,1.69);
    }


    @starting-style {
      [popover]:popover-open {
        transform: scale(0);
      }
    }
  `,
})
export class ProfileEditComponent {
  private store = inject(Store);
  private location = inject(Location);
  private fb = inject(FormBuilder);

  protected user = this.store.selectSignal(selectUser);
  protected loading = this.store.selectSignal(selectAuthLoading);
  protected error = this.store.selectSignal(selectAuthError);
  protected profileForm: FormGroup;

  constructor() {
    const currentUser = this.user();
    this.profileForm = this.fb.group({
      name: [currentUser?.name || currentUser?.email.split("@")[0] || "", Validators.required],
      dateOfBirth: [currentUser?.dateOfBirth || ""],
      phone: [currentUser?.phone || "", Validators.pattern("[0-9 ]+")],
      gender: [currentUser?.gender || ""],
      email: [currentUser?.email || "", [Validators.required, Validators.email]],
    });

    // Watch for successful update and navigate back
    effect(() => {
      const currentError = this.error();
      const isLoading = this.loading();

      // If there's an error, show it
      if (currentError) {
        console.error("❌ Profile update failed:", currentError);
      }

      // If update completed successfully (not loading and no error), navigate back
      if (!isLoading && !currentError && this.profileForm.dirty) {
        console.log("✅ Profile updated successfully");
        setTimeout(() => this.goBack(), 500);
      }
    });
  }

  protected goBack(): void {
    this.location.back();
  }

  protected onSubmit(): void {
    if (this.profileForm.valid) {
      const currentUser = this.user();
      if (!currentUser) {
        console.error("No user logged in");
        return;
      }

      const formValue = this.profileForm.value;

      // Prepare user data update with all profile fields
      const userData = {
        name: formValue.name,
        dateOfBirth: formValue.dateOfBirth,
        phone: formValue.phone,
        gender: formValue.gender,
        email: formValue.email,
      };

      console.log("📝 Submitting profile update:", userData);

      // Dispatch the update user action
      this.store.dispatch(
        AuthActions.updateUser({
          userId: currentUser.id,
          userData,
        }),
      );
    } else {
      console.log("Form is invalid");
    }
  }
}
