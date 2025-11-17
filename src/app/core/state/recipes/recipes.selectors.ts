import { createFeatureSelector, createSelector } from "@ngrx/store";
import { selectUser } from "../auth/auth.selectors";
import { selectRatingStatsMap, selectReviewsByRecipeMap } from "../reviews/reviews.selectors";
import { type RecipesState, recipesFeatureKey } from "./recipes.reducer";

/**
 * Recipe Selectors - Functions to select slices of state from the store
 *
 * Selectors are:
 * - Memoized: Only recompute when inputs change
 * - Composable: Can be built from other selectors
 * - Testable: Pure functions
 *
 * Pattern:
 * 1. Create feature selector to get the entire feature state
 * 2. Create specific selectors to drill down into state properties
 * 3. Create computed selectors that derive data from state
 */

/**
 * Feature Selector - Selects the entire recipes state slice
 */
export const selectRecipesState = createFeatureSelector<RecipesState>(recipesFeatureKey);

/**
 * Select all recipes
 */
export const selectAllRecipes = createSelector(selectRecipesState, (state) => state.recipes);

/**
 * Select selected recipe
 */
export const selectSelectedRecipe = createSelector(selectRecipesState, (state) => state.selectedRecipe);

/**
 * Select loading state
 */
export const selectRecipesLoading = createSelector(selectRecipesState, (state) => state.loading);

/**
 * Select error state
 */
export const selectRecipesError = createSelector(selectRecipesState, (state) => state.error);

/**
 * Select loaded state
 */
export const selectRecipesLoaded = createSelector(selectRecipesState, (state) => state.loaded);

/**
 * Select active filters
 */
export const selectRecipeFilters = createSelector(selectRecipesState, (state) => state.filters);

/**
 * Select recipe by ID
 * Usage: store.select(selectRecipeById('123'))
 */
export const selectRecipeById = (id: string) => createSelector(selectAllRecipes, (recipes) => recipes.find((recipe) => recipe.id === id) || null);

/**
 * Select filtered recipes based on active filters
 * This is a computed selector that applies all filters to the recipes
 */
export const selectFilteredRecipes = createSelector(selectAllRecipes, selectRecipeFilters, (recipes, filters) => {
  let filtered = [...recipes];

  // Apply search query filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter((recipe) => recipe.title.toLowerCase().includes(query) || recipe.description.toLowerCase().includes(query));
  }

  // Apply category filter
  if (filters.category) {
    filtered = filtered.filter((recipe) => recipe.category === filters.category);
  }

  // Apply cuisine filter
  if (filters.cuisine) {
    filtered = filtered.filter((recipe) => recipe.cuisine === filters.cuisine);
  }

  // Apply dietary tags filter (recipe must have ALL selected tags)
  if (filters.dietaryTags && filters.dietaryTags.length > 0) {
    filtered = filtered.filter((recipe) => {
      if (!recipe.dietaryTags || recipe.dietaryTags.length === 0) {
        return false;
      }
      const recipeTags = recipe.dietaryTags;
      const filterTags = filters.dietaryTags || [];
      return filterTags.every((tag) => recipeTags.includes(tag));
    });
  }

  // Apply meal type filter (recipe must have at least one selected meal type)
  if (filters.mealType && filters.mealType.length > 0) {
    filtered = filtered.filter((recipe) => {
      if (!recipe.mealType || recipe.mealType.length === 0) {
        return false;
      }
      const recipeMealTypes = recipe.mealType;
      const filterMealTypes = filters.mealType || [];
      return filterMealTypes.some((type) => recipeMealTypes.includes(type));
    });
  }

  // Apply spice level filter
  if (filters.spiceLevel !== undefined) {
    filtered = filtered.filter((recipe) => recipe.spiceLevel === filters.spiceLevel);
  }

  // Apply difficulty filter (calculated from prep/cook time and ingredient count)
  if (filters.difficulty) {
    filtered = filtered.filter((recipe) => {
      const totalTime = recipe.prepTime + recipe.cookTime;
      const ingredientCount = recipe.ingredients.length;

      if (filters.difficulty === "easy") {
        return totalTime < 30 && ingredientCount < 6;
      }
      if (filters.difficulty === "medium") {
        return totalTime >= 30 && totalTime < 60 && ingredientCount < 10;
      }
      if (filters.difficulty === "hard") {
        return totalTime >= 60 || ingredientCount >= 10;
      }
      return true;
    });
  }

  return filtered;
});

/**
 * Select unique categories from all recipes
 */
export const selectUniqueCategories = createSelector(selectAllRecipes, (recipes) => {
  const categories = recipes.map((r) => r.category);
  return [...new Set(categories)].sort();
});

