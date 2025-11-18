// src/components/WeatherCard.js
import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  useDisclosure,
  Alert, AlertIcon, AlertTitle, AlertDescription, Button,
  IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  useBreakpointValue,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { getWeatherDescription } from '../utils/weatherUtils';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useWeather } from '../hooks/useWeather';

import ForecastItem from './ForecastItem';
import HistoryModal from './HistoryModal';
import DetailedWeatherModal from './DetailedWeatherModal';
import SunCalendar from './SunCalendar';
import WeatherMapModal from './WeatherMapModal';
import WeatherCardSkeleton from './WeatherCardSkeleton';
import { motion, useAnimation } from 'framer-motion';
import WeatherCardHeader from './WeatherCardHeader';
import AISummary from './AISummary';
import CurrentWeather from './CurrentWeather';
import WeatherActions from './WeatherActions';

// Extracted and memoized ForecastCarousel to prevent re-creation on every render
const ForecastCarousel = React.memo(({ children, itemCount }) => {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // These values are approximations. For a more robust solution, you could measure the item width.
  const itemWidth = 110; // From ForecastItem's minW="110px"
  const spacing = 16; // Corresponds to spacing={4}

  // Animate to the new position when currentIndex changes or on desktop view
  useEffect(() => {
    if (!isMobile) {
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const centerOffset = containerWidth / 2 - itemWidth / 2;
      const targetX = -currentIndex * (itemWidth + spacing) + centerOffset;
      controls.start({ x: targetX, transition: { type: 'spring', stiffness: 400, damping: 50 } });
    }
  }, [currentIndex, controls, isMobile, itemWidth, spacing]);

  // Calculate drag constraints for the desktop carousel
  const dragConstraints = useMemo(() => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const contentWidth = itemCount * (itemWidth + spacing) - spacing;
    return { right: 0, left: -(contentWidth - containerWidth) };
  }, [itemCount, itemWidth, spacing]);

  if (isMobile) {
    return (
      <Box
        overflowX="auto"
        css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}
        ref={containerRef}
      >
        <HStack spacing={4} pb={2}>
          {children}
        </HStack>
      </Box>
    );
  }

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, itemCount - 1));

  const onDragEnd = (event, info) => {
    const { offset, velocity } = info;
    const currentX = controls.get().x; // Get the current animated position
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const centerOffset = containerWidth / 2 - itemWidth / 2;
    const projectedPosition = currentX + offset.x + velocity.x * 0.2; // Predict final position
    const itemAndSpacingWidth = itemWidth + spacing;
    const snapIndex = Math.round((-projectedPosition + centerOffset) / itemAndSpacingWidth);
    const newIndex = Math.max(0, Math.min(snapIndex, itemCount - 1));
    setCurrentIndex(newIndex);
  };

  return (
    <HStack w="full" spacing={2}>
      <IconButton icon={<ChevronLeftIcon />} onClick={handlePrev} aria-label="Previous forecast item" variant="ghost" isRound isDisabled={currentIndex === 0} />
      <Box overflowX="hidden" w="full" ref={containerRef} cursor="grab">
        <motion.div drag="x" dragConstraints={dragConstraints} onDragEnd={onDragEnd} animate={controls} whileTap={{ cursor: 'grabbing' }} style={{ display: 'flex' }}>
          <HStack spacing={4} pb={2}>
            {children}
          </HStack>
        </motion.div>
      </Box>
      <IconButton icon={<ChevronRightIcon />} onClick={handleNext} aria-label="Next forecast item" variant="ghost" isRound isDisabled={currentIndex >= itemCount - 1} />
    </HStack>
  );
});

