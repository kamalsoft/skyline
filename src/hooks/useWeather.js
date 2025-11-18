// src/hooks/useWeather.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { WeatherError } from '../utils/weatherUtils';
import { validateWeatherData } from '../utils/weatherValidation';

/**
 * A custom hook to manage fetching and processing weather data.
 * @param {number} latitude - The latitude for the weather location.
 * @param {number} longitude - The longitude for the weather location.
 * @param {object} appSettings - Application settings, including the refresh interval.
 * @param {string} locationName - The name of the location for logging.
 * @param {function} onForecastFetch - Callback for when daily forecast is fetched.
 * @param {function} onWeatherFetch - Callback for when current weather is fetched.
 * @returns {object} An object containing weatherData, isLoading, error, isRefreshing, and a manual fetch function.
 */
export function useWeather({ latitude, longitude, appSettings, locationName, onForecastFetch, onWeatherFetch }) {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Use a ref to hold the latest weatherData to avoid re-creating fetchWeather on every data change
    const weatherDataRef = useRef(weatherData);
    useEffect(() => {
        weatherDataRef.current = weatherData;
    }, [weatherData]);

    const fetchWeather = useCallback(async () => {
        if (!latitude || !longitude) return;

        // Set refreshing state only if we already have data
        if (weatherDataRef.current) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_direction_10m,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_direction_10m_dominant&forecast_days=14&timezone=auto&current_weather=true&air_quality_index=us_aqi`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new WeatherError(`Server error: ${response.status} ${response.statusText}. Please try again later.`, 'SERVER_ERROR');
            }

            const data = await response.json();
            const { isValid, error: validationError } = validateWeatherData(data);
            if (!isValid) {
                throw new WeatherError(validationError, 'VALIDATION_ERROR');
            }

            setWeatherData(data);
            setLastUpdated(new Date());
            onForecastFetch?.(data.daily);
            onWeatherFetch?.(data.current_weather);
            console.log(`[useWeather] Weather fetch successful for ${locationName}.`);
        } catch (err) {
            console.error(`[useWeather] Detailed weather fetch error for ${locationName}:`, err);
            setError(err instanceof WeatherError ? err : new WeatherError('An unexpected error occurred.', 'UNKNOWN_ERROR'));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [latitude, longitude, locationName, onForecastFetch, onWeatherFetch]);

    useEffect(() => {
        fetchWeather();
        const refreshIntervalMinutes = appSettings?.weatherRefreshInterval || 10;
        const intervalId = setInterval(fetchWeather, refreshIntervalMinutes * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [fetchWeather, appSettings?.weatherRefreshInterval]);

    return { weatherData, isLoading, error, isRefreshing, lastUpdated, fetchWeather };
}