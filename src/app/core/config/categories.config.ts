import type { CategoryGroup } from "@/app/core/services/recipe.service";

/**
 * Category Configuration
 * Defines hierarchical category structure with icons for the discover page
 * Similar to e-commerce category filtering
 */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "trending",
    name: "Trending Now",
    icon: `<svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="w-5 h-5" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>`,
    subcategories: [
      { id: "trending-all", name: "All Trending", filterKey: "isTrending", filterValue: "true" },
      { id: "trending-popular", name: "Most Popular", filterKey: "isPopular", filterValue: "true" },
    ],
  },
  {
    id: "meal-type",
    name: "Meal Type",
    icon: `<svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="w-5 h-5" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V2"></path><path d="m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5"></path><path d="M2 14h12a2 2 0 0 1 0 4h-2"></path><path d="M4 10h16"></path><path d="M5 10a7 7 0 0 1 14 0"></path><path d="M5 14v6a1 1 0 0 1-1 1H2"></path></svg>`,
    subcategories: [
      { id: "meal-all", name: "All Meals", filterKey: "mealType", filterValue: "all" },
      { id: "meal-breakfast", name: "Breakfast", filterKey: "mealType", filterValue: "breakfast" },
      { id: "meal-lunch", name: "Lunch", filterKey: "mealType", filterValue: "lunch" },
      { id: "meal-dinner", name: "Dinner", filterKey: "mealType", filterValue: "dinner" },
      { id: "meal-snack", name: "Snacks", filterKey: "mealType", filterValue: "snack" },
      { id: "meal-dessert", name: "Desserts", filterKey: "mealType", filterValue: "dessert" },
    ],
  },
  {
    id: "cuisine",
    name: "Cuisine Type",
    icon: `<svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="w-5 h-5" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`,
    subcategories: [
      { id: "cuisine-all", name: "All Cuisines", filterKey: "cuisine", filterValue: "all" },
      { id: "cuisine-italian", name: "Italian", filterKey: "cuisine", filterValue: "Italian" },
      { id: "cuisine-asian", name: "Asian", filterKey: "cuisine", filterValue: "Asian" },
      { id: "cuisine-mexican", name: "Mexican", filterKey: "cuisine", filterValue: "Mexican" },
      { id: "cuisine-indian", name: "Indian", filterKey: "cuisine", filterValue: "Indian" },
      { id: "cuisine-french", name: "French", filterKey: "cuisine", filterValue: "French" },
      { id: "cuisine-american", name: "American", filterKey: "cuisine", filterValue: "American" },
      { id: "cuisine-mediterranean", name: "Mediterranean", filterKey: "cuisine", filterValue: "Mediterranean" },
      { id: "cuisine-middle-eastern", name: "Middle Eastern", filterKey: "cuisine", filterValue: "Middle Eastern" },
    ],
  },
  {
    id: "dietary",
    name: "Dietary Preferences",
    icon: `<svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="w-5 h-5" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M2 21a8 8 0 0 1 13.292-6"></path><circle cx="10" cy="8" r="5"></circle><path d="M19 16v6"></path><path d="M22 19h-6"></path></svg>`,
    subcategories: [
      { id: "diet-all", name: "All Diets", filterKey: "dietaryTags", filterValue: "all" },
      { id: "diet-vegetarian", name: "Vegetarian", filterKey: "dietaryTags", filterValue: "vegetarian" },
      { id: "diet-vegan", name: "Vegan", filterKey: "dietaryTags", filterValue: "vegan" },
      { id: "diet-gluten-free", name: "Gluten-Free", filterKey: "dietaryTags", filterValue: "gluten-free" },
      { id: "diet-dairy-free", name: "Dairy-Free", filterKey: "dietaryTags", filterValue: "dairy-free" },
      { id: "diet-keto", name: "Keto", filterKey: "dietaryTags", filterValue: "keto" },
      { id: "diet-paleo", name: "Paleo", filterKey: "dietaryTags", filterValue: "paleo" },
      { id: "diet-low-carb", name: "Low Carb", filterKey: "dietaryTags", filterValue: "low-carb" },
    ],
  },
  {
    id: "spice-level",
    name: "Spice Level",
    icon: `<svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="w-5 h-5" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`,
    subcategories: [
      { id: "spice-all", name: "All Spice Levels", filterKey: "spiceLevel", filterValue: "all" },
      { id: "spice-none", name: "Not Spicy", filterKey: "spiceLevel", filterValue: "0" },
      { id: "spice-mild", name: "Mild", filterKey: "spiceLevel", filterValue: "1" },
      { id: "spice-medium", name: "Medium", filterKey: "spiceLevel", filterValue: "2" },
      { id: "spice-hot", name: "Spicy", filterKey: "spiceLevel", filterValue: "3" },
    ],
  },
  {
    id: "cooking-time",
    name: "Cooking Time",
    icon: `<svg stroke="currentColor" fill="none" stroke-width="2.2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" focusable="false" class="w-5 h-5" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    subcategories: [
      { id: "time-all", name: "All Times", filterKey: "totalTime", filterValue: "all" },
      { id: "time-quick", name: "Quick (<30 min)", filterKey: "totalTime", filterValue: "<30" },
      { id: "time-medium", name: "Medium (30-60 min)", filterKey: "totalTime", filterValue: "30-60" },
      { id: "time-long", name: "Long (60+ min)", filterKey: "totalTime", filterValue: ">60" },
    ],
  },
];

/**
 * Filter Options for the advanced filter component
 */
export interface FilterOption {
  label: string;
  value: string;
  icon?: string;
}

export const DIFFICULTY_FILTERS: FilterOption[] = [
  { label: "All Levels", value: "all" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

export const SORT_OPTIONS: FilterOption[] = [
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Quickest", value: "time" },
  { label: "Newest", value: "newest" },
  { label: "A-Z", value: "name" },
];
