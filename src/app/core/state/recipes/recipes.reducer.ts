import { createReducer, on } from "@ngrx/store";
import type { Recipe } from "@/app/core/services/recipe.service";
import * as RecipesActions from "./recipes.actions";

/**
 * Recipe Filters Interface
 */
export interface RecipeFilters {
  searchQuery?: string;
  category?: string;
  cuisine?: string;
  dietaryTags?: string[];
  mealType?: string[];
  spiceLevel?: number;
  difficulty?: string;
}

/**
 * Recipes State Interface
 *
 * Defines the shape of the recipes state in the store
 */
export interface RecipesState {
  /** All recipes loaded from the API */
  recipes: Recipe[];

  /** Currently selected recipe for detail view */
  selectedRecipe: Recipe | null;

  /** Loading state for async operations */
  loading: boolean;

  /** Error message from failed operations */
  error: string | null;

  /** Active filters */
  filters: RecipeFilters;

  /** Whether recipes have been loaded */
  loaded: boolean;
}

/**
 * Initial State
 *
 * The default state when the app first loads
 */
export const initialState: RecipesState = {
  recipes: [],
  selectedRecipe: null,
  loading: false,
  error: null,
  filters: {},
  loaded: false,
};

/**
 * Recipes Reducer
 *
 * Pure function that takes the current state and an action,
 * and returns a new state based on that action.
 */
export const recipesReducer = createReducer(
  initialState,

  /**
   * Load Recipes Action Handler
   * Sets loading to true and clears any previous errors
   */
  on(RecipesActions.loadRecipes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Load Recipes Success Action Handler
   * Updates state with recipes from API
   */
  on(RecipesActions.loadRecipesSuccess, (state, { recipes }) => ({
    ...state,
    recipes,
    loading: false,
    error: null,
    loaded: true,
  })),

  /**
   * Load Recipes Failure Action Handler
   * Sets error message and clears loading state
   */
  on(RecipesActions.loadRecipesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    loaded: false,
  })),

  /**
   * Load Recipe By ID Action Handler
   * Sets loading to true for single recipe load
   */
  on(RecipesActions.loadRecipeById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Load Recipe By ID Success Action Handler
   * Updates selected recipe and adds to recipes array if not present
   */
  on(RecipesActions.loadRecipeByIdSuccess, (state, { recipe }) => {
    const recipeExists = state.recipes.some((r) => r.id === recipe.id);
    const updatedRecipes = recipeExists ? state.recipes.map((r) => (r.id === recipe.id ? recipe : r)) : [...state.recipes, recipe];

    return {
      ...state,
      recipes: updatedRecipes,
      selectedRecipe: recipe,
      loading: false,
      error: null,
    };
  }),

  /**
   * Load Recipe By ID Failure Action Handler
   * Sets error message and clears loading state
   */
  on(RecipesActions.loadRecipeByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Create Recipe Action Handler
   * Sets loading to true for recipe creation
   */
  on(RecipesActions.createRecipe, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Create Recipe Success Action Handler
   * Adds new recipe to the recipes array
   */
  on(RecipesActions.createRecipeSuccess, (state, { recipe }) => ({
    ...state,
    recipes: [...state.recipes, recipe],
    loading: false,
    error: null,
  })),

  /**
   * Create Recipe Failure Action Handler
   * Sets error message and clears loading state
   */
  on(RecipesActions.createRecipeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Update Recipe Action Handler
   * Sets loading to true for recipe update
   */
  on(RecipesActions.updateRecipe, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Update Recipe Success Action Handler
   * Updates the recipe in the recipes array
   */
  on(RecipesActions.updateRecipeSuccess, (state, { recipe }) => ({
    ...state,
    recipes: state.recipes.map((r) => (r.id === recipe.id ? recipe : r)),
    selectedRecipe: state.selectedRecipe?.id === recipe.id ? recipe : state.selectedRecipe,
    loading: false,
    error: null,
  })),

  /**
   * Update Recipe Failure Action Handler
   * Sets error message and clears loading state
   */
  on(RecipesActions.updateRecipeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Delete Recipe Action Handler
   * Sets loading to true for recipe deletion
   */
  on(RecipesActions.deleteRecipe, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  /**
   * Delete Recipe Success Action Handler
   * Removes the recipe from the recipes array
   */
  on(RecipesActions.deleteRecipeSuccess, (state, { id }) => ({
    ...state,
    recipes: state.recipes.filter((r) => r.id !== id),
    selectedRecipe: state.selectedRecipe?.id === id ? null : state.selectedRecipe,
    loading: false,
    error: null,
  })),

  /**
   * Delete Recipe Failure Action Handler
   * Sets error message and clears loading state
   */
  on(RecipesActions.deleteRecipeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  /**
   * Select Recipe Action Handler
   * Sets the selected recipe by ID
   */
  on(RecipesActions.selectRecipe, (state, { id }) => ({
    ...state,
    selectedRecipe: state.recipes.find((r) => r.id === id) || null,
  })),

  /**
   * Clear Selected Recipe Action Handler
   * Clears the selected recipe
   */
  on(RecipesActions.clearSelectedRecipe, (state) => ({
    ...state,
    selectedRecipe: null,
  })),

  /**
   * Set Filter Action Handler
   * Updates the active filters
   */
  on(RecipesActions.setFilter, (state, filters) => ({
    ...state,
    filters: {
      ...state.filters,
      ...filters,
    },
  })),

  /**
   * Clear Filters Action Handler
   * Clears all active filters
   */
  on(RecipesActions.clearFilters, (state) => ({
    ...state,
    filters: {},
  })),
);

/**
 * Feature Key for the Recipes State
 * Used when registering the reducer in the store
 */
export const recipesFeatureKey = "recipes";
