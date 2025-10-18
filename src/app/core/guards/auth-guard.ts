import { Injectable, inject } from "@angular/core";
import { type ActivatedRouteSnapshot, type CanActivate, Router, type RouterStateSnapshot, type UrlTree } from "@angular/router";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "@/app/core/services/auth";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    // The core logic is here:
    return this.authService.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          // User is authenticated, allow access
          return true;
        }

        // User is not authenticated, redirect to login
        console.warn("Access denied. Redirecting to login...");
        this.router.navigate(["/auth/login"]);
        return false;
      }),
    );
  }
}
