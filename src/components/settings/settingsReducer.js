// src/reducers/settingsReducer.js

import { v4 as uuidv4 } from 'uuid';
import theme from '../../theme';
/**
 * An example reducer for managing application settings.
 * This demonstrates how to handle the SET_LAYOUT_PREFERENCE action.
 */
export const settingsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_THEME': {
            const selectedTheme = theme.themes[action.payload];
            if (selectedTheme) {
                return { ...state, themeId: action.payload, background: selectedTheme.background, appSettings: { ...state.appSettings, uiEffect: selectedTheme.panelStyle } };
            }
            return {
                ...state,
                themeId: action.payload,
            };
        }
        case 'SET_LAYOUT_PREFERENCE':
            console.log('[Settings] Action: SET_LAYOUT_PREFERENCE, Payload:', action.payload);
            const newState = {
                ...state,
                layoutPreference: action.payload,
            };
            console.log('[Settings] Layout preference changed to:', newState.layoutPreference);
            return newState;

        case 'SET_DISPLAY_SETTING':
            return {
                ...state,
                displaySettings: { ...state.displaySettings, [action.payload.settingName]: action.payload.value },
            };

        case 'SET_CLOCK_THEME':
            return { ...state, clockTheme: action.payload };

        case 'SET_TIME_FORMAT':
            return { ...state, timeFormat: action.payload };

        case 'SET_ANIMATION_SETTINGS':
            return { ...state, animationSettings: action.payload };

        case 'SET_ANIMATION_SETTING':
            return {
                ...state,
                animationSettings: { ...state.animationSettings, [action.payload.settingName]: action.payload.value },
            };

        case 'SET_APP_SETTINGS':
            return { ...state, appSettings: action.payload };

        case 'SET_APP_SETTING':
            return {
                ...state,
                appSettings: { ...state.appSettings, [action.payload.settingName]: action.payload.value },
            };

        case 'RESET_TO_DEFAULTS':
            // This action should reset settings to their initial state, but preserve clocks.
            // Assuming 'initialState' is available in a real scenario.
            // For this example, we'll reset a few specific fields.
            return {
                ...state,
                themePreference: 'auto',
                layoutPreference: 'grid',
                // Keep clocks and primary location
            };

        case 'ADD_CLOCK':
            return {
                ...state,
                clocks: [...state.clocks, { ...action.payload, id: uuidv4() }],
            };

        case 'REMOVE_CLOCK':
            return {
                ...state,
                clocks: state.clocks.filter((clock) => clock.id !== action.payload),
            };

        case 'REMOVE_ALL_CLOCKS':
            // Keep the primary location clock
            return {
                ...state,
                clocks: state.clocks.filter((clock) => clock.id === 'current-location'),
            };

        case 'SET_PRIMARY_LOCATION':
            return {
                ...state,
                primaryLocation: action.payload,
                clocks: [
                    { ...action.payload, id: 'current-location' },
                    ...state.clocks.filter((clock) => clock.id !== 'current-location'),
                ],
            };

        case 'SET_NOTIFICATION_SETTING':
            return {
                ...state,
                notificationSettings: { ...state.notificationSettings, [action.payload.settingName]: action.payload.value },
            };

        case 'SET_PANEL_POSITION':
            return { ...state, panelPositions: { ...state.panelPositions, [action.payload.panel]: action.payload.position } };

        case 'SET_BACKGROUND':
            return { ...state, background: { ...state.background, ...action.payload } };

        // ... other action handlers
        default:
            return state;
    }
};