# 🍳 Angular Recipe Planner

A modern, feature-rich recipe management application built with Angular 19, NgRx, and Tailwind CSS. Discover, save, and organize your favorite recipes with a beautiful, responsive interface.

![Angular](https://img.shields.io/badge/Angular-19.x-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![NgRx](https://img.shields.io/badge/NgRx-18.x-purple?style=flat-square&logo=ngrx)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login
- Secure JWT-based authentication
- Profile management and editing
- Personalized user greetings

### 🍽️ Recipe Management
- Browse 50+ curated recipes with beautiful images
- Detailed recipe pages with:
  - Interactive image gallery
  - Nutrition information
  - Cooking instructions
  - Ingredients list
  - Difficulty level indicators
- Real-time recipe ratings and reviews
- Add and view recipe reviews

### 🔍 Discovery & Search
- Hierarchical category browsing
- Filter recipes by:
  - Cuisine type (Italian, Japanese, Mexican, etc.)
  - Meal type (Breakfast, Lunch, Dinner, etc.)
  - Cooking time
  - Difficulty level
  - Dietary preferences
- Featured and trending recipes
- Popular recipes section

### ❤️ Bookmarks
- Save favorite recipes
- Quick access to bookmarked recipes
- Visual bookmark indicators

### 📱 Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interfaces
- Smooth animations and transitions

### 🎨 Modern UI/UX
- Clean, soft modern design
- Glassmorphism effects
- Smooth hover states
- Loading and error states
- Custom component design system

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/web-app-angular-efrei-m2/angular-recipe-planner.git
cd angular-recipe-planner
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the JSON Server (API):
```bash
pnpm api
# or
npm run api
```

The API will run on `http://localhost:3000`

4. Start the development server:
```bash
pnpm start
# or
npm start
```

The application will open at `http://localhost:4200`

## 🛠️ Tech Stack

### Core
- **Angular 19** - Modern web framework with signals and standalone components
- **TypeScript 5** - Type-safe development
- **RxJS** - Reactive programming

### State Management
- **NgRx** - Redux-inspired state management
- **NgRx Effects** - Side effect management
- **NgRx Signals** - Modern signal-based state access

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Component Classes** - Reusable design system
- **Responsive Design** - Mobile-first approach

### Backend
- **JSON Server** - Mock REST API for development
- **Local Storage** - Client-side data persistence

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── config/           # Application configuration
│   │   ├── guards/           # Route guards
│   │   ├── interceptors/     # HTTP interceptors
│   │   ├── services/         # Core services
│   │   └── state/            # NgRx state management
│   │       ├── auth/         # Authentication state
│   │       ├── recipes/      # Recipe state
│   │       └── reviews/      # Review state
│   ├── features/
│   │   ├── auth/             # Login & Registration
│   │   ├── bookmarks/        # Saved recipes
│   │   ├── discover/         # Recipe discovery
│   │   ├── profile/          # User profile
│   │   └── recipes/          # Recipe management
│   │       ├── recipe-list/
│   │       ├── recipe-detail/
│   │       └── recipe-review/
│   └── shared/
│       ├── components/       # Reusable components
│       ├── directives/       # Custom directives
│       ├── pipes/            # Custom pipes
│       └── validators/       # Form validators
├── styles/                   # Global styles & design system
└── utils/                    # Utility functions
```

## 🎯 Key Features Implementation

### State Management with NgRx
- Centralized state management for recipes, reviews, and authentication
- Efficient data loading with effects
- Memoized selectors for optimal performance

### Signals Integration
- Modern Angular signals for reactive UI
- `selectSignal()` for direct store access
- Computed signals for derived state

### Custom Directives
- `SafeHtmlDirective` - Secure HTML rendering for SVG icons

### Custom Pipes
- `DifficultyLevelPipe` - Recipe difficulty display
- `RatingPipe` - Review rating calculations and formatting

### Responsive Design
- Breakpoint-based styling (sm, md, lg)
- Touch-optimized interactions
- Adaptive layouts and typography

## 🧪 Available Scripts

```bash
# Development
pnpm start          # Start dev server
pnpm api            # Start JSON server

# Building
pnpm build          # Production build
pnpm build:dev      # Development build

# Testing
pnpm test           # Run unit tests
pnpm test:headless  # Run tests in headless mode

# Code Quality
pnpm lint           # Run linter
pnpm format         # Format code with Biome
```

## 📊 Database

The application uses JSON Server with a `db.json` file containing:
- 50 recipes with images and detailed information
- 74 recipe reviews with ratings
- 4 sample users

## 🎨 Design System

The project includes a custom design system with:
- Button variants (primary, secondary, ghost, link)
- Form components (input, checkbox, toggle)
- Card components
- Alert states (info, success, warning, error)
- Loading states
- Navigation components

## 🔒 Authentication

- JWT-based authentication
- Protected routes with auth guards
- Automatic token management
- HTTP interceptors for API calls

## 📝 Future Enhancements

🚧 **More features coming soon!** This project is currently in its first phase. Stay tuned for:

- Recipe creation and editing
- Advanced search with filters
- Recipe collections
- Social features (follow chefs, share recipes)
- Meal planning
- Shopping list generation
- Recipe import from URLs
- Dark mode
- Internationalization (i18n)
- Progressive Web App (PWA) features

## 🤝 Contributing

This project is part of an academic program. Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

- Angular team for the amazing framework
- NgRx team for state management
- Tailwind CSS for the utility-first approach
- Unsplash for recipe images

---

**Built with ❤️ using Angular 19**
