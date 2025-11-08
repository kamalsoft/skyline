// src/utils/weatherValidation.js

const plausibleTemp = (temp) => temp >= -90 && temp <= 60;
const plausibleHumidity = (humidity) => humidity >= 0 && humidity <= 100;
/**
 * Validates the structure of the weather data from the Open-Meteo API.
 * @param {object} data The weather data object from the API response.
 * @returns {{isValid: boolean, error: string|null}} An object indicating if the data is valid and an error message if not.
 */
export const validateWeatherData = (data) => {
    if (!data) {
        return { isValid: false, error: "No data object received from API." };
    }

    // Validate current weather object
    if (typeof data.current_weather !== 'object' || data.current_weather === null) {
        return { isValid: false, error: "Missing or invalid 'current_weather' data." };
    }
    if (!plausibleTemp(data.current_weather.temperature)) {
        return { isValid: false, error: `Implausible current temperature: ${data.current_weather.temperature}°C` };
    }
    if (data.current_weather.weathercode === undefined) {
        return { isValid: false, error: "Current weather is missing 'weathercode'." };
    }

    // Validate daily forecast object and its arrays
    if (typeof data.daily !== 'object' || data.daily === null) {
        return { isValid: false, error: "Missing or invalid 'daily' forecast data." };
    }
    const dailyArrays = ['time', 'weather_code', 'temperature_2m_max', 'temperature_2m_min'];
    for (const key of dailyArrays) {
        if (!Array.isArray(data.daily[key])) {
            return { isValid: false, error: `Daily forecast is missing '${key}' array.` };
        }
    }

    // Validate hourly forecast object and its arrays
    if (typeof data.hourly !== 'object' || data.hourly === null) {
        return { isValid: false, error: "Missing or invalid 'hourly' forecast data." };
    }
    const hourlyArrays = ['time', 'weather_code', 'temperature_2m', 'apparent_temperature', 'relative_humidity_2m'];
    for (const key of hourlyArrays) {
        if (!Array.isArray(data.hourly[key])) {
            return { isValid: false, error: `Hourly forecast is missing '${key}' array.` };
        }
    }
    // Sanity check the first hour's temperature
    if (data.hourly.temperature_2m.length > 0 && !plausibleTemp(data.hourly.temperature_2m[0])) {
        return { isValid: false, error: `Implausible hourly temperature: ${data.hourly.temperature_2m[0]}°C` };
    }
    // Sanity check the first hour's humidity
    if (data.hourly.relative_humidity_2m.length > 0 && !plausibleHumidity(data.hourly.relative_humidity_2m[0])) {
        return { isValid: false, error: `Implausible hourly humidity: ${data.hourly.relative_humidity_2m[0]}%` };
    }

    return { isValid: true, error: null };
};