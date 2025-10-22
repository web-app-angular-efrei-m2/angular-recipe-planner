import { Component } from "@angular/core";

@Component({
  selector: "app-discover",
  standalone: true,
  template: `
    <div class="container mx-auto px-4 max-w-7xl min-h-screen">
      <div class="flex flex-col pt-6">
        <h1 class="text-2xl font-semibold text-gray-900">Discover</h1>
        <p class="text-gray-600 mt-4">Explore new recipes and culinary adventures!</p>

        <div class="mt-8 p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl shadow-sm">
          <div class="flex items-start gap-3">
            <span class="text-3xl">🔍</span>
            <div>
              <h3 class="font-semibold text-purple-900 mb-1">Coming Soon</h3>
              <p class="text-purple-600">The Discover feature is under development. Stay tuned!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DiscoverComponent {}
