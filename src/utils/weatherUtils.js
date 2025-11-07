// src/utils/weatherUtils.js
import {
    WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm,
    WiFog, WiSleet, WiHail, WiRainMix, WiShowers, WiSnowflakeCold
} from 'react-icons/wi';

// WMO Weather interpretation codes (WW)
// See https://www.nodc.noaa.gov/archive/arc0021/0001995/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
// Or https://www.open-meteo.com/en/docs
export const getWeatherDescription = (code) => {
    switch (code) {
        case 0: return 'Clear sky';
        case 1: return 'Mainly clear';
        case 2: return 'Partly cloudy';
        case 3: return 'Overcast';
        case 45: return 'Fog';
        case 48: return 'Depositing rime fog';
        case 51: return 'Drizzle: Light';
        case 53: return 'Drizzle: Moderate';
        case 55: return 'Drizzle: Dense intensity';
        case 56: return 'Freezing Drizzle: Light';
        case 57: return 'Freezing Drizzle: Dense intensity';
        case 61: return 'Rain: Slight';
        case 63: return 'Rain: Moderate';
        case 65: return 'Rain: Heavy intensity';
        case 66: return 'Freezing Rain: Light';
        case 67: return 'Freezing Rain: Heavy intensity';
        case 71: return 'Snow fall: Slight';
        case 73: return 'Snow fall: Moderate';
        case 75: return 'Snow fall: Heavy intensity';
        case 77: return 'Snow grains';
        case 80: return 'Rain showers: Slight';
        case 81: return 'Rain showers: Moderate';
        case 82: return 'Rain showers: Violent';
        case 85: return 'Snow showers: Slight';
        case 86: return 'Snow showers: Heavy';
        case 95: return 'Thunderstorm: Slight or moderate';
        case 96: return 'Thunderstorm with slight hail';
        case 99: return 'Thunderstorm with heavy hail';
        default: return 'Unknown';
    }
};

export const getWeatherIcon = (code) => {
    switch (code) {
        case 0:
        case 1: return WiDaySunny;
        case 2: return WiCloudy;
        case 3: return WiCloudy; // Overcast
        case 45:
        case 48: return WiFog;
        case 51:
        case 53:
        case 55: return WiRainMix;
        case 56:
        case 57: return WiSleet;
        case 61:
        case 63:
        case 65: return WiRain;
        case 66:
        case 67: return WiSleet;
        case 71:
        case 73:
        case 75:
        case 77: return WiSnow;
        case 80:
        case 81:
        case 82: return WiShowers;
        case 85:
        case 86: return WiSnowflakeCold;
        case 95:
        case 96:
        case 99: return WiThunderstorm; // Thunderstorm is more prominent than hail
        default: return WiDaySunny; // Default icon
    }
};