function WeatherCard({
  latitude,
  longitude,
  onForecastFetch,
  onWeatherFetch,
  locationName,
  timeFormat,
  displaySettings,
  className,
  appSettings = {},
}) {
  const {
    weatherData,
    isLoading,
    error,
    isRefreshing,
    lastUpdated,
    fetchWeather,
  } = useWeather({
    latitude,
    longitude,
    appSettings,
    locationName,
    onForecastFetch,
    onWeatherFetch,
  });

  const [unit, setUnit] = useState('C'); // 'C' for Celsius, 'F' for Fahrenheit
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedForecast, setSelectedForecast] = useState(null);
  const { isOpen: isCalendarOpen, onOpen: onCalendarOpen, onClose: onCalendarClose } = useDisclosure();
  const { isOpen: isMapOpen, onOpen: onMapOpen, onClose: onMapClose } = useDisclosure();
  const { isOpen: isHistoryOpen, onOpen: onHistoryOpen, onClose: onHistoryClose } = useDisclosure();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Effect to update the current time every minute to keep the forecast in sync
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const convertToFahrenheit = (celsius) => {
    return Math.round((celsius * 9) / 5 + 32);
  };

  const displayTemp = useCallback(
    (celsius, withUnit = true) => {
      if (unit === 'F') {
        return `${convertToFahrenheit(celsius)}°${withUnit ? 'F' : ''}`;
      }
      return `${Math.round(celsius)}°${withUnit ? 'C' : ''}`;
    },
    [unit]
  );

  // Memoize derived data to avoid re-calculating on every render
  const currentHourIndex = useMemo(() => {
    if (!weatherData?.hourly)
      return -1;
    return weatherData.hourly.time.findIndex((time) => new Date(time) >= currentTime);
  }, [weatherData, currentTime]);

  const handleForecastClick = useCallback(
    (type, index) => {
      let details;
      if (type === 'hourly' && weatherData) {
        const hourData = weatherData.hourly;
        details = {
          time: new Date(hourData.time[index]).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: timeFormat === '12h',
          }),
          temperature: displayTemp(hourData.temperature_2m[index], true),
          weather_code: hourData.weather_code[index],
          apparent_temperature: hourData.apparent_temperature[index],
          precipitation: hourData.precipitation[index],
          relative_humidity_2m: hourData.relative_humidity_2m[index],
          uv_index: hourData.uv_index[index],
          wind_direction_10m: hourData.wind_direction_10m[index],
          wind_speed_10m: hourData.wind_speed_10m[index],
        };
      } else if (weatherData) {
        // daily
        const dayData = weatherData.daily;
        details = {
          time: new Date(dayData.time[index]).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          }),
          temperature: `${displayTemp(dayData.temperature_2m_min[index], true)} / ${displayTemp(dayData.temperature_2m_max[index], true)}`,
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
    },
    [weatherData, displayTemp, timeFormat, onOpen]
  );

  // Memoize forecast items to prevent re-mapping on every render
  const hourlyForecastItems = useMemo(() => {
    if (!weatherData?.hourly || currentHourIndex === -1) return null;
    return weatherData.hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, index) => {
      const actualIndex = currentHourIndex + index;
      return (
        <ForecastItem
          onClick={() => handleForecastClick('hourly', actualIndex)}
          key={time}
          index={index}
          label={`${new Date(time).getHours()}:00`}
          weatherCode={weatherData.hourly.weather_code[actualIndex]}
          description={getWeatherDescription(weatherData.hourly.weather_code[actualIndex])}
          temp={displayTemp(weatherData.hourly.temperature_2m[actualIndex], true)}
        />
      );
    });
  }, [weatherData, currentHourIndex, handleForecastClick, displayTemp]);

  const dailyForecastItems = useMemo(() => {
    if (!weatherData?.daily) return null;
    return weatherData.daily.time.slice(0, 7).map((time, index) => {
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
          weatherCode={weatherData.daily.weather_code[index]}
          description={getWeatherDescription(weatherData.daily.weather_code[index])}
          temp={`${displayTemp(weatherData.daily.temperature_2m_min[index], false)} / ${displayTemp(weatherData.daily.temperature_2m_max[index], false)}`}
        />
      );
    });
  }, [weatherData, handleForecastClick, displayTemp]);



  if (isLoading) {
    return <WeatherCardSkeleton />;
  }

  if (error) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column" _
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        minH="250px"
        borderRadius="xl"
        className="glass"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Failed to Load Weather
        </AlertTitle>
        <AlertDescription maxWidth="sm">{error.message}</AlertDescription>
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

  const { current_weather: current, air_quality: airQuality } = weatherData;

  return (
    <Box className={`themed-panel ${appSettings.uiEffect} ${className}`} p={4} borderRadius="xl">
      <WeatherCardHeader locationName={locationName} lastUpdated={lastUpdated} />
      <VStack spacing={4} align="stretch">
        <Text>{getWeatherDescription(current.weathercode)}</Text>
        <AISummary weatherData={weatherData} isEnabled={appSettings.enableAiSummary} />
        <CurrentWeather current={current} hourly={weatherData.hourly} airQuality={airQuality} displayTemp={displayTemp} />
        <WeatherActions
          onRefresh={fetchWeather}
          onCalendarOpen={onCalendarOpen}
          onMapOpen={onMapOpen}
          onHistoryOpen={onHistoryOpen}
          unit={unit}
          onUnitChange={setUnit}
          isLoading={isRefreshing}
        />

        {/* Hourly Forecast */}
        {displaySettings.showHourlyForecast && (
          <Box>
            <Heading as="h4" size="sm" mb={2}>
              Hourly
            </Heading>
            <ForecastCarousel itemCount={24}>{hourlyForecastItems}</ForecastCarousel>
          </Box>
        )}

        {/* Daily Forecast */}
        {displaySettings.showWeeklyForecast && (
          <Box>
            <Heading as="h4" size="sm" mb={2}>
              Weekly
            </Heading>
            <ForecastCarousel itemCount={7}>{dailyForecastItems}</ForecastCarousel>
          </Box>
        )}
      </VStack>
      <DetailedWeatherModal
        isOpen={isOpen}
        onClose={onClose}
        data={selectedForecast}
        displayTemp={displayTemp}
        timeFormat={timeFormat}
      />
      <Modal isOpen={isCalendarOpen} onClose={onCalendarClose} size="2xl">
        <ModalOverlay />
        <ModalContent className="glass">
          <ModalHeader>Sunrise & Sunset Calendar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SunCalendar latitude={latitude} longitude={longitude} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <WeatherMapModal
        isOpen={isMapOpen}
        onClose={onMapClose}
        latitude={latitude}
        longitude={longitude}
        locationName={locationName}
      />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={onHistoryClose}
        latitude={latitude}
        longitude={longitude}
      />
    </Box>
  );
}

WeatherCard.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  onForecastFetch: PropTypes.func.isRequired,
  onWeatherFetch: PropTypes.func.isRequired,
  locationName: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  displaySettings: PropTypes.object.isRequired,
  className: PropTypes.string,
  appSettings: PropTypes.object,
};

WeatherCard.defaultProps = {
  className: '',
  appSettings: {},
};

export default memo(WeatherCard);
