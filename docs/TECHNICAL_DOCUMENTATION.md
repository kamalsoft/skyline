# Skyline - Technical Documentation

## 1. Introduction

This document provides a technical overview of the Skyline weather dashboard application. It is intended for developers who are new to the project or need to understand its architecture and codebase.

Skyline is a client-side single-page application (SPA) built with React. It leverages modern web technologies to deliver a feature-rich, interactive, and aesthetically pleasing user experience.

## 2. Technology Stack

- **Framework:** React (v18+)
- **UI Library:** Chakra UI for a comprehensive set of accessible and composable UI components.
- **Animations:** Framer Motion for all UI and background animations.
- **Drag & Drop:** dnd-kit for accessible and performant drag-and-drop functionality (used for world clocks).
- **State Management:**
  - React Hooks (`useState`, `useEffect`, `useCallback`) for local component state.
  - React Context API (`useContext`, `useReducer`) for global state like settings, sounds, and logs.
- **HTTP Client:** Axios for making API requests.
- **Audio:** Howler.js for managing and playing all application sounds.
- **Mapping:** Leaflet and React-Leaflet for the weather radar map.
- **Utilities:** date-fns or Moment.js (via `useWorldClock` hook) for time and date manipulation across timezones.

## 3. Project Structure

The `src/` directory is organized by feature and responsibility:

```
src/
├── components/       # Reusable React components (e.g., WeatherCard, AnalogClock)
│   └── settings/     # Components specific to the SettingsPanel
├── contexts/         # Global state providers (SettingsContext, LogContext, SoundContext)
├── hooks/            # Custom React hooks for shared logic (e.g., useClockManager, useAppSettings)
├── utils/            # Helper functions and utilities (e.g., weatherUtils, moonUtils)
├── App.js            # Main application component orchestrating the layout and data flow
├── index.js          # Application entry point
├── settingsReducer.js # Reducer function for managing application settings
└── service-worker.js # PWA service worker logic
```

## 4. Architecture & State Management

### State Management

Skyline employs a hybrid state management strategy:

1.  **`SettingsContext`**: A global context powered by `useReducer`. It manages all user-configurable settings. The `settingsReducer.js` file defines all possible state transitions and persists changes to `localStorage`. This provides a centralized and predictable way to handle user preferences.

2.  **`LogContext`**: A global context for in-app logging. It intercepts `console.log`, `console.error`, etc., and stores the messages. The `LogTerminal` component consumes this context to display logs, which is invaluable for debugging.

3.  **`SoundContext`**: Manages all audio using Howler.js. It handles loading sounds, playing/stopping them, and applying volume settings.

4.  **Custom Hooks**:
    - `useClockManager`: Encapsulates all logic for adding, removing, and reordering world clocks, including drag-and-drop state.
    - `useWorldClock`: Provides a continuously updating time for a specific timezone.

### Component Architecture

- **`App.js`**: The root component that wraps everything in the necessary context providers (`LogProvider`, `SettingsProvider`, etc.).
- **`AppContent` (within `App.js`)**: The main layout component. It fetches the primary location, orchestrates the main UI elements (`WeatherCard`, `SettingsPanel`, `AnimatedBackground`), and passes down state and dispatch functions.
- **`WeatherCard.js`**: A complex component responsible for fetching and displaying all weather data for the primary location. It manages its own state for API calls (loading, error).
- **`AnimatedBackground.js`**: A purely presentational component that renders complex animations based on props like `weatherCode`, `sunrise`, and `sunset`. It uses Framer Motion for all animations.

## 5. External APIs

- **Geocoding & Location:**
  - `api.bigdatacloud.net`: Used for reverse geocoding to get a city name from browser-provided latitude/longitude.
  - `geocoding-api.open-meteo.com`: Used for forward geocoding (searching for cities by name).
- **Weather:**
  - `api.open-meteo.com`: The primary source for all weather forecast data (current, hourly, daily).
- **Weather Maps:**
  - `api.rainviewer.com`: Provides timestamps and tile URLs for the live weather radar overlay.

## 6. Development

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Running Locally

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm start`
4.  Open http://localhost:3000 in your browser.

### Contribution Guidelines

- **Commits:** Follow the Conventional Commits specification (e.g., `feat:`, `fix:`, `docs:`).
- **Code Style:** The project uses ESLint and Prettier for code formatting and linting. Please run `npm run lint` before committing.
- **Pull Requests:** Create a feature branch from `main`. Ensure all tests pass and there are no linting errors before submitting a PR.

---
