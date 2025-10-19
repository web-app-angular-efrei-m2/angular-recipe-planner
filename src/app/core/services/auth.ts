import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, catchError, type Observable, tap, throwError } from "rxjs";

/**
 * Interface for user credentials
 */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * Interface for user data returned from the server
 */
export interface User {
  id: string;
  email: string;
  password: string;
  createdAt?: number;
  updatedAt?: number;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);

  // JSON Server URL (runs on port 3000)
  private readonly API_URL = "http://localhost:3000";

  // LocalStorage key for token
  private readonly TOKEN_KEY = "auth_token";

  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  // Observable to expose authentication state for the Guard and components to subscribe to
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  /**
   * Check if a token exists in localStorage on service initialization
   */
  private hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Simulates user login and stores token.
   * In a real app, this would call an API endpoint that returns a JWT token.
   *
   * @param email - User email
   * @param password - User password
   * @returns void
   */
  login(email: string, _password: string) {
    // TODO: Replace with actual API call that returns a token
    // For now, simulate successful login with a fake token
    const fakeToken = `fake-jwt-token-${Date.now()}-${email}`;

    console.log("🔐 Login successful, storing token:", fakeToken);

    // Store token in localStorage
    this.setToken(fakeToken);

    // Update authentication state
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Registers a new user by making an HTTP POST request to JSON Server.
   *
   * @param userCredentials - Object containing email and password
   * @returns Observable<User> - The created user object from the server
   */
  register(userCredentials: UserCredentials): Observable<User> {
    const now = Date.now();
    // POST to /users endpoint on JSON Server (port 3000)
    return this.http
      .post<User>(`${this.API_URL}/users`, {
        ...userCredentials,
        createdAt: now,
        updatedAt: now,
      })
      .pipe(
        tap((user) => {
          console.log("✅ User registered successfully:", user);

          // Generate a fake token for the registered user
          // In a real app, the backend would return this token
          const fakeToken = `fake-jwt-token-${Date.now()}-${user.email}`;

          console.log("🔐 Storing token for registered user:", fakeToken);

          // Store token in localStorage
          this.setToken(fakeToken);

          // Automatically mark user as authenticated after successful registration
          this.isAuthenticatedSubject.next(true);
        }),
        // Handle errors reactively
        catchError(this.handleError),
      );
  }

  /**
   * Retrieves the stored authentication token.
   *
   * @returns The token string if it exists, or null
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Stores the authentication token in localStorage.
   *
   * @param token - The JWT token to store
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Clears the stored token from localStorage.
   */
  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Logs out the user by clearing authentication state and stored token.
   */
  logout(): void {
    console.log("🚪 Logging out, clearing token...");

    // Clear token from localStorage
    this.clearToken();

    // Reset authentication state
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Handles HTTP errors.
   * @param error - The HTTP error response
   * @returns An observable with the error message
   */
  private handleError(error: HttpErrorResponse) {
    // Basic error handling for a training project
    let errorMessage = "An unknown error occurred!";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error (Status ${error.status}): ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
