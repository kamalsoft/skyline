// src/contexts/SettingsContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { settingsReducer, initialState } from '../settingsReducer';

const SettingsContext = createContext();

const APP_SETTINGS_KEY = 'skyline-app-settings';

export const SettingsProvider = ({ children }) => {
    // Initialize state from localStorage or use initial state
    const [state, dispatch] = useReducer(settingsReducer, initialState, (init) => {
        try {
            const storedState = localStorage.getItem(APP_SETTINGS_KEY);
            if (storedState) {
                // Merge stored state with initial state to ensure all keys are present
                const parsedState = JSON.parse(storedState);
                return { ...init, ...parsedState };
            }
        } catch (error) {
            console.error('Could not parse settings from localStorage', error);
        }
        return init;
    });

    // Persist state to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Could not save settings to localStorage', error);
        }
    }, [state]);

    return <SettingsContext.Provider value={{ settings: state, dispatch }}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};