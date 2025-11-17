import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AuthService } from "@/app/core/services/auth";
import { UserService } from "@/app/core/services/user.service";
import * as AuthActions from "./auth.actions";

// LocalStorage key for token
const TOKEN_KEY = "auth_token";

/**
 * Auth Effects - Handle side effects for authentication actions
 *
 * Effects are where we handle:
 * - API calls
 * - localStorage operations
 * - Routing/navigation
 * - Logging
 *
 * Pattern: Action → Effect → API Call → Success/Failure Action → Reducer
 */
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  /**
   * Login Effect - Handles the async login operation
   *
   * Flow:
   * 1. Listens for [Auth] Login action
   * 2. Calls AuthService.login() (HTTP GET to validate credentials)
   * 3. Stores token in localStorage
   * 4. Dispatches [Auth] Login Success with user and token
   * 5. If error occurs, dispatches [Auth] Login Failure
   *
   * RxJS Operators:
   * - ofType: Filters actions by type
   * - switchMap: Cancels previous HTTP call if new login attempt occurs
   * - map: Transforms successful response to success action
   * - catchError: Catches errors and transforms to failure action
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        // Call the HTTP endpoint through AuthService
        this.authService
          .loginHttp({ email, password })
          .pipe(
            map(({ user, token }) => {
              // Validate password
              if (user.password !== password) {
                throw new Error("Invalid email or password");
              }
              console.log("🎯 Effect: Login successful, token stored");
              return AuthActions.loginSuccess({ user, token });
            }),
            catchError((error) => {
              console.error("❌ Effect: Login failed:", error.message);
              return of(AuthActions.loginFailure({ error: error.message }));
            }),
          ),
      ),
    ),
  );

  /**
   * After successful login, navigate to /recipes
   */
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => {
          // Store token in localStorage
          localStorage.setItem(TOKEN_KEY, token);
          console.log("✅ Login successful, navigating to /recipes");
          this.router.navigate(["/recipes"]);
        }),
      ),
    { dispatch: false }, // This effect doesn't dispatch another action
  );

  /**
   * Register Effect - Handles the async registration operation
   *
   * Flow:
   * 1. Listens for [Auth] Register action
   * 2. Calls AuthService.register() (HTTP POST to create user)
   * 3. Stores token in localStorage
   * 4. Dispatches [Auth] Register Success with user and token
   * 5. If error occurs, dispatches [Auth] Register Failure
   */
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ email, password }) =>
        this.authService.registerHttp({ email, password }).pipe(
          map(({ user, token }) => {
            console.log("🎯 Effect: Registration successful, token stored");
            return AuthActions.registerSuccess({ user, token });
          }),
          catchError((error) => {
            console.error("❌ Effect: Registration failed:", error.message);
            return of(AuthActions.registerFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * After successful registration, navigate to /recipes
   */
  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ token }) => {
          // Store token in localStorage
          localStorage.setItem(TOKEN_KEY, token);
          console.log("✅ Registration successful, navigating to /recipes");
          this.router.navigate(["/recipes"]);
        }),
      ),
    { dispatch: false }, // This effect doesn't dispatch another action
  );

  /**
   * Logout Effect - Handles side effects when user logs out
   *
   * Side Effects:
   * 1. Clears token from localStorage
   * 2. Navigates to login page
   */
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          console.log("🎯 Effect: Logging out, clearing token");
          localStorage.removeItem(TOKEN_KEY);
          this.router.navigate(["/"]);
        }),
      ),
    { dispatch: false }, // This effect doesn't dispatch another action
  );

  /**
   * On app initialization, check if token exists and restore user state
   */
  loadUserFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserFromStorage),
      switchMap(() => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
          // No token found, user not logged in
          return of({ type: "NO_ACTION" });
        }

        // In a real app, decode the JWT or make API call to validate/get user
        // For now, extract email from fake token
        const emailMatch = token.match(/fake-jwt-token-\d+-(.+)/);
        const email = emailMatch ? emailMatch[1] : null;

        if (!email) {
          console.warn("⚠️ Invalid token format, clearing localStorage");
          localStorage.removeItem(TOKEN_KEY);
          return of({ type: "NO_ACTION" });
        }

        return this.authService.loginHttp({ email, password: "" }).pipe(
          map(({ user }) => {
            console.log("🎯 Effect: Login successful, token stored");
            return AuthActions.loadUserFromStorageSuccess({ user, token });
          }),
          catchError((error) => {
            console.error("❌ Failed to restore session:", error.message);
            localStorage.removeItem(TOKEN_KEY);
            return of({ type: "NO_ACTION" });
          }),
        );
      }),
    ),
  );

  /**
   * Update User Effect - Handles the async user update operation
   *
   * Flow:
   * 1. Listens for [Auth] Update User action
   * 2. Calls UserService.updateUser() (HTTP PATCH to update user)
   * 3. Dispatches [Auth] Update User Success with updated user
   * 4. If error occurs, dispatches [Auth] Update User Failure
   */
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      switchMap(({ userId, userData }) =>
        this.userService.updateUser(userId, userData).pipe(
          map((user) => {
            console.log("🎯 Effect: User update successful");
            return AuthActions.updateUserSuccess({ user });
          }),
          catchError((error) => {
            console.error("❌ Effect: User update failed:", error.message);
            return of(AuthActions.updateUserFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );
}
