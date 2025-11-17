import { Pipe, type PipeTransform } from "@angular/core";
import type { Recipe } from "@/app/core/services/recipe.service";

/**
 * Difficulty Level Pipe
 *
 * Determines the difficulty level of a recipe based on:
 * - Total time (prep time + cook time)
 * - Number of ingredients
 */
@Pipe({
  name: "difficultyLevel",
  standalone: true,
  pure: true, // Pure pipe - only re-evaluates when recipe reference changes
})
export class DifficultyLevelPipe implements PipeTransform {
  /**
   * Transforms a recipe into a difficulty level string
   *
   * @param recipe - The recipe to evaluate
   * @returns Difficulty level: "Easy", "Medium", or "Advanced"
   */
  transform(recipe: Recipe | null | undefined): "Easy" | "Medium" | "Advanced" | null {
    if (!recipe) {
      return null;
    }

    const totalTime = recipe.prepTime + recipe.cookTime;
    const ingredientCount = recipe.ingredients.length;

    // Easy: Quick recipes with few ingredients
    if (totalTime < 30 && ingredientCount < 6) {
      return "Easy";
    }

    // Medium: Moderate time and ingredient complexity
    if (totalTime < 60 && ingredientCount < 10) {
      return "Medium";
    }

    // Advanced: Time-consuming or ingredient-heavy recipes
    return "Advanced";
  }
}
