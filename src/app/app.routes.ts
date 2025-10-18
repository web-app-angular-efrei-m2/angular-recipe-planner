import type { Routes } from "@angular/router";

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
    loadChildren: () => import("./features/recipes/recipes.routes").then((m) => m.RECIPE_ROUTES),
  },
  {
    path: "planner",
    loadChildren: () => import("./features/planner/planner.routes").then((m) => m.PLANNER_ROUTES),
  },
  {
    path: "shopping",
    loadChildren: () => import("./features/shopping/shopping.routes").then((m) => m.SHOPPING_ROUTES),
  },
  {
    path: "**",
    redirectTo: "recipes",
  },
];
