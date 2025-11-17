// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { // Removed ChakraProvider
  Box,
  Grid,
  VStack,
  HStack,
  Flex,
  Button,
  Heading,
  Text,
  Spinner,
  IconButton,
  useColorMode,
  Alert,
  AlertIcon,
  AlertTitle, // Kept for use
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Link,
  CloseButton, // Kept for use
  AlertDescription,
  Tooltip,
} from '@chakra-ui/react';
import { SettingsIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  defaultAnnouncements,
  defaultScreenReaderInstructions,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { DragOverlay } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import WeatherCard from './components/WeatherCard';
import SeasonalSunPath from './components/SeasonalSunPath';
import SettingsPanel from './components/SettingsPanel';
import TamilPanchangamPanel from './components/TamilPanchangamPanel';
import CelestialEventsPanel from './components/CelestialEventsPanel';
import WorldClockCard from './components/WorldClockCard';
import SortableWorldClock from './components/SortableWorldClock';
import { LogProvider } from './contexts/LogContext';
import { useAppUI } from './useAppUI';
import LogTerminal from './components/LogTerminal';
import { generateWeatherAlerts } from './utils/alertUtils';
import { SoundProvider, useSound } from './contexts/SoundContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import 'leaflet/dist/leaflet.css';
import axios from 'axios'; // For reverse geocoding

function AppContent() {
  const { settings, dispatch } = useSettings();

  const { clocks, primaryLocation, displaySettings, timeFormat, clockTheme, background, animationSettings, themePreference, appSettings } = settings;
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

  const { playSound } = useSound();
  const { setColorMode } = useColorMode();
  const { showSettingsPanel, setShowSettingsPanel, showLogTerminal, isSidebarOpen, setIsSidebarOpen, isAnimationPaused } = useAppUI();
  const [activeDragItem, setActiveDragItem] = useState(null);

  const [currentLocationStatus, setCurrentLocationStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [currentLocationError, setCurrentLocationError] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);

  // Centralized function to set the primary location and update the clocks list
  const setPrimaryLocationAndUpdateClocks = useCallback(
    (locationData) => {
      dispatch({ type: 'SET_PRIMARY_LOCATION', payload: locationData });
      // Use a functional update to avoid depending on 'clocks' in the callback
      dispatch({
        type: 'SET_CLOCKS',
        payload: (prevClocks) => [locationData, ...prevClocks.filter((c) => c.id !== 'current-location')],
      });
    },
    [dispatch] // Now only depends on dispatch, which is stable
  );

  useEffect(() => {
    const applyTheme = () => {
      if (themePreference === 'auto') {
        if (dailyForecast?.sunrise?.[0] && dailyForecast?.sunset?.[0]) {
          const now = new Date().getTime();
          const sunriseTime = new Date(dailyForecast.sunrise[0]).getTime();
          const sunsetTime = new Date(dailyForecast.sunset[0]).getTime();
          const isDay = now >= sunriseTime && now < sunsetTime;
          setColorMode(isDay ? 'light' : 'dark');
        } else {
          setColorMode('dark'); // Default to dark if sun times are not available
        }
      } else {
        setColorMode(themePreference);
      }
    };

    applyTheme();
    // Check every minute if in auto mode
    const intervalId = setInterval(() => {
      if (themePreference === 'auto') applyTheme();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [themePreference, dailyForecast, setColorMode]);

  const [weatherAlerts, setWeatherAlerts] = useState([]);

  // Custom announcements for screen readers to improve accessibility
  const customAnnouncements = {
    ...defaultAnnouncements,
    onDragStart({ active }) {
      return `Picked up ${active.data.current?.clock.location || 'clock'}.`;
    },
    onDragOver({ active, over }) {
      if (over) {
        return `Moving ${active.data.current?.clock.location || 'clock'} over ${over.data.current?.clock.location || 'clock'}.`;
      }
      return `Moving ${active.data.current?.clock.location || 'clock'}.`;
    },
    onDragEnd({ active, over }) {
      if (over) {
        const newIndex = clocks.findIndex((c) => c.id === over.id);
        return `Dropped ${active.data.current?.clock.location || 'clock'} at position ${newIndex + 1}.`;
      }
      return `Dropped ${active.data.current?.clock.location || 'clock'}.`;
    },
    onDragCancel({ active }) {
      return `Drag cancelled. ${active.data.current?.clock.location || 'clock'} returned to its original position.`;
    },
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const item = clocks.find((clock) => clock.id === active.id);
    setActiveDragItem(item);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragItem(null);
    if (over && active.id !== over.id) {
      dispatch({ type: 'REORDER_CLOCKS', payload: { activeId: active.id, overId: over.id } });
    }
  };

  const handleDragCancel = () => {
    setActiveDragItem(null);
  };
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 5 pixels before activating
      // Improves click handling on the cards
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleHapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // Vibrate for 50ms
    }
  };

  useEffect(() => {
    if (dailyForecast) {
      const newAlerts = generateWeatherAlerts(dailyForecast);
      setWeatherAlerts(newAlerts);
    }
  }, [dailyForecast]);

  useEffect(() => {
    setCurrentLocationStatus('loading');

    const handleLocationSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        const response = await axios.get(apiUrl);
        const result = response.data;

        if (result) {
          const newClock = {
            id: 'current-location',
            location: `${result.locality}, ${result.principalSubdivision || result.countryName}`,
            timeZone: result.timezone?.ianaName || 'UTC', // Use ianaName with fallback
            latitude: latitude,
            longitude: longitude,
            countryCode: result.countryCode,
          };
          setPrimaryLocationAndUpdateClocks(newClock);
          setCurrentLocationStatus('success');
        } else {
          throw new Error('Could not find location details.');
        }
      } catch (error) {
        console.error('Error during reverse geocoding:', error);
        setCurrentLocationStatus('error');
        setCurrentLocationError('Failed to get location details. Please check your internet connection.');
      }
    };

    const fetchLocationByIp = async () => {
      console.log('[App.js] Falling back to IP-based geolocation...');
      setCurrentLocationError('High-accuracy location failed. Trying network-based location...');
      try {
        const response = await axios.get('https://ipinfo.io/json');
        const result = response.data;
        if (result && result.loc) {
          const [lat, lon] = result.loc.split(',');
          const newClock = {
            id: 'current-location',
            location: `${result.city}, ${result.region || result.country}`,
            timeZone: result.timezone,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            countryCode: result.country.toLowerCase(),
          };
          setPrimaryLocationAndUpdateClocks(newClock);
          setCurrentLocationStatus('success');
        } else {
          throw new Error('IP-based geolocation failed or returned incomplete data.');
        }
      } catch (error) {
        console.error('[App.js] IP-based geolocation error:', error);
        setCurrentLocationError('Could not determine location from network. Please set it manually.');
        setCurrentLocationStatus('error');
      }
    };

    const handleLocationError = (error) => {
      console.error('[App.js] Geolocation error:', error);
      let message = 'An error occurred while fetching your location.';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location access denied. Please enable it in your browser settings to see local weather.';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information is unavailable. Please check your device settings.';
          break;
        case error.TIMEOUT:
          message = 'Failed to get your location. Please check your network and location settings.';
          break;
        default:
          message = `An unknown error occurred: ${error.message}`;
      }
      setCurrentLocationError(message);
      // Always try IP fallback if geolocation fails
      fetchLocationByIp();
    };

    const getLocation = async () => {
      if (!navigator.geolocation) {
        console.error('[App.js] Geolocation is not supported by this browser.');
        setCurrentLocationError('Geolocation is not supported by your browser.');
        fetchLocationByIp(); // Fallback if geolocation API is missing
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
        await handleLocationSuccess(position);
      } catch (error) {
        handleLocationError(error);
      }
    };

    getLocation();
  }, [setPrimaryLocationAndUpdateClocks]); // Run once on mount

  const handleForecastFetch = useCallback((daily) => {
    setDailyForecast(daily);
  }, []);

  const handleWeatherFetch = useCallback(
    (weather) => {
      // Dispatch an action to update the clocks array in the context
      dispatch({ type: 'UPDATE_CURRENT_LOCATION_WEATHER', payload: weather.weathercode });
    },
    [dispatch] // dispatch is a stable function and won't cause re-renders
  );

  const activeAlerts = weatherAlerts.filter((alert) => !dismissedAlerts.includes(alert.id));

  const shakeControls = useAnimation();
  const handleLightningFlash = useCallback(() => {
    const getRandomInt = (max) => Math.floor(Math.random() * (max * 2 + 1)) - max;

    if (!isAnimationPaused) {
      const maxShakeX = 5; // Max horizontal shake in pixels
      const maxShakeY = 3; // Max vertical shake in pixels

      // Generate a random sequence of movements for a more natural shake
      const xKeyframes = [0, getRandomInt(maxShakeX), -getRandomInt(maxShakeX), getRandomInt(maxShakeX / 2), 0];
      const yKeyframes = [0, getRandomInt(maxShakeY), -getRandomInt(maxShakeY), getRandomInt(maxShakeY / 2), 0];

      shakeControls.start({
        x: xKeyframes,
        y: yKeyframes,
        transition: { duration: 0.3, ease: 'easeInOut' },
      });
    }
  }, [shakeControls, isAnimationPaused]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Main grid layout that adapts based on sidebar visibility and screen size
  const gridTemplateColumns = displaySettings.showWorldClock && !isMobile ? (isSidebarOpen ? '380px 1fr' : '80px 1fr') : '1fr';

  return (
    <Box p={4} h="100vh" display="flex" flexDirection="column">
      <AnimatedBackground
        background={background}
        sunrise={dailyForecast?.sunrise?.[0]}
        sunset={dailyForecast?.sunset?.[0]}
        weatherCode={primaryLocation ? clocks.find((c) => c.id === primaryLocation.id)?.weatherCode : null}
        isAnimationPaused={isAnimationPaused}
        animationSettings={animationSettings}
        onLightningFlash={handleLightningFlash}
      />
      {/* Mobile-only button to open the World Clock Drawer */}
      {isMobile && displaySettings.showWorldClock && (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1300 }}>
          <Tooltip label="Show World Clocks" placement="bottom">
            <IconButton
              onClick={onDrawerOpen}
              icon={<ChevronRightIcon />}
              aria-label="Show world clocks"
              className="glass"
            />
          </Tooltip>
        </motion.div>
      )}

      {/* New Floating Settings Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1300 }}>
        <Tooltip label="Settings" placement="left" hasArrow>
          <IconButton
            icon={<SettingsIcon />}
            isRound
            size="lg"
            colorScheme="purple"
            className="glass"
            onClick={() => setShowSettingsPanel(true)}
            aria-label="Open Settings"
            boxShadow="lg"
          />
        </Tooltip>
      </motion.div>

      {currentLocationStatus === 'loading' && (
        <HStack justify="center" mb={4}>
          <Spinner size="sm" />
          <Text>Fetching current location...</Text>
        </HStack>
      )}
      {currentLocationStatus === 'error' && (
        <Alert status="error" borderRadius="md" className="glass" my={4}>
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Location Error</AlertTitle>
            <AlertDescription display="block">{currentLocationError}</AlertDescription>
          </Box>
          <Button colorScheme="yellow" size="sm" onClick={() => setShowSettingsPanel(true)} ml={4}>
            Set Manually
          </Button>
        </Alert>
      )}

      {activeAlerts.length > 0 && (
        <VStack spacing={4} my={4}>
          {activeAlerts.map((alert) => (
            <Alert status={alert.status} key={alert.id} borderRadius="md" className="glass">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>{alert.title}</AlertTitle>
                <Text fontSize="sm">{alert.description}</Text>
              </Box>
              <CloseButton
                position="relative"
                top="0"
                right="0"
                onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
              />
            </Alert>
          ))}
        </VStack>
      )}

      <motion.div animate={shakeControls}>
        <Grid
          templateColumns={gridTemplateColumns}
          gap={6}
          flex="1"
          transition="template-columns 0.3s ease-in-out"
          overflow="hidden"
        >
          {/* Sidebar Column */}
          {displaySettings.showWorldClock && !isMobile && (
            <Box
              className="glass"
              borderRadius="xl"
              p={4}
              display="flex"
              flexDirection="column"
              h="100%"
            >
              <HStack justify="space-between" mb={4} flexShrink={0}>
                {isSidebarOpen && <Heading size="md">World Clocks</Heading>}
                <Tooltip label={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'} placement="right">
                  <IconButton
                    icon={isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                    variant="ghost"
                  />
                </Tooltip>
              </HStack>
              <Box
                overflowY="auto"
                flex="1"
                sx={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' },
                }}
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={(event) => {
                    playSound('ui-drag');
                    handleDragStart(event);
                    handleHapticFeedback();
                  }}
                  onDragEnd={(event) => {
                    playSound('ui-drop');
                    handleDragEnd(event);
                  }}
                  onDragOver={() => playSound('ui-click')}
                  onDragCancel={handleDragCancel}
                  announcements={customAnnouncements}
                  accessibility={{
                    screenReaderInstructions: defaultScreenReaderInstructions,
                  }}
                >
                  <SortableContext items={clocks.map((c) => String(c.id))} strategy={rectSortingStrategy}>
                    <VStack spacing={4} align="stretch">
                      <AnimatePresence>
                        {clocks.map((clock) => (
                          <motion.div
                            key={clock.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                          >
                            <SortableWorldClock
                              clock={clock}
                              clockTheme={clockTheme}
                              timeFormat={timeFormat}
                              isSidebarOpen={isSidebarOpen}
                              appSettings={appSettings}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </VStack>
                    <DragOverlay>
                      {activeDragItem ? (
                        <WorldClockCard
                          clock={activeDragItem}
                          isDragging
                          clockTheme={clockTheme}
                          timeFormat={timeFormat}
                          isSidebarOpen={isSidebarOpen}
                          appSettings={appSettings}
                        />
                      ) : null}
                    </DragOverlay>
                  </SortableContext>
                </DndContext>
              </Box>
            </Box>
          )}

          {/* Main Content Column */}
          <Box
            overflowY="auto"
            p={2}
            h="100%"
            sx={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' },
              scrollbarWidth: 'thin',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={settings.layoutPreference}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%' }}
              >
                {(() => {
                  const panels = [];
                  if (primaryLocation) {
                    panels.push(
                      <WeatherCard
                        key="weather-card"
                        latitude={primaryLocation.latitude}
                        longitude={primaryLocation.longitude}
                        onForecastFetch={handleForecastFetch}
                        locationName={primaryLocation.location}
                        onWeatherFetch={handleWeatherFetch}
                        timeFormat={timeFormat}
                        displaySettings={displaySettings}
                        appSettings={appSettings}
                      />
                    );
                  }
                  if (displaySettings.showSunPath) {
                    panels.push(<SeasonalSunPath key="sun-path" />);
                  }
                  if (displaySettings.showCelestialEvents && primaryLocation) {
                    panels.push(<CelestialEventsPanel key="celestial-events" latitude={primaryLocation.latitude} longitude={primaryLocation.longitude} />);
                  }
                  if (displaySettings.showPanchangamPanel) {
                    panels.push(<TamilPanchangamPanel key="panchangam-panel" primaryLocation={primaryLocation} />);
                  }

                  switch (settings.layoutPreference) {
                    case 'vertical':
                      return <VStack spacing={4}>{panels}</VStack>;
                    case 'horizontal':
                      return (
                        <HStack spacing={4} align="stretch" h="100%">
                          {panels.map((panel) => React.cloneElement(panel, { minW: '400px' }))}
                        </HStack>
                      );
                    default: // 'grid'
                      return <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap={4}>{panels}</Grid>;
                  }
                })()}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Grid>
      </motion.div>

      {/* World Clock Drawer for Mobile */}
      <Drawer isOpen={isDrawerOpen} placement="left" onClose={onDrawerClose} size="sm">
        <DrawerOverlay />
        <DrawerContent className="glass">
          <DrawerCloseButton />
          <DrawerHeader>World Clocks</DrawerHeader>
          <DrawerBody
            overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' },
            }}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(event) => {
                playSound('ui-drag');
                handleDragStart(event);
                handleHapticFeedback();
              }}
              onDragEnd={(event) => {
                playSound('ui-drop');
                handleDragEnd(event);
              }}
              onDragOver={() => playSound('ui-click')}
              onDragCancel={handleDragCancel}
              announcements={customAnnouncements}
              accessibility={{
                screenReaderInstructions: defaultScreenReaderInstructions,
              }}
            >
              <SortableContext items={clocks.map((c) => String(c.id))} strategy={rectSortingStrategy}>
                <VStack spacing={4} align="stretch">
                  <AnimatePresence>
                    {clocks.map((clock) => (
                      <motion.div
                        key={clock.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <SortableWorldClock clock={clock} clockTheme={clockTheme} timeFormat={timeFormat} isSidebarOpen={true} appSettings={appSettings} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </VStack>
                <DragOverlay>
                  {activeDragItem ? (
                    <WorldClockCard clock={activeDragItem} isDragging clockTheme={clockTheme} timeFormat={timeFormat} isSidebarOpen={true} appSettings={appSettings} />
                  ) : null}
                </DragOverlay>
              </SortableContext>
            </DndContext>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <AnimatePresence>{showLogTerminal && <LogTerminal />}</AnimatePresence>
      <AnimatePresence>
        {showSettingsPanel && (
          <SettingsPanel
            onClose={() => setShowSettingsPanel(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer Section */}
      <Box as="footer" pt={4}>
        <Flex
          className="glass"
          p={{ base: 3, md: 4 }}
          borderRadius="xl"
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'start' }}
          justify="space-between"
          gap={{ base: 3, md: 4 }}
        >
          <VStack align={{ base: 'center', md: 'start' }} spacing={1} color="gray.300" fontSize="xs">
            <Text fontWeight="bold">
              &copy; {new Date().getFullYear()} Skyline Weather Dashboard
            </Text>
            <Text>
              Ideas & Concept by{' '}
              <Link href="https://www.linkedin.com/in/kamalesh-k-9a5b3b1b/" isExternal color="purple.300" fontWeight="bold">
                Kamalesh
              </Link>
            </Text>
            <Text mt={2} fontSize="2xs" color="gray.500" maxW="lg" textAlign={{ base: 'center', md: 'left' }}>
              This application is for educational and demonstration purposes only. It contains no commercial elements or user tracking.
            </Text>
          </VStack>

          <VStack align={{ base: 'center', md: 'end' }} spacing={2} color="gray.400" fontSize="xs">
            <Text fontWeight="bold">Powered By</Text>
            <HStack>
              <Link href="https://open-meteo.com/" isExternal color="teal.300">Open-Meteo</Link>
              <Text>&</Text>
              <Link href="https://www.bigdatacloud.com/" isExternal color="teal.300">BigDataCloud</Link>
            </HStack>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <LogProvider> {/* LogProvider is typically at the top */}
      <SettingsProvider> {/* SettingsProvider should wrap the main app content */}
        <SoundProvider> {/* SoundProvider also needs to wrap the app content */}
          <ErrorBoundary>
            <AppContent />

          </ErrorBoundary>
        </SoundProvider>
      </SettingsProvider>
    </LogProvider>
  );
}

export default App;
