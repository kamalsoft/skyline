// src/settingsReducer.js

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
        case 'REMOVE_ALL_CLOCKS':
            return { ...state, clocks: state.clocks.filter((c) => c.id === 'current-location') };
        case 'SET_CLOCKS':
            return { ...state, clocks: action.payload };
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