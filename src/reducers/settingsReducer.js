// src/reducers/settingsReducer.js

/**
 * An example reducer for managing application settings.
 * This demonstrates how to handle the SET_LAYOUT_PREFERENCE action.
 */
export const settingsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_THEME_PREFERENCE':
            return {
                ...state,
                themePreference: action.payload,
            };

        case 'SET_LAYOUT_PREFERENCE':
            return {
                ...state,
                layoutPreference: action.payload,
            };

        case 'SET_DISPLAY_SETTING':
            return {
                ...state,
                displaySettings: { ...state.displaySettings, [action.payload.settingName]: action.payload.value },
            };

        // ... other action handlers
        default:
            return state;
    }
};