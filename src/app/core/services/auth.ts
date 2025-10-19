import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { catchError, map, type Observable, throwError } from "rxjs";
import * as AuthActions from "@/app/core/state/auth/auth.actions";

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

/**
 * Interface for login response
 */
export interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);
  private store = inject(Store);

  // JSON Server URL (runs on port 3000)
  private readonly API_URL = "http://localhost:3000";

  register(credentials: UserCredentials): void {
    // Dispatch the action that the NgRx Effect is listening for
    this.store.dispatch(AuthActions.register(credentials));
  }

  login(credentials: UserCredentials): void {
    // Dispatch the action that the NgRx Effect is listening for
    this.store.dispatch(AuthActions.login(credentials));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  /**
   * Performs HTTP login by querying users endpoint and validating credentials.
   * @param credentials - User email and password
   * @returns Observable<LoginResponse> - User object and JWT token
   */
  loginHttp(credentials: UserCredentials): Observable<LoginResponse> {
    return this.http.get<User[]>(`${this.API_URL}/users?email=${credentials.email}`).pipe(
      map((users) => {
        // Check if user exists
        if (users.length === 0) {
          throw new Error("Invalid email or password");
        }

        const user = users[0];

        // Generate fake JWT token (in real app, backend returns this)
        const token = `fake-jwt-token-${Date.now()}-${user.email}`;

        console.log("🔐 Login API successful for:", user.email);

        return { user, token };
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Registers a new user by making an HTTP POST request to JSON Server.
   *
   * @param userCredentials - Object containing email and password
   * @returns Observable<LoginResponse> - The created user and generated token
   */
  registerHttp(userCredentials: UserCredentials): Observable<LoginResponse> {
    const now = Date.now();
    // POST to /users endpoint on JSON Server (port 3000)
    return this.http
      .post<User>(`${this.API_URL}/users`, {
        ...userCredentials,
        createdAt: now,
        updatedAt: now,
      })
      .pipe(
        map((user) => {
          console.log("✅ User registered successfully:", user);

          // Generate a fake token for the registered user
          // In a real app, the backend would return this token
          const token = `fake-jwt-token-${Date.now()}-${user.email}`;

          console.log("🔐 Generated token for registered user");

          return { user, token };
        }),
        // Handle errors reactively
        catchError(this.handleError),
      );
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
      errorMessage = `Client Error:\n${error.error.message}`;
    } else if (error.message === "Invalid email or password") {
      errorMessage = "Invalid email or password";
    } else {
      errorMessage = `Server Error (Status ${error.status}):\n${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
