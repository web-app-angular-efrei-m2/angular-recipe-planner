import { createFeatureSelector, createSelector } from "@ngrx/store";
import type { AuthState } from "./auth.reducer";
import { authFeatureKey } from "./auth.reducer";

/**
 * Auth Selectors - Extract specific pieces of state from the store
 *
 * Selectors are pure functions that:
 * 1. Take the global state as input
 * 2. Return a specific piece of state
 * 3. Are memoized for performance (only recompute when inputs change)
 */

/**
 * Feature Selector - Selects the entire auth state slice
 *
 * This is the root selector that all other selectors build upon
 */
export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

/**
 * Select the current user
 *
 * @returns User object or null if not logged in
 */
export const selectUser = createSelector(selectAuthState, (state: AuthState) => state.user);

/**
 * Select the authentication token
 *
 * @returns JWT token string or null
 */
export const selectAuthToken = createSelector(selectAuthState, (state: AuthState) => state.token);

/**
 * Select authentication status
 *
 * @returns true if user is authenticated, false otherwise
 */
export const selectIsAuthenticated = createSelector(selectAuthState, (state: AuthState) => state.isAuthenticated);

/**
 * Select loading status
 *
 * @returns true if an auth operation is in progress
 */
export const selectAuthLoading = createSelector(selectAuthState, (state: AuthState) => state.loading);

/**
 * Select error message
 *
 * @returns Error message string or null
 */
export const selectAuthError = createSelector(selectAuthState, (state: AuthState) => state.error);

/**
 * Select user email (derived selector)
 *
 * Composes the selectUser selector to extract just the email
 *
 * @returns User's email or null
 */
export const selectUserEmail = createSelector(selectUser, (user) => user?.email ?? null);

/**
 * Select user ID (derived selector)
 *
 * @returns User's ID or null
 */
export const selectUserId = createSelector(selectUser, (user) => user?.id ?? null);
