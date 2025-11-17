import { createAction, props } from "@ngrx/store";
import type { Recipe } from "@/app/core/services/recipe.service";

/**
 * Recipe Actions - Define all recipe-related actions
 *
 * NgRx follows the Redux pattern:
 * Component/Service → Dispatch Action → Reducer → New State → Selectors
 *
 * Action naming convention: [Source] Event
 * - [Source]: Where the action originated (e.g., Recipes, Recipe List)
 * - Event: What happened (e.g., Load Recipes, Create Recipe)
 */

/**
 * Load Recipes Action - Dispatched when recipes need to be loaded from API
 */
export const loadRecipes = createAction("[Recipes] Load Recipes");

/**
 * Load Recipes Success Action - Dispatched when recipes are loaded successfully
 */
export const loadRecipesSuccess = createAction("[Recipes] Load Recipes Success", props<{ recipes: Recipe[] }>());

/**
 * Load Recipes Failure Action - Dispatched when loading recipes fails
 */
export const loadRecipesFailure = createAction("[Recipes] Load Recipes Failure", props<{ error: string }>());

/**
 * Load Recipe By ID Action - Dispatched when a single recipe needs to be loaded
 */
export const loadRecipeById = createAction("[Recipes] Load Recipe By ID", props<{ id: string }>());

/**
 * Load Recipe By ID Success Action - Dispatched when single recipe is loaded successfully
 */
export const loadRecipeByIdSuccess = createAction("[Recipes] Load Recipe By ID Success", props<{ recipe: Recipe }>());

/**
 * Load Recipe By ID Failure Action - Dispatched when loading single recipe fails
 */
export const loadRecipeByIdFailure = createAction("[Recipes] Load Recipe By ID Failure", props<{ error: string }>());

/**
 * Create Recipe Action - Dispatched when a new recipe needs to be created
 */
export const createRecipe = createAction("[Recipes] Create Recipe", props<{ recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt"> }>());

/**
 * Create Recipe Success Action - Dispatched when recipe is created successfully
 */
export const createRecipeSuccess = createAction("[Recipes] Create Recipe Success", props<{ recipe: Recipe }>());

/**
 * Create Recipe Failure Action - Dispatched when creating recipe fails
 */
export const createRecipeFailure = createAction("[Recipes] Create Recipe Failure", props<{ error: string }>());

/**
 * Update Recipe Action - Dispatched when an existing recipe needs to be updated
 */
export const updateRecipe = createAction("[Recipes] Update Recipe", props<{ id: string; recipe: Partial<Recipe> }>());

/**
 * Update Recipe Success Action - Dispatched when recipe is updated successfully
 */
export const updateRecipeSuccess = createAction("[Recipes] Update Recipe Success", props<{ recipe: Recipe }>());

/**
 * Update Recipe Failure Action - Dispatched when updating recipe fails
 */
export const updateRecipeFailure = createAction("[Recipes] Update Recipe Failure", props<{ error: string }>());

/**
 * Delete Recipe Action - Dispatched when a recipe needs to be deleted
 */
export const deleteRecipe = createAction("[Recipes] Delete Recipe", props<{ id: string }>());

/**
 * Delete Recipe Success Action - Dispatched when recipe is deleted successfully
 */
export const deleteRecipeSuccess = createAction("[Recipes] Delete Recipe Success", props<{ id: string }>());

/**
 * Delete Recipe Failure Action - Dispatched when deleting recipe fails
 */
export const deleteRecipeFailure = createAction("[Recipes] Delete Recipe Failure", props<{ error: string }>());

/**
 * Select Recipe Action - Dispatched when a recipe is selected for viewing/editing
 */
export const selectRecipe = createAction("[Recipes] Select Recipe", props<{ id: string }>());

/**
 * Clear Selected Recipe Action - Dispatched when selected recipe needs to be cleared
 */
export const clearSelectedRecipe = createAction("[Recipes] Clear Selected Recipe");

/**
 * Set Filter Action - Dispatched when filters need to be applied to recipes
 */
export const setFilter = createAction(
  "[Recipes] Set Filter",
  props<{
    searchQuery?: string;
    category?: string;
    cuisine?: string;
    dietaryTags?: string[];
    mealType?: string[];
    spiceLevel?: number;
    difficulty?: string;
  }>(),
);

/**
 * Clear Filters Action - Dispatched when all filters need to be cleared
 */
export const clearFilters = createAction("[Recipes] Clear Filters");
