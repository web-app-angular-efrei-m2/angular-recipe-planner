import type { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectAuthToken } from "@/app/core/state/auth/auth.selectors";

/**
 * Auth Interceptor - Adds Authorization header to outgoing HTTP requests
 *
 * This functional interceptor automatically attaches the JWT token from NgRx Store
 * to all HTTP requests that require authentication.
 *
 * Note: This is a synchronous interceptor. The token must be available in the Store
 * at the time of the request. For async token retrieval, consider using switchMap.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Synchronously get the current token from the Store
  // Note: This assumes the token is already loaded in the Store
  let token: string | null = null;
  const subscription = store.select(selectAuthToken).subscribe((t) => {
    token = t;
  });
  subscription.unsubscribe();

  // If no token exists, forward the original request unchanged
  if (!token) {
    console.log("🔓 No token found, forwarding request without Authorization header");
    return next(req);
  }

  // TypeScript type narrowing - token is now definitely a string
  const authToken: string = token;

  // Clone the request and add the Authorization header
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const tokenPreview = authToken.length > 20 ? `${authToken.substring(0, 20)}...` : authToken;
  console.log("🔐 Token found, adding Authorization header:", `Bearer ${tokenPreview}`);

  // Forward the cloned request with the Authorization header
  return next(clonedRequest);
};
