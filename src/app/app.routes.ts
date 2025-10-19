import type { Routes } from "@angular/router";
import { authGuard } from "@/app/core/guards/auth-guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "recipes",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("./features/auth/auth.routes").then((m) => m.AUTH_ROUTES),
  },
  {
    path: "recipes",
    canActivate: [authGuard], // Protect recipes route with functional auth guard
    loadChildren: () => import("./features/recipes/recipes.routes").then((m) => m.RECIPE_ROUTES),
  },
  {
    path: "planner",
    canActivate: [authGuard], // Protect planner route with functional auth guard
    loadChildren: () => import("./features/planner/planner.routes").then((m) => m.PLANNER_ROUTES),
  },
  {
    path: "shopping",
    canActivate: [authGuard], // Protect shopping route with functional auth guard
    loadChildren: () => import("./features/shopping/shopping.routes").then((m) => m.SHOPPING_ROUTES),
  },
  {
    path: "**",
    redirectTo: "recipes",
  },
];
