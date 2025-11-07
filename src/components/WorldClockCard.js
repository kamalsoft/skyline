// src/components/WorldClockCard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, HStack, VStack, Text, Spinner } from '@chakra-ui/react';
import DigitalClock from './DigitalClock';
import { useWorldClock } from '../hooks/useWorldClock';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

function WorldClockCard({ clock }) {
    const time = useWorldClock(clock.timeZone);
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
    }, [clock.latitude, clock.longitude]);

    return (
        <Box
            className="glass"
            p={4}
            borderRadius="lg"
            h="100%"
            position="relative"
            overflow="hidden"
        >
            <HStack justify="space-between" align="center">
                <VStack align="flex-start">
                    <Text fontWeight="bold" fontSize="lg">{clock.location.split(',')[0]}</Text>
                    <DigitalClock time={time} timeZone={clock.timeZone} compact />
                </VStack>
                {loading ? (
                    <Spinner size="md" />
                ) : weather ? (
                    <HStack>
                        <Text fontSize="2xl" fontWeight="bold">{Math.round(weather.temperature_2m)}°C</Text>
                        <AnimatedWeatherIcon weatherCode={weather.weather_code} w={10} h={10} />
                    </HStack>
                ) : null}
            </HStack>
        </Box>
    );
}

export default WorldClockCard;