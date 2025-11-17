// src/contexts/SettingsContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { settingsReducer } from '../components/settings/settingsReducer';

const SettingsContext = createContext();

const getInitialState = () => {
    const savedSettings = localStorage.getItem('skyline-settings');
    const defaultState = {
        themePreference: 'auto',
        layoutPreference: 'grid',
        timeFormat: '12h',
        clockTheme: 'metallic',
        displaySettings: {
            showCelestialEvents: true,
            showPanchangamPanel: false,
            showHourlyForecast: true,
            showWeeklyForecast: true,
            showSunPath: true,
            showWorldClock: true,
        },
        notificationSettings: {
            enablePushNotifications: false,
        },
        clocks: [],
        primaryLocation: null,
        panelPositions: {},
        background: {
            type: 'gradient',
            value: '',
        },
        animationSettings: {
            showWeatherEffects: true,
            showAmbientEffects: true,
        },
        appSettings: {
            autoUpdateCheck: true,
            developerMode: false,
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

export const useSettings = () => useContext(SettingsContext);