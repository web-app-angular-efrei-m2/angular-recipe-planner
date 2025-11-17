import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { RecipeService } from "@/app/core/services/recipe.service";
import * as RecipesActions from "./recipes.actions";

/**
 * Recipes Effects - Handle side effects for recipe actions
 *
 * Effects are where we handle:
 * - API calls
 * - Side effects (logging, analytics, etc.)
 * - Complex async operations
 *
 * Pattern: Action → Effect → API Call → Success/Failure Action → Reducer
 */
@Injectable()
export class RecipesEffects {
  private actions$ = inject(Actions);
  private recipeService = inject(RecipeService);

  /**
   * Load Recipes Effect - Handles loading all recipes from the API
   *
   * Flow:
   * 1. Listens for [Recipes] Load Recipes action
   * 2. Calls RecipeService.getRecipes() (HTTP GET)
   * 3. Dispatches [Recipes] Load Recipes Success with recipes array
   * 4. If error occurs, dispatches [Recipes] Load Recipes Failure
   *
   * RxJS Operators:
   * - ofType: Filters actions by type
   * - switchMap: Cancels previous HTTP call if new load request occurs
   * - map: Transforms successful response to success action
   * - catchError: Catches errors and transforms to failure action
   */
  loadRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.loadRecipes),
      switchMap(() =>
        this.recipeService.getRecipes().pipe(
          map((recipes) => {
            console.log(`🎯 Effect: Loaded ${recipes.length} recipes successfully`);
            return RecipesActions.loadRecipesSuccess({ recipes });
          }),
          catchError((error) => {
            console.error("❌ Effect: Failed to load recipes:", error.message);
            return of(RecipesActions.loadRecipesFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Load Recipe By ID Effect - Handles loading a single recipe from the API
   *
   * Flow:
   * 1. Listens for [Recipes] Load Recipe By ID action
   * 2. Calls RecipeService.getRecipeById() (HTTP GET)
   * 3. Dispatches [Recipes] Load Recipe By ID Success with recipe
   * 4. If error occurs, dispatches [Recipes] Load Recipe By ID Failure
   */
  loadRecipeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.loadRecipeById),
      switchMap(({ id }) =>
        this.recipeService.getRecipeById(id).pipe(
          map((recipe) => {
            console.log(`🎯 Effect: Loaded recipe "${recipe.title}" successfully`);
            return RecipesActions.loadRecipeByIdSuccess({ recipe });
          }),
          catchError((error) => {
            console.error(`❌ Effect: Failed to load recipe with ID ${id}:`, error.message);
            return of(RecipesActions.loadRecipeByIdFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Create Recipe Effect - Handles creating a new recipe
   *
   * Flow:
   * 1. Listens for [Recipes] Create Recipe action
   * 2. Calls RecipeService.createRecipe() (HTTP POST)
   * 3. Dispatches [Recipes] Create Recipe Success with created recipe
   * 4. If error occurs, dispatches [Recipes] Create Recipe Failure
   */
  createRecipe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.createRecipe),
      switchMap(({ recipe }) =>
        this.recipeService.createRecipe(recipe).pipe(
          map((createdRecipe) => {
            console.log(`🎯 Effect: Created recipe "${createdRecipe.title}" successfully`);
            return RecipesActions.createRecipeSuccess({ recipe: createdRecipe });
          }),
          catchError((error) => {
            console.error("❌ Effect: Failed to create recipe:", error.message);
            return of(RecipesActions.createRecipeFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Update Recipe Effect - Handles updating an existing recipe
   *
   * Flow:
   * 1. Listens for [Recipes] Update Recipe action
   * 2. Calls RecipeService.updateRecipe() (HTTP PATCH)
   * 3. Dispatches [Recipes] Update Recipe Success with updated recipe
   * 4. If error occurs, dispatches [Recipes] Update Recipe Failure
   */
  updateRecipe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.updateRecipe),
      switchMap(({ id, recipe }) =>
        this.recipeService.updateRecipe(id, recipe).pipe(
          map((updatedRecipe) => {
            console.log(`🎯 Effect: Updated recipe "${updatedRecipe.title}" successfully`);
            return RecipesActions.updateRecipeSuccess({ recipe: updatedRecipe });
          }),
          catchError((error) => {
            console.error(`❌ Effect: Failed to update recipe with ID ${id}:`, error.message);
            return of(RecipesActions.updateRecipeFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Delete Recipe Effect - Handles deleting a recipe
   *
   * Flow:
   * 1. Listens for [Recipes] Delete Recipe action
   * 2. Calls RecipeService.deleteRecipe() (HTTP DELETE)
   * 3. Dispatches [Recipes] Delete Recipe Success with recipe ID
   * 4. If error occurs, dispatches [Recipes] Delete Recipe Failure
   */
  deleteRecipe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.deleteRecipe),
      switchMap(({ id }) =>
        this.recipeService.deleteRecipe(id).pipe(
          map(() => {
            console.log(`🎯 Effect: Deleted recipe with ID ${id} successfully`);
            return RecipesActions.deleteRecipeSuccess({ id });
          }),
          catchError((error) => {
            console.error(`❌ Effect: Failed to delete recipe with ID ${id}:`, error.message);
            return of(RecipesActions.deleteRecipeFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  /**
   * Log success actions for debugging
   */
  logSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          RecipesActions.loadRecipesSuccess,
          RecipesActions.loadRecipeByIdSuccess,
          RecipesActions.createRecipeSuccess,
          RecipesActions.updateRecipeSuccess,
          RecipesActions.deleteRecipeSuccess,
        ),
        tap((action) => {
          console.log("✅ Recipe operation successful:", action.type);
        }),
      ),
    { dispatch: false }, // This effect doesn't dispatch another action
  );
}
