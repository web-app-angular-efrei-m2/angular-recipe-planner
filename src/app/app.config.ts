import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { type ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { authInterceptor } from "./core/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(), // Enable HttpClient with fetch API
      withInterceptors([authInterceptor]), // Register the auth interceptor
    ),
  ],
};
