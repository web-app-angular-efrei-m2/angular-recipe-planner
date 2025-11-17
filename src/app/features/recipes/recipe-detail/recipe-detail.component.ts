import { CommonModule, Location } from "@angular/common";
import { Component, computed, effect, inject, type OnDestroy, type OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Store } from "@ngrx/store";
import { updateUser } from "@/app/core/state/auth/auth.actions";
import { selectUser } from "@/app/core/state/auth/auth.selectors";
import { loadRecipes, selectRecipe } from "@/app/core/state/recipes/recipes.actions";
import { selectRecipeById, selectRecipesError, selectRecipesLoading } from "@/app/core/state/recipes/recipes.selectors";
import { loadReviewsByRecipeId } from "@/app/core/state/reviews/reviews.actions";
import { selectAreReviewsLoadedForRecipe, selectReviewsForRecipe } from "@/app/core/state/reviews/reviews.selectors";
import { DifficultyLevelPipe } from "@/app/shared/pipes/difficulty-level.pipe";
import { RatingPipe } from "@/app/shared/pipes/rating.pipe";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-recipe-detail",
  imports: [CommonModule, RouterLink, DifficultyLevelPipe, RatingPipe],
  template: `
    <div class="flex flex-1 flex-col h-dvh wrap-break-word rounded-sm text-start font-semibold text-gray-400 transition-colors duration-300" [style.background-color]="'rgb(243 232 255)'">
      <!-- background image overlay -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        [style.background-image]="recipe()?.gallery?.[selectedImageIndex()] ? 'url(' + recipe()!.gallery![selectedImageIndex()] + ')' : 'none'"
      ></div>
      <!-- content wrapper with relative positioning -->
      <div class="relative flex flex-1 flex-col h-full">
      <!-- navigation buttons  -->
      <div class="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6">
        <button type="button" (click)="goBack()" class="btn btn-sm sm:btn-md rounded-full p-0 bg-white border-0 shadow-sm hover:shadow-md">
          <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
        </button>
        <button type="button" (click)="toggleBookmark()" [class]="cn('btn btn-sm sm:btn-md rounded-full p-0 border-0 shadow-sm hover:shadow-md transition-colors', isBookmarked() ? 'bg-red-100 text-red-500' : 'bg-white text-gray-500')">
          <svg stroke="currentColor" [attr.fill]="isBookmarked() ? 'currentColor' : 'none'" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
        </button>
      </div>
       <!-- Loading State -->
      @if (loading()) {
        <div class="flex items-center justify-center py-12 sm:py-16">
          <div class="text-center">
            <span class="loading loading-spinner loading-md sm:loading-lg text-orange-500"></span>
            <p class="text-gray-600 text-base sm:text-lg mt-4">Loading recipe...</p>
          </div>
        </div>
      }
      <!-- Error State -->
      @if (error()) {
        <div class="alert alert-error">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="size-6 shrink-0" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
          <div class="flex flex-col gap-2">
            <h3 class="font-semibold">Recipe Not Found</h3>
            <p class="text-sm">{{ error() }}</p>
            <button
              routerLink="/recipes"
              class="btn btn-sm btn-error mt-2 self-start"
            >
              Return to Recipe List
            </button>
          </div>
        </div>
      }
      <!-- Recipe Content using async pipe -->
      @if (recipe()) {
        <!-- media gallery   -->
        <div class="flex items-center justify-center mt-auto pb-4 sm:pb-6 px-4 sm:px-0">
          <div class="p-1 sm:p-1.5 rounded-xl overflow-hidden bg-base-200 backdrop-blur-sm max-w-3/4 shadow-lg">
            <div class="flex gap-1 sm:gap-1.5 overflow-auto snap-x snap-mandatory">
              @for (image of recipe()?.gallery || []; track $index) {
                <button
                  type="button"
                  (click)="selectImage($index)"
                  [class]="cn(
                    'w-11 h-11 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl shrink-0 snap-start bg-cover bg-center bg-no-repeat scale-80 transition-all duration-700',
                    selectedImageIndex() === $index
                      ? 'ring-2 ring-primary/40 ring-offset-1 scale-90'
                      : 'hover:border-primary/40 hover:scale-90'
                  )"
                  [style.background-image]="'url(' + image + ')'"
                  [attr.aria-label]="'View image ' + ($index + 1)"
                >
                </button>
              }
            </div>
          </div>
        </div>
        <!-- recipe details   -->
         <div class="h-4/6 rounded-t-2xl bg-base-100">
           <article class="overflow-auto max-w-5xl mx-auto w-dvw">
             <div class="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 bg-white">
             <!-- category & rating   -->
             <div class="flex items-center gap-1 text-xs sm:text-sm">
               <span class="mr-auto">{{ recipe()?.category }}</span>
               <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-3 sm:size-4 min-h-lh shrink-0 align-middle text-yellow-500 fill-current leading-[1em]"  height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
               <span>{{ reviews() | rating:'average' }}</span>
             </div>
             <!-- title & difficulty  -->
             <div class="flex justify-between gap-2">
               <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 max-w-3/4">{{ recipe()?.title }}</h2>
               <svg
               [class]="
                 cn(
                   'inline-block size-5 sm:size-6 min-h-lh shrink-0 align-middle leading-[1em] mt-0.5',
                   (recipe() | difficultyLevel) === 'Easy' && 'text-green-500',
                   (recipe() | difficultyLevel) === 'Medium' && 'text-yellow-500',
                   (recipe() | difficultyLevel) === 'Advanced' && 'text-red-500'
                 )
               "
               stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="12" cy="12" r="1"></circle></svg>
             </div>
             <!-- chef   -->
             <div class="flex flex-col gap-1 sm:gap-1.5">
               <p class="text-xs sm:text-sm text-gray-800">Recipe by</p>
               <div class="flex items-center gap-2">
                 <!-- avatar   -->
                 <div class="w-10 h-10 sm:w-13 sm:h-13 bg-gray-200 rounded-full"></div>
                 <div class="flex flex-col text-xs sm:text-sm mr-auto">
                   <span class="text-gray-800">Dianne Russel</span>
                   <span>Chef</span>
                 </div>
                 <button type="button" class="btn btn-xs sm:btn-sm rounded-full p-0 bg-gray-100 border-0 text-purple-500">
                   <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-3 sm:size-4 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
                 </button>
                 <button type="button" class="btn btn-xs sm:btn-sm rounded-full p-0 bg-gray-100 border-0 text-purple-500">
                   <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-3 sm:size-4 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                 </button>
               </div>
             </div>
             <!-- description   -->
             <div class="flex flex-col gap-1 sm:gap-1.5">
               <p class="text-sm sm:text-md text-gray-800">Description</p>
               <p class="text-xs sm:text-sm line-clamp-3">{{ recipe()?.description }}</p>
             </div>
             <!-- cooking time & nutrition info -->
             <div class="grid grid-cols-2 gap-1.5 sm:gap-2 py-2">
               <div class="flex flex-1 items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-gray-100">
                 <span class="size-8 sm:size-10 bg-white flex items-center justify-center rounded-full">
                   <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-purple-500 leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                 </span>
                 <div class="flex flex-col">
                   <span class="text-xs text-gray-500">Cooking Time</span>
                   <span class="text-xs sm:text-sm text-purple-500">{{ recipe()?.cookTime }} min</span>
                 </div>
               </div>
               <div class="flex flex-1 items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-gray-100">
                 <span class="size-8 sm:size-10 bg-white flex items-center justify-center rounded-full">
                 <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-purple-500 leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V2"></path><path d="m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5"></path><path d="M2 14h12a2 2 0 0 1 0 4h-2"></path><path d="M4 10h16"></path><path d="M5 10a7 7 0 0 1 14 0"></path><path d="M5 14v6a1 1 0 0 1-1 1H2"></path></svg>
                 </span>
                 <div class="flex flex-col">
                   <span class="text-xs text-gray-500">Cuisine</span>
                   <span class="text-xs sm:text-sm text-purple-500">{{ recipe()?.cuisine }}</span>
                 </div>
               </div>
               <div class="flex flex-1 items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-gray-100">
                 <span class="size-8 sm:size-10 bg-white flex items-center justify-center rounded-full">
                   <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-purple-500 leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
                 </span>
                 <div class="flex flex-col">
                   <span class="text-xs text-gray-500">Calories</span>
                   <span class="text-xs sm:text-sm text-purple-500">{{ recipe()?.calories }} kcal</span>
                 </div>
               </div>
               <div class="flex flex-1 items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-gray-100">
                 <span class="size-8 sm:size-10 bg-white flex items-center justify-center rounded-full">
                   <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-purple-500 leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m6.5 6.5.4-1.3C7.2 4.5 7.9 4 8.7 4c1.1 0 1.8.9 1.6 2L9.7 9h3.6l.6-3.3c.3-1.1 1-1.7 1.9-1.7 1.1 0 1.8.9 1.6 2l-.6 3.3h2.5c1.2 0 1.9 1 1.6 2.1-.2.8-.9 1.6-1.7 1.6h-3l-.9 5h2.5c1.2 0 1.9 1 1.6 2.1-.2.8-.9 1.6-1.7 1.6h-3l-.4 1.3c-.3.7-1 1.3-1.8 1.3-1.1 0-1.8-.9-1.6-2l.6-2.6H7.4l-.4 1.3c-.3.7-1 1.3-1.8 1.3-1.1 0-1.8-.9-1.6-2l.6-2.6H1.7c-1.2 0-1.9-1-1.6-2.1.2-.8.9-1.6 1.7-1.6h3l.9-5H3.2c-1.2 0-1.9-1-1.6-2.1.2-.8.9-1.6 1.7-1.6h3.2zm4.3 7.5-.9 5h3.6l.9-5H10.8z"></path></svg>
                 </span>
                 <div class="flex flex-col">
                   <span class="text-xs text-gray-500">Protein</span>
                   <span class="text-xs sm:text-sm text-purple-500">{{ recipe()?.protein }}g</span>
                 </div>
               </div>
             </div>
             <!-- ingredients   -->
             <details class="collapse collapse-arrow bg-gray-100 rounded-xl">
               <summary class="collapse-title text-xs sm:text-sm font-medium text-gray-500">
                 <div class="flex items-center gap-1.5 sm:gap-2 mr-6">
                   <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-purple-500 leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m5 11 4-7"></path><path d="m19 11-4-7"></path><path d="M2 11h20"></path><path d="M3.5 11 2 16c-.4 1.3.3 2 1.4 2h17.2c1.1 0 1.8-.7 1.4-2L20.5 11"></path></svg>
                   <span class="flex-1">Ingredients</span>
                   <span>{{ recipe()?.servings }} Serving</span>
                 </div>
               </summary>
               <div class="collapse-content text-gray-500">
                 <ul class="flex flex-col list-disc max-h-[150px] sm:max-h-[200px] overflow-auto">
                   @for (ingredient of recipe()?.ingredients; track $index) {
                     <li class="whitespace-normal items-center text-xs sm:text-sm ml-6 marker:text-purple-500/60">{{ ingredient }}</li>
                   }
                 </ul>
               </div>
             </details>
             <!-- instructions   -->
             <details open class="collapse collapse-arrow bg-gray-100 rounded-xl">
               <summary class="collapse-title text-xs sm:text-sm font-medium text-gray-500">
                 <div class="flex items-center gap-1.5 sm:gap-2">
                   <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-purple-500 leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"></path><path d="M9 12h6"></path><path d="M9 16h6"></path></svg>
                   <span class="flex-1">Instructions</span>
                 </div>
               </summary>
               <div class="collapse-content text-gray-500">
                 <p class="text-xs sm:text-sm">
                   {{ recipe()?.instructions }}
                 </p>
               </div>
             </details>
             <!-- ratings  -->
             @if ((reviews() | rating:'average') > 0) {
               <div class="flex flex-col">
                 <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 p-3 sm:p-4 rounded-2xl bg-gray-100">
                   <div class="flex flex-1 flex-col gap-2 sm:gap-4 w-full sm:w-auto">
                     <dl class="relative flex flex-1 flex-col">
                       <dd class="align-baseline font-semibold tracking-tight proportional-nums inline-flex items-end gap-1 text-gray-800">
                         <span class="text-xl sm:text-2xl">{{ reviews() | rating:'average' }}</span>
                         <span class="text-xs sm:text-sm leading-6">/5</span>
                       </dd>
                       <dt class="inline-flex gap-1.5 items-center text-xs sm:text-sm">Based on {{ reviews().length }} Reviews</dt>
                     </dl>
                     <ol class="flex items-center gap-0.5 sm:gap-1">
                       @for (rating of [1, 2, 3, 4, 5]; track rating) {
                         <li class="inline-flex items-center gap-2">
                           @if (rating === Math.ceil(reviews() | rating:'average') && (reviews() | rating:'average') % 1 !== 0) {
                             <span class="relative flex items-center">
                               <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-yellow-400 fill-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2"></path></svg>
                               <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="absolute inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-gray-200 fill-current leading-[1em] -scale-x-100" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2"></path></svg>
                             </span>
                           }
                           @else {
                             <span class="relative flex items-center">
                               <svg
                                 [class]="
                                   cn(
                                     'inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-current fill-current leading-[1em]',
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
                   <ol class="flex flex-1 flex-col gap-1.5 sm:gap-2 w-full sm:w-auto">
                     @for (rating of [5,4,3,2,1]; track rating) {
                       <li class="inline-flex items-center gap-1.5 sm:gap-2">
                         <span class="text-xs w-12">{{ rating }} Star</span>
                         <div class="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div
                             class="h-full bg-yellow-400 transition-all"
                             [style.width.%]="reviews() | rating:'percentage':rating"
                           ></div>
                         </div>
                         <span class="text-xs w-6 text-right">{{ reviews() | rating:'count':rating }}</span>
                       </li>
                     }
                   </ol>
                 </div>
               </div>
             }
             <!-- reviews   -->
             <a [routerLink]="['/recipes', recipe()?.id, 'reviews']" class="btn btn-md sm:btn-lg btn-ghost justify-start gap-1.5 sm:gap-2 rounded-xl font-semibold text-gray-500 bg-gray-100 border-0">
               <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-3 sm:size-4 min-h-lh shrink-0 align-middle text-current leading-[1em]" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
               <span class="mr-auto text-sm sm:text-base">Reviews</span>
               <svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="inline-block size-4 sm:size-5 min-h-lh shrink-0 align-middle text-purple-500 leading-[1em] -rotate-90" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6"></path></svg>
             </a>
             </div>
           </article>
         </div>
      }
      </div>
    </div>
  `,
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private readonly store = inject(Store);

  protected readonly cn = cn;
  protected readonly Math = Math;

  // Get recipe ID from route
  private recipeId = this.route.snapshot.paramMap.get("id") || "";

  // Select data from NgRx store
  protected recipe = this.store.selectSignal(selectRecipeById(this.recipeId));
  protected loading = this.store.selectSignal(selectRecipesLoading);
  protected error = this.store.selectSignal(selectRecipesError);

  // Select current user for bookmarks
  protected currentUser = this.store.selectSignal(selectUser);

  // Gallery image selection
  protected selectedImageIndex = signal(0);

  // Check if recipe is bookmarked
  protected isBookmarked = computed(() => {
    const user = this.currentUser();
    if (!user || !user.bookmarks) {
      return false;
    }
    return user.bookmarks.includes(this.recipeId);
  });

  // Select reviews for this recipe
  protected reviews = computed(() => {
    const reviewsList = this.store.selectSignal(selectReviewsForRecipe(this.recipeId))();
    // Sort by date (newest first)
    return [...reviewsList].sort((a, b) => b.createdAt - a.createdAt);
  });

  // Effect to load recipe and reviews
  private loadDataEffect = effect(() => {
    // Dispatch action to load recipes if not already loaded
    this.store.dispatch(loadRecipes());

    // Dispatch action to select this specific recipe
    this.store.dispatch(selectRecipe({ id: this.recipeId }));

    // Check if reviews are already loaded for this recipe
    const areReviewsLoaded = this.store.selectSignal(selectAreReviewsLoadedForRecipe(this.recipeId))();

    if (!areReviewsLoaded) {
      console.log(`🔄 Loading reviews for recipe ${this.recipeId}`);
      this.store.dispatch(loadReviewsByRecipeId({ recipeId: this.recipeId }));
    } else {
      console.log(`✅ Reviews already loaded for recipe ${this.recipeId}`);
    }
  });

  ngOnInit(): void {
    // Effect will handle loading
    console.log("🎯 Recipe Detail Component initialized for recipe:", this.recipeId);
  }

  ngOnDestroy(): void {
    // Cleanup effect
    this.loadDataEffect.destroy();
  }

  protected goBack(): void {
    this.location.back();
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected toggleBookmark(): void {
    const user = this.currentUser();
    if (!user) {
      console.warn("⚠️ User not logged in, redirecting to login page");
      this.router.navigate(["/auth/login"]);
      return;
    }

    const bookmarks = user.bookmarks || [];
    const isCurrentlyBookmarked = bookmarks.includes(this.recipeId);

    let updatedBookmarks: string[];
    if (isCurrentlyBookmarked) {
      // Remove bookmark
      updatedBookmarks = bookmarks.filter((id) => id !== this.recipeId);
      console.log("💔 Removing bookmark for recipe:", this.recipeId);
    } else {
      // Add bookmark
      updatedBookmarks = [...bookmarks, this.recipeId];
      console.log("❤️ Adding bookmark for recipe:", this.recipeId);
    }

    // Dispatch update action
    this.store.dispatch(
      updateUser({
        userId: user.id,
        userData: {
          bookmarks: updatedBookmarks,
        },
      }),
    );
  }
}
