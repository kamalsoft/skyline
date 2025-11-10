// src/settingsReducer.js
import { arrayMove } from '@dnd-kit/sortable';

export const initialState = {
    clocks: [],
    primaryLocation: null,
    themePreference: 'auto',
    background: { type: 'dynamic', value: '' },
    clockTheme: 'metallic',
    timeFormat: '24h',
    displaySettings: {
        showWorldClock: true,
        showHourlyForecast: true,
        showWeeklyForecast: true,
    },
    animationSettings: {
        showWeatherEffects: true,
        showAmbientEffects: true,
    },
    soundSettings: {
        masterEnabled: true,
        weatherVolume: 0.5,
        uiVolume: 0.7,
        ambientVolume: 0.3,
    },
    appSettings: {
        autoUpdateCheck: true,
        weatherRefreshInterval: 15,
        enableAiSummary: true,
    },
};

export const settingsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PRIMARY_LOCATION':
            return { ...state, primaryLocation: action.payload };
        case 'ADD_CLOCK':
            return { ...state, clocks: [...state.clocks, action.payload] };
        case 'REMOVE_CLOCK':
            return { ...state, clocks: state.clocks.filter((clock) => clock.id !== action.payload) };
        case 'REORDER_CLOCKS':
            const { activeId, overId } = action.payload;
            const oldIndex = state.clocks.findIndex((c) => c.id === activeId);
            const newIndex = state.clocks.findIndex((c) => c.id === overId);
            return { ...state, clocks: arrayMove(state.clocks, oldIndex, newIndex) };
        case 'REMOVE_ALL_CLOCKS':
            return { ...state, clocks: state.clocks.filter((c) => c.id === 'current-location') };
        case 'UPDATE_CURRENT_LOCATION_WEATHER':
            return {
                ...state, clocks: state.clocks.map(c =>
                    c.id === 'current-location' ? { ...c, weatherCode: action.payload } : c
                )
            };
        case 'SET_CLOCKS':
            // Allow functional updates, e.g., dispatch({ type: 'SET_CLOCKS', payload: (prevClocks) => ... })
            const newClocks = typeof action.payload === 'function' ? action.payload(state.clocks) : action.payload;
            return { ...state, clocks: newClocks };
        case 'SET_THEME_PREFERENCE':
            return { ...state, themePreference: action.payload };
        case 'SET_BACKGROUND':
            return { ...state, background: action.payload };
        case 'SET_CLOCK_THEME':
            return { ...state, clockTheme: action.payload };
        case 'SET_TIME_FORMAT':
            return { ...state, timeFormat: action.payload };
        case 'SET_DISPLAY_SETTINGS':
            return { ...state, displaySettings: action.payload };
        case 'SET_ANIMATION_SETTINGS':
            return { ...state, animationSettings: action.payload };
        case 'SET_SOUND_SETTINGS':
            return { ...state, soundSettings: action.payload };
        case 'SET_APP_SETTINGS':
            return { ...state, appSettings: action.payload };
        case 'RESET_TO_DEFAULTS':
            // Keep primary location and clocks, but reset everything else
            return {
                ...initialState,
                primaryLocation: state.primaryLocation,
                clocks: state.clocks,
            };
        case 'LOAD_SETTINGS':
            // Used to load settings from localStorage, merging with defaults
            return { ...initialState, ...action.payload };
        default:
            return state;
    }
};