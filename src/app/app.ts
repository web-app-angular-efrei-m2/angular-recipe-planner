import { Component, inject, type OnInit, signal } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { Store } from "@ngrx/store";
import { filter } from "rxjs/operators";
import { loadUserFromStorage, logout } from "@/app/core/state/auth/auth.actions";
import { selectIsAuthenticated, selectUserEmail } from "@/app/core/state/auth/auth.selectors";
import { NavbarComponent } from "@/app/shared/components/navbar/navbar.component";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <!-- Main Content -->
    <div [class.pb-20]="showNavbar()">
      <router-outlet></router-outlet>
    </div>

    <!-- Bottom Navigation Bar - Only show on specific pages -->
    @if (showNavbar()) {
      <app-navbar></app-navbar>
    }
  `,
})
export class App implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  protected readonly title = signal("angular-recipe-planner");
  protected readonly cn = cn;
  protected showNavbar = signal<boolean>(false);

  // Routes where navbar should be visible
  private readonly navbarRoutes = ["/recipes", "/discover", "/bookmarks", "/profile"];

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

    // Check initial route
    this.updateNavbarVisibility(this.router.url);

    // Listen to route changes
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.updateNavbarVisibility(event.urlAfterRedirects);
    });
  }

  /**
   * Update navbar visibility based on current route
   */
  private updateNavbarVisibility(url: string): void {
    const shouldShow = this.navbarRoutes.some((route) => route === url);
    this.showNavbar.set(shouldShow);
  }

  /**
   * Handles logout action
   */
  protected onLogout(): void {
    this.store.dispatch(logout());
  }
}
