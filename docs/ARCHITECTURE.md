# Skyline - Architecture Document

## 1. Overview

Skyline is a client-side, single-page application (SPA) designed to run entirely within a modern web browser. It is architected as a Progressive Web App (PWA), enabling offline capabilities and a native-like feel. The architecture prioritizes a modular component structure, predictable state management, and a rich, interactive user experience.

## 2. Software Architecture

### Frontend Architecture: React & Component-Based

The application is built using **React**. The architecture is strictly component-based, with a clear separation of concerns between container components (logic-heavy) and presentational components (UI-focused).

- **Core Framework:** React v18+
- **UI Components:** Chakra UI provides the foundational, accessible component library.
- **Styling:** A combination of Chakra UI's style props and a global stylesheet (`App.css`) for the "glassmorphism" effect and other base styles.

### State Management

State is managed through a combination of React's built-in hooks and the Context API for a distributed yet organized approach.

1.  **Local Component State:** `useState` is used for state that is local to a single component (e.g., loading/error states for an API call within `WeatherCard`).
2.  **Shared Global State (Context API):**
    - **`SettingsContext`**: Manages all user-configurable settings. It uses a `useReducer` hook for predictable state transitions. All settings are persisted to `localStorage` to maintain user preferences across sessions.
    - **`LogContext`**: A debug utility that intercepts all `console.*` calls and window errors, providing an on-screen terminal for easier debugging.
    - **`SoundContext`**: Manages audio playback via Howler.js, centralizing control over volume and sound events.

### Data Flow

- **Unidirectional Data Flow:** Data flows downwards from parent components to children via props.
- **State Updates:** Child components trigger state updates in parent components or global contexts by invoking callback functions (e.g., `onClose`) or dispatching actions to a reducer (e.g., `dispatch({ type: 'SET_THEME', ... })`).

### Asynchronous Operations

- **API Calls:** `axios` is used for all HTTP requests to external services (Open-Meteo, BigDataCloud, Rainviewer). These calls are encapsulated within `useEffect` or `useCallback` hooks to manage their lifecycle and dependencies.
- **Browser APIs:** Geolocation (`navigator.geolocation`) is used to determine the user's primary location.

### PWA & Offline Capabilities

Skyline is a Progressive Web App.

- **Service Worker:** The `service-worker.js` file, managed by Workbox, is responsible for caching application assets (`precacheAndRoute`). This allows the application shell to load instantly on subsequent visits, even when offline.
- **Cache Strategy:** A `StaleWhileRevalidate` strategy is used for assets like images, serving them from the cache first for speed while re-fetching in the background.
- **Manifest:** A `manifest.json` file allows the application to be "installed" on a user's home screen or desktop.

## 3. External Services & APIs (Data Layer)

Skyline is a pure client-side application and does not have its own backend. It relies entirely on third-party APIs for data.

- **Weather Data:** `api.open-meteo.com`
- **Geocoding:** `geocoding-api.open-meteo.com`
- **Reverse Geocoding:** `api.bigdatacloud.net`
- **Radar Tiles:** `api.rainviewer.com`

This serverless architecture simplifies deployment and maintenance but makes the application fully dependent on the availability and terms of these external services.

## 4. Hardware & Deployment

### Hardware Requirements (Client-Side)

- **Browser:** A modern, evergreen web browser (Chrome, Firefox, Safari, Edge) with support for JavaScript (ES6+), CSS3, and the Geolocation API.
- **CPU/GPU:** While the application is lightweight, a device with hardware acceleration is recommended for the smoothest experience with the WebGL-based animated background and Framer Motion animations. Performance can be managed by disabling animations in the settings.

### Deployment

- **Hosting:** The application is designed for static hosting. It can be deployed on any platform that serves static files, such as Netlify, Vercel, GitHub Pages, or an AWS S3 bucket.
- **Build Process:** The project uses Create React App (CRA). The `npm run build` command compiles the React code, bundles all assets, and generates a production-ready `build` directory, including the optimized service worker.

---
