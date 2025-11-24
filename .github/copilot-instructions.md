# GitHub Copilot Instructions for GymVoro

## Project Overview
GymVoro is a **Gym Tracker App** built with **React Native CLI (Bare Workflow)**.

**Core Architectural Principle: Offline-First**  
Users must be able to perform all critical actions (create workouts, log sets, view history) without internet connection. Data synchronizes silently with Firebase when connectivity is restored.

## Architecture

### Tech Stack
- **Framework**: React Native CLI
- **Language**: TypeScript
- **Local Storage**: `react-native-mmkv` 
- **Backend**: Firebase (Auth, Firestore)
- **Navigation**: React Navigation (Native Stack (Static))
- **Styling**: Standard StyleSheet

### Data Flow (Offline Strategy)
- **Read**: All Firestore reads rely on local cache first (`persistence: true` is enabled)
- **Write**: Writes are optimistic. UI updates immediately; Firebase SDK handles background sync
- **Media**: Images must be cached to disk upon first load to ensure availability offline

### Project Structure
```
src/
├── components/    # Reusable UI components (Buttons, Inputs, Cards)
├── screens/       # Main views (Dashboard, WorkoutActive, History)
├── navigation/    # Stack and Tab navigators
├── services/      # Firebase service wrappers (Auth, Firestore references)
├── hooks/         # Custom hooks (useWorkouts, useHistory, ...)
├── store/         # State management (use zustand)
├── types/         # TypeScript interfaces (Workout, Exercise, Set)
└── utils/         # Helpers (Time formatting, Calculation logic)
```


### Component Patterns
- Use **Functional Components** with React Hooks
- Use `useEffect` to subscribe to Firestore `onSnapshot` for real-time + offline updates
- Always type props using TypeScript interfaces

### Naming Conventions
- **Files**: PascalCase for components (`WorkoutCard.tsx`), camelCase for hooks/utils (`useAuth.ts`)
- **Firestore Collections**:
  - `exercises` (Public)
  - `users/{uid}/workouts` (Private)
  - `users/{uid}/history` (Private)

### Error Handling
- Wrap async operations in `try/catch`
- Since this is offline-first, network errors on read should generally be suppressed in favor of showing cached data, unless the cache is empty


## Important Notes
- **Persistence**: Firestore persistence is enabled by default in the native SDK. Do NOT add complex logic to "check internet" before writing to DB; let the SDK handle the queue
- **Performance**: Avoid reading the entire history collection at once; implement pagination or limit queries if the dataset grows large


---
*Last updated: November 21, 2025*
