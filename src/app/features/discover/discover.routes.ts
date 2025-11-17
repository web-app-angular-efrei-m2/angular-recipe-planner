import type { Routes } from "@angular/router";

export const DISCOVER_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./discover.component").then((m) => m.DiscoverComponent),
  },
  {
    path: "results",
    loadComponent: () => import("./discover-results.component").then((m) => m.DiscoverResultsComponent),
  },
];
