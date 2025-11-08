// src/components/WorldClockCard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, HStack, VStack, Text, Spinner, IconButton, Tooltip } from '@chakra-ui/react';
import { FaClock, FaDigitalTachograph } from 'react-icons/fa';
import DigitalClock from './DigitalClock';
import AnalogClock from './AnalogClock';
import { useWorldClock } from '../hooks/useWorldClock';
import { getWeatherDescription } from '../utils/weatherUtils';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

function WorldClockCard({ clock, isDragging, clockTheme, timeFormat }) {
    const time = useWorldClock(clock.timeZone);
    const [isAnalog, setIsAnalog] = useState(false);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!clock.latitude || !clock.longitude) return;
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${clock.latitude}&longitude=${clock.longitude}&current=temperature_2m,weather_code`
                );
                setWeather(response.data.current);
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
    }, [clock.latitude, clock.longitude]);

    return (
        <Box
            className="glass"
            p={4}
            borderRadius="lg"
            h="100%"
            position="relative"
            boxShadow={isDragging ? 'xl' : 'none'}
            overflow="hidden"
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
                    <Text fontWeight="bold" fontSize="lg">{clock.location.split(',')[0]}</Text>
                    {!isAnalog && <DigitalClock time={time} compact timeFormat={timeFormat} />}
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
    );
}

export default WorldClockCard;