import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, inject, type OnInit, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { catchError, type Observable, of, switchMap, tap } from "rxjs";
import { type Recipe, RecipeService } from "@/app/core/services/recipe.service";
import { DifficultyLevelPipe } from "@/app/shared/pipes/difficulty-level.pipe";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-recipe-detail",
  imports: [CommonModule, AsyncPipe, RouterLink, DifficultyLevelPipe],
  template: `
    <div class="flex flex-1 flex-col h-[calc(100dvh-97px)] break-words rounded-sm text-start font-semibold text-gray-400 bg-purple-100">
      <!-- navigation buttons  -->
      <div class="flex items-center justify-between px-6 pt-6">
        <a routerLink="/recipes" class="button button-sm button-solid rounded-full bg-white p-0">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        </a>
        <button type="button" class="button button-sm button-solid rounded-full bg-white p-0">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
        </button>
      </div>
       <!-- Loading State -->
      @if (loading()) {
        <div class="flex items-center justify-center py-16">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
            <span class="text-gray-600 text-lg">Loading recipe...</span>
          </div>
        </div>
      }
      <!-- Error State -->
      @if (error()) {
        <div class="p-6 bg-red-50 border-2 border-red-200 rounded-2xl shadow-sm">
          <div class="flex items-start gap-3">
            <span class="text-3xl">❌</span>
            <div>
              <h3 class="font-semibold text-red-900 mb-1">Recipe Not Found</h3>
              <p class="text-red-600">{{ error() }}</p>
              <button
                routerLink="/recipes"
                class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Return to Recipe List
              </button>
            </div>
          </div>
        </div>
      }
      <!-- Recipe Content using async pipe -->
      @if (recipe$ | async; as recipe) {
        <!-- media gallery   -->
        <div class="flex items-center justify-center mt-auto pb-6">
          <div class="p-1.5 rounded-xl overflow-hidden bg-white max-w-3/4">
            <div class="flex gap-1.5 overflow-auto snap-x snap-mandatory">
              @for (i of [1, 2, 3, 4]; track i) {
                <div class="w-13 h-13 bg-gray-100 rounded-xl shrink-0 snap-start"></div>
              }
            </div>
          </div>
        </div>
        <!-- recipe details   -->
        <article class="flex flex-col gap-4 h-4/6 p-6 rounded-t-2xl bg-white overflow-auto">
          <!-- category & rating   -->
          <div class="flex items-center gap-1 text-sm">
            <span class="mr-auto">{{ recipe?.category }}</span>
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-yellow-500 fill-current leading-[1em]"  height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
            <span>4.9</span>
          </div>
          <!-- title & difficulty  -->
          <div class="flex justify-between">
            <h2 class="text-xl font-semibold text-gray-900 max-w-3/4">{{ recipe?.title }}</h2>
            <svg
            [class]="
              cn(
                'inline-block size-5 min-h-[1lh] shrink-0 align-middle leading-[1em] mt-0.5',
                (recipe | difficultyLevel) === 'Easy' && 'text-green-500',
                (recipe | difficultyLevel) === 'Medium' && 'text-yellow-500',
                (recipe | difficultyLevel) === 'Advanced' && 'text-red-500'
              )
            "
            stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="12" cy="12" r="1"></circle></svg>
          </div>
          <!-- chef   -->
          <div class="flex flex-col gap-1.5">
            <p class="text-sm text-gray-800">Recipe by</p>
            <div class="flex items-center gap-2">
              <!-- avatar   -->
              <div class="w-13 h-13 bg-gray-200 rounded-full"></div>
              <div class="flex flex-col text-sm mr-auto">
                <span class="text-gray-800">Dianne Russel</span>
                <span>Chef</span>
              </div>
              <button type="button" class="button button-sm button-solid rounded-full bg-gray-100 text-purple-500 p-0">
                <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
              </button>
              <button type="button" class="button button-sm button-solid rounded-full bg-gray-100 text-purple-500 p-0">
                <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </button>
            </div>
          </div>
          <!-- description   -->
          <div class="flex flex-col gap-1.5">
            <p class="text-md text-gray-800">Description</p>
            <p class="text-sm line-clamp-3">{{ recipe?.description }}</p>
          </div>
          <!-- cooking time   -->
          <div class="flex gap-2">
            <div class="flex flex-1 items-center gap-2 p-2 rounded-xl bg-gray-100">
              <span class="size-10 bg-white flex items-center justify-center rounded-full">
                <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-purple-500 leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </span>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Cooking Time</span>
                <span class="text-sm text-purple-500">{{ recipe?.cookTime }} min</span>
              </div>
            </div>
            <div class="flex flex-1 items-center gap-2 p-2 rounded-xl bg-gray-100">
              <span class="size-10 bg-white flex items-center justify-center rounded-full">
              <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-purple-500 leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V2"></path><path d="m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5"></path><path d="M2 14h12a2 2 0 0 1 0 4h-2"></path><path d="M4 10h16"></path><path d="M5 10a7 7 0 0 1 14 0"></path><path d="M5 14v6a1 1 0 0 1-1 1H2"></path></svg>
              </span>
              <div class="flex flex-col">
                <span class="text-xs text-gray-500">Cuisine</span>
                <span class="text-sm text-purple-500">{{ recipe?.category }}</span>
              </div>
            </div>
          </div>
          <!-- ingredients   -->
          <details class="accordion group rounded-xl text-gray-500 bg-gray-100 open:[--height:96px]">
            <summary class="button button-lg justify-start gap-1 w-full">
              <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-purple-500 leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V2"></path><path d="m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5"></path><path d="M2 14h12a2 2 0 0 1 0 4h-2"></path><path d="M4 10h16"></path><path d="M5 10a7 7 0 0 1 14 0"></path><path d="M5 14v6a1 1 0 0 1-1 1H2"></path></svg>
              <span class="text-sm mr-auto">Ingredients</span>
              <span class="text-sm">{{ recipe?.servings }} Serving</span>
              <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-purple-500 leading-[1em] transition-[rotate] duration-300 group-open:rotate-180" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6"></path></svg>
            </summary>
            <div class="h-full px-4 pb-2">
              <ul class="flex flex-col list-disc h-full overflow-auto">
                @for (ingredient of recipe?.ingredients; track $index) {
                  <li class="whitespace-normal items-center text-sm ml-6 marker:text-purple-500/60">{{ ingredient }}</li>
                }
              </ul>
            </div>
          </details>
          <!-- reviews   -->
          <a routerLink="#" class="button button-lg button-subtle justify-start rounded-xl font-semibold text-gray-500 bg-gray-100 open:[--height:96px]">
            <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
            <span class="mr-auto">Reviews</span>
            <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-purple-500 leading-[1em] -rotate-90" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6"></path></svg>
          </a>
        </article>
      }
    </div>
  `,
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  protected readonly cn = cn;

  protected recipe$: Observable<Recipe> | null = null;
  // Signal for loading state
  protected loading = signal<boolean>(false);
  // Signal for error state
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    console.log("🔍 RecipeDetailComponent initialized - reading route parameter...");

    /**
     * CRITICAL: Observable-based parameter handling ⭐⭐⭐
     *
     * this.route.paramMap is an Observable that emits whenever route params change
     * We use switchMap to:
     * 1. Get the latest param value
     * 2. Cancel any pending HTTP request
     * 3. Start a new HTTP request with the new ID
     */
    this.recipe$ = this.route.paramMap.pipe(
      // Log the parameter extraction
      tap((params) => {
        const id = params.get("id");
        console.log(`📌 Route parameter 'id' extracted: ${id}`);
        this.loading.set(true);
        this.error.set(null);
      }),

      // switchMap: Cancel previous request and switch to new one
      switchMap((params) => {
        const id = params.get("id");

        // Validate ID exists
        if (!id) {
          console.error("❌ No ID parameter found in route");
          this.loading.set(false);
          this.error.set("Recipe ID is missing");
          return of(null as unknown as Recipe); // Return empty observable
        }

        console.log(`🌐 Fetching recipe with ID: ${id}`);

        // Make HTTP request to get recipe by ID
        return this.recipeService.getRecipeById(id).pipe(
          // Success handler
          tap((recipe) => {
            console.log("✅ Recipe loaded successfully:", recipe?.title);
            this.loading.set(false);
          }),

          // Error handler
          catchError((error) => {
            console.error("❌ Failed to load recipe:", error);
            this.loading.set(false);
            this.error.set(error.message || "Failed to load recipe. Please try again.");
            return of(null as unknown as Recipe); // Return empty to prevent template errors
          }),
        );
      }),
    );
  }
}
