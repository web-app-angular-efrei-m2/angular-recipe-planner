import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, type Observable, throwError } from "rxjs";
import type { User } from "./auth";

/**
 * User Service - Handles user-related operations
 *
 * Demonstrates:
 * - HTTP GET to fetch user data
 * - Integration with JSON Server
 * - Error handling
 */
@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = "http://localhost:3000";

  /**
   * Get a user by ID
   * @param userId - The ID of the user to fetch
   * @returns Observable<User> - The user data
   */
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${userId}`).pipe(catchError(this.handleError));
  }

  /**
   * Get multiple users by their IDs
   * @param userIds - Array of user IDs to fetch
   * @returns Observable<User[]> - Array of user data
   */
  getUsersByIds(userIds: string[]): Observable<User[]> {
    // Create query string: ?id=1&id=2&id=3
    const params = userIds.map((id) => `id=${id}`).join("&");
    return this.http.get<User[]>(`${this.API_URL}/users?${params}`).pipe(catchError(this.handleError));
  }

  /**
   * Get all users
   * @returns Observable<User[]> - Array of all users
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`).pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors
   * @param error - The HTTP error response
   * @returns An observable with the error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "An unknown error occurred!";

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error (Status ${error.status}): ${error.message}`;
    }

    console.error("❌ UserService Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
