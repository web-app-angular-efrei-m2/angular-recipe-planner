import { CommonModule, Location } from "@angular/common";
import { Component, inject, type OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { switchMap, tap } from "rxjs/operators";
import { cn } from "@/utils/classes";
import { type Recipe, RecipeService } from "../../../core/services/recipe.service";
import { type Review, ReviewService } from "../../../core/services/review.service";
import { selectUser } from "../../../core/state/auth/auth.selectors";

@Component({
  selector: "app-recipe-review",
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="relative flex flex-1 flex-col wrap-break-word rounded-sm text-start font-semibold">
      <!-- navigation buttons  -->
      <div class="sticky inset-0 z-10 flex items-center justify-between shrink-0 h-(--header-height) px-6 pt-0 bg-white">
        <button type="button" (click)="goBack()" class="btn btn-sm btn-ghost rounded-full p-0">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        </button>
        <h2 class="text-sm text-gray-800 font-semibold">Add Review</h2>
        <div class="btn-sm p-0"></div>
      </div>
      @if (recipe()) {
        <div class="max-w-5xl mx-auto w-dvw">
          <!-- recipe info  -->
          <div class="flex items-center gap-4 px-6 pb-4">
            <div class="avatar">
              <div class="bg-linear-to-br from-orange-100 to-purple-100 w-20 rounded-2xl">
                <img [src]="recipe()?.imageUrl" alt="Recipe Image" class="" />
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-8 text-orange-300" xmlns="http://www.w3.org/2000/svg"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <p class="text-xs text-muted">{{ recipe()?.category | uppercase }}</p>
              <h3 class="text-ellipsis overflow-hidden whitespace-nowrap text-lg text-gray-800">{{ recipe()?.title }}</h3>
            </div>
          </div>
          <!-- separator  -->
          <hr class="block border-t my-4">
          <!-- review form  -->
          <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="flex flex-col px-6 pb-20">
            <!-- Rating Selection -->
            <fieldset class="flex flex-col items-center gap-4 px-6">
              <p>Your overall rating of this recipe</p>
              <ol class="flex items-center gap-1">
                @for (rating of [1, 2, 3, 4, 5]; track rating) {
                  <li class="inline-flex items-center justify-center transition-[scale] duration-300 hover:scale-115 active:scale-95">
                    <label for="rating-{{ rating }}" [class]="cn(rating > selectedRating() ? 'text-gray-200' : 'text-yellow-500', 'cursor-pointer')">
                      <input id="rating-{{ rating }}" type="radio" [value]="rating" formControlName="rating" class="hidden" (change)="setRating(rating)" />
                      <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-7 min-h-lh shrink-0 align-middle text-current fill-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                    </label>
                  </li>
                }
              </ol>
            </fieldset>
            <!-- separator  -->
            <hr class="block border-t my-4">
            <!-- Comment/Review Text -->
            <div class="flex flex-col gap-2">
              <p class="text-sm">What did you like or dislike?</p>
              <textarea
                formControlName="comment"
                rows="6"
                placeholder="Share your thoughts about this recipe..."
                class="validator input input-lg w-full input-soft placeholder:text-muted h-full resize-none py-2 rounded-lg"
              ></textarea>
              <p class="text-xs text-muted">{{ (reviewForm.get('comment')?.value?.length || 0) }} / 500 characters</p>
            </div>

            <!-- Submission Status Messages -->
            @if (submitting()) {
              <div class="alert alert-info my-4">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-6 shrink-0" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                <span>Submitting your review...</span>
              </div>
            }

            @if (submitSuccess()) {
              <div class="alert alert-success my-4">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-6 shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                <span>Review submitted successfully!</span>
              </div>
            }

            <!-- Form Validation Summary -->
            @if (submitError()) {
              <div class="alert alert-error my-4">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-6 shrink-0" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                <span>{{ submitError() }}</span>
              </div>
            }

            <!-- Form Validation Summary -->
            @if (reviewForm.invalid && submitted) {
              <div class="alert alert-warning my-4">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-6 shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                <div class="flex flex-col gap-1">
                  <span class="font-semibold">Please complete the form:</span>
                  <ul class="text-sm list-disc list-inside space-y-1">
                    @if (reviewForm.get('rating')?.invalid) {
                      <li>Select a star rating</li>
                    }
                    @if (reviewForm.get('comment')?.invalid) {
                      <li>{{ getErrorMessage('comment') }}</li>
                    }
                  </ul>
                </div>
              </div>
            }

            <!-- Form Actions -->
            <button
              type="submit"
              class="btn btn-lg btn-primary rounded-lg mt-4"
              [disabled]="submitting()"
            >
              @if (submitting()) {
                <span class="loading loading-spinner loading-sm"></span>
              }
              Submit Review
            </button>
          </form>
        </div>
      }
    </div>
  `,
})
export class RecipeReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private reviewService = inject(ReviewService);
  private store = inject(Store);

  protected readonly cn = cn;
  protected readonly Validators = Validators;
  protected readonly Math = Math;

  // State
  protected recipeId = signal<string>("");
  protected recipe = signal<Recipe | null>(null);
  protected userId = signal<string>("");
  protected selectedRating = signal<number>(0);
  protected submitting = signal<boolean>(false);
  protected submitSuccess = signal<boolean>(false);
  protected submitError = signal<string>("");

  // Track if form has been submitted
  protected submitted = false;

  // Initialize the reactive form with validation
  protected reviewForm = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    console.log("🔍 RecipeReviewComponent initialized");

    // Get user from store
    this.store.select(selectUser).subscribe((user) => {
      if (user) {
        this.userId.set(user.id);
        console.log("👤 User loaded:", user.email);
      } else {
        console.warn("⚠️ No user in store - redirecting to login");
        this.router.navigate(["/auth/login"]);
      }
    });

    // Extract recipe ID from route and load recipe
    this.route.paramMap
      .pipe(
        tap((params) => {
          this.recipeId.set(params.get("id") || "");
          console.log("📌 Recipe ID from route:", this.recipeId());
        }),
        switchMap((params) => {
          const id = params.get("id") || "";
          return this.recipeService.getRecipeById(id);
        }),
      )
      .subscribe({
        next: (recipe: Recipe) => {
          this.recipe.set(recipe);
          console.log("✅ Recipe loaded:", recipe.title);
        },
        error: (error: Error) => {
          console.error("❌ Failed to load recipe:", error);
          this.submitError.set("Failed to load recipe");
        },
      });
  }

  /**
   * Set rating value when user clicks a star
   */
  protected setRating(rating: number): void {
    // this.reviewForm.patchValue({ rating });
    this.selectedRating.set(rating);
    console.log("⭐ Rating set to:", rating);
  }

  /**
   * Handles form submission
   * Dispatches login action to NgRx Store instead of calling service directly
   */
  onSubmit(): void {
    // Mark form as submitted
    this.submitted = true;

    console.log("🚀 Submitting login form...");

    // Check if form is valid
    if (this.reviewForm.invalid) {
      console.warn("❌ Form is invalid. Please fix errors.");
      return;
    }

    // Get form values (type-safe!)
    const { rating, comment } = this.reviewForm.value;

    console.log("📤 Review submitted:", { rating, comment });

    this.reviewService.createReview({ authorId: this.userId(), recipeId: this.recipeId(), rating: rating as number, comment: comment as string }).subscribe({
      next: (createdReview: Review) => {
        console.log("✅ Review submitted successfully:", createdReview);
        this.submitting.set(false);
        this.submitSuccess.set(true);

        // Redirect back to reviews list after 2 seconds
        setTimeout(() => {
          this.router.navigate(["/recipes", this.recipeId(), "reviews"]);
        }, 2000);
      },
      error: (error: Error) => {
        console.error("❌ Failed to submit review:", error);
        this.submitting.set(false);
        this.submitError.set(error.message || "Failed to submit review. Please try again.");
      },
    });
  }

  getErrorMessage(name: string): string | undefined {
    const control = this.reviewForm.get(name);
    if (control?.hasError("required")) {
      return "Please write a review";
    }
    if (control?.hasError("minlength")) {
      const requiredLength = control.getError("minlength").requiredLength;
      return `Review must be at least ${requiredLength} characters long`;
    }

    if (control?.hasError("maxlength")) {
      const requiredLength = control.getError("maxlength").requiredLength;
      return `Review must be at most ${requiredLength} characters long`;
    }
    return undefined;
  }

  /**
   * Go back to the previous page
   */
  protected goBack(): void {
    this.location.back();
  }
}
