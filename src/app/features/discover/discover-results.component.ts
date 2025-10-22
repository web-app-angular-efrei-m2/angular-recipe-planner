import { Component, computed, effect, inject, type OnDestroy, type OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadRecipes } from "@/app/core/state/recipes/recipes.actions";
import { selectAllRecipes, selectPopularRecipes, selectRecipesLoading, selectTrendingRecipes } from "@/app/core/state/recipes/recipes.selectors";
import { loadReviewsByRecipeId } from "@/app/core/state/reviews/reviews.actions";
import { selectAreReviewsLoadedForRecipe, selectReviewsByRecipeMap } from "@/app/core/state/reviews/reviews.selectors";
import { DifficultyLevelPipe } from "@/app/shared/pipes/difficulty-level.pipe";
import { RatingPipe } from "@/app/shared/pipes/rating.pipe";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-discover-results",
  standalone: true,
  imports: [RouterLink, FormsModule, DifficultyLevelPipe, RatingPipe],
  template: `
    <div
      class="max-h-dvh flex flex-1 flex-col break-words rounded-sm text-start font-semibold"
    >
      <!-- Header with Back Button -->
      <div
        class="sticky inset-0 z-10 flex items-center justify-between shrink-0 h-[var(--header-height)] px-4 pt-0 bg-white"
      >
        <button
          (click)="goBack()"
          class="button button-sm button-ghost rounded-full p-0"
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2.2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            focusable="false"
            class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]"
            height="200px"
            width="200px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
        </button>
        <h2 class="text-sm text-gray-800 font-semibold">Search</h2>
        <div class="button-sm p-0"></div>
      </div>

      <!-- Search Bar -->
      <fieldset class="flex flex-col break-words text-start px-4 py-4">
        <div
          class="relative isolate inline-flex justify-start gap-2 items-center"
        >
          <div
            class="pointer-events-none absolute left-0 z-[2] flex h-full items-center justify-center pl-3 text-gray-400"
          >
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="2.2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              focusable="false"
              class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]"
              height="200px"
              width="200px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange()"
            class="input input-lg input-subtle pl-12 pr-15 rounded-lg placeholder:text-gray-400 focus-visible:outline-purple-500"
            placeholder="Search Any Recipe..."
          />
          <div
            class="absolute right-0 z-[2] flex h-full items-center justify-center text-gray-400"
          >
            <button
              class="button button-md button-ghost rounded-l-none rounded-lg border-l size-full"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                focusable="false"
                class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 7h-9"></path>
                <path d="M14 17H5"></path>
                <circle cx="17" cy="17" r="3"></circle>
                <circle cx="7" cy="7" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>
      </fieldset>

      <!-- Loading State -->
      @if (loading()) {
      <div class="flex items-center justify-center py-16">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"
          ></div>
          <span class="text-gray-600 text-sm">Loading recipes...</span>
        </div>
      </div>
      } @if (!loading() && filteredRecipes().length > 0) {
      <div class="flex-1 flex flex-col px-6 py-2 overflow-hidden">
        <!-- Results Summary -->
        <div class="flex flex-col gap-2 mb-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm text-gray-800 font-semibold">
              Found
              <span class="text-purple-500">{{ filteredRecipes().length }}</span>
              recipes
            </h3>
          </div>

          <!-- Active Filter Display -->
          @if (filterDisplayText()) {
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center rounded-xl tabular-nums whitespace-nowrap select-none px-3 py-1 text-sm bg-purple-100 text-purple-700">
                {{ filterDisplayText() }}
                <button
                  (click)="clearSearch()"
                  class="ml-2 hover:text-purple-900"
                  aria-label="Clear filter"
                >
                  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="inline-block size-4">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </span>
            </div>
          }
        </div>
        <!-- Recipe Results Grid -->
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-scroll snap-y snap-mandatory">
          @for (recipe of filteredRecipes(); track recipe.id) {
          <div
            class="relative flex flex-col shrink-0 break-words rounded-2xl text-start max-h-2xs h-dvh bg-purple-100 snap-start scale-95 hover:cursor-pointer hover:scale-100 transition-[scale] duration-700"
          >
            <div class="flex items-center justify-between p-2">
              @if (reviews().has(recipe.id)) {
              <span
                class="inline-flex items-center rounded-2xl tabular-nums whitespace-nowrap select-none px-2 min-h-6 text-sm bg-white text-contrast"
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  focusable="false"
                  class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-yellow-500 fill-current leading-[1em]"
                  height="200px"
                  width="200px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                  ></path>
                </svg>
                <span>
                  {{ reviews().get(recipe.id)! | rating: 'average' }}
                  ({{reviews().get(recipe.id)?.length}} Reviews)
                </span>
              </span>
              }
              <button
                class="button button-xs button-solid rounded-full bg-white text-gray-300"
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2.2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  focusable="false"
                  class="inline-block size-4 min-h-[1lh] shrink-0 align-middle leading-[1em] text-current fill-current"
                  height="200px"
                  width="200px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              class="flex flex-col mt-auto gap-1.5 px-4 py-2 rounded-2xl bg-gray-100"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-md font-semibold text-gray-900 overflow-hidden">
                  <a
                    [routerLink]="['/recipes', recipe.id]"
                    class="link-overlay block text-ellipsis overflow-hidden whitespace-nowrap"
                    >{{ recipe.title }}</a
                  >
                </h3>
                <svg
                  [class]="
                    cn(
                      'inline-block size-5 min-h-[1lh] shrink-0 align-middle leading-[1em]',
                      (recipe | difficultyLevel) === 'Easy' && 'text-green-500',
                      (recipe | difficultyLevel) === 'Medium' && 'text-yellow-500',
                      (recipe | difficultyLevel) === 'Advanced' && 'text-red-500'
                    )
                  "
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2.2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  focusable="false"
                  height="200px"
                  width="200px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <circle cx="12" cy="12" r="1"></circle>
                </svg>
              </div>
              <div class="flex gap-2">
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2.2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  focusable="false"
                  class="inline-block size-4 min-h-[1lh] shrink-0 align-middle leading-[1em] mt-0.5 text-purple-500"
                  height="200px"
                  width="200px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="13" r="8"></circle>
                  <path d="M12 9v4l2 2"></path>
                  <path d="M5 3 2 6"></path>
                  <path d="m22 6-3-3"></path>
                  <path d="M6.38 18.7 4 21"></path>
                  <path d="M17.64 18.67 20 21"></path>
                </svg>
                <p class="text-sm text-gray-500">
                  {{ recipe.prepTime + recipe.cookTime }} min • {{ recipe |
                  difficultyLevel }} • by Arlene McCoy
                </p>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
      }

      <!-- No Results -->
      @if (!loading() && filteredRecipes().length === 0) {
      <div
        class="p-8 bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-sm text-center"
      >
        <span class="text-6xl mb-4 block">🔍</span>
        <h3 class="font-semibold text-gray-900 mb-2 text-xl">
          No recipes found
        </h3>
        <p class="text-gray-600 mb-4">Try adjusting your search or filters</p>
        <button
          (click)="clearSearch()"
          class="button button-solid bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
      }
    </div>
  `,
})
export class DiscoverResultsComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly cn = cn;

  // Select data from NgRx store
  protected recipes = this.store.selectSignal(selectAllRecipes);
  protected loading = this.store.selectSignal(selectRecipesLoading);
  protected reviews = this.store.selectSignal(selectReviewsByRecipeMap);
  protected trendingRecipes = this.store.selectSignal(selectTrendingRecipes);
  protected popularRecipes = this.store.selectSignal(selectPopularRecipes);

  // Filter signals
  protected searchQuery = signal<string>("");
  protected filterKey = signal<string>("");
  protected filterValue = signal<string>("");

  // Computed signal for filtered recipes
  protected filteredRecipes = computed(() => {
    let filtered = this.recipes();

    // Special handling for trending/popular filters BEFORE other filters
    const key = this.filterKey();
    const value = this.filterValue();

    // For trending/popular filters, we need reviews to be loaded
    // Only apply these filters if we have reviews data
    const reviewsMap = this.reviews();
    const hasReviews = reviewsMap.size > 0;

    if (key === "isTrending" && value === "true" && hasReviews) {
      filtered = this.trendingRecipes();
    } else if (key === "isPopular" && value === "true" && hasReviews) {
      filtered = this.popularRecipes();
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.category.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query)),
      );
    }

    // Filter by URL params (filter and value) - skip if already handled trending/popular
    if (key && value && value !== "all" && key !== "isTrending" && key !== "isPopular") {
      filtered = filtered.filter((recipe) => {
        // Special case: totalTime with range values
        if (key === "totalTime") {
          const totalTime = recipe.prepTime + recipe.cookTime;

          if (value === "<30") {
            return totalTime < 30;
          }
          if (value === "30-60") {
            return totalTime >= 30 && totalTime <= 60;
          }
          if (value === ">60") {
            return totalTime > 60;
          }

          return false;
        }

        const recipeValue = recipe[key as keyof typeof recipe];

        // Handle different types of properties
        if (Array.isArray(recipeValue)) {
          // For array properties like dietaryTags, mealType
          return recipeValue.includes(value);
        }
        if (typeof recipeValue === "string") {
          // For string properties like cuisine, category
          return recipeValue.toLowerCase() === value.toLowerCase();
        }
        if (typeof recipeValue === "number") {
          // For number properties like spiceLevel
          return recipeValue === Number(value);
        }

        return false;
      });
    }

    return filtered;
  });

  // Computed signal for filter display text
  protected filterDisplayText = computed(() => {
    const key = this.filterKey();
    const value = this.filterValue();

    if (!key || !value || value === "all") {
      return "";
    }

    // Format filter key for display
    const keyMap: Record<string, string> = {
      cuisine: "Cuisine",
      dietaryTags: "Dietary",
      mealType: "Meal Type",
      category: "Category",
      spiceLevel: "Spice Level",
      totalTime: "Cooking Time",
      isTrending: "Filter",
      isPopular: "Filter",
    };

    // Format filter value for display
    let displayValue = "";

    if (key === "totalTime") {
      const timeMap: Record<string, string> = {
        "<30": "Quick (<30 min)",
        "30-60": "Medium (30-60 min)",
        ">60": "Long (60+ min)",
      };
      displayValue = timeMap[value] || value;
    } else if (key === "spiceLevel") {
      const spiceMap: Record<string, string> = {
        "0": "Not Spicy",
        "1": "Mild",
        "2": "Medium",
        "3": "Spicy",
      };
      displayValue = spiceMap[value] || value;
    } else if (key === "isTrending") {
      displayValue = "Trending Now";
    } else if (key === "isPopular") {
      displayValue = "Most Popular";
    } else {
      // Capitalize first letter and replace hyphens with spaces
      displayValue = value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    const displayKey = keyMap[key] || key;

    return `${displayKey}: ${displayValue}`;
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

    // Get query params from URL
    this.route.queryParams.subscribe((params) => {
      // Handle search query (q parameter)
      if (params["q"]) {
        this.searchQuery.set(params["q"]);
      }

      // Handle tag search (legacy parameter)
      if (params["tag"]) {
        this.searchQuery.set(params["tag"]);
      }

      // Handle filter parameters (filter and value)
      if (params["filter"]) {
        this.filterKey.set(params["filter"]);
      }
      if (params["value"]) {
        this.filterValue.set(params["value"]);
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup if necessary
    this.loadReviewsEffect.destroy();
  }

  /**
   * Handle search input change
   */
  protected onSearchChange(): void {
    console.log("🔍 Search query:", this.searchQuery());
    // Update URL with search query
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.searchQuery() || null },
      queryParamsHandling: "merge",
    });
  }

  /**
   * Clear search input and filters
   */
  protected clearSearch(): void {
    this.searchQuery.set("");
    this.filterKey.set("");
    this.filterValue.set("");
    // Clear URL params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  /**
   * Go back to discover page
   */
  protected goBack(): void {
    this.router.navigate(["/discover"]);
  }
}
