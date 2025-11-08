
// src/components/WeatherCard.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    useColorModeValue,
    useDisclosure,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    ButtonGroup,
    Badge,
} from '@chakra-ui/react';
import { getWeatherDescription } from '../utils/weatherUtils';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';
import { getAqiColor } from '../utils/aqiUtils';
import ForecastItem from './ForecastItem';
import DetailedWeatherModal from './DetailedWeatherModal';
import WeatherCardSkeleton from './WeatherCardSkeleton';

function WeatherCard({ latitude, longitude, onForecastFetch, onWeatherFetch, locationName }) {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState('C'); // 'C' for Celsius, 'F' for Fahrenheit
    const { isOpen, onOpen, onClose } = useDisclosure();
    const scrollbarThumbColor = useColorModeValue('gray.400', 'gray.600');
    const [selectedForecast, setSelectedForecast] = useState(null);

    const fetchWeather = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_direction_10m,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_direction_10m_dominant&forecast_days=14&timezone=auto&current_weather=true&air_quality_index=us_aqi`
            );
            // Basic validation of the response structure
            if (!response.data || !response.data.current_weather || !response.data.daily) {
                throw new Error("Incomplete weather data received from the API.");
            }
            setWeatherData(response.data);
            if (onForecastFetch) {
                onForecastFetch(response.data.daily);
            }
            if (onWeatherFetch) {
                onWeatherFetch(response.data.current_weather);
            }
        } catch (err) {
            console.error("Error fetching weather:", err);
            let errorMessage = "An unexpected error occurred.";
            if (err.response) {
                // Server responded with a status code outside the 2xx range
                errorMessage = `Server error: ${err.response.status}. Please try again later.`;
            } else if (err.request) {
                // The request was made but no response was received
                errorMessage = "Network error. Please check your connection and try again.";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [latitude, longitude, onForecastFetch, onWeatherFetch]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    const convertToFahrenheit = (celsius) => {
        return Math.round((celsius * 9) / 5 + 32);
    };

    const displayTemp = (celsius, withUnit = true) => {
        if (unit === 'F') {
            return `${convertToFahrenheit(celsius)}°${withUnit ? 'F' : ''}`;
        }
        return `${Math.round(celsius)}°${withUnit ? 'C' : ''}`;
    };

    const handleForecastClick = (type, index) => {
        let details;
        if (type === 'hourly') {
            const hourData = weatherData.hourly;
            details = {
                time: new Date(hourData.time[index]).toLocaleTimeString(),
                temperature: displayTemp(hourData.temperature_2m[index], true),
                weather_code: hourData.weather_code[index],
                apparent_temperature: hourData.apparent_temperature[index],
                precipitation: hourData.precipitation[index],
                relative_humidity_2m: hourData.relative_humidity_2m[index],
                uv_index: hourData.uv_index[index],
                wind_direction_10m: hourData.wind_direction_10m[index],
                wind_speed_10m: hourData.wind_speed_10m[index],
            };
        } else { // daily
            const dayData = weatherData.daily;
            details = {
                time: new Date(dayData.time[index]).toLocaleDateString(),
                temperature: `${displayTemp(dayData.temperature_2m_min[index], true)} / ${displayTemp(dayData.temperature_2m_max[index], true)}`,
                // Manually map properties to avoid circular references
                weather_code: dayData.weather_code[index],
                sunrise: dayData.sunrise[index],
                sunset: dayData.sunset[index],
                uv_index_max: dayData.uv_index_max[index],
                precipitation_sum: dayData.precipitation_sum[index],
                wind_direction_10m_dominant: dayData.wind_direction_10m_dominant[index],
            };
        }
        setSelectedForecast({ type, details });
        onOpen();
    };

    if (isLoading) {
        return <WeatherCardSkeleton />;
    }

    if (error) {
        return (
            <Alert
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                minH="250px"
                borderRadius="lg"
                className="glass"
            >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    Failed to Load Weather
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    {error}
                </AlertDescription>
                <Button colorScheme="red" variant="outline" onClick={fetchWeather} mt={4}>
                    Retry
                </Button>
            </Alert>
        );
    }

    if (!weatherData) {
        return (
            <Box p={4} borderWidth="1px" borderRadius="lg" minH="250px">
                <Text>No weather data available.</Text>
            </Box>
        );
    }

    const { current_weather: current, hourly, daily, air_quality: airQuality } = weatherData;

    const scrollbarStyles = {
        '&::-webkit-scrollbar': {
            height: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'transparent',
            borderRadius: '24px',
        },
        '&:hover::-webkit-scrollbar-thumb': {
            background: scrollbarThumbColor,
        },
    };

    // Find the index of the current hour to start the hourly forecast from now
    const currentHourIndex = hourly
        ? hourly.time.findIndex(time => new Date(time) >= new Date())
        : -1;

    // Get current humidity and feels-like temp from the hourly forecast, as it's not in current_weather
    const currentApparentTemperature = (hourly && currentHourIndex !== -1)
        ? hourly.apparent_temperature[currentHourIndex]
        : undefined;
    const currentHumidity = (hourly && currentHourIndex !== -1)
        ? hourly.relative_humidity_2m[currentHourIndex]
        : undefined;

    return (
        <Box className="glass" p={4} borderRadius="lg">
            <VStack justify="center" mb={4}>
                <Heading as="h3" size="lg">{locationName}</Heading>
                <Text>{getWeatherDescription(current.weather_code)}</Text>
            </VStack>
            <VStack spacing={6} align="stretch">
                {/* Current Weather */}
                <HStack justify="space-around" align="center" className="glass" p={4} borderRadius="md">
                    <HStack>
                        <AnimatedWeatherIcon weatherCode={current.weathercode} w={24} h={24} />
                        <Text fontSize="6xl" fontWeight="bold">{displayTemp(current.temperature, false)}</Text>
                    </HStack>
                    <VStack align="flex-start">
                        {currentApparentTemperature !== undefined && (
                            <Text>Feels like: {displayTemp(currentApparentTemperature, false)}</Text>
                        )}
                        {currentHumidity !== undefined && (
                            <Text>Humidity: {currentHumidity}%</Text>
                        )}
                        <Text>Wind: {current.windspeed} km/h</Text>
                        {airQuality?.us_aqi && (
                            <Text>AQI: <Badge colorScheme={getAqiColor(airQuality.us_aqi)}>{airQuality.us_aqi}</Badge></Text>
                        )}
                        <ButtonGroup isAttached size="sm" mt={2}>
                            <Button onClick={() => setUnit('C')} isActive={unit === 'C'}>°C</Button>
                            <Button onClick={() => setUnit('F')} isActive={unit === 'F'}>°F</Button>
                        </ButtonGroup>
                    </VStack>
                </HStack>

                {/* Hourly Forecast */}
                <Box>
                    <Heading as="h4" size="sm" mb={2}>Hourly</Heading>
                    <Box overflowX="auto" whiteSpace="nowrap" sx={scrollbarStyles}>
                        <HStack spacing={4}>
                            {hourly && currentHourIndex !== -1 && hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, index) => {
                                const actualIndex = currentHourIndex + index;
                                return (
                                    <ForecastItem
                                        onClick={() => handleForecastClick('hourly', actualIndex)}
                                        key={time}
                                        index={index}
                                        label={`${new Date(time).getHours()}:00`}
                                        weatherCode={hourly.weather_code[actualIndex]}
                                        description={getWeatherDescription(hourly.weather_code[actualIndex])}
                                        temp={displayTemp(hourly.temperature_2m[actualIndex], true)}
                                    />
                                );
                            })}
                        </HStack>
                    </Box>
                </Box>

                {/* Daily Forecast */}
                <Box>
                    <Heading as="h4" size="sm" mb={2}>Daily</Heading>
                    <Box overflowX="auto" whiteSpace="nowrap" sx={scrollbarStyles}>
                        <HStack spacing={4}>
                            {daily && daily.time.map((time, index) => {
                                return (
                                    <ForecastItem
                                        onClick={() => handleForecastClick('daily', index)}
                                        key={time}
                                        index={index}
                                        label={new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        weatherCode={daily.weather_code[index]}
                                        description={getWeatherDescription(daily.weather_code[index])}
                                        temp={`${displayTemp(daily.temperature_2m_min[index], false)} / ${displayTemp(daily.temperature_2m_max[index], false)}`}
                                    />
                                );
                            })}
                        </HStack>
                    </Box>
                </Box>
            </VStack>
            <DetailedWeatherModal
                isOpen={isOpen}
                onClose={onClose}
                data={selectedForecast}
                displayTemp={displayTemp}
            />
        </Box>
    );
}

export default WeatherCard;
