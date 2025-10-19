import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { type ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";

import { routes } from "./app.routes";
import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { authFeatureKey, authReducer } from "./core/state/auth/auth.reducer";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(), // Enable HttpClient with fetch API
      withInterceptors([authInterceptor]), // Register the auth interceptor
    ),
    // NgRx Store Configuration
    provideStore({
      [authFeatureKey]: authReducer, // Register auth reducer
    }),
    // NgRx DevTools (only in development)
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode in production
      autoPause: true, // Pauses recording actions when the extension window is not open
      trace: false, // Include stack trace for every action
      traceLimit: 75, // Maximum stack trace frames to be stored
    }),
  ],
};
