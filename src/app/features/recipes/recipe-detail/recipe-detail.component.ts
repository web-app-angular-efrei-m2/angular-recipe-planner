import { Component } from "@angular/core";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-recipe-detail",
  imports: [],
  template: `
    <div [class]="cn('container mx-auto px-4 py-8')">
      <h1 [class]="cn('text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent')">
        Recipe Details
      </h1>
      <p [class]="cn('text-gray-600')">Recipe details will appear here...</p>
    </div>
  `,
})
export class RecipeDetailComponent {
  protected readonly cn = cn;
}
