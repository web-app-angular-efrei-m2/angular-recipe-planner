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

  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Observable to expose authentication state for the Guard and components to subscribe to
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  /**
   * Simulates user login.
   * In a real app, this would call an API and store tokens.
   *
   * @param _email - User email (unused for now, prefixed with _ to indicate intentional)
   * @param _password - User password (unused for now, prefixed with _ to indicate intentional)
   * @returns Observable<boolean> - true if login successful
   */
  login(_email: string, _password: string) {
    // TODO: Replace with actual API call
    // For now, simulate successful login
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
          // Automatically mark user as authenticated after successful registration
          this.isAuthenticatedSubject.next(true);
        }),
        // Handle errors reactively
        catchError(this.handleError),
      );
  }

  /**
   * Logs out the user by clearing authentication state.
   *
   * @returns Observable<boolean> - true when logout complete
   */
  logout() {
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
