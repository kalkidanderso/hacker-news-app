# HackerNewsApp

A React Native news feed application built against the Hacker News Firebase API. The app presents the top 20 stories with sorting, debounced search, persistent bookmarks, and accurate scroll-position restoration.

## Requirements

- Node.js 18+
- React Native CLI environment (Android SDK for Android, Xcode for iOS)
- An Android emulator / physical device (API 30+), or an iOS simulator (14+)

## Setup

```bash
# Install dependencies
npm install

# iOS only — install CocoaPods
cd ios && bundle exec pod install && cd ..

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run tests
npm test
```

## Folder Structure

```
src/
├── api/              # Network layer (Hacker News client)
├── assets/           # Static assets (favicon placeholder)
├── components/       # Shared, reusable UI components
├── constants/        # Design tokens and config constants
├── features/
│   ├── feed/         # Article list + detail screens and Redux slice
│   └── bookmarks/    # Bookmarks screen and Redux slice
├── hooks/            # Custom hooks (typed Redux, bookmarks, scroll position)
├── navigation/       # Stack and tab navigators
├── store/            # Redux store configuration
├── types/            # TypeScript interfaces and navigation param lists
└── utils/            # Pure functions (story normalization, debounce)
```

## Architectural Decisions

**Feature-based folder structure** — each domain (feed, bookmarks) owns its slice, screen, and local logic. Shared concerns live in `components/`, `hooks/`, and `utils/`. This makes features independently traceable and avoids cross-feature coupling.

**Redux Toolkit** — chosen over Zustand or raw Context because the app has two distinct domains (feed and bookmarks) that share state across tabs. RTK's `createAsyncThunk` handles loading/error state ergonomically, and the slice pattern enforces single-responsibility at the data layer. Zustand would be viable for a smaller surface area; Context would introduce prop-drilling or context-splitting boilerplate at this scale.

**Scroll position restoration** — the current top-visible index is captured via `onViewableItemsChanged` (not `onScroll`, which fires too frequently). On focus return, `scrollToIndex` is called with `animated: false` for an imperceptible restore. Index-based restoration is safe here because the list data is stable between navigations.

**Debounced search** — filtering runs client-side against the already-fetched 20 stories. The debounce (300 ms) is implemented as a plain utility rather than a third-party hook to keep the dependency tree lean. Query is stored in Redux so sort and search compose correctly in the selector.

**AsyncStorage persistence** — bookmarks are written to AsyncStorage after every `toggleBookmark` or `removeBookmark` action via a fire-and-forget `persist()` helper inside the reducer. Hydration runs once at app startup via `hydrateBookmarks` thunk dispatched in `AppContent`'s `useEffect`.

**Performance** — `StoryCard` is wrapped in `React.memo`. `FlatList` uses `getItemLayout` (fixed row height of 110 dp) to allow O(1) scroll-to-index without layout measurement. `maxToRenderPerBatch` and `windowSize` are tuned conservatively; `removeClippedSubviews` is enabled to reduce off-screen GPU usage.

---

## Technical Q&A

### Q1 — Bridge vs JSI, Fabric, TurboModules

The legacy Bridge serializes all JS↔native communication to JSON, queued asynchronously across a thread boundary. This means every native call incurs serialization overhead and a full round-trip even for synchronous operations. JSI (JavaScript Interface) replaces the Bridge with a C++ layer that lets JavaScript hold direct references to native host objects; calls become synchronous and zero-copy, eliminating JSON serialization entirely. Fabric is the new renderer built on JSI — it runs the React shadow tree in C++ and enables concurrent rendering and synchronous layout measurements on the JS thread. TurboModules are lazily-loaded native modules exposed via JSI, replacing the upfront registration of all modules at startup, which reduces cold-start time. The combined effect is measurably lower call latency (microseconds vs. milliseconds on the Bridge), faster startup, and the ability to use React 18 concurrent features.

### Q2 — Diagnosing and fixing a janky FlatList with 500 items

First, enable the Perf Monitor overlay and identify whether the frame drop is JS-thread-bound or UI-thread-bound. If JS-bound, the likely culprits are expensive `renderItem` re-renders — solved by wrapping the item component in `React.memo` and ensuring `onPress` callbacks are stable references (via `useCallback`). Second, use `getItemLayout` to provide precomputed item dimensions; without it, React Native must measure each item during scroll, stalling the JS thread. Third, audit image loading: each off-screen image should be decoded lazily and ideally cached — consider `react-native-fast-image` which uses a shared cache and respects `Cache-Control` headers, preventing redundant fetches that compete with scroll rendering. Within the `FlatList`, `windowSize={5}` (or lower) reduces the number of rendered items off-screen; combined with `removeClippedSubviews` this keeps GPU memory bounded.

### Q3 — Error Boundaries and error tracking

React's `ErrorBoundary` is a class component that implements `componentDidCatch` and `getDerivedStateFromError`. It intercepts render-phase exceptions in its subtree, renders a fallback UI, and prevents the whole tree from unmounting. Boundaries should be placed at three levels: the root (catch-all), around each tab/screen (isolate failures per surface), and around individually failure-prone widgets like data-fetching cards. On `componentDidCatch`, pass the error and `errorInfo.componentStack` directly to Sentry via `Sentry.captureException(error, { extra: { componentStack } })`. Sentry's React Native SDK also provides `Sentry.wrap(App)` which automatically installs a root boundary and forwards unhandled promise rejections and native crashes, but explicit per-boundary calls give richer context and allow custom fallback UI per scope.

### Q4 — State management at 12-screen scale

Context API is appropriate for low-frequency global values (theme, user locale) that change rarely and don't need fine-grained subscriptions. At 12 screens with shared transient state (loading flags, pagination cursors, cross-screen selections), Context causes unnecessary re-renders across every consumer unless split into many tiny contexts, which defeats the simplicity argument. Redux Toolkit solves this with slice-level subscription granularity — `useSelector` with a specific selector only re-renders the component when that slice of state changes. The trade-off is boilerplate (reducers, actions, selectors), mitigated significantly by RTK's `createSlice`. Zustand occupies the middle ground: minimal API, no Provider needed, and per-store subscriptions — ideal for apps where RTK's ceremony isn't justified but Context's re-render problem is apparent. For this app's two-domain, two-tab structure, RTK is the right fit because async thunk lifecycle states (pending/fulfilled/rejected) are handled cleanly without custom middleware.

### Q5 — Offline-first UX

Connectivity detection uses `@react-native-community/netinfo`, which provides a subscription to connection state changes including type (wifi, cellular) and reachability. The strategy layers as follows: on first load, fetch from the network and write results to a local cache (AsyncStorage for simple JSON, MMKV for performance, or a SQLite-backed ORM like WatermelonDB for relational data); on subsequent loads, check connectivity first and serve the cache immediately while a background refresh runs in parallel. Cache invalidation is time-based (TTL stored alongside the payload) and event-based (pull-to-refresh always bypasses the cache). The UI communicates offline state via a non-intrusive banner component that appears when `netinfo.isInternetReachable === false`. For mutations (bookmarks, in this app), a write-ahead approach is used: apply the change optimistically to local state and storage first, then sync to the server when connectivity returns — this keeps the UX snappy regardless of network state.
