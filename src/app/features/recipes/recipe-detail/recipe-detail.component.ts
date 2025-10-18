import { Component } from "@angular/core";
import { LayoutComponent } from "@/app/shared/layout/layout.component";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-recipe-detail",
  imports: [LayoutComponent],
  template: `
    <app-layout>
      <div [class]="cn('container mx-auto px-4 py-8')">
        <h1 [class]="cn('text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent')">
          Recipe Details
        </h1>
        <p [class]="cn('text-gray-600')">Recipe details will appear here...</p>
      </div>
    </app-layout>
  `,
})
export class RecipeDetailComponent {
  protected readonly cn = cn;
}
