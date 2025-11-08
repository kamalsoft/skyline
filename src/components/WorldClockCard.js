// src/components/WorldClockCard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, HStack, VStack, Text, Spinner, IconButton, Tooltip } from '@chakra-ui/react';
import { WiDaySunny, WiNightClear } from 'react-icons/wi';
import { FaClock, FaDigitalTachograph } from 'react-icons/fa';
import DigitalClock from './DigitalClock';
import AnalogClock from './AnalogClock';
import { useWorldClock } from '../hooks/useWorldClock';
import { getWeatherDescription } from '../utils/weatherUtils';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

function WorldClockCard({ clock, isDragging, clockTheme, timeFormat, isSidebarOpen }) {
    const time = useWorldClock(clock.timeZone);
    const [isAnalog, setIsAnalog] = useState(false);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDay, setIsDay] = useState(true);
    const [sunTimes, setSunTimes] = useState({ sunrise: null, sunset: null });

    useEffect(() => {
        const fetchWeather = async () => {
            if (!clock.latitude || !clock.longitude) return;
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${clock.latitude}&longitude=${clock.longitude}&current=temperature_2m,weather_code&daily=sunrise,sunset&forecast_days=1&timezone=${clock.timeZone}`
                );
                const data = response.data;
                setWeather(data.current);

                if (data.daily && data.daily.sunrise && data.daily.sunset) {
                    const sunriseDate = new Date(data.daily.sunrise[0]);
                    const sunsetDate = new Date(data.daily.sunset[0]);
                    setSunTimes({ sunrise: sunriseDate, sunset: sunsetDate });
                }
            } catch (error) {
                console.error("Failed to fetch weather for world clock", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();

        // Refresh weather every 10 minutes
        const intervalId = setInterval(fetchWeather, 600000);

        return () => {
            clearInterval(intervalId);
        };
    }, [clock.latitude, clock.longitude, clock.timeZone]);

    useEffect(() => {
        if (sunTimes.sunrise && sunTimes.sunset) {
            const isCurrentlyDay = time.valueOf() >= sunTimes.sunrise.getTime() && time.valueOf() <= sunTimes.sunset.getTime();
            setIsDay(isCurrentlyDay);
        }
    }, [time, sunTimes]);

    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: timeFormat === '12h',
    };

    const sunriseStr = sunTimes.sunrise ? sunTimes.sunrise.toLocaleTimeString('en-US', timeOptions) : 'N/A';
    const sunsetStr = sunTimes.sunset ? sunTimes.sunset.toLocaleTimeString('en-US', timeOptions) : 'N/A';
    const tooltipLabel = `Sunrise: ${sunriseStr} | Sunset: ${sunsetStr}`;

    return (
        <AnimatePresence mode="wait">
            {isSidebarOpen ? (
                <motion.div key="expanded" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <Box
                        className="glass"
                        p={4} borderRadius="xl"
                        position="relative"
                        boxShadow={isDragging ? '0 0 20px rgba(0,0,0,0.3)' : 'none'}
                        overflow="hidden"
                        transform={isDragging ? 'scale(1.05)' : 'scale(1)'}
                        transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                    >
                        <Tooltip label={`Switch to ${isAnalog ? 'Digital' : 'Analog'} Clock`} placement="top">
                            <IconButton
                                icon={isAnalog ? <FaDigitalTachograph /> : <FaClock />}
                                size="xs"
                                variant="ghost"
                                position="absolute"
                                top="8px"
                                right="8px"
                                onClick={() => setIsAnalog(!isAnalog)}
                                aria-label="Toggle clock type"
                            />
                        </Tooltip>
                        <HStack justify="space-between" align="center">
                            <VStack align="flex-start">
                                <HStack>
                                    <Text fontWeight="bold" fontSize="lg">{clock.location.split(',')[0]}</Text>
                                    <Tooltip label={tooltipLabel} placement="top">
                                        <Box as={isDay ? WiDaySunny : WiNightClear} size="24px" color={isDay ? "yellow.400" : "gray.300"} />
                                    </Tooltip>
                                </HStack>
                                <Text fontSize="xs" color="gray.500" mt="-8px">{clock.timeZone.replace('_', ' ')}</Text>
                                {!isAnalog && (
                                    <VStack align="flex-start" spacing={0}>
                                        <DigitalClock time={time} compact timeFormat={timeFormat} timeZone={clock.timeZone} />
                                        <Text fontSize="xs" color="gray.400">{`Sunrise: ${sunriseStr} | Sunset: ${sunsetStr}`}</Text>
                                    </VStack>
                                )}
                            </VStack>
                            {isAnalog ? (
                                <AnalogClock time={time} clockTheme={clockTheme} />
                            ) : (
                                loading ? (
                                    <Spinner size="md" />
                                ) : weather ? (
                                    <HStack>
                                        <Text fontSize="2xl" fontWeight="bold">{Math.round(weather.temperature_2m)}°C</Text>
                                        <Tooltip label={getWeatherDescription(weather.weather_code)} placement="top">
                                            <Box><AnimatedWeatherIcon weatherCode={weather.weather_code} w={10} h={10} /></Box>
                                        </Tooltip>
                                    </HStack>
                                ) : null
                            )}
                        </HStack>
                    </Box>
                </motion.div>
            ) : (
                <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Tooltip label={`${clock.location} - ${time.format(timeFormat === '12h' ? 'h:mm A' : 'HH:mm')}`} placement="right">
                        <HStack
                            className="glass"
                            p={3} borderRadius="xl"
                            justify="center"
                            spacing={4}
                        >
                            <motion.div whileHover={{ scale: 1.2 }}>
                                <Box as={isDay ? WiDaySunny : WiNightClear} size="24px" color={isDay ? "yellow.400" : "gray.300"} />
                            </motion.div>
                        </HStack>
                    </Tooltip>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default WorldClockCard;