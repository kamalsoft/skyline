// src/contexts/SettingsContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { settingsReducer } from '../components/settings/settingsReducer';

const SettingsContext = createContext();

/**
 * Retrieves the initial settings state, either from localStorage or by using
 * a default configuration. This ensures that user preferences are persisted.
 */
const getInitialState = () => {
    const savedSettings = localStorage.getItem('skyline-settings');
    const defaultState = {
        themeId: 'midnight', // New unified theme setting
        layoutPreference: 'grid',
        font: 'poppins',
        timeFormat: '12h',
        clockTheme: 'metallic',
        displaySettings: {
            showCelestialEvents: true,
            showPanchangamPanel: false,
            showHourlyForecast: true,
            showWeeklyForecast: true,
            showSunPath: true,
            showWorldClock: true,
            showNewPanel: true, // Add setting for the new panel
        },
        background: { type: 'gradient', gradientTheme: 'default' },
        notificationSettings: {
            enablePushNotifications: false,
        },
        clocks: [],
        primaryLocation: null,
        animationSettings: {
            showWeatherEffects: true,
            showAmbientEffects: true,
            gradientSpeed: 'normal',
        },
        appSettings: {
            autoUpdateCheck: true,
            developerMode: false,
            mainSidebarSplit: '2fr 10px 1fr',
        },
    };

    try {
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            // Ensure parsed settings is an object before spreading
            if (parsedSettings && typeof parsedSettings === 'object') {
                return { ...defaultState, ...parsedSettings };
            }
        }
        return defaultState;
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        return defaultState;
    }
};

/**
 * Provides application-wide settings management.
 * It uses a reducer to handle state changes and persists the settings
 * to localStorage automatically.
 */
export const SettingsProvider = ({ children }) => {
    const [settings, dispatch] = useReducer(settingsReducer, getInitialState());

    useEffect(() => {
        // Save settings to localStorage whenever they change
        localStorage.setItem('skyline-settings', JSON.stringify(settings));
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, dispatch }}>
            {children}
        </SettingsContext.Provider>
    );
};

/**
 * A custom hook to easily access the settings context (state and dispatch function).
 */
export const useSettings = () => useContext(SettingsContext);