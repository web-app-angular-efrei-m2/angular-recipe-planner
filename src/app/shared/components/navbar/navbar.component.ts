import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div class="container mx-auto px-4 max-w-7xl">
        <ul class="flex items-center justify-center gap-8 py-3">
          <!-- Home -->
          <li>
            <a
              routerLink="/recipes"
              routerLinkActive="text-purple-500"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2.2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                focusable="false"
                class="inline-block size-6 min-h-[1lh] shrink-0 align-middle leading-[1em]"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                <path
                  d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                ></path>
              </svg>
              <span class="text-xs font-medium">Home</span>
            </a>
          </li>

          <!-- Discover -->
          <li>
            <a
              routerLink="/discover"
              routerLinkActive="text-purple-500"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2.2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                focusable="false"
                class="inline-block size-6 min-h-[1lh] shrink-0 align-middle leading-[1em]"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <span class="text-xs font-medium">Discover</span>
            </a>
          </li>

          <!-- Bookmark -->
          <li>
            <a
              routerLink="/bookmarks"
              routerLinkActive="text-purple-500"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2.2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                focusable="false"
                class="inline-block size-6 min-h-[1lh] shrink-0 align-middle leading-[1em]"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              </svg>
              <span class="text-xs font-medium">Bookmark</span>
            </a>
          </li>

          <!-- Profile -->
          <li>
            <a
              routerLink="/profile"
              routerLinkActive="text-purple-500"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex flex-col items-center gap-1 text-gray-400 hover:text-purple-500 transition-colors"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2.2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                focusable="false"
                class="inline-block size-6 min-h-[1lh] shrink-0 align-middle leading-[1em]"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span class="text-xs font-medium">Profile</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  protected readonly cn = cn;
}
