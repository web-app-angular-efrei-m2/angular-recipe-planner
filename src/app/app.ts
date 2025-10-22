import { Component, inject, type OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadUserFromStorage, logout } from "@/app/core/state/auth/auth.actions";
import { selectIsAuthenticated, selectUserEmail } from "@/app/core/state/auth/auth.selectors";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  template: `
    <!-- Main Content -->
    <router-outlet></router-outlet>
  `,
})
export class App implements OnInit {
  private store = inject(Store);

  protected readonly title = signal("angular-recipe-planner");
  protected readonly cn = cn;

  // Select authentication state from NgRx Store using async pipe
  protected isLoggedIn$ = this.store.select(selectIsAuthenticated);
  protected userEmail$ = this.store.select(selectUserEmail);

  /**
   * On app initialization, check if user has a valid token in localStorage
   * and restore their session
   */
  ngOnInit(): void {
    console.log("🚀 App initialized - checking for stored authentication...");
    this.store.dispatch(loadUserFromStorage());
  }

  /**
   * Handles logout action
   */
  protected onLogout(): void {
    this.store.dispatch(logout());
  }
}
