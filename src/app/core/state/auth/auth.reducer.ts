import { createReducer, on } from "@ngrx/store";
import type { User } from "@/app/core/services/auth";
import * as AuthActions from "./auth.actions";

/**
 * Auth State Interface
 *
 * Defines the shape of the authentication state in the store
 */
export interface AuthState {
  /** The currently authenticated user, or null if not logged in */
  user: User | null;

  /** The JWT token for API authentication, or null if not logged in */
  token: string | null;

  /** Whether the user is authenticated */
  isAuthenticated: boolean;

  /** Loading state for async operations (login, register) */
  loading: boolean;

  /** Error message from failed operations */
  error: string | null;
}

/**
 * Initial State
 *
 * The default state when the app first loads
 * Will be updated by loadUserFromStorage action if token exists
 */
export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/**
 * Pure function that takes the current state and an action,
 * and returns a new state based on that action.
 */
export const authReducer = createReducer(
  initialState,

  /**
   * Login Action Handler
   * Sets loading to true and clears any previous errors
   */
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Login Success Action Handler
   * Updates state with user and token, sets authenticated to true
   *
   * This is where the actual authentication state change happens!
   */
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  /**
   * Login Failure Action Handler
   * Sets error message and clears loading state
   */
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  /**
   * Register Action Handler
   * Sets loading to true and clears any previous errors
   */
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Register Success Action Handler
   * Updates state with new user and token, sets authenticated to true
   */
  on(AuthActions.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  /**
   * Register Failure Action Handler
   * Sets error message and clears loading state
   */
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  /**
   * Logout Action Handler
   * Resets state to initial values (user logged out)
   */
  on(AuthActions.logout, () => ({
    ...initialState,
  })),

  /**
   * Load User From Storage Success Handler
   * Restores user state from localStorage on app initialization
   */
  on(AuthActions.loadUserFromStorageSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
  })),
);

/**
 * Feature Key for the Auth State
 * Used when registering the reducer in the store
 */
export const authFeatureKey = "auth";
