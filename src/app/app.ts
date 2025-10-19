import { AsyncPipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Store } from "@ngrx/store";
import { logout } from "@/app/core/state/auth/auth.actions";
import { selectIsAuthenticated, selectUserEmail } from "@/app/core/state/auth/auth.selectors";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, AsyncPipe, RouterLink],
  template: `
    <!-- Header with Auth Status -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">🍳 Recipe Planner</h1>

        <!-- Auth Status using async pipe -->
        @if (isLoggedIn$ | async) {
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">
              Welcome, <span class="font-semibold">{{ userEmail$ | async }}</span>!
            </span>
            <button
              (click)="onLogout()"
              class="button button-sm button-outline border-red-500 text-red-500 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        } @else {
          <div class="flex items-center gap-2">
            <a
              routerLink="/auth/login"
              class="button button-sm button-ghost text-purple-600 rounded-lg"
            >
              Login
            </a>
            <a
              routerLink="/auth/register"
              class="button button-sm button-solid bg-purple-600 rounded-lg"
            >
              Sign Up
            </a>
          </div>
        }
      </div>
    </header>

    <!-- Main Content -->
    <router-outlet></router-outlet>
  `,
})
export class App {
  private store = inject(Store);

  protected readonly title = signal("angular-recipe-planner");
  protected readonly cn = cn;

  // Select authentication state from NgRx Store using async pipe
  protected isLoggedIn$ = this.store.select(selectIsAuthenticated);
  protected userEmail$ = this.store.select(selectUserEmail);

  /**
   * Handles logout action
   */
  protected onLogout(): void {
    this.store.dispatch(logout());
  }
}
