import { createFeatureSelector, createSelector } from "@ngrx/store";
import { type ReviewsState, reviewsFeatureKey } from "./reviews.reducer";

/**
 * Review Selectors - Functions to select slices of state from the store
 *
 * Selectors are:
 * - Memoized: Only recompute when inputs change
 * - Composable: Can be built from other selectors
 * - Testable: Pure functions
 */

/**
 * Feature Selector - Selects the entire reviews state slice
 */
export const selectReviewsState = createFeatureSelector<ReviewsState>(reviewsFeatureKey);

/**
 * Select loading state
 */
export const selectReviewsLoading = createSelector(selectReviewsState, (state) => state.loading);

/**
 * Select error state
 */
export const selectReviewsError = createSelector(selectReviewsState, (state) => state.error);

/**
 * Select selected review
 */
export const selectSelectedReview = createSelector(selectReviewsState, (state) => state.selectedReview);

/**
 * Select all reviews by recipe map
 */
export const selectReviewsByRecipeMap = createSelector(selectReviewsState, (state) => state.reviewsByRecipe);

/**
 * Select all reviews by author map
 */
export const selectReviewsByAuthorMap = createSelector(selectReviewsState, (state) => state.reviewsByAuthor);

/**
 * Select all reviews indexed by ID
 */
export const selectReviewsByIdMap = createSelector(selectReviewsState, (state) => state.reviewsById);

/**
 * Select rating statistics map
 */
export const selectRatingStatsMap = createSelector(selectReviewsState, (state) => state.ratingStatsByRecipe);

/**
 * Select loaded recipe IDs
 */
export const selectLoadedRecipeIds = createSelector(selectReviewsState, (state) => state.loadedRecipeIds);

/**
 * Select reviews for a specific recipe
 * Usage: store.select(selectReviewsForRecipe('recipe123'))
 */
export const selectReviewsForRecipe = (recipeId: string) =>
  createSelector(selectReviewsByRecipeMap, (reviewsByRecipe) => {
    return reviewsByRecipe.get(recipeId) || [];
  });

/**
 * Select reviews by a specific author
 * Usage: store.select(selectReviewsByAuthor('author123'))
 */
export const selectReviewsByAuthor = (authorId: string) =>
  createSelector(selectReviewsByAuthorMap, (reviewsByAuthor) => {
    return reviewsByAuthor.get(authorId) || [];
  });

/**
 * Select a single review by ID
 * Usage: store.select(selectReviewById('review123'))
 */
export const selectReviewById = (reviewId: string) =>
  createSelector(selectReviewsByIdMap, (reviewsById) => {
    return reviewsById.get(reviewId) || null;
  });

/**
 * Select rating statistics for a specific recipe
 * Usage: store.select(selectRatingStatsForRecipe('recipe123'))
 */
export const selectRatingStatsForRecipe = (recipeId: string) =>
  createSelector(selectRatingStatsMap, (ratingStatsByRecipe) => {
    return ratingStatsByRecipe.get(recipeId) || { average: 0, count: 0 };
  });

/**
 * Select whether reviews for a recipe have been loaded
 * Usage: store.select(selectAreReviewsLoadedForRecipe('recipe123'))
 */
export const selectAreReviewsLoadedForRecipe = (recipeId: string) =>
  createSelector(selectLoadedRecipeIds, (loadedRecipeIds) => {
    return loadedRecipeIds.has(recipeId);
  });

/**
 * Select review count for a specific recipe
 * Usage: store.select(selectReviewCountForRecipe('recipe123'))
 */
export const selectReviewCountForRecipe = (recipeId: string) => createSelector(selectReviewsForRecipe(recipeId), (reviews) => reviews.length);

/**
 * Select average rating for a specific recipe
 * Usage: store.select(selectAverageRatingForRecipe('recipe123'))
 */
export const selectAverageRatingForRecipe = (recipeId: string) => createSelector(selectRatingStatsForRecipe(recipeId), (stats) => stats.average);

/**
 * Select all reviews across all recipes (flattened)
 */
export const selectAllReviews = createSelector(selectReviewsByIdMap, (reviewsById) => {
  return Array.from(reviewsById.values());
});

/**
 * Select total review count across all recipes
 */
export const selectTotalReviewCount = createSelector(selectAllReviews, (reviews) => reviews.length);

/**
 * Select recent reviews (sorted by createdAt, descending)
 * Usage: store.select(selectRecentReviews(10))
 */
export const selectRecentReviews = (limit = 10) =>
  createSelector(selectAllReviews, (reviews) => {
    return [...reviews].sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  });

/**
 * Select top-rated reviews for a recipe (sorted by rating, descending)
 * Usage: store.select(selectTopRatedReviewsForRecipe('recipe123', 5))
 */
export const selectTopRatedReviewsForRecipe = (recipeId: string, limit = 5) =>
  createSelector(selectReviewsForRecipe(recipeId), (reviews) => {
    return [...reviews].sort((a, b) => b.rating - a.rating).slice(0, limit);
  });

/**
 * Select reviews sorted by date (newest first) for a recipe
 * Usage: store.select(selectReviewsSortedByDateForRecipe('recipe123'))
 */
export const selectReviewsSortedByDateForRecipe = (recipeId: string) =>
  createSelector(selectReviewsForRecipe(recipeId), (reviews) => {
    return [...reviews].sort((a, b) => b.createdAt - a.createdAt);
  });

/**
 * Select reviews sorted by rating (highest first) for a recipe
 * Usage: store.select(selectReviewsSortedByRatingForRecipe('recipe123'))
 */
export const selectReviewsSortedByRatingForRecipe = (recipeId: string) =>
  createSelector(selectReviewsForRecipe(recipeId), (reviews) => {
    return [...reviews].sort((a, b) => b.rating - a.rating);
  });

/**
 * Select rating distribution for a recipe
 * Returns count of reviews for each rating (1-5 stars)
 * Usage: store.select(selectRatingDistributionForRecipe('recipe123'))
 */
export const selectRatingDistributionForRecipe = (recipeId: string) =>
  createSelector(selectReviewsForRecipe(recipeId), (reviews) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });
    return distribution;
  });

/**
 * Select percentage distribution of ratings for a recipe
 * Returns percentage of reviews for each rating (1-5 stars)
 * Usage: store.select(selectRatingPercentagesForRecipe('recipe123'))
 */
export const selectRatingPercentagesForRecipe = (recipeId: string) =>
  createSelector(selectReviewsForRecipe(recipeId), selectRatingDistributionForRecipe(recipeId), (reviews, distribution) => {
    const total = reviews.length;
    if (total === 0) {
      return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }

    return {
      1: Math.round((distribution[1] / total) * 100),
      2: Math.round((distribution[2] / total) * 100),
      3: Math.round((distribution[3] / total) * 100),
      4: Math.round((distribution[4] / total) * 100),
      5: Math.round((distribution[5] / total) * 100),
    };
  });

/**
 * Select whether a user has reviewed a specific recipe
 * Usage: store.select(selectHasUserReviewedRecipe('recipe123', 'user123'))
 */
export const selectHasUserReviewedRecipe = (recipeId: string, userId: string) =>
  createSelector(selectReviewsForRecipe(recipeId), (reviews) => {
    return reviews.some((review) => review.author.id === userId);
  });

/**
 * Select user's review for a specific recipe
 * Usage: store.select(selectUserReviewForRecipe('recipe123', 'user123'))
 */
export const selectUserReviewForRecipe = (recipeId: string, userId: string) =>
  createSelector(selectReviewsForRecipe(recipeId), (reviews) => {
    return reviews.find((review) => review.author.id === userId) || null;
  });
