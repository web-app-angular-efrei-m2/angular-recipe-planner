import type { Routes } from "@angular/router";
import { AuthGuard } from "@/app/core/guards/auth-guard";

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
    canActivate: [AuthGuard], // Protect recipes route with auth guard
    loadChildren: () => import("./features/recipes/recipes.routes").then((m) => m.RECIPE_ROUTES),
  },
  {
    path: "planner",
    canActivate: [AuthGuard], // Protect planner route with auth guard
    loadChildren: () => import("./features/planner/planner.routes").then((m) => m.PLANNER_ROUTES),
  },
  {
    path: "shopping",
    canActivate: [AuthGuard], // Protect shopping route with auth guard
    loadChildren: () => import("./features/shopping/shopping.routes").then((m) => m.SHOPPING_ROUTES),
  },
  {
    path: "**",
    redirectTo: "recipes",
  },
];
