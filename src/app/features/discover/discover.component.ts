import { Component, effect, inject, type OnDestroy, type OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { CATEGORY_GROUPS } from "@/app/core/config/categories.config";
import { loadRecipes } from "@/app/core/state/recipes/recipes.actions";
import { selectAllRecipes, selectPopularRecipes, selectRecipesLoading, selectTrendingRecipes } from "@/app/core/state/recipes/recipes.selectors";
import { loadReviewsByRecipeId } from "@/app/core/state/reviews/reviews.actions";
import { selectAreReviewsLoadedForRecipe } from "@/app/core/state/reviews/reviews.selectors";
import { SafeHtmlDirective } from "@/app/shared/directives/safe-html.directive";

/**
 * ENHANCED DISCOVER COMPONENT WITH HIERARCHICAL CATEGORIES
 *
 * This is an example showing how to implement the Shoplon-style
 * collapsible categories with icons and subcategories.
 *
 * Features:
 * - Hierarchical category structure
 * - SVG icons for each category group
 * - Expandable/collapsible sections
 * - Dynamic recipe counts per subcategory
 * - Filter navigation to results page
 */
@Component({
  selector: "app-discover-enhanced",
  standalone: true,
  imports: [ReactiveFormsModule, SafeHtmlDirective],
  template: `
    <div class="min-h-screen flex flex-1 flex-col wrap-break-word rounded-sm p-0 text-start font-semibold">

      <!-- Header -->
      <div class="sticky inset-0 z-10 flex items-center justify-center shrink-0 h-(--header-height) px-6 pt-0 bg-white">
        <h2 class="text-2xl font-semibold text-gray-800">Discover</h2>
      </div>

      <div class="max-w-5xl mx-auto w-dvw">
        <!-- Search Bar -->
        <form [formGroup]="searchQueryForm" (ngSubmit)="onSubmit()" class="flex flex-col wrap-break-word text-start px-6 py-4">
          <label class="input input-lg input-soft rounded-lg pr-0 w-full">
            <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <input
              type="text"
              formControlName="query"
              class="placeholder:text-gray-400 focus-visible:outline-primary"
              placeholder="Search Any Recipe..."
            />
            <button type="button" class="tooltip tooltip-left tooltip-animated btn btn-md btn-ghost rounded-l-none rounded-lg border-l h-full cursor-default" data-tip="Coming soon - Feature not yet implemented">
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
            </button>
          </label>
        </form>

        <!-- Popular Chefs Section -->
        <div class="px-6 py-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm text-gray-800 font-semibold">Popular Chefs</h3>
            <button type="button" class="btn btn-link text-purple-500 text-sm">See all</button>
          </div>
          <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            @for (chef of popularChefs(); track chef.id) {
              <div class="flex flex-col items-center gap-2 min-w-20">
                <div class="avatar avatar-placeholder">
                  <div class="w-16 rounded-full bg-linear-to-br from-purple-400 to-pink-400 text-white shadow-md">
                  <span class="text-xl font-bold">{{ chef.initials }}</span>
                </div>
                </div>
                <span class="text-xs text-gray-700 text-center font-medium">{{ chef.name }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Hierarchical Categories Section -->
        <div class="flex flex-col">
          <div class="sticky top-(--header-height) z-10 px-6 py-3 bg-white">
            <h3 class="text-sm text-gray-800 font-semibold">Categories</h3>
          </div>
          <!-- Category Groups -->
          @for (group of categoryGroups; track group.id) {
            <details class="collapse collapse-arrow border-y-2 border-transparent open:border-(--color-border)">
              <summary
                class="collapse-title text-gray-400">
               <div class="flex items-center gap-3">
                 <!-- Icon -->
                <span class="text-gray-400" [appSafeHtml]="group.icon"></span>
                <!-- Category Name -->
                <span class="text-sm font-medium mr-auto text-gray-800">{{ group.name }}</span>
               </div>
              </summary>
              <!-- Subcategories -->
              <div class="collapse-content px-4 pb-2">
                <ul class="flex flex-col h-full max-h-[200px] overflow-auto snap-y snap-mandatory">
                  @for (subcategory of group.subcategories; track subcategory.id) {
                    @if (getRecipeCount(subcategory) > 0) {
                      <li class="inline-flex whitespace-normal text-sm ml-10 border-t first:border-t-0 snap-start">
                        <button
                          type="button"
                          (click)="navigateToFilter(subcategory)"
                          class="btn btn-lg btn-ghost justify-start text-sm font-semibold rounded-none w-full">
                          {{ subcategory.name }}
                          @if (getRecipeCount(subcategory); as count) {
                            <span class="text-xs text-gray-400 ml-auto">({{ count }})</span>
                          }
                        </button>
                      </li>
                    }
                  }
                </ul>
              </div>
            </details>
          }
        </div>
      </div>

    </div>
  `,
})
export class DiscoverComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private readonly store = inject(Store);

  // Category configuration
  protected categoryGroups = CATEGORY_GROUPS;

  // Select data from NgRx store
  protected recipes = this.store.selectSignal(selectAllRecipes);
  protected loading = this.store.selectSignal(selectRecipesLoading);

  protected trendingRecipes = this.store.selectSignal(selectTrendingRecipes);
  protected popularRecipes = this.store.selectSignal(selectPopularRecipes);

  // Popular chefs (mock data)
  protected popularChefs = signal([
    { id: "1", name: "Eleanor P.", initials: "EP" },
    { id: "2", name: "Kathryn M.", initials: "KM" },
    { id: "3", name: "Darrell S.", initials: "DS" },
    { id: "4", name: "Floyd M.", initials: "FM" },
  ]);

  // Search form
  protected searchQueryForm = this.fb.group({
    query: ["", [Validators.required]],
  });

  // Effect to load reviews for filtered recipes
  private loadReviewsEffect = effect(() => {
    const allRecipes = this.recipes();

    // Load reviews for all recipes so we can calculate popularity
    for (const recipe of allRecipes) {
      // Check if reviews for this recipe are already loaded
      const areLoaded = this.store.selectSignal(selectAreReviewsLoadedForRecipe(recipe.id))();

      if (!areLoaded) {
        this.store.dispatch(loadReviewsByRecipeId({ recipeId: recipe.id }));
      }
    }
  });

  ngOnInit(): void {
    // Dispatch action to load recipes from the store
    this.store.dispatch(loadRecipes());
  }

  ngOnDestroy(): void {
    // Cleanup if necessary
    this.loadReviewsEffect.destroy();
  }

  /**
   * Get recipe count for a subcategory
   */
  protected getRecipeCount(subcategory: { filterKey: string; filterValue: string }): number {
    const allRecipes = this.recipes();

    // Handle "all" value - return total recipe count
    if (subcategory.filterValue === "all") {
      return allRecipes.length;
    }

    // Handle trending filter
    if (subcategory.filterKey === "isTrending") {
      return this.trendingRecipes().length;
    }

    // Handle popular filter
    if (subcategory.filterKey === "isPopular") {
      return this.popularRecipes().length;
    }

    return allRecipes.filter((recipe) => {
      // Access recipe properties dynamically
      const recipeData = recipe as unknown as Record<string, unknown>;
      const value = recipeData[subcategory.filterKey];

      if (Array.isArray(value)) {
        return value.includes(subcategory.filterValue);
      }

      if (subcategory.filterKey === "totalTime") {
        const totalTime = recipe.prepTime + recipe.cookTime;
        if (subcategory.filterValue === "<30") {
          return totalTime < 30;
        }
        if (subcategory.filterValue === "30-60") {
          return totalTime >= 30 && totalTime <= 60;
        }
        if (subcategory.filterValue === ">60") {
          return totalTime > 60;
        }
      }

      return String(value) === subcategory.filterValue;
    }).length;
  }

  /**
   * Navigate to filter results
   */
  protected navigateToFilter(subcategory: { filterKey: string; filterValue: string }): void {
    this.router.navigate(["/discover/results"], {
      queryParams: {
        filter: subcategory.filterKey,
        value: subcategory.filterValue,
      },
    });
  }

  /**
   * Handle search submission
   */
  protected onSubmit(): void {
    if (this.searchQueryForm.invalid) {
      return;
    }

    const { query } = this.searchQueryForm.value;
    if (query?.trim()) {
      this.router.navigate(["/discover/results"], {
        queryParams: { q: query },
      });
    }
  }
}
