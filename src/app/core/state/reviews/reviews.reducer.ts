import { createReducer, on } from "@ngrx/store";
import type { Review } from "@/app/core/services/review.service";
import * as ReviewsActions from "./reviews.actions";

/**
 * Recipe Rating Stats Interface
 */
export interface RecipeRatingStats {
  average: number;
  count: number;
}

/**
 * Reviews State Interface
 *
 * Defines the shape of the reviews state in the store
 * Organized by recipeId for efficient lookups
 */
export interface ReviewsState {
  /** Reviews grouped by recipe ID for efficient access */
  reviewsByRecipe: Map<string, Review[]>;

  /** Reviews grouped by author ID */
  reviewsByAuthor: Map<string, Review[]>;

  /** All reviews indexed by review ID */
  reviewsById: Map<string, Review>;

  /** Rating statistics by recipe ID */
  ratingStatsByRecipe: Map<string, RecipeRatingStats>;

  /** Currently selected review for detail view */
  selectedReview: Review | null;

  /** Loading state for async operations */
  loading: boolean;

  /** Error message from failed operations */
  error: string | null;

  /** IDs of recipes whose reviews have been loaded */
  loadedRecipeIds: Set<string>;
}

/**
 * Initial State
 *
 * The default state when the app first loads
 */
export const initialState: ReviewsState = {
  reviewsByRecipe: new Map(),
  reviewsByAuthor: new Map(),
  reviewsById: new Map(),
  ratingStatsByRecipe: new Map(),
  selectedReview: null,
  loading: false,
  error: null,
  loadedRecipeIds: new Set(),
};

/**
 * Reviews Reducer
 *
 * Pure function that takes the current state and an action,
 * and returns a new state based on that action.
 */
