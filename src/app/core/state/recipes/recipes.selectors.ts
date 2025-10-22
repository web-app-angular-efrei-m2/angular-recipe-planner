import { createFeatureSelector, createSelector } from "@ngrx/store";
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
 * Select trending recipes
 */
export const selectTrendingRecipes = createSelector(selectAllRecipes, (recipes) => recipes.filter((r) => r.isTrending));

/**
 * Select popular recipes
 */
export const selectPopularRecipes = createSelector(selectAllRecipes, (recipes) => recipes.filter((r) => r.isPopular));

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
