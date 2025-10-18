import type { Routes } from "@angular/router";

export const RECIPE_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./recipe-list/recipe-list.component").then((m) => m.RecipeListComponent),
  },
  {
    path: ":id",
    loadComponent: () => import("./recipe-detail/recipe-detail.component").then((m) => m.RecipeDetailComponent),
  },
];
