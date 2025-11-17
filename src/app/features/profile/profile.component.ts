import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { logout } from "@/app/core/state/auth/auth.actions";
import { selectUser } from "@/app/core/state/auth/auth.selectors";

@Component({
  selector: "app-profile",
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative flex flex-1 flex-col min-h-dvh wrap-break-word rounded-sm text-start font-semibold">
      <!-- Header -->
      <div class="sticky inset-0 z-10 flex items-center justify-between shrink-0 h-(--header-height) px-6 pt-0 bg-white">
        <div class="btn-sm p-0"></div>
        <h2 class="text-sm text-gray-800 font-semibold">Profile</h2>
        <a routerLink="/profile/edit" class="btn btn-sm btn-link text-primary font-semibold">Edit</a>
      </div>

      @if (user(); as currentUser) {
        <div class="flex flex-col items-center px-6 py-8">
          <!-- Profile Photo -->
          <div class="relative mb-2">
            <div class="size-32 bg-gray-200 rounded-full flex items-center justify-center">
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-16 text-gray-400" xmlns="http://www.w3.org/2000/svg"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>
          <div class="mb-8 h-5"></div>

          <!-- User Info -->
          <div class="w-full max-w-md flex flex-col gap-4">
            <!-- Name -->
            <div class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Name</span>
              <span class="text-end text-sm font-semibold">{{ currentUser.name || currentUser.email.split('@')[0] }}</span>
            </div>

            <!-- Date of birth -->
            <div class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Date of birth</span>
              <span class="text-end text-sm font-semibold">{{ currentUser.dateOfBirth || '-' }}</span>
            </div>

            <!-- Phone Number -->
            <div class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Phone number</span>
              <span class="text-end text-sm font-semibold">{{ currentUser.phone || '-' }}</span>
            </div>

            <!-- Gender -->
            <div class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Gender</span>
              <span class="text-end text-sm font-semibold">{{ currentUser.gender || '-' }}</span>
            </div>

            <!-- Email -->
            <div class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Email</span>
              <span class="text-end text-sm font-semibold pl-12">{{ currentUser.email }}</span>
            </div>

            <!-- Password -->
            <div class="input input-lg input-flushed justify-between w-full">
              <span class="text-sm text-gray-400">Password</span>
              <button type="button" class="btn btn-sm btn-ghost text-primary rounded-full text-sm font-semibold ml-auto tooltip tooltip-animated" data-tip="Not implemented yet">
                Change password
              </button>
            </div>

            <!-- Logout Button -->
            <div class="mt-8">
              <button
                type="button"
                (click)="handleLogout()"
                class="btn btn-lg btn-solid btn-error w-full rounded-lg font-semibold"
              >
                <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-5" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                Log Out
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ProfileComponent {
  private store = inject(Store);
  protected user = this.store.selectSignal(selectUser);

  protected handleLogout(): void {
    this.store.dispatch(logout());
    // this.router.navigate(["/auth/login"]);
  }
}
