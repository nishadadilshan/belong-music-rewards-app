# Architecture Documentation

This document outlines the architecture and design decisions for the MusicRewards React Native application.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architectural Patterns](#architectural-patterns)
5. [Key Design Decisions](#key-design-decisions)
6. [State Management](#state-management)
7. [Routing & Navigation](#routing--navigation)
8. [Audio Playback System](#audio-playback-system)
9. [Theming System](#theming-system)
10. [Component Architecture](#component-architecture)
11. [Data Flow](#data-flow)
12. [Persistence Strategy](#persistence-strategy)

## Overview

MusicRewards is a React Native application built with Expo that allows users to complete music listening challenges and earn points. The application follows a **layered architecture** pattern with clear separation of concerns, emphasizing maintainability, scalability, and type safety.

## Technology Stack

### Core Framework
- **Expo ~54.0.20**: Provides development tooling, native module management, and a streamlined React Native development experience
- **React Native 0.81.5**: Cross-platform mobile framework
- **React 19.1.0**: UI library

### Routing
- **Expo Router 6.0.14**: File-based routing system inspired by Next.js, providing type-safe navigation with minimal configuration

### State Management
- **Zustand 5.0.8**: Lightweight state management library chosen for its simplicity and performance
- **@react-native-async-storage/async-storage**: Persistent storage for state hydration

### Audio Playback
- **react-native-track-player 4.1.2**: Native audio playback library with background playback support, chosen over Expo AV for advanced features like background playback, lock screen controls, and native performance

### UI Libraries
- **expo-blur**: Glassmorphism effects
- **expo-linear-gradient**: Gradient overlays
- **react-native-gesture-handler**: Enhanced gesture handling for better UX

### Type Safety
- **TypeScript 5.9.2**: Full type safety with strict mode enabled

## Project Structure

```
├── app/                      # Expo Router file-based routes
│   ├── _layout.tsx          # Root layout (initializes services)
│   ├── (tabs)/              # Tab navigation group
│   │   ├── _layout.tsx      # Tabs configuration
│   │   ├── index.tsx        # Home screen
│   │   └── profile.tsx       # Profile screen
│   └── (modals)/            # Modal screens group
│       ├── _layout.tsx      # Modal stack configuration
│       ├── player.tsx        # Music player modal
│       └── challenge-detail.tsx  # Challenge details modal
│
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── challenge/       # Challenge-specific components
│   │   └── ui/              # Generic UI components (GlassCard, GlassButton, etc.)
│   ├── constants/           # Static configuration data
│   │   ├── challenges.ts    # Sample challenge data
│   │   └── theme.ts         # Theme definitions (dark/light)
│   ├── hooks/               # Custom React hooks
│   │   ├── useChallenges.ts # Challenge data management
│   │   ├── useMusicPlayer.ts # Audio playback logic
│   │   ├── usePointsCounter.ts # Points calculation
│   │   └── useTheme.ts      # Theme context hook
│   ├── services/            # Business logic services
│   │   └── audioService.ts  # TrackPlayer initialization
│   ├── stores/              # Zustand state stores
│   │   ├── musicStore.ts    # Music playback state
│   │   ├── themeStore.ts    # Theme preferences
│   │   └── userStore.ts     # User progress & points
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Shared types
│   └── utils/               # Utility functions
│
├── trackPlayerService.js    # Background service registration
├── app.json                 # Expo configuration
└── tsconfig.json            # TypeScript configuration
```

### Design Rationale

The structure follows a **hybrid approach** combining:
- **Feature-based organization** for routes (`app/` directory)
- **Layer-based organization** for shared code (`src/` directory)

This structure provides:
- Clear separation between routing (app/) and business logic (src/)
- Easy navigation with file-based routing
- Reusable components and hooks across features
- Centralized state management

## Architectural Patterns

### 1. Layered Architecture

The application is organized into distinct layers:

```
┌─────────────────────────────────┐
│      Presentation Layer         │  (app/, components/)
│      - Screens & Components     │
│      - User interactions        │
├─────────────────────────────────┤
│      Business Logic Layer       │  (hooks/, services/)
│      - Custom hooks             │
│      - Business rules           │
│      - API interactions         │
├─────────────────────────────────┤
│      State Management Layer     │  (stores/)
│      - Global state             │
│      - State persistence        │
├─────────────────────────────────┤
│      Data Layer                 │  (constants/, types/)
│      - Type definitions         │
│      - Static data              │
└─────────────────────────────────┘
```

### 2. Container/Presentational Pattern

- **Container Components** (screens in `app/`): Handle state, side effects, and business logic
- **Presentational Components** (`src/components/`): Focus on UI rendering, receive props, and call callbacks

### 3. Custom Hooks Pattern

Business logic is extracted into reusable hooks:
- `useMusicPlayer`: Encapsulates all audio playback logic
- `usePointsCounter`: Manages points calculation and progress tracking
- `useTheme`: Provides theme context with computed values
- `useChallenges`: Manages challenge data loading and updates

This pattern:
- Separates concerns
- Improves testability
- Enables code reuse
- Makes components cleaner

## Key Design Decisions

### 1. File-Based Routing (Expo Router)

**Decision**: Use Expo Router instead of React Navigation directly.

**Rationale**:
- Type-safe navigation with TypeScript
- Automatic route generation from file structure
- Built-in deep linking support
- Modal and stack navigation through folder structure (`(modals)`, `(tabs)`)
- Reduces boilerplate code

**Implementation**:
- Route groups `(tabs)` and `(modals)` provide logical grouping without affecting URLs
- Layout files (`_layout.tsx`) define navigation structure
- Modal presentation style configured at layout level

### 2. Zustand for State Management

**Decision**: Use Zustand instead of Redux, Context API, or MobX.

**Rationale**:
- **Lightweight**: Minimal boilerplate compared to Redux
- **Performance**: Efficient re-renders with selector-based subscriptions
- **Simplicity**: Straightforward API, easy to learn
- **TypeScript Support**: Excellent type inference
- **Middleware**: Built-in persistence middleware
- **No Provider Wrapping**: Can use stores outside React components

**Trade-offs**:
- Less ecosystem compared to Redux
- No built-in time-travel debugging (acceptable for this project size)

**Implementation**:
```typescript
// Stores are simple, typed, and persisted
export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({ ... }),
    { name: 'music-store', storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

### 3. react-native-track-player for Audio

**Decision**: Use react-native-track-player instead of Expo AV.

**Rationale**:
- **Background Playback**: Continues playing when app is backgrounded
- **Lock Screen Controls**: Native iOS/Android lock screen integration
- **System Integration**: Notification controls, car play support
- **Production Ready**: Used by major music apps
- **Advanced Features**: Speed control, queue management, events

**Trade-offs**:
- Requires native build (cannot use Expo Go)
- Additional configuration needed
- Larger bundle size

**Implementation**:
- Service registration in `trackPlayerService.js` for background playback
- Initialization in root layout (`app/_layout.tsx`)
- Encapsulated in `useMusicPlayer` hook for easy consumption

### 4. Glassmorphism UI Design

**Decision**: Implement glassmorphism design system throughout the app.

**Rationale**:
- **Modern Aesthetic**: Creates a premium, contemporary feel
- **Visual Hierarchy**: Blur effects help separate UI layers
- **Theme Support**: Works well with both dark and light themes
- **User Experience**: Familiar pattern from iOS/macOS

**Implementation**:
- `GlassCard` component using `expo-blur` and `expo-linear-gradient`
- Consistent blur intensity and border styling
- Theme-aware tinting (dark/light)

### 5. Theme System Architecture

**Decision**: Build custom theme system instead of using a library.

**Rationale**:
- **Full Control**: Complete customization of colors, spacing, typography
- **Type Safety**: TypeScript ensures theme property access is correct
- **Performance**: No runtime theme parsing, all values are constants
- **Simplicity**: No external dependency overhead

**Implementation**:
- Constants in `src/constants/theme.ts` with `DARK_THEME` and `LIGHT_THEME`
- Store in `themeStore.ts` for preference persistence
- Hook `useTheme()` provides computed theme values
- Components access theme through hook, ensuring consistency

### 6. TypeScript Strict Mode

**Decision**: Enable TypeScript strict mode.

**Rationale**:
- **Type Safety**: Catches errors at compile time
- **Better Developer Experience**: IDE autocomplete and refactoring support
- **Documentation**: Types serve as inline documentation
- **Maintainability**: Easier to reason about code with explicit types

**Implementation**:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### 7. Separation of Concerns

**Decision**: Strict separation between routing, business logic, UI, and state.

**Rationale**:
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add features without refactoring
- **Team Collaboration**: Clear boundaries for different developers

## State Management

### Store Architecture

Three main Zustand stores manage application state:

#### 1. `musicStore` - Audio Playback State
```typescript
interface MusicStore {
  challenges: MusicChallenge[];      // All challenges
  currentTrack: MusicChallenge | null; // Currently playing track
  isPlaying: boolean;                 // Playback state
  currentPosition: number;            // Track position
  playbackSpeed: number;              // Playback rate
  // Actions...
}
```

**Persistence Strategy**:
- Persists: `challenges`, `playbackSpeed`
- Does NOT persist: `currentTrack`, `isPlaying`, `currentPosition` (ephemeral state)

**Rationale**: Reset playback state on app restart, but maintain user progress and preferences.

#### 2. `themeStore` - Theme Preferences
```typescript
interface ThemeStore {
  themeMode: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}
```

**Persistence**: Theme preference persisted to maintain user choice across sessions.

#### 3. `userStore` - User Progress
```typescript
interface UserStore {
  totalPoints: number;
  completedChallenges: string[];
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  reset: () => void;
}
```

**Persistence**: All user progress persisted to maintain gamification continuity.

### State Flow

```
User Action
    ↓
Component Event Handler
    ↓
Hook (business logic)
    ↓
Store Action (state update)
    ↓
Store Persistence (AsyncStorage)
    ↓
Component Re-render (Zustand subscription)
```

### State Update Pattern

Stores use immutable updates:
```typescript
updateProgress: (challengeId: string, progress: number) => {
  const { challenges } = get();
  const updatedChallenges = challenges.map((challenge) =>
    challenge.id === challengeId
      ? { ...challenge, progress: Math.min(100, Math.max(0, progress)) }
      : challenge
  );
  set({ challenges: updatedChallenges });
}
```

## Routing & Navigation

### File-Based Routing Structure

```
app/
├── _layout.tsx                 # Root layout
├── (tabs)/
│   ├── _layout.tsx            # Tab navigator configuration
│   ├── index.tsx              # Home tab
│   └── profile.tsx            # Profile tab
└── (modals)/
    ├── _layout.tsx            # Modal stack configuration
    ├── player.tsx             # Full-screen player modal
    └── challenge-detail.tsx  # Challenge details modal
```

### Navigation Patterns

**1. Tab Navigation**
- Bottom tab bar with glassmorphism styling
- Custom tab button component with active indicators
- Gesture handler integration for smooth interactions

**2. Modal Navigation**
- Full-screen modals for focused experiences (player, challenge details)
- Vertical swipe-to-dismiss gesture
- Stack presentation for nested modals

**3. Navigation Type Safety**
- Type-safe route params using Expo Router's typed navigation
- Compile-time checking of route names and parameters

### Route Groups

- `(tabs)`: Logical grouping for main navigation, doesn't appear in URL
- `(modals)`: Modal presentation group for overlay screens

**Rationale**: Provides organization without affecting deep linking structure.

## Audio Playback System

### Architecture

```
┌─────────────────────────────────┐
│   Component (Player Screen)     │
│   - User interactions           │
│   - UI rendering                │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│   useMusicPlayer Hook            │
│   - Playback control logic       │
│   - State synchronization        │
│   - Error handling               │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│   react-native-track-player      │
│   - Native audio playback        │
│   - Background service           │
│   - System integration           │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│   musicStore (Zustand)           │
│   - Playback state               │
│   - Current track                │
│   - Progress tracking            │
└─────────────────────────────────┘
```

### Initialization Flow

1. **Root Layout** (`app/_layout.tsx`): Calls `setupTrackPlayer()` on mount
2. **Audio Service** (`src/services/audioService.ts`): Configures TrackPlayer capabilities
3. **Background Service** (`trackPlayerService.js`): Registers remote control handlers
4. **Components**: Use `useMusicPlayer` hook to interact with playback

### Playback Features

- **Play/Pause**: Basic playback control
- **Seek**: Position control for scrubbing
- **Speed Control**: Variable playback speed (0.5x - 2.0x)
- **Progress Tracking**: Real-time position updates
- **Background Playback**: Continues when app is backgrounded
- **Lock Screen Controls**: Native iOS/Android lock screen controls

### State Synchronization

The `useMusicPlayer` hook synchronizes TrackPlayer's native state with Zustand store:
```typescript
useEffect(() => {
  const state = playbackState?.state;
  if (state === State.Playing) {
    setIsPlaying(true);
  } else if (state === State.Paused || state === State.Ready) {
    setIsPlaying(false);
  }
}, [playbackState, setIsPlaying]);
```

This ensures UI always reflects actual playback state, even if changed via system controls.

## Theming System

### Architecture

```
┌─────────────────────────────────┐
│   Theme Constants               │
│   (src/constants/theme.ts)      │
│   - DARK_THEME                  │
│   - LIGHT_THEME                 │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│   themeStore (Zustand)           │
│   - themeMode: 'dark' | 'light' │
│   - Persisted preference         │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│   useTheme Hook                  │
│   - Computes active theme        │
│   - Provides theme object        │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│   Components                     │
│   - Access theme via hook        │
│   - Dynamic styling              │
└─────────────────────────────────┘
```

### Theme Structure

Each theme object contains:
- **Colors**: Primary, secondary, accent, background, text, semantic colors
- **Typography**: Font family definitions
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, xxl)
- **Border Radius**: Rounded corner values
- **Shadows**: Platform-specific shadow definitions
- **Gradients**: Color gradient definitions for UI effects

### Design Decisions

1. **Constant-Based**: Themes are TypeScript constants, not runtime objects
   - **Rationale**: Better performance, full type safety, tree-shakeable

2. **Default Dark Theme**: Dark theme is the default
   - **Rationale**: Modern app aesthetic, better for music-focused apps

3. **System Fonts**: Uses platform system fonts
   - **Rationale**: Better performance, native feel, no font loading overhead

4. **Glass Effect Colors**: Separate glass color definitions for transparency effects
   - **Rationale**: Enables glassmorphism design pattern with theme-aware transparency

## Component Architecture

### Component Categories

#### 1. Screen Components (`app/`)
- **Purpose**: Top-level route components
- **Responsibilities**: 
  - Data fetching coordination
  - Navigation handling
  - Layout structure
- **Examples**: `index.tsx`, `profile.tsx`, `player.tsx`

#### 2. Feature Components (`src/components/challenge/`)
- **Purpose**: Feature-specific reusable components
- **Responsibilities**:
  - Feature-specific UI logic
  - Data presentation
- **Examples**: `ChallengeCard`, `ChallengeList`

#### 3. UI Components (`src/components/ui/`)
- **Purpose**: Generic, reusable UI building blocks
- **Responsibilities**:
  - Presentational rendering
  - Style composition
  - Theme integration
- **Examples**: `GlassCard`, `GlassButton`, `PointsCounter`, `ThemeToggle`

### Component Patterns

#### 1. Controlled Components
Components receive props for data and callbacks for events:
```typescript
<ChallengeCard
  challenge={challenge}
  onPress={handlePress}
  onPlay={handlePlay}
/>
```

#### 2. Compound Components
Related components work together (e.g., `ChallengeList` + `ChallengeCard`)

#### 3. Higher-Order Components Pattern
Theme integration through hooks rather than HOCs:
```typescript
const { colors, spacing } = useTheme();
```

### Styling Approach

- **StyleSheet.create**: Static styles for performance
- **Dynamic Styles**: Inline styles for theme-dependent values
- **Theme Hook**: Centralized theme access
- **No Styled Components**: Avoids runtime overhead, keeps bundle size small

## Data Flow

### Unidirectional Data Flow

```
┌──────────────┐
│   User       │
│   Action     │
└──────┬───────┘
       │
       ↓
┌─────────────────┐
│   Component     │
│   Event Handler │
└──────┬──────────┘
       │
       ↓
┌─────────────────┐
│   Custom Hook   │
│   (Business     │
│    Logic)       │
└──────┬──────────┘
       │
       ↓
┌─────────────────┐
│   Store Action  │
│   (State Update)│
└──────┬──────────┘
       │
       ↓
┌─────────────────┐
│   Persistence   │
│   (AsyncStorage)│
└──────┬──────────┘
       │
       ↓
┌─────────────────┐
│   Component     │
│   Re-render     │
│   (Subscription)│
└─────────────────┘
```

### Example: Playing a Track

1. **User Action**: Taps play button on challenge card
2. **Component Handler**: `handleChallengePlay()` in `index.tsx`
3. **Hook Call**: `play(challenge)` from `useMusicPlayer`
4. **Store Updates**: 
   - `setCurrentTrack(track)` in musicStore
   - `setIsPlaying(true)` in musicStore
5. **Native Playback**: TrackPlayer starts playing
6. **State Sync**: `useMusicPlayer` hook syncs TrackPlayer state to store
7. **UI Update**: Components subscribed to store re-render
8. **Persistence**: Store automatically persists relevant state to AsyncStorage

## Persistence Strategy

### Persistence Architecture

**Storage Backend**: `@react-native-async-storage/async-storage`
- Cross-platform key-value storage
- Asynchronous API
- Used by Zustand's `persist` middleware

### What Gets Persisted

#### `musicStore`
- ✅ `challenges`: User progress on challenges
- ✅ `playbackSpeed`: User preference
- ❌ `currentTrack`: Ephemeral, resets on app restart
- ❌ `isPlaying`: Ephemeral, resets on app restart
- ❌ `currentPosition`: Ephemeral, resets on app restart

**Rationale**: Maintain user progress while resetting playback state for clean app launches.

#### `themeStore`
- ✅ `themeMode`: User's theme preference

#### `userStore`
- ✅ `totalPoints`: Cumulative points earned
- ✅ `completedChallenges`: Array of completed challenge IDs

### Persistence Middleware

Zustand's `persist` middleware handles:
- **Automatic Serialization**: JSON stringification
- **Selective Persistence**: `partialize` option for selective persistence
- **Versioning**: Support for schema migrations (version field)
- **Error Handling**: Graceful fallback if storage fails

### Data Migration Strategy

Themes include a `version` field for future schema migrations:
```typescript
{
  name: 'theme-store',
  storage: createJSONStorage(() => AsyncStorage),
  version: 1, // Increment for migrations
}
```

## Performance Considerations

### 1. Zustand Selectors
Components subscribe only to relevant store slices:
```typescript
const themeMode = useThemeStore((state) => state.themeMode);
```

### 2. useCallback for Event Handlers
Prevents unnecessary re-renders in child components:
```typescript
const play = useCallback(async (track: MusicChallenge) => {
  // ...
}, [setCurrentTrack, setIsPlaying, playbackSpeed]);
```

### 3. Memoization Strategy
- React.memo for expensive components (if needed)
- useMemo for computed values (if needed)
- Currently minimal usage due to simple component tree

### 4. Native Module Usage
- TrackPlayer runs on native thread, not blocking JS thread
- Blur effects use native implementations via expo-blur

## Future Considerations

### Scalability

Current architecture supports:
- **Adding Features**: New routes in `app/`, new hooks in `src/hooks/`
- **State Expansion**: New Zustand stores or extended existing stores
- **Component Library**: Growing `src/components/ui/` collection

### Potential Improvements

1. **API Integration**: Replace `constants/challenges.ts` with API calls
   - Add service layer in `src/services/`
   - Implement caching strategy
   - Add error handling and retry logic

2. **Offline Support**: 
   - Cache challenges in AsyncStorage
   - Queue state updates for sync when online

3. **Analytics**: 
   - Add analytics service
   - Track user engagement with challenges
   - Monitor playback behavior

4. **Testing**:
   - Unit tests for hooks and stores
   - Integration tests for navigation flows
   - E2E tests for critical user journeys

5. **Internationalization**:
   - Add i18n library (react-i18next)
   - Extract all strings to translation files
   - Support multiple languages

## Conclusion

This architecture prioritizes:
- **Maintainability**: Clear separation of concerns, type safety
- **Developer Experience**: TypeScript, file-based routing, simple state management
- **User Experience**: Smooth animations, background playback, modern UI
- **Scalability**: Layered architecture supports growth

The chosen technologies and patterns provide a solid foundation for a production-ready music rewards application while remaining simple enough for rapid development and iteration.

