import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { ReviewService } from "@/app/core/services/review.service";
import * as ReviewsActions from "./reviews.actions";

/**
 * Reviews Effects - Handle side effects for review actions
 *
 * Effects are where we handle:
 * - API calls
 * - Side effects (logging, analytics, etc.)
 * - Complex async operations
 *
 * Pattern: Action → Effect → API Call → Success/Failure Action → Reducer
 */
@Injectable()
export class ReviewsEffects {
  private actions$ = inject(Actions);
  private reviewService = inject(ReviewService);

  /**
   * Load Reviews By Recipe ID Effect
   *
   * Flow:
   * 1. Listens for [Reviews] Load Reviews By Recipe ID action
   * 2. Calls ReviewService.getReviewsByRecipeId() (HTTP GET)
   * 3. Dispatches [Reviews] Load Reviews By Recipe ID Success with reviews
   * 4. If error occurs, dispatches [Reviews] Load Reviews By Recipe ID Failure
   *
   * Note: Uses mergeMap to allow multiple concurrent requests (for loading reviews for multiple recipes)
   */
  loadReviewsByRecipeId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadReviewsByRecipeId),
      mergeMap(({ recipeId }) =>
        this.reviewService.getReviewsByRecipeId(recipeId).pipe(
          map((reviews) => {
            console.log(`🎯 Effect: Loaded ${reviews.length} reviews for recipe ${recipeId}`);
            return ReviewsActions.loadReviewsByRecipeIdSuccess({ recipeId, reviews });
          }),
          catchError((error) => {
            console.error(`❌ Effect: Failed to load reviews for recipe ${recipeId}:`, error.message);
            return of(ReviewsActions.loadReviewsByRecipeIdFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Load Reviews By Author ID Effect
   *
   * Flow:
   * 1. Listens for [Reviews] Load Reviews By Author ID action
   * 2. Calls ReviewService.getReviewsByAuthorId() (HTTP GET)
   * 3. Dispatches [Reviews] Load Reviews By Author ID Success with reviews
   * 4. If error occurs, dispatches [Reviews] Load Reviews By Author ID Failure
   */
  loadReviewsByAuthorId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadReviewsByAuthorId),
      switchMap(({ authorId }) =>
        this.reviewService.getReviewsByAuthorId(authorId).pipe(
          map((reviews) => {
            console.log(`🎯 Effect: Loaded ${reviews.length} reviews by author ${authorId}`);
            return ReviewsActions.loadReviewsByAuthorIdSuccess({ authorId, reviews });
          }),
          catchError((error) => {
            console.error(`❌ Effect: Failed to load reviews by author ${authorId}:`, error.message);
            return of(ReviewsActions.loadReviewsByAuthorIdFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Load Review By ID Effect
   *
   * Flow:
   * 1. Listens for [Reviews] Load Review By ID action
   * 2. Calls ReviewService.getReviewById() (HTTP GET)
   * 3. Dispatches [Reviews] Load Review By ID Success with review
   * 4. If error occurs, dispatches [Reviews] Load Review By ID Failure
   */
  loadReviewById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadReviewById),
      switchMap(({ id }) =>
        this.reviewService.getReviewById(id).pipe(
          map((review) => {
            console.log(`🎯 Effect: Loaded review ${id} successfully`);
            return ReviewsActions.loadReviewByIdSuccess({ review });
          }),
          catchError((error) => {
            console.error(`❌ Effect: Failed to load review ${id}:`, error.message);
            return of(ReviewsActions.loadReviewByIdFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Create Review Effect
   *
   * Flow:
   * 1. Listens for [Reviews] Create Review action
   * 2. Calls ReviewService.createReview() (HTTP POST)
   * 3. Dispatches [Reviews] Create Review Success with created review
   * 4. If error occurs, dispatches [Reviews] Create Review Failure
   */
  createReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.createReview),
      switchMap(({ review }) =>
        this.reviewService.createReview(review).pipe(
          map((createdReview) => {
            console.log(`🎯 Effect: Created review for recipe ${review.recipeId} successfully`);
            return ReviewsActions.createReviewSuccess({ review: createdReview });
          }),
          catchError((error) => {
            console.error("❌ Effect: Failed to create review:", error.message);
            return of(ReviewsActions.createReviewFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Update Review Effect
   *
   * Flow:
   * 1. Listens for [Reviews] Update Review action
   * 2. Calls ReviewService.updateReview() (HTTP PATCH)
   * 3. Dispatches [Reviews] Update Review Success with updated review
   * 4. If error occurs, dispatches [Reviews] Update Review Failure
   */
  updateReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.updateReview),
      switchMap(({ id, review }) =>
        this.reviewService.updateReview(id, review).pipe(
          map((updatedReview) => {
            console.log(`🎯 Effect: Updated review ${id} successfully`);
            return ReviewsActions.updateReviewSuccess({ review: updatedReview });
          }),
          catchError((error) => {
            console.error(`❌ Effect: Failed to update review ${id}:`, error.message);
            return of(ReviewsActions.updateReviewFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Delete Review Effect
   *
   * Flow:
   * 1. Listens for [Reviews] Delete Review action
   * 2. Calls ReviewService.deleteReview() (HTTP DELETE)
   * 3. Dispatches [Reviews] Delete Review Success with review ID
   * 4. If error occurs, dispatches [Reviews] Delete Review Failure
   *
   * Note: We need the recipeId to update the state correctly, so we'll need to
   * get it from the state before deleting. For now, we'll pass it as part of the action.
   */
  deleteReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.deleteReview),
      switchMap(({ id }) =>
        this.reviewService.deleteReview(id).pipe(
          map(() => {
            console.log(`🎯 Effect: Deleted review ${id} successfully`);
            // Note: In a real app, we'd get the recipeId from the review before deleting
            // For now, we'll need to pass it as part of the delete action
            return ReviewsActions.deleteReviewSuccess({ id, recipeId: "" });
          }),
          catchError((error) => {
            console.error(`❌ Effect: Failed to delete review ${id}:`, error.message);
            return of(ReviewsActions.deleteReviewFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Calculate Average Rating Effect
   *
   * Flow:
   * 1. Listens for [Reviews] Calculate Average Rating action
   * 2. Calls ReviewService.getAverageRating()
   * 3. Dispatches [Reviews] Calculate Average Rating Success with stats
   * 4. If error occurs, dispatches [Reviews] Calculate Average Rating Failure
   */
  calculateAverageRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.calculateAverageRating),
      switchMap(({ recipeId }) =>
        this.reviewService.getAverageRating(recipeId).pipe(
          map(({ average, count }) => {
            console.log(`🎯 Effect: Calculated average rating for recipe ${recipeId}: ${average} (${count} reviews)`);
            return ReviewsActions.calculateAverageRatingSuccess({ recipeId, average, count });
          }),
          catchError((error) => {
            console.error(`❌ Effect: Failed to calculate average rating for recipe ${recipeId}:`, error.message);
            return of(ReviewsActions.calculateAverageRatingFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * After creating a review, automatically recalculate the average rating
   */
  recalculateRatingAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.createReviewSuccess),
      map(({ review }) => {
        console.log(`🔄 Effect: Recalculating rating after review creation for recipe ${review.recipeId}`);
        return ReviewsActions.calculateAverageRating({ recipeId: review.recipeId });
      }),
    ),
  );

  /**
   * After updating a review, automatically recalculate the average rating
   */
  recalculateRatingAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.updateReviewSuccess),
      map(({ review }) => {
        console.log(`🔄 Effect: Recalculating rating after review update for recipe ${review.recipeId}`);
        return ReviewsActions.calculateAverageRating({ recipeId: review.recipeId });
      }),
    ),
  );

  /**
   * After deleting a review, automatically recalculate the average rating
   */
  recalculateRatingAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.deleteReviewSuccess),
      map(({ recipeId }) => {
        if (recipeId) {
          console.log(`🔄 Effect: Recalculating rating after review deletion for recipe ${recipeId}`);
          return ReviewsActions.calculateAverageRating({ recipeId });
        }
        return { type: "NO_ACTION" };
      }),
    ),
  );

  /**
   * Log success actions for debugging
   */
  logSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ReviewsActions.loadReviewsByRecipeIdSuccess,
          ReviewsActions.loadReviewsByAuthorIdSuccess,
          ReviewsActions.loadReviewByIdSuccess,
          ReviewsActions.createReviewSuccess,
          ReviewsActions.updateReviewSuccess,
          ReviewsActions.deleteReviewSuccess,
          ReviewsActions.calculateAverageRatingSuccess,
        ),
        tap((action) => {
          console.log("✅ Review operation successful:", action.type);
        }),
      ),
    { dispatch: false },
  );
}
