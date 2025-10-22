import { CommonModule, Location } from "@angular/common";
import { Component, inject, type OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { switchMap, tap } from "rxjs/operators";
import { FieldComponent } from "@/shared/components/ui/form/field/field.component";
import { cn } from "@/utils/classes";
import { type Recipe, RecipeService } from "../../../core/services/recipe.service";
import { type Review, ReviewService } from "../../../core/services/review.service";
import { selectUser } from "../../../core/state/auth/auth.selectors";

/**
 * Recipe Review Component
 *
 * Allows authenticated users to submit reviews (rating + comment) for recipes.
 * Demonstrates:
 * - Nested routing (/recipes/:id/review)
 * - Reactive Forms with validation
 * - HTTP POST to create reviews
 * - Route parameter extraction
 * - NgRx Store integration for user data
 */
@Component({
  selector: "app-recipe-review",
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FieldComponent],
  template: `
    <div class="relative flex flex-1 flex-col h-[calc(100dvh-97px)] break-words rounded-sm text-start font-semibold">
      <!-- navigation buttons  -->
      <div class="sticky inset-0 z-10 flex items-center justify-between shrink-0 h-[var(--header-height)] px-6 pt-0 bg-white">
        <button type="button" (click)="goBack()" class="button button-sm button-ghost rounded-full p-0">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-5 min-h-[1lh] shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        </button>
        <h2 class="text-sm text-gray-800 font-semibold">Add Review</h2>
        <div class="button-sm p-0"></div>
      </div>
      @if (recipe()) {
        <!-- todo  -->
        <div class="flex items-center gap-4 px-6">
          <div class="w-20 h-20 rounded-2xl bg-gray-200"></div>
          <div class="flex flex-col gap-1">
            <p class="text-xs text-gray-400">{{ recipe()?.category | uppercase }}</p>
            <h3 class="text-ellipsis overflow-hidden whitespace-nowrap text-lg text-gray-800">{{ recipe()?.title }}</h3>
          </div>
        </div>
        <!-- separator  -->
        <hr class="block border-t my-4">
        <!-- todo  -->
        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="flex flex-col px-6">
          <!-- Rating Selection -->
          <fieldset class="flex flex-col items-center gap-4 px-6">
            <p>Your overall rating of this recipe</p>
            <ol class="flex items-center gap-1">
              @for (rating of [1, 2, 3, 4, 5]; track rating) {
                <li class="inline-flex items-center justify-center transition-[scale] duration-300 hover:scale-115 active:scale-95">
                  <label for="rating-{{ rating }}" [class]="cn(rating > selectedRating() ? 'text-gray-200' : 'text-yellow-500')">
                    <input id="rating-{{ rating }}" type="radio" [value]="rating" formControlName="rating" class="hidden" (change)="setRating(rating)" />
                    <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-7 min-h-[1lh] shrink-0 align-middle text-current fill-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
                  </label>
                </li>
              }
            </ol>
          </fieldset>
          <!-- separator  -->
          <hr class="block border-t my-4">
          <!-- Comment/Review Text -->
          <app-field
            [id]="'comment'"
            [label]="'What did you like or dislike?'"
            [required]="reviewForm.get('comment')?.hasValidator(Validators.required)"
            [invalid]="reviewForm.get('comment')?.invalid && submitted"
            [helperText]="(reviewForm.get('comment')?.value?.length?.toString() || '0') + ' / 500 characters'"
            [class]="'*:data-[part=helper-text]:text-gray-400'"
          >
            <textarea
              formControlName="comment"
              rows="6"
              placeholder="Share your thoughts about this recipe..."
              [class]="cn(
                'input input-lg input-subtle placeholder:text-gray-400 h-full resize-none py-2 mt-2 rounded-lg',
                reviewForm.get('comment')?.invalid && 'focus-visible:outline-purple-500'
              )"
            ></textarea>
          </app-field>

          <!-- Submission Status Messages -->
          @if (submitting()) {
            <div class="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p class="text-blue-700">📤 Submitting your review...</p>
            </div>
          }

          @if (submitSuccess()) {
            <div class="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <p class="text-green-700">✅ Review submitted successfully!</p>
            </div>
          }

          @if (submitError()) {
            <div class="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p class="text-red-700">❌ {{ submitError() }}</p>
            </div>
          }

          <details
            [open]="reviewForm.invalid &&  submitted"
            [class]="cn(
              'accordion group rounded-xl text-gray-500 bg-gray-100',
              (reviewForm.get('rating')?.invalid && reviewForm.get('comment')?.invalid) ? 'open:[--height:108px]' : 'open:[--height:108px]'
            )"
          >
            <summary class="hidden"></summary>
          </details>

          <!-- Form Validation Summary -->
          <details
            [open]="reviewForm.invalid &&  submitted"
            [class]="cn(
              'accordion group rounded-xl text-gray-500 bg-gray-100',
              (reviewForm.get('rating')?.invalid && reviewForm.get('comment')?.invalid) ? 'open:[--height:108px]' : 'open:[--height:108px]'
            )"
          >
            <summary class="hidden"></summary>
            <div class="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <p class="text-sm text-yellow-800 font-medium mb-2">⚠️ Please complete the form:</p>
              <ul class="text-sm text-yellow-700 list-disc list-inside space-y-1">
                @if (reviewForm.get('rating')?.invalid) {
                  <li>Select a star rating</li>
                }
                @if (reviewForm.get('comment')?.invalid) {
                  <li>{{ getErrorMessage('comment') }}</li>
                }
              </ul>
            </div>
          </details>

          <!-- separator  -->
          <hr class="block border-t my-4">

          <!-- Form Actions -->
          <button
            type="submit"
            class="button button-lg button-solid bg-purple-600 rounded-lg font-semibold"
          >
            Submit Review
          </button>
        </form>
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
  protected reviewForm = this.fb.group(
    {
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    },
    {
      updateOn: "submit", // Only validate when form is submitted, not on every input change
    },
  );

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

    this.reviewService
      .createReview({ authorId: this.userId(), recipeId: "sfdxgcfgvhhjbkfygtdfrchgvujbukj", rating: rating as number, comment: comment as string })
      .subscribe({
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
    return undefined;
  }

  /**
   * Go back to the previous page
   */
  protected goBack(): void {
    this.location.back();
  }
}
