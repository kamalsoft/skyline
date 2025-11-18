// src/components/WorldClockCard.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, HStack, VStack, Text, Tooltip, Icon, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import { WiSunrise, WiSunset, WiDaySunny, WiNightClear } from 'react-icons/wi';
import { FaThermometerHalf } from 'react-icons/fa';
import DigitalClock from './DigitalClock';
import { useWorldClock } from '../hooks/useWorldClock';
import { getWeatherDescription } from '../utils/weatherUtils';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function WorldClockCard({ clock, isDragging, timeFormat, isSidebarOpen, appSettings, primaryClock }) {
  const time = useWorldClock(clock.timeZone, true); // Get full dayjs object
  const [weather, setWeather] = useState(null);
  const [sunTimes, setSunTimes] = useState({ sunrise: null, sunset: null });

  const fetchWeather = useCallback(async () => {
    console.log(`[WorldClockCard] Fetching weather for: ${clock.location}`);
    if (!clock.latitude || !clock.longitude) return;
    try {
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${clock.latitude}&longitude=${clock.longitude}&current=temperature_2m,weather_code&daily=sunrise,sunset&forecast_days=1&timezone=${clock.timeZone}`;
      const response = await axios.get(apiUrl);
      const data = response.data;
      setWeather(data.current);

      if (data.daily && data.daily.sunrise && data.daily.sunset) {
        const sunriseDate = new Date(data.daily.sunrise[0]);
        const sunsetDate = new Date(data.daily.sunset[0]);
        setSunTimes({ sunrise: sunriseDate, sunset: sunsetDate });
      }
    } catch (error) {
      console.error(`[WorldClockCard] Failed to fetch weather for ${clock.location}:`, error);
    }
  }, [clock.latitude, clock.longitude, clock.timeZone, clock.location]);

  useEffect(() => {
    fetchWeather();

    // Get refresh interval from settings, default to 10 minutes
    const refreshIntervalMinutes = appSettings?.weatherRefreshInterval || 10;
    const refreshIntervalMs = refreshIntervalMinutes * 60 * 1000;

    // Refresh weather using the interval from settings
    const intervalId = setInterval(fetchWeather, refreshIntervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchWeather, appSettings?.weatherRefreshInterval]);

  const isDay = useMemo(() => {
    if (!sunTimes.sunrise || !sunTimes.sunset || !time) {
      return true; // Default to day if sun times are not available
    }
    const now = time.valueOf(); // Get timestamp from dayjs object
    const sunriseTime = sunTimes.sunrise.getTime();
    const sunsetTime = sunTimes.sunset.getTime();
    return now > sunriseTime && now < sunsetTime;
  }, [sunTimes, time]);

  // Dynamically set colors based on day/night status
  const cardBg = useColorModeValue(isDay ? 'whiteAlpha.600' : 'blackAlpha.400', isDay ? 'blackAlpha.300' : 'blackAlpha.500');
  const hoverBg = useColorModeValue(isDay ? 'whiteAlpha.800' : 'blackAlpha.500', isDay ? 'blackAlpha.400' : 'blackAlpha.600');
  const borderColor = useColorModeValue(isDay ? 'whiteAlpha.900' : 'whiteAlpha.300', isDay ? 'whiteAlpha.200' : 'whiteAlpha.400');

  const timeDifference = useMemo(() => {
    if (!primaryClock || !time) {
      return null;
    }

    const primaryOffset = dayjs().tz(primaryClock.timeZone).utcOffset();
    const currentOffset = time.utcOffset();
    const diffInHours = (currentOffset - primaryOffset) / 60;

    if (diffInHours === 0) {
      return 'Same time';
    }

    return `${diffInHours > 0 ? '+' : ''}${diffInHours} HRS`;
  }, [primaryClock, time]);

  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: timeFormat === '12h',
  };
  const sunriseStr = sunTimes.sunrise ? sunTimes.sunrise.toLocaleTimeString('en-US', timeOptions) : 'N/A';
  const sunsetStr = sunTimes.sunset ? sunTimes.sunset.toLocaleTimeString('en-US', timeOptions) : 'N/A';

  return (
    <AnimatePresence mode="wait">
      {isSidebarOpen ? (
        <motion.div
          key="expanded"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Box
            className={`themed-panel ${appSettings.uiEffect}`}
            p={4}
            borderRadius="xl"
            position="relative"
            overflow="hidden"
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            boxShadow={isDragging ? '0 10px 25px rgba(0, 0, 0, 0.3)' : 'md'}
            transform={isDragging ? 'scale(1.05)' : 'scale(1)'}
            transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
            _hover={{ bg: hoverBg, shadow: 'lg' }}
          >
            <Grid templateColumns="1fr auto" templateRows="auto auto" gap={1}>
              <GridItem colSpan={1}>
                <Text fontWeight="bold" fontSize="lg" noOfLines={1} title={clock.location}>
                  {clock.location.split(',')[0]}
                </Text>
              </GridItem>

              <GridItem colSpan={1} justifySelf="end" alignSelf="center">
                {weather && (
                  <HStack spacing={2}>
                    <Text fontSize="lg" fontWeight="bold">
                      {Math.round(weather.temperature_2m)}°
                    </Text>
                    <Tooltip label={getWeatherDescription(weather.weather_code)} placement="top">
                      <Box w={8} h={8} position="relative">
                        <AnimatedWeatherIcon weatherCode={weather.weather_code} w={8} h={8} />
                      </Box>
                    </Tooltip>
                  </HStack>
                )}
              </GridItem>

              <GridItem colSpan={1}>
                <Text fontSize="xs" color="gray.400" mt={-1}>
                  {timeDifference || clock.timeZone.replace('_', ' ')}
                </Text>
              </GridItem>

              <GridItem colSpan={2} mt={2}>
                <DigitalClock time={time} timeFormat={timeFormat} timeZone={clock.timeZone} />
              </GridItem>

              <GridItem colSpan={2} mt={2}>
                <HStack justify="space-between" fontSize="xs" color="gray.400">
                  <HStack>
                    <Icon as={WiSunrise} boxSize={5} color="yellow.400" />
                    <Text>{sunriseStr}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={WiSunset} boxSize={5} color="purple.300" />
                    <Text>{sunsetStr}</Text>
                  </HStack>
                </HStack>
              </GridItem>
            </Grid>
          </Box>
        </motion.div>
      ) : (
        <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Tooltip
            label={`${clock.location} - ${time?.format(timeFormat === '12h' ? 'h:mm A' : 'HH:mm')}`}
            placement="right"
          >
            <VStack bg={cardBg} p={3} borderRadius="xl" justify="center" spacing={2} w="64px">
              <HStack spacing={1}>
                <Text fontSize="2xs" fontWeight="bold" noOfLines={1}>{clock.countryCode}</Text>
                <Icon as={isDay ? WiDaySunny : WiNightClear} boxSize="14px" color={isDay ? 'yellow.400' : 'gray.300'} />
              </HStack>
              <Text fontSize="sm" fontWeight="bold">{time?.format('HH:mm')}</Text>
              {weather ? (
                <HStack spacing={1} align="center">
                  <Icon as={FaThermometerHalf} boxSize="12px" color="gray.400" />
                  <Text fontSize="xs">{Math.round(weather.temperature_2m)}°C</Text>
                </HStack>
              ) : (
                <HStack spacing={1} align="center" h="18px" />
              )}
            </VStack>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

WorldClockCard.propTypes = {
  clock: PropTypes.object.isRequired,
  isDragging: PropTypes.bool,
  timeFormat: PropTypes.string.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  appSettings: PropTypes.object,
  primaryClock: PropTypes.object,
};

export default WorldClockCard;
