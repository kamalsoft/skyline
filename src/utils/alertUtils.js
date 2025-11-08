// src/utils/alertUtils.js

const ALERT_TRIGGERS = {
    // Thunderstorms
    95: { title: 'Thunderstorm Expected', status: 'warning' },
    96: { title: 'Thunderstorm with Hail', status: 'error' },
    99: { title: 'Thunderstorm with Heavy Hail', status: 'error' },
    // Heavy Snow
    75: { title: 'Heavy Snowfall Expected', status: 'info' },
    // Violent Rain Showers
    82: { title: 'Violent Rain Showers Expected', status: 'warning' },
};

/**
 * Scans the daily forecast and generates weather alerts for severe conditions.
 * @param {object} dailyForecast - The daily forecast object from the API.
 * @returns {Array<object>} An array of alert objects.
 */
export const generateWeatherAlerts = (dailyForecast) => {
    if (!dailyForecast || !dailyForecast.time || !dailyForecast.weather_code) {
        return [];
    }

    const alerts = [];

    dailyForecast.weather_code.forEach((code, index) => {
        if (ALERT_TRIGGERS[code]) {
            const date = new Date(dailyForecast.time[index]);
            const dayString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

            alerts.push({
                id: `${code}-${dailyForecast.time[index]}`, // Unique ID for the alert
                status: ALERT_TRIGGERS[code].status,
                title: ALERT_TRIGGERS[code].title,
                description: `Prepare for potential severe weather on ${dayString}.`,
            });
        }
    });

    return alerts;
};