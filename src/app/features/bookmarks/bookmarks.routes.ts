import type { Routes } from "@angular/router";

export const BOOKMARKS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./bookmarks.component").then((m) => m.BookmarksComponent),
  },
];
