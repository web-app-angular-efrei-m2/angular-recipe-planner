import { CommonModule, Location } from "@angular/common";
import { Component, inject, type OnInit, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { switchMap, tap } from "rxjs/operators";
import { RatingPipe } from "@/app/shared/pipes/rating.pipe";
import { cn } from "@/utils/classes";
import { type Recipe, RecipeService } from "../../../core/services/recipe.service";
import { type Review, ReviewService } from "../../../core/services/review.service";

@Component({
  selector: "app-recipe-reviews-list",
  imports: [CommonModule, RouterLink, RatingPipe],
  template: `
    <div class="relative flex flex-1 flex-col h-[calc(100dvh-97px)] break-words rounded-sm text-start font-semibold text-gray-400">
      <!-- navigation buttons  -->
       <div class="sticky inset-0 z-10 flex items-center justify-between shrink-0 h-[var(--header-height)] px-6 pt-0 bg-white">
        <button type="button" (click)="goBack()" class="button button-sm button-ghost rounded-full p-0">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        </button>
        <h2 class="text-sm text-gray-800 font-semibold">Reviews</h2>
        <div class="button-sm p-0"></div>
       </div>
      <!-- ratings  -->
      <div class="flex flex-col px-6 py-4">
        <div class="flex items-center gap-2 p-4 rounded-2xl bg-gray-100">
          <div class="flex flex-1 flex-col gap-4">
            <dl class="relative flex flex-1 flex-col">
              <dd class="align-baseline font-semibold tracking-tight proportional-nums inline-flex items-end gap-1 text-gray-800">
                <span class="text-2xl">{{ reviews() | rating:'average' }}</span>
                <span class="text-sm leading-6">/5</span>
              </dd>
              <dt class="inline-flex gap-1.5 items-center text-sm">Based on {{ reviews().length }} Reviews</dt>
            </dl>
            <ol class="flex items-center gap-1">
              @for (rating of [1, 2, 3, 4, 5]; track rating) {
                <li class="inline-flex items-center gap-2">
                  @if (rating === Math.ceil(reviews() | rating:'average') && (reviews() | rating:'average') % 1 !== 0) {
                    <span class="relative flex items-center">
                      <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="absolute inset-0 z-2 inline-block size-5 min-h-[1lh] shrink-0 align-middle text-yellow-400 fill-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2"></path></svg>
                      <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-gray-200 fill-current leading-[1em] -scale-x-100" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2"></path></svg>
                    </span>
                  }
                  @else {
                    <span class="relative flex items-center">
                      <svg
                        [class]="
                          cn(
                            'inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current fill-current leading-[1em]',
                            rating <= (reviews() | rating:'average') ? 'text-yellow-400' : 'text-gray-200'
                          )
                        "
                        stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                      </svg>
                    </span>
                  }
                </li>
              }
            </ol>
          </div>
          <ol class="flex flex-1 flex-col gap-2">
            @for (rating of [5,4,3,2,1]; track rating) {
              <li class="inline-flex items-center gap-2">
                <span class="text-xs">{{ rating }} Star</span>
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-yellow-400 transition-all"
                    [style.width.%]="reviews() | rating:'percentage':rating"
                  ></div>
                </div>
                <span class="text-xs">{{ reviews() | rating:'count':rating }}</span>
              </li>
            }
          </ol>
        </div>
      </div>
      <!-- add review button  -->
      <div class="flex flex-col px-6">
         <a [routerLink]="['/recipes', recipeId(), 'review', 'new']" class="button button-lg button-subtle justify-start rounded-xl font-semibold text-gray-500 bg-gray-100">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>
          <span class="mr-auto">Add Review</span>
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-purple-500 leading-[1em] -rotate-90" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6"></path></svg>
        </a>
      </div>
      <!-- review list  -->
      <div class="flex flex-1 flex-col break-words text-start px-6 py-4">
        <div class="sticky top-[var(--header-height)] flex items-center justify-between pb-2 bg-white">
          <h3 class="text-sm text-gray-800 font-semibold">User reviews</h3>
          <button class="button button-xs button-ghost justify-start rounded-xl text-gray-800 hover:bg-opacity-7 active:bg-opacity-5">
            <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="M11 4h4"></path><path d="M11 8h7"></path><path d="M11 12h10"></path></svg>
            <span class="mr-auto">Most useful</span>
            <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6"></path></svg>
          </button>
        </div>
        <ul class="flex flex-col flex-1 gap-4 snap-y snap-mandatory">
          @for (review of reviews(); track review.id) {
            <li class="inline-flex flex-col gap-2 p-4 rounded-2xl bg-gray-100">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gray-200"></div>
                <span class="text-sm font-semibold text-gray-800">{{ review.author.email }}</span>
                <span class="text-xs text-gray-500">{{ getTimeAgo(review.createdAt) }}</span>
              </div>
              <p class="text-sm">" {{ review.comment }} "</p>
            </li>
          }
        </ul>
      </div>
      <!-- todo  -->
    </div>
  `,
  styles: [],
})
export class RecipeReviewsListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly recipeService = inject(RecipeService);
  private readonly reviewService = inject(ReviewService);

  protected readonly cn = cn;
  protected readonly Math = Math;

  protected recipeId = signal<string>("");
  protected recipe = signal<Recipe | null>(null);
  protected reviews = signal<Review[]>([]);
  protected loading = signal<boolean>(true);

  ngOnInit(): void {
    // Get recipe ID from route and load recipe + reviews
    this.route.paramMap
      .pipe(
        tap((params) => {
          this.recipeId.set(params.get("id") || "");
          console.log("📌 Recipe ID from route:", this.recipeId);
        }),
        switchMap((params) => {
          const id = params.get("id") || "";
          return this.recipeService.getRecipeById(id);
        }),
      )
      .subscribe({
        next: (recipe: Recipe) => {
          console.log("✅ Recipe loaded:", recipe.title);
          this.loadReviews();
        },
        error: (error: Error) => {
          console.error("❌ Failed to load recipe:", error);
          this.loading.set(false);
        },
      });
  }

  private loadReviews(): void {
    this.reviewService.getReviewsByRecipeId(this.recipeId()).subscribe({
      next: (reviews) => {
        // Reviews already have author data populated by the service
        const sortedReviews = reviews.sort((a, b) => b.createdAt - a.createdAt);
        this.reviews.set(sortedReviews);
        console.log("✅ Reviews loaded:", reviews.length);
        this.loading.set(false);
      },
      error: (error: Error) => {
        console.error("❌ Failed to load reviews:", error);
        this.loading.set(false);
      },
    });
  }

  protected getUserInitial(email: string): string {
    // Get first character of email as initial
    return email.charAt(0).toUpperCase();
  }

  protected getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }
    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
    return "Just now";
  }

  /**
   * Go back to the previous page
   */
  protected goBack(): void {
    this.location.back();
  }
}
