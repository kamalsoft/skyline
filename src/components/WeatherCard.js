// src/components/WeatherCard.js
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  useBreakpointValue,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { getWeatherDescription, WeatherError } from '../utils/weatherUtils';
import { RepeatIcon, CalendarIcon, ViewIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaHistory } from 'react-icons/fa';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';
import { motion, useAnimation } from 'framer-motion';
import { validateWeatherData } from '../utils/weatherValidation';
import { getAqiColor } from '../utils/aqiUtils';
import ForecastItem from './ForecastItem';
import { generateWeatherSummary, generateActivitySuggestion } from '../utils/aiSummaryUtils';
import HistoryModal from './HistoryModal';
import DetailedWeatherModal from './DetailedWeatherModal';
import SunCalendar from './SunCalendar';
import WeatherMapModal from './WeatherMapModal';
import WeatherCardSkeleton from './WeatherCardSkeleton';
import { useSound } from '../contexts/SoundContext';

// Extracted and memoized ForecastCarousel to prevent re-creation on every render
const ForecastCarousel = React.memo(({ children, itemCount }) => {
  const controls = useAnimation();
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef(null);
  // Determine if the view is mobile to switch behavior
  const isMobile = useBreakpointValue({ base: true, md: false });

  const itemWidth = 100; // Approximate width of a ForecastItem
  const spacing = 16; // Corresponds to spacing={4} in HStack

  useEffect(() => {
    if (contentRef.current) {
      // Calculate the total width of all children
      const totalWidth = itemCount * (itemWidth + spacing) - spacing;
      setContentWidth(totalWidth);
    }
  }, [children, itemCount]);

  const scrollConstraints = { right: 0, left: -(contentWidth - (containerRef.current?.offsetWidth || 0)) };

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const centerOffset = containerWidth / 2 - itemWidth / 2;
    const itemAndSpacingWidth = itemWidth + spacing;
    const targetX = -currentIndex * itemAndSpacingWidth + centerOffset;

    controls.start({
      x: targetX,
      transition: { type: 'spring', stiffness: 400, damping: 40 },
    });
  }, [currentIndex, controls, itemWidth, spacing, contentWidth]);

  const onDragEnd = (event, info) => {
    const { offset, velocity } = info; // Get offset and velocity from the drag event

    // Predict the final position with velocity
    const projectedOffset = offset.x + velocity.x * 0.4; // A higher multiplier gives more "flick" power

    const containerWidth = containerRef.current?.offsetWidth || 0;
    const centerOffset = containerWidth / 2 - itemWidth / 2;

    // Calculate which item to snap to
    const itemAndSpacingWidth = itemWidth + spacing;
    // We adjust the projected offset by the center offset to find the correct item
    const snapIndex = Math.round((-projectedOffset + centerOffset) / itemAndSpacingWidth);

    // Clamp the index to be within bounds
    const clampedIndex = Math.max(0, Math.min(snapIndex, itemCount - 1));

    setCurrentIndex(clampedIndex);
  };

  // On mobile, render a natively scrollable container for a better touch experience
  if (isMobile) {
    return (
      <Box
        overflowX="auto"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none', // Hide scrollbar for a cleaner look on WebKit browsers
          },
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
        }}
      >
        <HStack spacing={4} pb={2}>
          {children}
        </HStack>
      </Box>
    );
  }

  // On desktop, use the auto-scrolling animation
  // with drag-to-scroll functionality
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, itemCount - 1));
  };

  return (
    <HStack w="full" spacing={2}>
      <IconButton
        icon={<ChevronLeftIcon />}
        onClick={handlePrev}
        aria-label="Previous forecast item"
        variant="ghost"
        isRound
        isDisabled={currentIndex === 0}
      />
      <Box overflowX="hidden" ref={containerRef} cursor="grab" w="full">
        <motion.div
          animate={controls}
          ref={contentRef}
          drag="x"
          dragConstraints={scrollConstraints}
          onDragEnd={onDragEnd}
          whileTap={{ cursor: 'grabbing' }}
          style={{ display: 'flex' }}
        >
          <HStack spacing={4} pb={2}>
            {children}
          </HStack>
        </motion.div>
      </Box>
      <IconButton
        icon={<ChevronRightIcon />}
        onClick={handleNext}
        aria-label="Next forecast item"
        variant="ghost"
        isRound
        isDisabled={currentIndex >= itemCount - 1}
      />
    </HStack>
  );
});

const ResponsiveButtonGroup = ({ children }) => { // Accept children explicitly
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <VStack
      spacing={isMobile ? 2 : 0}
      align={isMobile ? 'stretch' : 'flex-end'}
      w={isMobile ? 'full' : 'auto'}
    >
      {/* Render children directly. The children are expected to be ButtonGroup components. */}
      {children}
    </VStack>
  );
};

