import { Component, computed, inject, type OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { forkJoin } from "rxjs";
import { type Recipe, RecipeService } from "@/app/core/services/recipe.service";
import { type Review, ReviewService } from "@/app/core/services/review.service";
import { DifficultyLevelPipe } from "@/app/shared/pipes/difficulty-level.pipe";
import { cn } from "@/utils/classes";
import { RatingPipe } from "../../shared/pipes/rating.pipe";

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
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm text-gray-800 font-semibold">
            Found
            <span class="text-purple-500">{{ filteredRecipes().length }}</span>
            recipes
          </h3>
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
export class DiscoverResultsComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private readonly reviewService = inject(ReviewService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly cn = cn;

  // Signals for state management
  protected recipes = signal<Recipe[]>([]);
  protected loading = signal<boolean>(false);

  // Filter signals
  protected searchQuery = signal<string>("");

  protected reviews = signal<Map<string, Review[]>>(new Map());

  // Computed signal for filtered recipes
  protected filteredRecipes = computed(() => {
    let filtered = this.recipes();

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
    return filtered;
  });

  ngOnInit(): void {
    this.loadRecipes();

    // Get query params from URL
    this.route.queryParams.subscribe((params) => {
      if (params["q"]) {
        this.searchQuery.set(params["q"]);
      }
      if (params["tag"]) {
        this.searchQuery.set(params["tag"]);
      }
    });
  }

  /**
   * Load all recipes from the API
   */
  private loadRecipes(): void {
    // Set loading to true
    this.loading.set(true);

    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        console.log("✅ Recipes loaded:", recipes);
        this.recipes.set(recipes);
        this.loadReviews(recipes);
      },
      error: (err) => {
        console.error("❌ Error loading recipes:", err);
        this.loading.set(false);
      },
    });
  }

  private loadReviews(recipes: Recipe[]) {
    // Create an array of observables for all review requests
    const reviewObservables = recipes.map((recipe) => this.reviewService.getReviewsByRecipeId(recipe.id));

    // Use forkJoin to wait for all requests to complete
    forkJoin(reviewObservables).subscribe({
      next: (reviewsArray) => {
        const reviewsMap = new Map<string, Review[]>();

        // Map each review array to its recipe ID
        recipes.forEach((recipe, index) => {
          reviewsMap.set(recipe.id, reviewsArray[index]);
          console.log("✅ Reviews loaded:", reviewsArray[index].length, "for:", recipe.id);
        });

        this.reviews.set(reviewsMap);
        this.loading.set(false);
        console.log("✅ All reviews loaded successfully");
      },
      error: (error: Error) => {
        console.error("❌ Failed to load reviews:", error);
        this.loading.set(false);
      },
    });
  }

  /**
   * Handle search input change
   */
  protected onSearchChange(): void {
    console.log("🔍 Search query:", this.searchQuery());
  }

  /**
   * Clear search input
   */
  protected clearSearch(): void {
    this.searchQuery.set("");
  }

  /**
   * Go back to discover page
   */
  protected goBack(): void {
    this.router.navigate(["/discover"]);
  }
}
