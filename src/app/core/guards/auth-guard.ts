import { inject } from "@angular/core";
import { type CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { selectIsAuthenticated } from "@/app/core/state/auth/auth.selectors";

/**
 * Auth Guard
 *
 * Uses NgRx Store to check authentication state.
 * If user is authenticated, allows access. Otherwise, redirects to login.
 */
export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  // Select authentication state from NgRx Store
  return store.select(selectIsAuthenticated).pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        // User is authenticated, allow access
        return true;
      }

      // User is not authenticated, redirect to login
      console.warn("⛔ Access denied. Redirecting to login...");
      return router.createUrlTree(["/auth/login"]);
    }),
  );
};