function WeatherCard({
  latitude,
  longitude,
  onForecastFetch,
  onWeatherFetch,
  locationName,
  timeFormat,
  displaySettings,

  appSettings = {},
}) {
  const [weatherData, setWeatherData] = useState(null);
  // Define isMobile at the top level of the component so it can be used in the JSX below
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C'); // 'C' for Celsius, 'F' for Fahrenheit
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [activitySuggestion, setActivitySuggestion] = useState(null);
  const { isOpen: isCalendarOpen, onOpen: onCalendarOpen, onClose: onCalendarClose } = useDisclosure();
  const { isOpen: isMapOpen, onOpen: onMapOpen, onClose: onMapClose } = useDisclosure();
  const { isOpen: isHistoryOpen, onOpen: onHistoryOpen, onClose: onHistoryClose } = useDisclosure();

  const [currentTime, setCurrentTime] = useState(new Date());
  const { playSound } = useSound();

  // Create a ref to hold the latest weatherData without causing re-renders
  const weatherDataRef = useRef(weatherData);
  useEffect(() => {
    weatherDataRef.current = weatherData;
  }, [weatherData]);

  const fetchWeather = useCallback(async () => {
    if (weatherDataRef.current) {
      setIsRefreshing(true);
    }
    console.info(`[WeatherCard] Starting weather fetch for ${locationName} (${latitude}, ${longitude})`);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_direction_10m,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_direction_10m_dominant&forecast_days=14&timezone=auto&current_weather=true&air_quality_index=us_aqi`;
      const response = await fetch(url);

      if (!response.ok) {
        // Fetch API does not throw for HTTP errors, so we have to check the status and throw manually.
        throw new WeatherError(`Server error: ${response.status} ${response.statusText}. Please try again later.`, 'SERVER_ERROR');
      }

      const data = await response.json();

      // Validate the detailed structure of the API response
      const { isValid, error } = validateWeatherData(data);
      if (!isValid) {
        throw new WeatherError(error, 'VALIDATION_ERROR');
      }
      setWeatherData(data);

      setLastUpdated(new Date()); // Set the last updated time
      if (onForecastFetch) {
        onForecastFetch(data.daily);
      }
      if (onWeatherFetch) {
        onWeatherFetch(data.current_weather);
      }
      console.log('[WeatherCard] Weather fetch successful.');
    } catch (err) {
      console.error('[WeatherCard] Detailed weather fetch error:', err);
      if (err instanceof WeatherError) {
        setError(err);
      } else if (err instanceof TypeError) {
        // This is often a network error with fetch
        setError(new WeatherError('Network error. Please check your connection and try again.', 'NETWORK_ERROR'));
      } else {
        setError(new WeatherError('An unexpected error occurred while fetching weather data.', 'UNKNOWN_ERROR'));
      }
    } finally {
      // This runs regardless of success or error
      setIsRefreshing(false); // Always turn off the refreshing indicator
      setIsLoading(false); // We can safely set this to false
    }
  }, [latitude, longitude, locationName, onForecastFetch, onWeatherFetch]);

  useEffect(() => {
    fetchWeather();

    const refreshIntervalMinutes = appSettings?.weatherRefreshInterval || 10;
    const refreshIntervalMs = refreshIntervalMinutes * 60 * 1000;
    const refreshInterval = setInterval(fetchWeather, refreshIntervalMs);

    return () => clearInterval(refreshInterval); // Cleanup the interval on component unmount
  }, [fetchWeather, latitude, longitude, appSettings.weatherRefreshInterval]); // Rerun this effect if the fetchWeather function changes (e.g., location changes)

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
    },
    [weatherData, displayTemp, timeFormat, onOpen]
  );

  // Memoize derived data to avoid re-calculating on every render
  const { currentHourIndex, currentApparentTemperature, currentHumidity } = useMemo(() => {
    if (!weatherData?.hourly)
      return { currentHourIndex: -1, currentApparentTemperature: undefined, currentHumidity: undefined };
    const index = weatherData.hourly.time.findIndex((time) => new Date(time) >= currentTime);
    return {
      currentHourIndex: index,
      currentApparentTemperature: index !== -1 ? weatherData.hourly.apparent_temperature[index] : undefined,
      currentHumidity: index !== -1 ? weatherData.hourly.relative_humidity_2m[index] : undefined,
    };
  }, [weatherData, currentTime]);

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

  // Memoize the AI summary generation to prevent re-running on every render
  useEffect(() => {
    if (appSettings.enableAiSummary && weatherData) {
      console.info('[WeatherCard] AI summary is enabled. Generating...');
      setIsGeneratingSummary(true);
      // Simulate AI generation delay to avoid blocking the main thread
      const timer = setTimeout(() => {
        setAiSummary(generateWeatherSummary(weatherData));
        setActivitySuggestion(generateActivitySuggestion(weatherData));
        setIsGeneratingSummary(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAiSummary('');
      setActivitySuggestion(null);
    }
  }, [weatherData, appSettings.enableAiSummary]);



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
    <Box className="glass" p={4} borderRadius="xl">
      <VStack justify="center" mb={4}>
        <Heading as="h3" size="lg" noOfLines={1} title={locationName}>
          {locationName}
        </Heading>
        {lastUpdated && (
          <Text fontSize="xs" color="gray.500">
            Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
        <Text>{getWeatherDescription(current.weathercode)}</Text>
        {appSettings.enableAiSummary && (
          <>
            {isGeneratingSummary ? (
              <HStack className="glass" p={3} borderRadius="md" w="full" justify="center">
                <Spinner size="xs" />
                <Text fontSize="sm" fontStyle="italic">
                  Generating AI weather brief...
                </Text>
              </HStack>
            ) : (
              aiSummary && <Box className="glass" p={3} borderRadius="md" w="full">
                <Text fontSize="sm" fontStyle="italic">{aiSummary}</Text>
              </Box>
            )}
            {activitySuggestion && !isGeneratingSummary && (
              <Box className="glass" p={3} borderRadius="md" w="full">
                <HStack>
                  <Box as={activitySuggestion.icon} size="20px" color="accentPink" />
                  <Text fontSize="sm" fontWeight="bold">
                    Suggestion:{' '}
                    <Text as="span" fontWeight="normal">
                      {activitySuggestion.text}
                    </Text>
                  </Text>
                </HStack>
              </Box>
            )}
          </>
        )}
      </VStack>
      <VStack spacing={6} align="stretch">
        {/* Current Weather */}
        <Box position="relative">
          {isRefreshing && (
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="blackAlpha.600"
              zIndex="1"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="xl"
            >
              <VStack>
                <Spinner color="white" />
                <Text color="white" fontSize="sm">Refreshing...</Text>
              </VStack>
            </Box>
          )}
          <Box className="glass" p={4} borderRadius="xl">
            <Grid templateColumns={{ base: '1fr', lg: 'auto 1fr' }} gap={{ base: 4, md: 6 }} alignItems="center">
              <HStack spacing={4} justify="center">
                <AnimatedWeatherIcon weatherCode={current.weathercode} w={24} h={24} />
                <Text fontSize="6xl" fontWeight="bold">
                  {displayTemp(current.temperature, false)}
                </Text>
                <VStack align={{ base: 'center', md: 'stretch' }} justify="center" spacing={1}>
                  {currentApparentTemperature !== undefined && (
                    <Text>Feels like: {displayTemp(currentApparentTemperature, false)}</Text>
                  )}
                  {currentHumidity !== undefined && <Text>Humidity: {currentHumidity}%</Text>}
                  <Text>Wind: {current.windspeed} km/h</Text>
                  {airQuality?.us_aqi && (
                    <Text>
                      AQI: <Badge colorScheme={getAqiColor(airQuality.us_aqi)}>{airQuality.us_aqi}</Badge>
                    </Text>
                  )}
                </VStack>
              </HStack>
              <ResponsiveButtonGroup> {/* This wrapper handles the VStack and responsive alignment */}
                {/* Action Buttons */}
                <ButtonGroup isAttached={!isMobile} size="sm" variant="outline">
                  <Tooltip label="Refresh weather" placement="top">
                    <IconButton
                      icon={<RepeatIcon />}
                      onClick={() => {
                        playSound('ui-click');
                        fetchWeather();
                      }}
                      isLoading={isLoading}
                      aria-label="Refresh weather"
                    />
                  </Tooltip>
                  <Tooltip label="Open Sunrise/Sunset Calendar" placement="top">
                    <IconButton
                      icon={<CalendarIcon />}
                      onClick={() => {
                        playSound('ui-click');
                        onCalendarOpen();
                      }}
                      aria-label="Open sunrise/sunset calendar"
                    />
                  </Tooltip>
                  <Tooltip label="Open Weather Map" placement="top">
                    <IconButton
                      icon={<ViewIcon />}
                      onClick={() => {
                        playSound('ui-click');
                        onMapOpen();
                      }}
                      aria-label="Open weather map"
                    />
                  </Tooltip>
                  <Tooltip label="View Weather History" placement="top">
                    <IconButton
                      icon={<FaHistory />}
                      onClick={() => {
                        playSound('ui-click');
                        onHistoryOpen();
                      }}
                      aria-label="View weather history"
                    />
                  </Tooltip>
                </ButtonGroup>
                {/* Unit Toggle Buttons */}
                <ButtonGroup isAttached={!isMobile} size="sm">
                  <Button onClick={() => { playSound('ui-click'); setUnit('C'); }} isActive={unit === 'C'}>
                    °C
                  </Button>
                  <Button onClick={() => { playSound('ui-click'); setUnit('F'); }} isActive={unit === 'F'}>
                    °F
                  </Button>
                </ButtonGroup>
              </ResponsiveButtonGroup>
            </Grid>
          </Box>
        </Box>

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

export default React.memo(WeatherCard);
