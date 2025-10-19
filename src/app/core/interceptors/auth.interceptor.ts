import type { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@/app/core/services/auth";

/**
 * Auth Interceptor - Adds Authorization header to outgoing HTTP requests
 *
 * This functional interceptor automatically attaches the JWT token from AuthService
 * to all HTTP requests that require authentication.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject AuthService using the inject() function
  const authService = inject(AuthService);

  // Retrieve the authentication token
  const token = authService.getToken();

  // If no token exists, forward the original request unchanged
  if (!token) {
    console.log("🔓 No token found, forwarding request without Authorization header");
    return next(req);
  }

  // Clone the request and add the Authorization header
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("🔐 Token found, adding Authorization header:", `Bearer ${token.substring(0, 20)}...`);

  // Forward the cloned request with the Authorization header
  return next(clonedRequest);
};
