import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, map, Observable, of, switchMap, throwError } from "rxjs";
import type { User } from "./auth";
import { UserService } from "./user.service";

/**
 * Review Interface (from database - with authorId)
 */
interface ReviewRaw {
  id: string;
  recipeId: string;
  authorId: string;
  rating: number;
  comment: string;
  createdAt: number;
}

/**
 * Review Interface (with populated author)
 */
export interface Review extends Omit<ReviewRaw, "authorId"> {
  author: User;
}

/**
 * Review Service - Handles CRUD operations for recipe reviews
 *
 * Demonstrates:
 * - HTTP POST to create reviews
 * - HTTP GET to fetch reviews
 * - Integration with JSON Server
 * - Error handling
 */
@Injectable({
  providedIn: "root",
})
export class ReviewService {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private readonly API_URL = "http://localhost:3000";

  /**
   * Create a new review
   *
   * @param review - Review data (without id and createdAt)
   * @returns Observable<Review> - Created review with ID, timestamp, and author data
   */
  createReview(review: Omit<ReviewRaw, "id" | "createdAt">): Observable<Review> {
    const now = Date.now();

    console.log("🌐 POST /reviews", { ...review, createdAt: now });

    return this.http.post<ReviewRaw>(`${this.API_URL}/reviews`, { ...review, createdAt: now }).pipe(
      switchMap(({ authorId, ...createdReview }) => {
        // Fetch the author data for the created review
        return this.userService.getUserById(authorId).pipe(map((author) => ({ ...createdReview, author })));
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Get all reviews for a specific recipe
   *
   * @param recipeId - Recipe ID
   * @returns Observable<Review[]> - Array of reviews for the recipe with author data
   */
  getReviewsByRecipeId(recipeId: string): Observable<Review[]> {
    console.log(`🌐 GET /reviews?recipeId=${recipeId}`);

    return this.http.get<ReviewRaw[]>(`${this.API_URL}/reviews?recipeId=${recipeId}`).pipe(
      switchMap((reviews) => {
        if (reviews.length === 0) {
          return of([]);
        }

        // Get unique author IDs
        const authorIds = [...new Set(reviews.map((r) => r.authorId))];

        // Fetch all authors
        return this.userService.getUsersByIds(authorIds).pipe(
          map((authors) => {
            // Create a map of authorId -> User
            const authorMap = new Map<string, User>();
            for (const author of authors) {
              authorMap.set(author.id, author);
            }

            // Combine reviews with their authors
            return reviews.map((review) => ({ ...review, author: authorMap.get(review.authorId) as User }));
          }),
        );
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Get all reviews by a specific author
   *
   * @param authorId - Author/User ID
   * @returns Observable<Review[]> - Array of reviews by the author with author data
   */
  getReviewsByAuthorId(authorId: string): Observable<Review[]> {
    console.log(`🌐 GET /reviews?authorId=${authorId}`);

    return this.http.get<ReviewRaw[]>(`${this.API_URL}/reviews?authorId=${authorId}`).pipe(
      switchMap((reviews) => {
        if (reviews.length === 0) {
          return of([]);
        }

        // Fetch the author data
        return this.userService.getUserById(authorId).pipe(
          map((author) => {
            // Combine all reviews with the author
            return reviews.map((review) => ({ ...review, author }));
          }),
        );
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Get a single review by ID
   *
   * @param id - Review ID
   * @returns Observable<Review> - Single review with author data
   */
  getReviewById(id: string): Observable<Review> {
    console.log(`🌐 GET /reviews/${id}`);

    return this.http.get<ReviewRaw>(`${this.API_URL}/reviews/${id}`).pipe(
      switchMap((review) => {
        // Fetch the author data for the review
        return this.userService.getUserById(review.authorId).pipe(map((author) => ({ ...review, author })));
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Update an existing review
   *
   * @param id - Review ID
   * @param review - Updated review data
   * @returns Observable<Review> - Updated review
   */
  updateReview(id: string, review: Partial<Review>): Observable<Review> {
    console.log(`🌐 PATCH /reviews/${id}`, review);

    return this.http.patch<Review>(`${this.API_URL}/reviews/${id}`, review).pipe(catchError(this.handleError));
  }

  /**
   * Delete a review
   *
   * @param id - Review ID
   * @returns Observable<void>
   */
  deleteReview(id: string): Observable<void> {
    console.log(`🌐 DELETE /reviews/${id}`);

    return this.http.delete<void>(`${this.API_URL}/reviews/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Calculate average rating for a recipe
   *
   * @param recipeId - Recipe ID
   * @returns Observable with average rating and count
   */
  getAverageRating(recipeId: string): Observable<{ average: number; count: number }> {
    return new Observable((observer) => {
      this.getReviewsByRecipeId(recipeId).subscribe({
        next: (reviews) => {
          if (reviews.length === 0) {
            observer.next({ average: 0, count: 0 });
            observer.complete();
            return;
          }

          const total = reviews.reduce((sum, review) => sum + review.rating, 0);
          const average = total / reviews.length;

          observer.next({
            average: Math.round(average * 10) / 10, // Round to 1 decimal
            count: reviews.length,
          });
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }

  /**
   * Handle HTTP errors
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

    console.error("❌ ReviewService Error:", errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
