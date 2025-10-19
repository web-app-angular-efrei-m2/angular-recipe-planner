import { createAction, props } from "@ngrx/store";
import type { User, UserCredentials } from "@/app/core/services/auth";

/**
 * Auth Actions - Define all authentication-related actions
 *
 * NgRx follows the Redux pattern:
 * Component/Service → Dispatch Action → Reducer → New State → Selectors
 *
 * Action naming convention: [Source] Event
 * - [Source]: Where the action originated (e.g., Auth, Login Page)
 * - Event: What happened (e.g., Login, Login Success, Logout)
 */

/**
 * Login Action - Dispatched when user attempts to login.
 */
export const login = createAction("[Auth] Login", props<UserCredentials>());

/**
 * Login Success Action - Dispatched when login is successful.
 */
export const loginSuccess = createAction("[Auth] Login Success", props<{ user: User; token: string }>());

/**
 * Login Failure Action - Dispatched when login fails.
 */
export const loginFailure = createAction("[Auth] Login Failure", props<{ error: string }>());

/**
 * Register Action - Dispatched when user attempts to register.
 */
export const register = createAction("[Auth] Register", props<UserCredentials>());

/**
 * Register Success Action - Dispatched when registration is successful.
 */
export const registerSuccess = createAction("[Auth] Register Success", props<{ user: User; token: string }>());

/**
 * Register Failure Action - Dispatched when registration fails.
 */
export const registerFailure = createAction("[Auth] Register Failure", props<{ error: string }>());

/**
 * Logout Action - Dispatched when user logs out.
 */
export const logout = createAction("[Auth] Logout");

/**
 * Load User From Storage Action - Dispatched on app init.
 *
 * Checks localStorage for existing token and loads user data if found.
 */
export const loadUserFromStorage = createAction("[Auth] Load User From Storage");

/**
 * Load User From Storage Success Action.
 */
export const loadUserFromStorageSuccess = createAction("[Auth] Load User From Storage Success", props<{ user: User; token: string }>());
