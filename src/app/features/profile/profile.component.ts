import { Component } from "@angular/core";

@Component({
  selector: "app-profile",
  standalone: true,
  template: `
    <div class="container mx-auto px-4 max-w-7xl min-h-screen">
      <div class="flex flex-col pt-6">
        <h1 class="text-2xl font-semibold text-gray-900">Profile</h1>
        <p class="text-gray-600 mt-4">Manage your account and preferences</p>

        <div class="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl shadow-sm">
          <div class="flex items-start gap-3">
            <span class="text-3xl">👤</span>
            <div>
              <h3 class="font-semibold text-blue-900 mb-1">Coming Soon</h3>
              <p class="text-blue-600">The Profile feature is under development. Stay tuned!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {}
