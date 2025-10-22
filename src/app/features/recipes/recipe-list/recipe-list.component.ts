import { Component, computed, inject, type OnInit, signal } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";
import { forkJoin } from "rxjs";
import { CATEGORY_GROUPS } from "@/app/core/config/categories.config";
import { type Recipe, RecipeService } from "@/app/core/services/recipe.service";
import type { Review } from "@/app/core/services/review.service";
import { ReviewService } from "@/app/core/services/review.service";
import { DifficultyLevelPipe } from "@/app/shared/pipes/difficulty-level.pipe";
import { RatingPipe } from "@/app/shared/pipes/rating.pipe";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-recipe-list",
  imports: [RouterLink, DifficultyLevelPipe, RatingPipe],
  template: `
    <div class="container mx-auto px-4 max-w-7xl font-semibold text-gray-400">
      <!-- greeting -->
      <div class="flex flex-1 flex-col pt-6">
        <span class="inline-flex gap-1 items-center text-sm">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle leading-[1em] text-purple-500" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
          Good Morning
        </span>
        <h1 class="text-2xl font-semibold text-gray-900">Alena Sabyan</h1>
      </div>
      <!-- featured -->
      <div class="flex flex-1 flex-col break-words text-start">
        <div class="flex flex-col pt-6 pb-2">
          <h2 class="text-xl font-semibold text-gray-900">Featured</h2>
        </div>
        <div class="flex flex-1 gap-4 overflow-auto snap-x snap-mandatory">
          <!-- featured card -->
          <div class="flex flex-col justify-end break-words rounded-2xl text-start shrink-0 max-w-xs aspect-golden bg-purple-100 snap-start">
            <div class="flex flex-col px-4 ">
              <h3 class="max-w-3/4 text-lg leading-5 font-semibold text-gray-900">Asian white noodle with extra seafood</h3>
            </div>
            <div class="flex items-center gap-1 px-4 pt-2 pb-4 text-sm">
              <div class="w-6 h-6 rounded-full bg-purple-500 border"></div>
              <span class="mr-auto">James Spacer</span>
              <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]"  height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>20 Min</span>
            </div>
          </div>
          <!-- featured card -->
          <div class="flex flex-col justify-end break-words rounded-2xl text-start shrink-0 max-w-xs aspect-golden bg-purple-100 snap-start">
            <div class="flex flex-col px-4 ">
              <h3 class="max-w-3/4 text-lg leading-5 font-semibold text-gray-900">Asian white noodle with extra seafood</h3>
            </div>
            <div class="flex items-center gap-1 px-4 pt-2 pb-4 text-sm">
              <div class="w-6 h-6 rounded-full bg-purple-500 border"></div>
              <span class="mr-auto">James Spacer</span>
              <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]"  height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>20 Min</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Loading State using Signal ⭐⭐⭐ -->
      @if (loading()) {
        <div class="flex items-center justify-center py-16">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
            <span class="text-gray-600 text-lg">Loading delicious recipes...</span>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <div class="p-6 bg-red-50 border-2 border-red-200 rounded-2xl shadow-sm">
          <div class="flex items-start gap-3">
            <span class="text-3xl">❌</span>
            <div>
              <h3 class="font-semibold text-red-900 mb-1">Oops! Something went wrong</h3>
              <p class="text-red-600">{{ error() }}</p>
            </div>
          </div>
        </div>
      }
      @if (!loading() && recipes().length > 0) {
        <!-- categories -->
        <div class="flex flex-1 flex-col break-words text-start">
          <div class="flex items-center justify-between pt-6 pb-2">
            <h2 class="text-xl font-semibold text-gray-900">Categories</h2>
            <a routerLink="/discover" class="button button-link text-sm font-semibold text-purple-500">See All</a>
          </div>
          <div class="flex flex-1 gap-2 overflow-auto snap-x snap-mandatory">
            <a routerLink="/recipes" class="inline-flex items-center shrink-0 rounded-2xl tabular-nums whitespace-nowrap select-none px-4 min-h-8 text-sm bg-purple-500 text-contrast snap-start">All Categories</a>
            @for (group of categoryGroups; track group.id) {

              <a
              [routerLink]="['/discover/results']"
              [queryParams]="{ filter: group.subcategories[0].filterKey, value: group.subcategories[0].filterValue }"
              class="inline-flex items-center gap-2 shrink-0 rounded-2xl tabular-nums whitespace-nowrap select-none px-4 min-h-8 text-sm bg-gray-100 text-contrast snap-start"
              >
                <span class="text-gray-400" [innerHTML]="sanitizeHtml(group.icon)"></span>
                <span>{{ group.name }}</span>
              </a>
            }
          </div>
        </div>
        <!-- popular recipes -->
        <div class="flex flex-1 flex-col break-words text-start">
          <div class="flex items-center justify-between pt-6 pb-2">
            <h2 class="text-xl font-semibold text-gray-900">Popular Recipes</h2>
            <button type="button" class="button button-link text-sm font-semibold text-purple-500">See All</button>
          </div>
          <div class="flex flex-1 flex-row gap-2 overflow-auto snap-x snap-mandatory">
            <!-- recipe card -->
            @for (recipe of trendingRecipes(); track recipe.id) {
              <div class="relative flex flex-col shrink-0 break-words rounded-2xl text-start max-w-2xs aspect-landscape bg-purple-100 snap-start scale-95 hover:cursor-pointer hover:scale-100 transition-[scale] duration-700"
              >
                <div class="flex items-center justify-between p-2">
                @if (reviews().has(recipe.id)) {
                    <span class="inline-flex items-center rounded-2xl tabular-nums whitespace-nowrap select-none px-2 min-h-6 text-sm bg-white text-contrast">
                      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-yellow-500 fill-current leading-[1em]"  height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                      <span> {{ reviews().get(recipe.id)! | rating: 'average' }} ({{reviews().get(recipe.id)?.length}} Reviews)
                      </span>
                    </span>
                  }
                  <button class="button button-xs button-solid rounded-full bg-white text-gray-300">
                    <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle leading-[1em] text-current fill-current" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                  </button>
                </div>
                <div class="flex flex-col mt-auto gap-1.5 px-4 py-2 rounded-2xl bg-gray-100">
                  <div class="flex items-center justify-between">
                    <h3 class="text-md font-semibold text-gray-900 overflow-hidden">
                      <a [routerLink]="['/recipes', recipe.id]" class="link-overlay block text-ellipsis overflow-hidden whitespace-nowrap">{{ recipe.title }}</a>
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
                    stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="12" cy="12" r="1"></circle></svg>
                  </div>
                  <div class="flex gap-2">
                    <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle leading-[1em] mt-0.5 text-purple-500" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2 2"></path><path d="M5 3 2 6"></path><path d="m22 6-3-3"></path><path d="M6.38 18.7 4 21"></path><path d="M17.64 18.67 20 21"></path></svg>
                    <p class="text-sm text-gray-500">{{ recipe.prepTime + recipe.cookTime }} min • {{ recipe | difficultyLevel }} • by Arlene McCoy</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class RecipeListComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private readonly reviewService = inject(ReviewService);
  protected reviews = signal<Map<string, Review[]>>(new Map());
  private sanitizer = inject(DomSanitizer);

  protected readonly cn = cn;

  // Signal for loading state
  protected loading = signal<boolean>(false);

  // Signal for recipes data
  protected recipes = signal<Recipe[]>([]);

  // Signal for error state
  protected error = signal<string | null>(null);

  // Category configuration
  protected categoryGroups = CATEGORY_GROUPS;

  // Computed signal for unique categories
  protected categories = computed(() => {
    const allRecipes = this.recipes();
    const uniqueCategories = [...new Set(allRecipes.map((r) => r.category))];
    return uniqueCategories.sort().splice(0, 4); // Top 5 categories
  });

  // Computed: Trending recipes (top recipes with most reviews or highest ratings)
  protected trendingRecipes = computed(() => {
    const allRecipes = this.recipes();
    const reviewsMap = this.reviews();

    // Sort recipes by number of reviews
    const sorted = [...allRecipes].sort((a, b) => {
      const aReviews = reviewsMap.get(a.id)?.length || 0;
      const bReviews = reviewsMap.get(b.id)?.length || 0;
      return bReviews - aReviews;
    });

    return sorted.slice(0, 5); // Top 5 trending recipes
  });

  ngOnInit(): void {
    this.loadRecipes();
  }

  /**
   * Load recipes from the API
   */
  private loadRecipes(): void {
    // Set loading to true
    this.loading.set(true);
    this.error.set(null);

    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        console.log("✅ Recipes loaded:", recipes);
        this.recipes.set(recipes);
        this.loadReviews(recipes);
      },
      error: (err) => {
        console.error("❌ Error loading recipes:", err);
        this.error.set(err.message);
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
    // Search is reactive via signal, no action needed
  }

  /**
   * Get random number of reviews for demo purposes
   */
  protected getRandomReviews(): number {
    return Math.floor(Math.random() * 200) + 50;
  }

  /**
   * Calculate mock calories based on recipe attributes
   */
  protected getCalories(recipe: Recipe): number {
    // Simple mock calculation
    const baseCalories = 200;
    const ingredientFactor = recipe.ingredients.length * 30;
    const servingFactor = Math.floor(100 / recipe.servings);
    return baseCalories + ingredientFactor + servingFactor;
  }

  /**
   * Sanitize HTML for SVG icons
   */
  protected sanitizeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
