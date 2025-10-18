import type { Routes } from "@angular/router";

export const SHOPPING_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./shopping-list/shopping-list.component").then((m) => m.ShoppingListComponent),
  },
];
