import { HttpClient, type HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { catchError, type Observable, throwError } from "rxjs";

/**
 * Recipe Interface with Enhanced Filter Properties
 */
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  category: string;
  imageUrl?: string;

  // Enhanced filter properties
  cuisine?: string; // e.g., "Italian", "Asian", "Mexican"
  dietaryTags?: string[]; // e.g., ["vegetarian", "gluten-free", "dairy-free", "vegan"]
  mealType?: string[]; // e.g., ["breakfast", "lunch", "dinner", "snack", "dessert"]
  spiceLevel?: 0 | 1 | 2 | 3; // 0=none, 1=mild, 2=medium, 3=spicy
  calories?: number;
  protein?: number;
  author?: string;
  rating?: number;
  reviewCount?: number;

  createdAt: number;
  updatedAt: number;
}

/**
 * Category Group Interface for hierarchical categories
 */
export interface CategoryGroup {
  id: string;
  name: string;
  icon: string; // SVG icon or icon identifier
  subcategories: Subcategory[];
}

/**
 * Subcategory Interface
 */
export interface Subcategory {
  id: string;
  name: string;
  filterKey: string; // The property to filter by (e.g., 'cuisine', 'dietaryTags')
  filterValue: string; // The value to filter for
}

/**
 * Recipe Service - Handles CRUD operations for recipes
 */
@Injectable({
  providedIn: "root",
})
export class RecipeService {
  private http = inject(HttpClient);
  private readonly API_URL = "http://localhost:3000";

  /**
   * Fetch all recipes from the API
   *
   * @returns Observable<Recipe[]> - Array of recipes
   */
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.API_URL}/recipes`).pipe(catchError(this.handleError));
  }

  /**
   * Fetch a single recipe by ID
   *
   * @param id - Recipe ID
   * @returns Observable<Recipe> - Single recipe
   */
  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.API_URL}/recipes/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Create a new recipe
   *
   * @param recipe - Recipe data (without id)
   * @returns Observable<Recipe> - Created recipe with ID
   */
  createRecipe(recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">): Observable<Recipe> {
    const now = Date.now();
    return this.http
      .post<Recipe>(`${this.API_URL}/recipes`, {
        ...recipe,
        createdAt: now,
        updatedAt: now,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing recipe
   *
   * @param id - Recipe ID
   * @param recipe - Updated recipe data
   * @returns Observable<Recipe> - Updated recipe
   */
  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http
      .patch<Recipe>(`${this.API_URL}/recipes/${id}`, {
        ...recipe,
        updatedAt: Date.now(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a recipe
   *
   * @param id - Recipe ID
   * @returns Observable<void>
   */
  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/recipes/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors
   *
   * @param error - HTTP error response
   * @returns Observable error
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred!";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error (Status ${error.status}): ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
