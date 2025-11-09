// src/utils/aiSummaryUtils.js

import { getWeatherDescription } from './weatherUtils';
import { FaHiking, FaSwimmer, FaFilm, FaSkiing } from 'react-icons/fa';

/**
 * Generates a more detailed and dynamic natural language weather summary.
 * This function simulates an AI generating a daily and weekly weather brief.
 * @param {object} weatherData - The weather data object from the API.
 * @returns {string} A natural language weather summary.
 */
export const generateWeatherSummary = (weatherData) => {
  if (!weatherData) {
    return 'Weather data is currently unavailable. Cannot generate summary.';
  }

  const { current_weather: current, daily } = weatherData;

  // Basic data checks
  if (!current || !daily || !daily.time || daily.time.length < 7) {
    return 'Insufficient data to generate a weather summary.';
  }

  // --- Today's Summary ---
  const temp = Math.round(current.temperature);
  const maxTemp = Math.round(daily.temperature_2m_max[0]);
  const minTemp = Math.round(daily.temperature_2m_min[0]);
  const todayWeatherDesc = getWeatherDescription(current.weathercode).toLowerCase();

  let summary = `Currently, it's ${temp}°C with ${todayWeatherDesc}. Today's forecast shows a high of ${maxTemp}°C and a low of ${minTemp}°C. `;

  // --- Weekly Outlook ---
  const weeklyMaxTemps = daily.temperature_2m_max.slice(0, 7);
  const weeklyWeatherCodes = daily.weather_code.slice(0, 7);

  // Temperature Trend Analysis
  const tempTrend = () => {
    const firstHalfAvg = weeklyMaxTemps.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const secondHalfAvg = weeklyMaxTemps.slice(4, 7).reduce((a, b) => a + b, 0) / 3;
    if (secondHalfAvg > firstHalfAvg + 2) {
      return 'expect a warming trend toward the end of the week. ';
    }
    if (secondHalfAvg < firstHalfAvg - 2) {
      return 'expect a cooling trend as the week progresses. ';
    }
    return 'temperatures will remain fairly consistent throughout the week. ';
  };

  // Significant Weather Event Analysis
  const significantEvents = () => {
    for (let i = 1; i < 7; i++) {
      // Check from tomorrow onwards
      const code = weeklyWeatherCodes[i];
      const day = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'long' });

      if (code >= 95) {
        // Thunderstorm
        return `Keep an eye out for potential thunderstorms on ${day}. `;
      }
      if (code >= 71 && code <= 86) {
        // Snow
        return `There's a possibility of snow on ${day}. `;
      }
      if (code >= 51 && code <= 67) {
        // Rain
        return `It looks like there will be some rain on ${day}. `;
      }
    }
    return 'The week ahead looks mostly clear. ';
  };

  summary += 'Looking at the week ahead, ';
  summary += tempTrend();
  summary += significantEvents();

  // Closing statement
  if (todayWeatherDesc.includes('rain') || todayWeatherDesc.includes('storm')) {
    summary += 'Stay dry and have a great day!';
  } else {
    summary += 'Enjoy the weather!';
  }

  return summary;
};

/**
 * Generates an activity suggestion based on the weather.
 * @param {object} weatherData - The weather data object from the API.
 * @returns {{suggestion: string, icon: object}|null} An object containing the suggestion string and a relevant icon, or null.
 */
export const generateActivitySuggestion = (weatherData) => {
  if (!weatherData || !weatherData.current_weather || !weatherData.daily) {
    return null;
  }

  const { current_weather: current, daily } = weatherData;
  const code = current.weathercode;
  const temp = current.temperature;
  const wind = current.windspeed;
  const precip = daily.precipitation_sum[0];

  // Good weather conditions for outdoor activities
  if (code <= 3 && temp > 15 && temp < 28 && wind < 25 && precip === 0) {
    return { text: 'Great day for a hike or a picnic!', icon: FaHiking };
  }

  // Hot day suggestion
  if (temp >= 28 && code <= 3) {
    return { text: 'Perfect weather for a swim or staying cool indoors.', icon: FaSwimmer };
  }

  // Rainy day suggestion
  if (code >= 51 && code <= 67) {
    return { text: 'A good day to visit a museum or watch a movie.', icon: FaFilm };
  }

  // Snowy day suggestion
  if (code >= 71 && code <= 86) {
    return { text: 'Looks like a good day for some winter sports!', icon: FaSkiing };
  }

  return null; // No specific suggestion if conditions are average
};