export const reviewsReducer = createReducer(
  initialState,

  /**
   * Load Reviews By Recipe ID Action Handler
   * Sets loading to true and clears any previous errors
   */
  on(ReviewsActions.loadReviewsByRecipeId, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Load Reviews By Recipe ID Success Action Handler
   * Stores reviews for the recipe and updates indexes
   */
  on(ReviewsActions.loadReviewsByRecipeIdSuccess, (state, { recipeId, reviews }) => {
    const newReviewsByRecipe = new Map(state.reviewsByRecipe);
    const newReviewsById = new Map(state.reviewsById);
    const newLoadedRecipeIds = new Set(state.loadedRecipeIds);

    // Store reviews for this recipe
    newReviewsByRecipe.set(recipeId, reviews);

    // Index reviews by ID for quick lookup
    reviews.forEach((review) => {
      newReviewsById.set(review.id, review);
    });

    // Mark this recipe as loaded
    newLoadedRecipeIds.add(recipeId);

    return {
      ...state,
      reviewsByRecipe: newReviewsByRecipe,
      reviewsById: newReviewsById,
      loadedRecipeIds: newLoadedRecipeIds,
      loading: false,
      error: null,
    };
  }),

  /**
   * Load Reviews By Recipe ID Failure Action Handler
   * Sets error message and clears loading state
   */
  on(ReviewsActions.loadReviewsByRecipeIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Load Reviews By Author ID Action Handler
   */
  on(ReviewsActions.loadReviewsByAuthorId, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Load Reviews By Author ID Success Action Handler
   */
  on(ReviewsActions.loadReviewsByAuthorIdSuccess, (state, { authorId, reviews }) => {
    const newReviewsByAuthor = new Map(state.reviewsByAuthor);
    const newReviewsById = new Map(state.reviewsById);

    // Store reviews for this author
    newReviewsByAuthor.set(authorId, reviews);

    // Index reviews by ID
    reviews.forEach((review) => {
      newReviewsById.set(review.id, review);
    });

    return {
      ...state,
      reviewsByAuthor: newReviewsByAuthor,
      reviewsById: newReviewsById,
      loading: false,
      error: null,
    };
  }),

  /**
   * Load Reviews By Author ID Failure Action Handler
   */
  on(ReviewsActions.loadReviewsByAuthorIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Load Review By ID Action Handler
   */
  on(ReviewsActions.loadReviewById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Load Review By ID Success Action Handler
   */
  on(ReviewsActions.loadReviewByIdSuccess, (state, { review }) => {
    const newReviewsById = new Map(state.reviewsById);
    newReviewsById.set(review.id, review);

    return {
      ...state,
      reviewsById: newReviewsById,
      selectedReview: review,
      loading: false,
      error: null,
    };
  }),

  /**
   * Load Review By ID Failure Action Handler
   */
  on(ReviewsActions.loadReviewByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Create Review Action Handler
   * Sets loading to true for review creation
   */
  on(ReviewsActions.createReview, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Create Review Success Action Handler
   * Adds new review to the appropriate recipe and indexes
   */
  on(ReviewsActions.createReviewSuccess, (state, { review }) => {
    const newReviewsByRecipe = new Map(state.reviewsByRecipe);
    const newReviewsById = new Map(state.reviewsById);

    // Add review to recipe's review list
    const recipeReviews = newReviewsByRecipe.get(review.recipeId) || [];
    newReviewsByRecipe.set(review.recipeId, [...recipeReviews, review]);

    // Index review by ID
    newReviewsById.set(review.id, review);

    return {
      ...state,
      reviewsByRecipe: newReviewsByRecipe,
      reviewsById: newReviewsById,
      loading: false,
      error: null,
    };
  }),

  /**
   * Create Review Failure Action Handler
   */
  on(ReviewsActions.createReviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Update Review Action Handler
   */
  on(ReviewsActions.updateReview, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Update Review Success Action Handler
   * Updates the review in all indexes
   */
  on(ReviewsActions.updateReviewSuccess, (state, { review }) => {
    const newReviewsByRecipe = new Map(state.reviewsByRecipe);
    const newReviewsById = new Map(state.reviewsById);

    // Update review in recipe's review list
    const recipeReviews = newReviewsByRecipe.get(review.recipeId) || [];
    newReviewsByRecipe.set(
      review.recipeId,
      recipeReviews.map((r) => (r.id === review.id ? review : r)),
    );

    // Update review in ID index
    newReviewsById.set(review.id, review);

    return {
      ...state,
      reviewsByRecipe: newReviewsByRecipe,
      reviewsById: newReviewsById,
      selectedReview: state.selectedReview?.id === review.id ? review : state.selectedReview,
      loading: false,
      error: null,
    };
  }),

  /**
   * Update Review Failure Action Handler
   */
  on(ReviewsActions.updateReviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Delete Review Action Handler
   */
  on(ReviewsActions.deleteReview, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Delete Review Success Action Handler
   * Removes the review from all indexes
   */
  on(ReviewsActions.deleteReviewSuccess, (state, { id, recipeId }) => {
    const newReviewsByRecipe = new Map(state.reviewsByRecipe);
    const newReviewsById = new Map(state.reviewsById);

    // Remove review from recipe's review list
    const recipeReviews = newReviewsByRecipe.get(recipeId) || [];
    newReviewsByRecipe.set(
      recipeId,
      recipeReviews.filter((r) => r.id !== id),
    );

    // Remove review from ID index
    newReviewsById.delete(id);

    return {
      ...state,
      reviewsByRecipe: newReviewsByRecipe,
      reviewsById: newReviewsById,
      selectedReview: state.selectedReview?.id === id ? null : state.selectedReview,
      loading: false,
      error: null,
    };
  }),

  /**
   * Delete Review Failure Action Handler
   */
  on(ReviewsActions.deleteReviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Calculate Average Rating Action Handler
   */
  on(ReviewsActions.calculateAverageRating, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Calculate Average Rating Success Action Handler
   * Stores rating statistics for the recipe
   */
  on(ReviewsActions.calculateAverageRatingSuccess, (state, { recipeId, average, count }) => {
    const newRatingStatsByRecipe = new Map(state.ratingStatsByRecipe);
    newRatingStatsByRecipe.set(recipeId, { average, count });

    return {
      ...state,
      ratingStatsByRecipe: newRatingStatsByRecipe,
      loading: false,
      error: null,
    };
  }),

  /**
   * Calculate Average Rating Failure Action Handler
   */
  on(ReviewsActions.calculateAverageRatingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Clear Reviews Action Handler
   * Resets state to initial values
   */
  on(ReviewsActions.clearReviews, () => ({
    ...initialState,
  })),

  /**
   * Clear Reviews For Recipe Action Handler
   * Removes reviews for a specific recipe
   */
  on(ReviewsActions.clearReviewsForRecipe, (state, { recipeId }) => {
    const newReviewsByRecipe = new Map(state.reviewsByRecipe);
    const newLoadedRecipeIds = new Set(state.loadedRecipeIds);
    const newRatingStatsByRecipe = new Map(state.ratingStatsByRecipe);

    newReviewsByRecipe.delete(recipeId);
    newLoadedRecipeIds.delete(recipeId);
    newRatingStatsByRecipe.delete(recipeId);

    return {
      ...state,
      reviewsByRecipe: newReviewsByRecipe,
      loadedRecipeIds: newLoadedRecipeIds,
      ratingStatsByRecipe: newRatingStatsByRecipe,
    };
  }),
);

/**
 * Feature Key for the Reviews State
 * Used when registering the reducer in the store
 */
export const reviewsFeatureKey = "reviews";
