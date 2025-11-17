import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectBookmarkedRecipes, selectRecipesLoading } from "@/app/core/state/recipes/recipes.selectors";
import { selectReviewsByRecipeMap } from "@/app/core/state/reviews/reviews.selectors";
import { DifficultyLevelPipe } from "@/app/shared/pipes/difficulty-level.pipe";
import { RatingPipe } from "@/app/shared/pipes/rating.pipe";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-bookmarks",
  standalone: true,
  imports: [CommonModule, RouterLink, DifficultyLevelPipe, RatingPipe],
  template: `
    <div class="relative flex flex-1 flex-col wrap-break-word rounded-sm text-start font-semibold">
      <!-- Header -->
      <div class="sticky inset-0 z-10 flex items-center justify-center shrink-0 h-(--header-height) px-6 pt-0 bg-white">
        <h2 class="text-sm text-gray-800 font-semibold">Bookmark</h2>
      </div>

      <div class="max-w-5xl mx-auto w-dvw">
        <!-- Content -->
        <div class="flex-1 px-4 py-6 pb-20">
          <!-- Loading State -->
          @if (loading()) {
            <div class="flex items-center justify-center py-16">
              <div class="text-center">
                <span class="loading loading-spinner loading-lg text-orange-500"></span>
                <p class="text-gray-600 text-lg mt-4">Loading bookmarks...</p>
              </div>
            </div>
          }

          <!-- Empty State -->
          @else if (bookmarkedRecipes().length === 0) {
            <div class="flex flex-col items-center justify-center min-h-[60vh]">
              <div class="card alert alert-soft alert-info border w-full max-w-md">
                <div class="card-body text-center w-full">
                  <span class="text-6xl mb-4">🔖</span>
                  <h3 class="card-title font-bold justify-center mb-2">No recipes found</h3>
                  <p class="text-sm mb-4">
                    Start bookmarking your favorite recipes by clicking the heart icon on recipe details!
                  </p>
                  <button
                    routerLink="/recipes"
                    class="btn btn-lg btn-primary rounded-lg"
                  >
                    Explore Recipes
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- Bookmarked Recipes Grid -->
          @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (recipe of bookmarkedRecipes(); track recipe.id) {
                <article
              class="card w-full rounded-2xl snap-start scale-95 hover:cursor-pointer hover:scale-100 transition-[scale] duration-700 shrink-0 min-h-[270px]"
            >
              <!-- Recipe Image -->
              <figure class="relative h-48 bg-purple-100">
                <img
                  [src]="recipe.imageUrl || 'https://placehold.co/400x300/e9d5ff/7c3aed?text=' + recipe.title"
                  [alt]="recipe.title"
                  class="w-full h-full object-cover"
                />
                <!-- Overlay badges and bookmark -->
                <div class="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                  @if (reviews().has(recipe.id)) {
                  <span
                    class="badge badge-md bg-white/95 backdrop-blur-sm text-contrast gap-1 shadow-sm"
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      focusable="false"
                      class="inline-block size-4 min-h-lh shrink-0 align-middle text-yellow-500 fill-current leading-[1em]"
                      height="200px"
                      width="200px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                      ></path>
                    </svg>
                    <span class="text-xs font-medium">
                      {{ reviews().get(recipe.id)! | rating: 'average' }}
                      ({{reviews().get(recipe.id)?.length}})
                    </span>
                  </span>
                  } @else {
                  <span></span>
                  }
                  <button
                    class="btn btn-xs bg-red-100 text-red-500 rounded-full"
                    aria-label="Bookmark recipe"
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="2.2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      focusable="false"
                      class="inline-block size-4 min-h-lh shrink-0 align-middle leading-[1em]"
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
              </figure>

              <!-- Recipe Details -->
              <div class="card-body bg-gray-100 px-4 py-2">
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
            </article>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class BookmarksComponent {
  private store = inject(Store);

  protected readonly cn = cn;

  protected bookmarkedRecipes = this.store.selectSignal(selectBookmarkedRecipes);
  protected loading = this.store.selectSignal(selectRecipesLoading);
  protected reviews = this.store.selectSignal(selectReviewsByRecipeMap);
}
