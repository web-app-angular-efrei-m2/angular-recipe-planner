import type { Routes } from "@angular/router";
import { authGuard } from "@/app/core/guards/auth-guard";

export const RECIPE_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./recipe-list/recipe-list.component").then((m) => m.RecipeListComponent),
  },
  {
    path: ":id",
    loadComponent: () => import("./recipe-detail/recipe-detail.component").then((m) => m.RecipeDetailComponent),
  },
  {
    path: ":id/reviews",
    loadComponent: () => import("./recipe-reviews-list/recipe-reviews-list.component").then((m) => m.RecipeReviewsListComponent),
  },
  {
    path: ":id/review/new",
    loadComponent: () => import("./recipe-review/recipe-review.component").then((m) => m.RecipeReviewComponent),
    canActivate: [authGuard],
  },
];
