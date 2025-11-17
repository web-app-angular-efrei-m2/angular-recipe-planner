import { Component, computed, effect, inject, type OnDestroy, type OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { CATEGORY_GROUPS } from "@/app/core/config/categories.config";
import { selectUser } from "@/app/core/state/auth/auth.selectors";
import { loadRecipes } from "@/app/core/state/recipes/recipes.actions";
import { selectAllRecipes, selectRecipesByPopularity, selectRecipesError, selectRecipesLoading } from "@/app/core/state/recipes/recipes.selectors";
import { loadReviewsByRecipeId } from "@/app/core/state/reviews/reviews.actions";
import { selectAreReviewsLoadedForRecipe, selectReviewsByRecipeMap } from "@/app/core/state/reviews/reviews.selectors";
import { SafeHtmlDirective } from "@/app/shared/directives/safe-html.directive";
import { DifficultyLevelPipe } from "@/app/shared/pipes/difficulty-level.pipe";
import { RatingPipe } from "@/app/shared/pipes/rating.pipe";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-recipe-list",
  imports: [RouterLink, DifficultyLevelPipe, RatingPipe, SafeHtmlDirective],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl font-semibold text-gray-400">
      <!-- greeting -->
      <div class="flex flex-1 flex-col pt-4 sm:pt-6">
        <span class="inline-flex gap-1 items-center text-xs sm:text-sm">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle leading-[1em] text-purple-500" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
          Good Morning
        </span>
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">{{ displayName() }}</h1>
      </div>
      <!-- featured -->
      <div class="flex flex-1 flex-col wrap-break-word text-start">
        <div class="flex flex-col pt-4 sm:pt-6 pb-2">
          <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Featured</h2>
        </div>
        <div class="flex flex-1 gap-3 sm:gap-4 overflow-auto snap-x snap-mandatory pb-2">
          <!-- featured card -->
          @for (recipe of featuredRecipes(); track recipe.id) {
            <a
              [routerLink]="['/recipes', recipe.id]"
              class="flex flex-col justify-end wrap-break-word rounded-2xl text-start shrink-0 w-72 sm:w-80 md:max-w-xs aspect-golden bg-cover bg-center snap-start transition-transform hover:scale-105 duration-300 shadow-lg hover:shadow-xl"
              [style.background-image]="recipe.imageUrl ? 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%), url(' + recipe.imageUrl + ')' : ''"
            >
              <div class="flex flex-col px-3 sm:px-4">
                <h3 class="max-w-3/4 text-base sm:text-lg leading-5 font-semibold text-white drop-shadow-lg">{{ recipe.title }}</h3>
              </div>
              <div class="flex items-center gap-1 px-3 sm:px-4 pt-2 pb-3 sm:pb-4 text-xs sm:text-sm text-white">
                <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-500 border border-white"></div>
                <span class="mr-auto">Chef</span>
                <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-3 sm:size-4 min-h-lh shrink-0 align-middle text-current leading-[1em]"  height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>{{ recipe.prepTime + recipe.cookTime }} Min</span>
              </div>
            </a>
          }
        </div>
      </div>
      <!-- Loading State using Signal  -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12 sm:py-16">
          <div class="text-center">
            <span class="loading loading-lg text-orange-500"></span>
            <p class="text-gray-600 text-base sm:text-lg mt-4">Loading delicious recipes...</p>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <div class="flex flex-col items-center justify-center py-8 sm:py-12">
          <div class="card alert alert-soft alert-error border w-full max-w-md mx-4">
            <div class="card-body text-center w-full">
              <span class="text-4xl sm:text-5xl mb-3">❌</span>
              <h3 class="card-title font-bold justify-center mb-2 text-sm sm:text-base">Oops! Something went wrong</h3>
              <p class="text-xs sm:text-sm mb-4">{{ error() }}</p>
              <button
                routerLink="/recipes"
                class="tooltip tooltip-animated tooltip-neutral btn btn-md sm:btn-lg btn-error rounded-lg cursor-default w-full"
                data-tip="Coming soon - Feature not yet implemented"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      }

      @if (!loading() && recipes().length > 0) {
        <!-- categories -->
        <div class="flex flex-1 flex-col wrap-break-word text-start">
          <div class="flex items-center justify-between pt-4 sm:pt-6 pb-2">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Categories</h2>
            <a routerLink="/discover" class="button button-link text-xs sm:text-sm font-semibold text-purple-500">See All</a>
          </div>
          <div class="flex flex-1 gap-2 overflow-auto snap-x snap-mandatory pb-2">
            <a routerLink="/discover/results" class="inline-flex items-center shrink-0 rounded-2xl tabular-nums whitespace-nowrap select-none px-3 sm:px-4 min-h-7 sm:min-h-8 text-xs sm:text-sm bg-purple-500 text-contrast snap-start">All Categories</a>
            @for (group of categoryGroups; track group.id) {
              <a
              [routerLink]="['/discover/results']"
              [queryParams]="{ filter: group.subcategories[0].filterKey, value: group.subcategories[0].filterValue }"
              class="inline-flex items-center gap-1.5 sm:gap-2 shrink-0 rounded-2xl tabular-nums whitespace-nowrap select-none px-3 sm:px-4 min-h-7 sm:min-h-8 text-xs sm:text-sm bg-gray-100 text-contrast snap-start"
              >
                <span class="text-gray-400 text-sm sm:text-base" [appSafeHtml]="group.icon"></span>
                <span>{{ group.name }}</span>
              </a>
            }
          </div>
        </div>
        <!-- popular recipes -->
        <div class="flex flex-1 flex-col wrap-break-word text-start">
          <div class="flex items-center justify-between pt-4 sm:pt-6 pb-2">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Popular Recipes</h2>
            <button type="button" class="button button-link text-xs sm:text-sm font-semibold text-purple-500">See All</button>
          </div>
          <div class="flex flex-1 flex-row gap-2 sm:gap-3 overflow-auto snap-x snap-mandatory pb-2">
            <!-- recipe card -->
            @for (recipe of trendingRecipes(); track recipe.id) {
              <article class="relative flex flex-col shrink-0 wrap-break-word rounded-2xl text-start w-60 sm:w-64 md:max-w-2xs aspect-landscape bg-cover bg-center snap-start scale-95 hover:cursor-pointer hover:scale-100 transition-[scale] duration-700 shadow-md hover:shadow-xl"
                [style.background-image]="recipe.imageUrl ? 'url(' + recipe.imageUrl + ')' : ''"
              >
                <div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-gray-900/90 rounded-2xl"></div>
                <div class="relative flex items-center justify-between p-1.5 sm:p-2 z-10">
                @if (reviews().has(recipe.id)) {
                    <span class="inline-flex items-center rounded-2xl tabular-nums whitespace-nowrap select-none px-1.5 sm:px-2 min-h-5 sm:min-h-6 text-xs sm:text-sm bg-white/95 backdrop-blur-sm text-contrast shadow-sm">
                      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-3 sm:size-4 min-h-lh shrink-0 align-middle text-yellow-500 fill-current leading-[1em]"  height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                      <span class="hidden sm:inline"> {{ reviews().get(recipe.id)! | rating: 'average' }} ({{reviews().get(recipe.id)?.length}} Reviews)
                      </span>
                      <span class="sm:hidden"> {{ reviews().get(recipe.id)! | rating: 'average' }}
                      </span>
                    </span>
                  }
                  <button class="btn btn-xs p-0 btn-md rounded-full bg-white/95 backdrop-blur-sm text-gray-300 shadow-sm hover:text-red-500 transition-colors">
                    <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-3 sm:size-4 min-h-lh shrink-0 align-middle leading-[1em] text-current fill-current" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                  </button>
                </div>
                <div class="relative flex flex-col mt-auto gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white/95 backdrop-blur-sm z-10 mx-1.5 sm:mx-2 mb-1.5 sm:mb-2 shadow-lg">
                  <div class="flex items-center justify-between gap-2">
                    <h3 class="text-sm sm:text-md font-semibold text-gray-900 overflow-hidden flex-1">
                      <a [routerLink]="['/recipes', recipe.id]" class="link-overlay block text-ellipsis overflow-hidden whitespace-nowrap">{{ recipe.title }}</a>
                    </h3>
                    <svg
                    [class]="
                      cn(
                        'inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle leading-[1em]',
                        (recipe | difficultyLevel) === 'Easy' && 'text-green-500',
                        (recipe | difficultyLevel) === 'Medium' && 'text-yellow-500',
                        (recipe | difficultyLevel) === 'Advanced' && 'text-red-500'
                      )
                    "
                    stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="12" cy="12" r="1"></circle></svg>
                  </div>
                  <div class="flex gap-1.5 sm:gap-2 items-start">
                    <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-3 sm:size-4 min-h-lh shrink-0 align-middle leading-[1em] mt-0.5 text-purple-500" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2 2"></path><path d="M5 3 2 6"></path><path d="m22 6-3-3"></path><path d="M6.38 18.7 4 21"></path><path d="M17.64 18.67 20 21"></path></svg>
                    <p class="text-xs sm:text-sm text-gray-500 leading-tight">{{ recipe.prepTime + recipe.cookTime }} min • {{ recipe | difficultyLevel }} <span class="hidden sm:inline">• by Arlene McCoy</span></p>
                  </div>
                </div>
              </article>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  protected readonly cn = cn;

  // Select data from NgRx store
  protected recipes = this.store.selectSignal(selectAllRecipes);
  protected loading = this.store.selectSignal(selectRecipesLoading);
  protected error = this.store.selectSignal(selectRecipesError);

  // Select current user from NgRx store
  protected user = this.store.selectSignal(selectUser);

  // Select reviews from NgRx store
  protected reviews = this.store.selectSignal(selectReviewsByRecipeMap);

  // Select recipes sorted by popularity for trending section
  protected recipesByPopularity = this.store.selectSignal(selectRecipesByPopularity);

  // Category configuration
  protected categoryGroups = CATEGORY_GROUPS;

  // Computed: Trending recipes - Top 5 recipes sorted by popularity (review count * rating)
  protected trendingRecipes = computed(() => {
    return this.recipesByPopularity().slice(0, 5);
  });

  // Computed: Featured recipes - First 3 recipes with images for the featured section
  protected featuredRecipes = computed(() => {
    return this.recipes()
      .filter((recipe) => recipe.imageUrl) // Only recipes with images
      .slice(0, 3);
  });

  // Computed: Display name - User's name or email prefix
  protected displayName = computed(() => {
    const currentUser = this.user();
    if (!currentUser) {
      return "Guest";
    }
    if (currentUser.name) {
      return currentUser.name;
    }
    // Extract email prefix (before @)
    return currentUser.email.split("@")[0];
  });

  // Effect to load reviews for all recipes (needed for popularity calculation)
  // Only loads reviews that haven't been loaded yet to avoid duplicate API calls
  private loadReviewsEffect = effect(() => {
    const allRecipes = this.trendingRecipes();

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
    // If you had manual effects, you would clean them up here
    this.loadReviewsEffect.destroy();
  }
}
