# Skyline Weather Dashboard: Wiki & Roadmap

Welcome to the official wiki for the Skyline Weather Dashboard. This document provides an overview of the application's current features and a roadmap for future development.

## Overview

Skyline is a modern, immersive weather dashboard designed to provide a beautiful and intuitive experience for tracking weather conditions. It combines real-time weather data with stunning visuals, astronomical information, and a high degree of personalization to create a unique and engaging tool for users across all devices.

---

## Current Features (v1.2.0)

The application is built on a robust and scalable architecture, featuring a centralized state management system using React Context and a responsive, mobile-first UI.

### Core Weather & Data

- **Real-time Weather:** Displays current temperature, "feels like" temperature, humidity, wind speed, and AQI for the user's primary location.
- **Forecast Carousels:** Interactive, draggable carousels for both hourly (24-hour) and weekly (7-day) forecasts.
- **Detailed Forecast Modal:** Clicking on any forecast item opens a modal with detailed information (e.g., precipitation, UV index, wind direction).
- **AI-Powered Summaries:** An optional feature that provides a concise, AI-generated summary of the day's weather and a relevant activity suggestion.
- **Historical Weather Chart:** A modal that allows users to select a date range and view historical weather data (temperature range and precipitation) in an interactive chart.

### UI/UX & Layout

- **Fully Responsive Design:** The layout intelligently adapts to all screen sizes, from mobile phones and tablets to desktops and large ambient displays.
- **Mobile-First Experience:** On mobile devices, secondary content like the world clock list is neatly tucked into a slide-in drawer to maximize screen space for primary weather data.
- **Floatable Header:** The main header controls (theme toggle, settings, etc.) are draggable, allowing users to customize the layout and enjoy an unobstructed view.
- **Resizable Settings Panel:** On desktop, the settings panel is a draggable and resizable window, enabling users to see their changes take effect in real-time.
- **Glassmorphism Theme:** A consistent "glass" effect is used across UI elements like cards, modals, and panels for a modern, cohesive aesthetic.

### Customization & Settings

- **Theme Control:**
  - Manual Light/Dark mode toggle.
  - "Auto" theme mode that automatically switches between light and dark based on the local sunrise and sunset times.
- **Background Customization:**
  - **Dynamic:** A fully animated gradient background that changes with the time of day.
  - **Custom Image:** Users can provide a URL to set their own custom background image.
- **Layout Toggles:** Users can show or hide individual UI sections, including the World Clock sidebar, hourly/weekly forecasts, and the Seasonal Sun Path panel.
- **Clock & Time:**
  - Choose from multiple analog clock themes (e.g., Copper, Minimalist, Ocean, Cyberpunk).
  - Select between 12-hour and 24-hour time formats.
- **World Clock Management:**
  - Search for and add multiple world clocks.
  - Set a manual primary location.
  - Reorder clocks via drag-and-drop.
  - Delete individual clocks or all at once.
- **Data & Network:**
  - Adjust the automatic refresh interval for weather data.
  - Option to clear all cached application data and settings.

### Animations & Visuals

- **Animated Background:** A dynamic background that visualizes the day/night cycle.
- **Live Weather Effects:** Real-time visual effects for weather conditions, including rain, clouds, fog, and lightning (with screen shake).
- **Ambient Effects:** At night, the background features twinkling stars, shooting stars, and an animated aurora.
- **Interactive Globe:** An interactive 3D globe that visualizes the sun/moon's daily orbit, which can be spun by the user.
- **Earth's Orbit Diagram:** A dedicated panel that provides a beautiful and educational animated illustration of the Earth's elliptical orbit, showing the seasons and key astronomical points like solstices and equinoxes.

---

## Future Roadmap

This section outlines planned features and ideas for future versions of Skyline.

### Next Up (v1.3.0)

- **Proactive Weather Alerts & Push Notifications:**
  - **Goal:** Transform the app into a proactive assistant by sending push notifications for significant upcoming weather events (e.g., "Rain starting in 1 hour," "High wind warning tomorrow").
  - **Implementation:** This will involve adding a "Notifications" settings tab, using the browser's Push API for user subscriptions, and creating a small backend service to monitor forecasts and trigger alerts.

- **Enhanced Unit Customization:**
  - **Goal:** Allow users to select their preferred units for all meteorological data, not just temperature.
  - **Implementation:** Add settings for Wind Speed (km/h, mph, m/s), Precipitation (mm, inches), and Pressure (hPa, inHg). The UI will be updated to display data in the user's chosen format.

### Future Ideas (Post-v1.3.0)

- **Advanced Weather Maps:** Integrate more detailed, interactive map layers for radar, satellite, wind patterns, and temperature gradients.
- **Accessibility Overhaul:** Conduct a full accessibility audit (WCAG compliance) to improve screen reader support, keyboard navigation, and color contrast.
- **Theming Engine:** Allow users to create and save their own custom themes by selecting colors for the UI, gradients, and effects.
- **PWA Enhancements:** Improve offline capabilities, allowing users to view their last-fetched weather data even without an internet connection.
- **Localization (i18n):** Add support for multiple languages in the UI and for location search results.
