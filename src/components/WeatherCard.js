
// src/components/WeatherCard.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Grid,
    useDisclosure,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    ButtonGroup,
    Badge,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';
import { getWeatherDescription } from '../utils/weatherUtils';
import { RepeatIcon } from '@chakra-ui/icons';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';
import { motion } from 'framer-motion';
import { validateWeatherData } from '../utils/weatherValidation';
import { getAqiColor } from '../utils/aqiUtils';
import ForecastItem from './ForecastItem';
import DetailedWeatherModal from './DetailedWeatherModal';
import WeatherCardSkeleton from './WeatherCardSkeleton';

function WeatherCard({ latitude, longitude, onForecastFetch, onWeatherFetch, locationName, timeFormat }) {
    // New component for the auto-scrolling carousel
    const ForecastCarousel = ({ children, itemCount }) => {
        const contentRef = useRef(null);
        const [contentWidth, setContentWidth] = useState(0);

        useEffect(() => {
            if (contentRef.current) {
                // Calculate the total width of all children
                const totalWidth = Array.from(contentRef.current.children).reduce((acc, child) => acc + child.offsetWidth, 0);
                // Add spacing (itemCount - 1) * 16px (for spacing={4})
                const totalSpacing = (itemCount - 1) * 16;
                setContentWidth(totalWidth + totalSpacing);
            }
        }, [itemCount, children]);

        const duration = itemCount * 3; // Adjust speed by changing the multiplier

        return (
            <Box overflowX="hidden" ref={contentRef}>
                <motion.div
                    animate={{
                        x: [0, -contentWidth / 2], // Animate to half the content width for a seamless loop
                    }}
                    whileHover={{ paused: true }}
                    transition={{
                        x: { repeat: Infinity, repeatType: 'loop', duration: duration, ease: 'linear' },
                    }}
                    style={{ x: 0, display: 'flex', width: `${contentWidth * 2}px` }} // Double the width for duplicated content
                >
                    <HStack spacing={4}>{children}</HStack>
                    <HStack spacing={4} ml={4}>{children}</HStack> {/* Duplicate children for seamless loop */}
                </motion.div>
            </Box>
        );
    };
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState('C'); // 'C' for Celsius, 'F' for Fahrenheit
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedForecast, setSelectedForecast] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchWeather = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_direction_10m,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_direction_10m_dominant&forecast_days=14&timezone=auto&current_weather=true&air_quality_index=us_aqi`
            );
            // Validate the detailed structure of the API response
            const { isValid, error } = validateWeatherData(response.data);
            if (!isValid) {
                throw new Error(error);
            }
            setWeatherData(response.data);
            setLastUpdated(new Date()); // Set the last updated time
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
                time: new Date(hourData.time[index]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12h' }),
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
                time: new Date(dayData.time[index]).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
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
                minH="250px" borderRadius="xl"
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
            <Box p={4} borderWidth="1px" borderRadius="xl" minH="250px">
                <Text>No weather data available.</Text>
            </Box>
        );
    }

    const { current_weather: current, hourly, daily, air_quality: airQuality } = weatherData;

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
        <Box className="glass" p={4} borderRadius="xl">
            <VStack justify="center" mb={2}>
                <HStack>
                    <Heading as="h3" size="lg" noOfLines={1} title={locationName}>{locationName}</Heading>
                    <HStack>
                        <Tooltip label="Refresh weather" placement="top">
                            <IconButton
                                icon={<RepeatIcon />}
                                isRound size="sm" variant="ghost"
                                onClick={fetchWeather}
                                isLoading={isLoading}
                                aria-label="Refresh weather" />
                        </Tooltip>
                        {lastUpdated && <Text fontSize="xs" color="gray.500">Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
                    </HStack>
                </HStack>
                <Text>{getWeatherDescription(current.weathercode)}</Text>
            </VStack>
            <VStack spacing={6} align="stretch">
                {/* Current Weather */}
                <Box className="glass" p={4} borderRadius="xl">
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} alignItems="center">
                        <HStack spacing={4} justify="center">
                            <AnimatedWeatherIcon weatherCode={current.weathercode} w={24} h={24} />
                            <Text fontSize="6xl" fontWeight="bold">{displayTemp(current.temperature, false)}</Text>
                        </HStack>
                        <VStack align="stretch" justify="center" spacing={1}>
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
                        </VStack>
                    </Grid>
                    <VStack align="stretch" mt={4}>
                        <ButtonGroup isAttached size="sm" mt={2}>
                            <Button onClick={() => setUnit('C')} isActive={unit === 'C'}>°C</Button>
                            <Button onClick={() => setUnit('F')} isActive={unit === 'F'}>°F</Button>
                        </ButtonGroup>
                    </VStack>
                </Box>

                {/* Hourly Forecast */}
                <Box>
                    <Heading as="h4" size="sm" mb={2}>Hourly</Heading>
                    <ForecastCarousel itemCount={24}>
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
                    </ForecastCarousel>
                </Box>

                {/* Daily Forecast */}
                <Box>
                    <Heading as="h4" size="sm" mb={2}>Weekly</Heading>
                    <ForecastCarousel itemCount={7}>
                        {daily && daily.time.slice(0, 7).map((time, index) => {
                            const date = new Date(time);
                            const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
                            const dateString = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
                            const combinedLabel = `${dateString} - ${weekday}`;

                            return (
                                <ForecastItem
                                    onClick={() => handleForecastClick('daily', index)}
                                    key={time}
                                    index={index}
                                    label={index === 0 ? 'Today' : combinedLabel}
                                    dateLabel={index === 0 ? dateString : undefined}
                                    weatherCode={daily.weather_code[index]}
                                    description={getWeatherDescription(daily.weather_code[index])}
                                    temp={`${displayTemp(daily.temperature_2m_min[index], false)} / ${displayTemp(daily.temperature_2m_max[index], false)}`}
                                />
                            );
                        })}
                    </ForecastCarousel>
                </Box>
            </VStack>
            <DetailedWeatherModal
                isOpen={isOpen}
                onClose={onClose}
                data={selectedForecast}
                displayTemp={displayTemp}
                timeFormat={timeFormat}
            />
        </Box >
    );
}

export default WeatherCard;