/**
 * Select unique cuisines from all recipes
 */
export const selectUniqueCuisines = createSelector(selectAllRecipes, (recipes) => {
  const cuisines = recipes.filter((r) => r.cuisine).map((r) => r.cuisine as string);
  return [...new Set(cuisines)].sort();
});

/**
 * Select recipes by category
 */
export const selectRecipesByCategory = (category: string) =>
  createSelector(selectAllRecipes, (recipes) => recipes.filter((recipe) => recipe.category === category));

/**
 * Select recipes by cuisine
 */
export const selectRecipesByCuisine = (cuisine: string) =>
  createSelector(selectAllRecipes, (recipes) => recipes.filter((recipe) => recipe.cuisine === cuisine));

/**
 * Select recipes by meal type
 */
export const selectRecipesByMealType = (mealType: string) =>
  createSelector(selectAllRecipes, (recipes) => recipes.filter((recipe) => recipe.mealType?.includes(mealType)));

/**
 * Select total recipe count
 */
export const selectRecipeCount = createSelector(selectAllRecipes, (recipes) => recipes.length);

/**
 * Select filtered recipe count
 */
export const selectFilteredRecipeCount = createSelector(selectFilteredRecipes, (recipes) => recipes.length);

/**
 * Select whether any filters are active
 */
export const selectHasActiveFilters = createSelector(selectRecipeFilters, (filters) => {
  return (
    !!filters.searchQuery ||
    !!filters.category ||
    !!filters.cuisine ||
    (filters.dietaryTags && filters.dietaryTags.length > 0) ||
    (filters.mealType && filters.mealType.length > 0) ||
    filters.spiceLevel !== undefined ||
    !!filters.difficulty
  );
});

/**
 * Select popular recipes (recipes with high review count or rating)
 * A recipe is considered popular if it has 3+ reviews with average rating >= 4
 */
export const selectPopularRecipes = createSelector(selectAllRecipes, selectReviewsByRecipeMap, selectRatingStatsMap, (recipes, reviewsMap, ratingsMap) => {
  return recipes.filter((recipe) => {
    const reviews = reviewsMap.get(recipe.id);
    const stats = ratingsMap.get(recipe.id);

    if (!reviews || !stats) {
      return false;
    }

    // Popular = 3+ reviews AND average rating >= 4
    return reviews.length >= 3 && stats.average >= 4;
  });
});

/**
 * Select trending recipes (recently created recipes with good engagement)
 * A recipe is trending if it was created in the last 365 days and has 2+ reviews
 */
export const selectTrendingRecipes = createSelector(selectAllRecipes, selectReviewsByRecipeMap, (recipes, reviewsMap) => {
  return recipes.filter((recipe) => {
    const reviews = reviewsMap.get(recipe.id);

    if (reviews && reviews.length > 0) {
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const isRecent = recipe.createdAt >= oneWeekAgo;
      const hasEngagement = reviews && reviews.length >= 2;
      return isRecent && hasEngagement;
    }
    return false;
  });
});

/**
 * Check if a specific recipe is popular
 */
export const selectIsRecipePopular = (recipeId: string) =>
  createSelector(selectPopularRecipes, (popularRecipes) => {
    return popularRecipes.some((recipe) => recipe.id === recipeId);
  });

/**
 * Check if a specific recipe is trending
 */
export const selectIsRecipeTrending = (recipeId: string) =>
  createSelector(selectTrendingRecipes, (trendingRecipes) => {
    return trendingRecipes.some((recipe) => recipe.id === recipeId);
  });

/**
 * Select recipes sorted by popularity (review count * average rating)
 */
export const selectRecipesByPopularity = createSelector(selectAllRecipes, selectReviewsByRecipeMap, selectRatingStatsMap, (recipes, reviewsMap, ratingsMap) => {
  return [...recipes].sort((a, b) => {
    const aReviews = reviewsMap.get(a.id)?.length || 0;
    const bReviews = reviewsMap.get(b.id)?.length || 0;
    const aRating = ratingsMap.get(a.id)?.average || 0;
    const bRating = ratingsMap.get(b.id)?.average || 0;

    // Popularity score = review count * average rating
    const aScore = aReviews * aRating;
    const bScore = bReviews * bRating;

    return bScore - aScore;
  });
});

/**
 * Select bookmarked recipes for the current user
 * Returns an array of recipes that are in the user's bookmarks
 */
export const selectBookmarkedRecipes = createSelector(selectAllRecipes, selectUser, (recipes, user) => {
  if (!user || !user.bookmarks || user.bookmarks.length === 0) {
    return [];
  }
  const bookmarks = user.bookmarks;
  return recipes.filter((recipe) => bookmarks.includes(recipe.id));
});
