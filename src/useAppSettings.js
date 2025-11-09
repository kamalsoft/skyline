// src/hooks/useAppSettings.js
import { useState, useEffect } from 'react';

/**
 * A custom hook to manage user-configurable application settings.
 * It abstracts away the logic for storing and retrieving settings
 * from localStorage.
 *
 * @returns An object containing all settings and their update functions.
 */
export function useAppSettings() {
  const getInitialState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const [themePreference, setThemePreference] = useState(() => getInitialState('themePreference', 'dark'));
  const [clockTheme, setClockTheme] = useState(() => getInitialState('clockTheme', 'metallic'));
  const [timeFormat, setTimeFormat] = useState(() => getInitialState('timeFormat', '12h'));
  const [background, setBackground] = useState(() => getInitialState('background', { type: 'dynamic', value: '' }));
  const [animationSettings, setAnimationSettings] = useState(() =>
    getInitialState('animationSettings', { showWeatherEffects: true, showAmbientEffects: true })
  );
  const [displaySettings, setDisplaySettings] = useState(() =>
    getInitialState('displaySettings', { showWorldClock: true, showHourlyForecast: true, showWeeklyForecast: true })
  );
  const [appSettings, setAppSettings] = useState(() => getInitialState('appSettings', { autoUpdateCheck: true }));

  useEffect(() => {
    localStorage.setItem('themePreference', JSON.stringify(themePreference));
  }, [themePreference]);

  useEffect(() => {
    localStorage.setItem('clockTheme', JSON.stringify(clockTheme));
  }, [clockTheme]);

  useEffect(() => {
    localStorage.setItem('timeFormat', JSON.stringify(timeFormat));
  }, [timeFormat]);

  useEffect(() => {
    localStorage.setItem('background', JSON.stringify(background));
  }, [background]);

  useEffect(() => {
    localStorage.setItem('animationSettings', JSON.stringify(animationSettings));
  }, [animationSettings]);

  useEffect(() => {
    localStorage.setItem('displaySettings', JSON.stringify(displaySettings));
  }, [displaySettings]);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
  }, [appSettings]);

  return {
    themePreference,
    setThemePreference,
    clockTheme,
    setClockTheme,
    timeFormat,
    setTimeFormat,
    background,
    setBackground,
    animationSettings,
    setAnimationSettings,
    displaySettings,
    setDisplaySettings,
    appSettings,
    setAppSettings,
  };
}
