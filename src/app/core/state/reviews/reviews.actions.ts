import { createAction, props } from "@ngrx/store";
import type { Review } from "@/app/core/services/review.service";

/**
 * Review Actions - Define all review-related actions
 *
 * NgRx follows the Redux pattern:
 * Component/Service → Dispatch Action → Reducer → New State → Selectors
 *
 * Action naming convention: [Source] Event
 * - [Source]: Where the action originated (e.g., Reviews, Recipe Detail)
 * - Event: What happened (e.g., Load Reviews, Create Review)
 */

/**
 * Load Reviews By Recipe ID Action - Dispatched when reviews for a recipe need to be loaded
 */
export const loadReviewsByRecipeId = createAction("[Reviews] Load Reviews By Recipe ID", props<{ recipeId: string }>());

/**
 * Load Reviews By Recipe ID Success Action - Dispatched when reviews are loaded successfully
 */
export const loadReviewsByRecipeIdSuccess = createAction("[Reviews] Load Reviews By Recipe ID Success", props<{ recipeId: string; reviews: Review[] }>());

/**
 * Load Reviews By Recipe ID Failure Action - Dispatched when loading reviews fails
 */
export const loadReviewsByRecipeIdFailure = createAction("[Reviews] Load Reviews By Recipe ID Failure", props<{ error: string }>());

/**
 * Load Reviews By Author ID Action - Dispatched when reviews by an author need to be loaded
 */
export const loadReviewsByAuthorId = createAction("[Reviews] Load Reviews By Author ID", props<{ authorId: string }>());

/**
 * Load Reviews By Author ID Success Action - Dispatched when author reviews are loaded successfully
 */
export const loadReviewsByAuthorIdSuccess = createAction("[Reviews] Load Reviews By Author ID Success", props<{ authorId: string; reviews: Review[] }>());

/**
 * Load Reviews By Author ID Failure Action - Dispatched when loading author reviews fails
 */
export const loadReviewsByAuthorIdFailure = createAction("[Reviews] Load Reviews By Author ID Failure", props<{ error: string }>());

/**
 * Load Review By ID Action - Dispatched when a single review needs to be loaded
 */
export const loadReviewById = createAction("[Reviews] Load Review By ID", props<{ id: string }>());

/**
 * Load Review By ID Success Action - Dispatched when single review is loaded successfully
 */
export const loadReviewByIdSuccess = createAction("[Reviews] Load Review By ID Success", props<{ review: Review }>());

/**
 * Load Review By ID Failure Action - Dispatched when loading single review fails
 */
export const loadReviewByIdFailure = createAction("[Reviews] Load Review By ID Failure", props<{ error: string }>());

/**
 * Create Review Action - Dispatched when a new review needs to be created
 */
export const createReview = createAction(
  "[Reviews] Create Review",
  props<{
    review: {
      recipeId: string;
      authorId: string;
      rating: number;
      comment: string;
    };
  }>(),
);

/**
 * Create Review Success Action - Dispatched when review is created successfully
 */
export const createReviewSuccess = createAction("[Reviews] Create Review Success", props<{ review: Review }>());

/**
 * Create Review Failure Action - Dispatched when creating review fails
 */
export const createReviewFailure = createAction("[Reviews] Create Review Failure", props<{ error: string }>());

/**
 * Update Review Action - Dispatched when an existing review needs to be updated
 */
export const updateReview = createAction("[Reviews] Update Review", props<{ id: string; review: Partial<Review> }>());

/**
 * Update Review Success Action - Dispatched when review is updated successfully
 */
export const updateReviewSuccess = createAction("[Reviews] Update Review Success", props<{ review: Review }>());

/**
 * Update Review Failure Action - Dispatched when updating review fails
 */
export const updateReviewFailure = createAction("[Reviews] Update Review Failure", props<{ error: string }>());

/**
 * Delete Review Action - Dispatched when a review needs to be deleted
 */
export const deleteReview = createAction("[Reviews] Delete Review", props<{ id: string }>());

/**
 * Delete Review Success Action - Dispatched when review is deleted successfully
 */
export const deleteReviewSuccess = createAction("[Reviews] Delete Review Success", props<{ id: string; recipeId: string }>());

/**
 * Delete Review Failure Action - Dispatched when deleting review fails
 */
export const deleteReviewFailure = createAction("[Reviews] Delete Review Failure", props<{ error: string }>());

/**
 * Calculate Average Rating Action - Dispatched when average rating needs to be calculated
 */
export const calculateAverageRating = createAction("[Reviews] Calculate Average Rating", props<{ recipeId: string }>());

/**
 * Calculate Average Rating Success Action - Dispatched when average rating is calculated successfully
 */
export const calculateAverageRatingSuccess = createAction(
  "[Reviews] Calculate Average Rating Success",
  props<{ recipeId: string; average: number; count: number }>(),
);

/**
 * Calculate Average Rating Failure Action - Dispatched when calculating average rating fails
 */
export const calculateAverageRatingFailure = createAction("[Reviews] Calculate Average Rating Failure", props<{ error: string }>());

/**
 * Clear Reviews Action - Dispatched when reviews need to be cleared (e.g., on logout)
 */
export const clearReviews = createAction("[Reviews] Clear Reviews");

/**
 * Clear Reviews For Recipe Action - Dispatched when reviews for a specific recipe need to be cleared
 */
export const clearReviewsForRecipe = createAction("[Reviews] Clear Reviews For Recipe", props<{ recipeId: string }>());
