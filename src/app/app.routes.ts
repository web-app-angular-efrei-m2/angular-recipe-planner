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
    loadChildren: () => import("./features/recipes/recipes.routes").then((m) => m.RECIPE_ROUTES),
  },
  {
    path: "discover",
    loadChildren: () => import("./features/discover/discover.routes").then((m) => m.DISCOVER_ROUTES),
  },
  {
    path: "bookmarks",
    canActivate: [authGuard],
    loadChildren: () => import("./features/bookmarks/bookmarks.routes").then((m) => m.BOOKMARKS_ROUTES),
  },
  {
    path: "profile",
    canActivate: [authGuard],
    loadChildren: () => import("./features/profile/profile.routes").then((m) => m.PROFILE_ROUTES),
  },
  {
    path: "**",
    redirectTo: "recipes",
  },
];
