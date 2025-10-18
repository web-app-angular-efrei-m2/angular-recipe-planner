import type { Routes } from "@angular/router";

export const PLANNER_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () => import("./meal-planner/meal-planner.component").then((m) => m.MealPlannerComponent),
  },
];
