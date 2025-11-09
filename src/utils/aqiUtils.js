// src/utils/aqiUtils.js

/**
 * Returns a Chakra UI color scheme based on the US Air Quality Index (AQI) value.
 * @param {number} aqi The AQI value.
 * @returns {string} The name of the color scheme.
 */
export const getAqiColor = (aqi) => {
  if (aqi <= 50) {
    return 'green'; // Good
  }
  if (aqi <= 100) {
    return 'yellow'; // Moderate
  }
  if (aqi <= 150) {
    return 'orange'; // Unhealthy for Sensitive Groups
  }
  if (aqi <= 200) {
    return 'red'; // Unhealthy
  }
  if (aqi <= 300) {
    return 'purple'; // Very Unhealthy
  }
  return 'maroon'; // Hazardous
};
