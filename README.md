# Jokes App

A modern, responsive web application for browsing, filtering, and managing jokes. Built with Vue 3, TypeScript, and Tailwind CSS.

Live Demo: https://qu-challenge-two.vercel.app/

## 🚀 Project Overview

The Joke App is a feature-rich application that allows users to:

- Browse through a collection of jokes with pagination
- Filter jokes by category, search text, and like status
- Like or dislike jokes
- Add new jokes
- Delete jokes individually or all at once 
- Fetch random jokes from an external API

The application demonstrates modern frontend development practices, including component-based architecture, state management, and responsive design.

## 🛠️ Tech Stack

### Core Technologies
- **Vue 3**: Frontend framework with Composition API
- **TypeScript**: For type safety and better developer experience
- **Vite**: Fast, modern build tool
- **Pinia**: State management library for Vue 3
- **Vue Router**: Official router for Vue.js
- **Tailwind CSS**: Utility-first CSS framework
- **VueUse**: Collection of Vue Composition API utilities

### UI Components
- **Shadcn Vue (https://www.shadcn-vue.com/)**: Component library for Vue 3
- **Vue Sonner**: Toast notifications

### Testing
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing framework

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking

## 🏗️ Architecture & Design Patterns

The application follows several design patterns and architectural principles:

### Repository Pattern
The application uses the repository pattern to abstract data access logic:

- **Repository Interfaces**: Define contracts for data operations
- **Repository Implementations**: Implement the interfaces with concrete data access logic
- **Factory Functions**: Provide dependency injection for repositories

This pattern provides several benefits:
- Separation of concerns between data access and business logic
- Easier testing through dependency injection
- Flexibility to change data sources without affecting the rest of the application

### Composable Pattern
Vue 3's Composition API is leveraged through custom composables:

- **usePagination**: Handles pagination logic
- **useToast**: Provides toast notification functionality
- **useDialog**: Manages dialog state with open/close functionality
- **useJokeForm**: Handles joke form validation and creation
- **useApiCache**: Manages API response cache

Composables encapsulate reusable logic, making components cleaner and more focused on presentation. This approach improves separation of concerns by:

1. **Extracting stateful logic**: Moving state management out of components
2. **Promoting reusability**: Allowing the same logic to be used across multiple components
3. **Simplifying testing**: Making it easier to test logic in isolation
4. **Reducing component complexity**: Keeping components focused on their primary responsibility

### State Management with Pinia
The application uses Pinia for state management:

- **Stores**: Organized by feature (e.g., jokes store)
- **Actions**: Handle side effects and business logic
- **State**: Reactive state with computed properties for derived state

## 🚦 Getting Started

### Prerequisites
- Node.js (v22+)
- pnpm (v9.15.2+)

### Installation
```bash
# Clone the repository
git clone https://github.com/facuagueria/qu-challenge.git

# Navigate to the project directory
cd jokes-app

# Install dependencies
pnpm install
```

### Development
```bash
# Start the development server
pnpm dev
```

### Building for Production
```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

### Testing
```bash
# Run unit tests
pnpm test:unit

# Run end-to-end tests
pnpm test:e2e
```

## ❓ Technical Questions

### 1. What's a closure? Where in the code is there a closure?

A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned. Closures are created when a function is defined within another function and "remembers" the environment in which it was created.

**Example in the code**: The `usePagination` composable in `src/composables/usePagination.ts` is a perfect example of a closure:

```typescript
export function usePagination<T>(
  items: () => T[],
  options: PaginationOptions = {},
) {
  // These variables are enclosed in the closure
  const defaultCurrentPage = options.defaultCurrentPage || 1
  const defaultItemsPerPage = options.defaultItemsPerPage || 5
  const currentPage = ref(defaultCurrentPage)
  const itemsPerPage = ref(defaultItemsPerPage)

  // These functions maintain access to the enclosed variables
  function handlePageChange(page: number) {
    currentPage.value = page
  }

  function resetPage() {
    currentPage.value = defaultCurrentPage
  }

  // The returned object contains functions that form closures
  return {
    currentPage,
    itemsPerPage,
    // ...other properties
    handlePageChange,
    resetPage,
  }
}
```

When `usePagination` is called, it creates a closure where:
1. Local variables like `currentPage`, `itemsPerPage`, and `defaultCurrentPage` are enclosed
2. The returned functions (`handlePageChange` and `resetPage`) maintain access to these variables even after `usePagination` has executed
3. The computed properties also maintain access to these enclosed variables

This pattern is fundamental to Vue's Composition API and allows for encapsulating and reusing stateful logic.

### 2. Which are the potential side-effects in any function? Could you point out any of these cases in your code? Are they expected? Can they be avoided?

Side effects in functions occur when a function modifies state outside its local scope or performs operations beyond returning a value, such as:

1. Modifying global variables or state
2. Modifying input parameters
3. Making API calls
4. Throwing exceptions
5. Logging to console

**Examples in the code**:

1. **Repository methods with side effects**:
   ```typescript
   // In JokesRepositoryImpl.ts
   addJoke(joke: Joke): void {
     this.jokes.value.unshift(joke) // Side effect: modifies the jokes array
   }

   removeJoke(jokeId: number): void {
     // Side effect: modifies the jokes array
     this.jokes.value.splice(jokeIndex, 1)
   }
   ```

2. **State modifications in composables**:
   ```typescript
   // In usePagination.ts
   function handlePageChange(page: number) {
     currentPage.value = page // Side effect: modifies state
   }
   ```

3. **API calls in the repository**:
   ```typescript
   // In JokesRepositoryImpl.ts
   async getJokes(): Promise<Joke[]> {
     const { error, data } = await useFetch<Joke[]>(API_URLS.RANDOM_JOKES)
       .get()
       .json()
     // Side effect: network request
   }
   ```

**Are they expected?** Yes, these side effects are expected and intentional. In a frontend application, side effects are necessary for:
- Updating the UI in response to user actions
- Persisting data
- Communicating with external services

**Can they be avoided?** While side effects can't be completely eliminated in a practical application, they can be:

1. **Isolated**: Contains side effects in specific parts of the application (e.g., repositories, stores)
2. **Made explicit**: Clearly document functions with side effects
3. **Minimized**: Use pure functions where possible, especially for business logic
4. **Managed**: Use patterns like the repository pattern to abstract side effects

The application already follows good practices by:
- Isolating data modification in repositories
- Using stores to centralize state management
- Leveraging Vue's reactivity system to make side effects more predictable
