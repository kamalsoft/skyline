// src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChakraProvider,
  Box,
  Grid,
  VStack,
  HStack,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  CloseButton,
  Heading,
  DrawerCloseButton,
  Text,
  Spinner,
  IconButton,
  useDisclosure,
  useColorMode,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  extendTheme,
  Tooltip,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, SettingsIcon, ViewIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { DragOverlay } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import WeatherCard from './components/WeatherCard';
import SettingsPanel from './components/SettingsPanel';
import WorldClockCard from './components/WorldClockCard';
import SortableWorldClock from './components/SortableWorldClock'; // This should now wrap WorldClockCard
import { LogProvider } from './contexts/LogContext';
import LogTerminal from './components/LogTerminal';
import { generateWeatherAlerts } from './utils/alertUtils';
import './App.css';
import axios from 'axios'; // For reverse geocoding

const initialClocks = [
  { id: 1, location: 'Naperville, USA', timeZone: 'America/Chicago', latitude: 41.7731, longitude: -88.1502 },
  { id: 2, location: 'Chennai, India', timeZone: 'Asia/Kolkata', latitude: 13.0827, longitude: 80.2707 },
];

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    // New Vibrant Purple Palette
    primaryPurple: '#7B61FF',
    accentPink: '#FF6EC7',
    deepViolet: '#5A4FCF',
    lightLavender: '#E4D9FF',
    softGray: '#F5F5F5',
    darkGray: '#4A4A4A',

    // Existing clock themes
    metallic: { // Copper theme
      light: { bg: 'linear-gradient(145deg, #d98752, #b87333)', shadowLight: '#ffb87a', shadowDark: '#a15e2c', hands: '#4A4A4A', numbers: '#333', secondHand: '#FF0000' },
      dark: { bg: 'linear-gradient(145deg, #b87333, #8c5829)', shadowLight: '#d98752', shadowDark: '#7a4f24', hands: '#E0E0E0', numbers: '#EEE', secondHand: '#FF4500' },
    },
    minimalist: {
      light: {
        bg: '#ffffff',
        hands: '#333333',
        secondHand: '#E53E3E', // red.500
      },
      dark: {
        bg: '#1A202C', // gray.800
        hands: '#E2E8F0', // gray.200
        secondHand: '#FC8181', // red.300
      },
    },
    ocean: {
      light: {
        bg: 'linear-gradient(145deg, #E4D9FF, #F5F5F5)',
        shadowLight: '#ffffff',
        shadowDark: '#c1b7d7',
        hands: '#5A4FCF',
        numbers: '#7B61FF',
        secondHand: '#FF6EC7',
      },
      dark: {
        bg: 'linear-gradient(145deg, #5A4FCF, #2c3e50)',
        shadowLight: '#7c6be0',
        shadowDark: '#382e7e',
        hands: '#E4D9FF',
        numbers: '#FFFFFF',
        secondHand: '#FF6EC7',
      },
    },
    cyberpunk: {
      light: { // A light mode variant for cyberpunk
        bg: 'linear-gradient(145deg, #e0e0e0, #f5f5f5)',
        shadowLight: '#ffffff',
        shadowDark: '#c7c7c7',
        hands: '#00ffff', // Cyan
        numbers: '#ff00ff', // Magenta
        secondHand: '#ffff00', // Yellow,
        numberFontFamily: "'Orbitron', sans-serif",
      },
      dark: {
        bg: 'linear-gradient(145deg, #0d0221, #241e4e)',
        shadowLight: '#3a307b',
        shadowDark: '#000000',
        hands: '#00ffff', // Cyan
        numbers: '#ff00ff', // Magenta
        secondHand: '#ffff00', // Yellow,
        numberFontFamily: "'Orbitron', sans-serif",
      },
    },
  },
  styles: {
    global: (props) => ({
      '.glass': {
        bg: props.colorMode === 'dark' ? 'rgba(90, 79, 207, 0.25)' : 'rgba(228, 217, 255, 0.5)',
        backdropFilter: 'blur(15px)',
        borderWidth: '1px',
        borderColor: props.colorMode === 'dark' ? 'rgba(228, 217, 255, 0.2)' : 'rgba(90, 79, 207, 0.3)',
        boxShadow: props.colorMode === 'dark' ? '0 8px 20px rgba(0,0,0,0.3)' : `0 8px 20px rgba(90, 79, 207, 0.2)`,
      }
    }),
  },
  components: {
    Drawer: { baseStyle: { dialog: { bg: 'transparent' } } }, // Merged Drawer and Button
    Button: {
      variants: {
        'ghost': (props) => ({
          color: props.colorMode === 'dark' ? 'white' : 'primaryPurple',
          _hover: {
            bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(123, 97, 255, 0.1)',
          },
        }),
      },
    },
  },
});

function AppContent() {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const [showLogTerminal, setShowLogTerminal] = useState(false);

  const [currentLocationStatus, setCurrentLocationStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [currentLocationError, setCurrentLocationError] = useState(null);
  const [primaryLocation, setPrimaryLocation] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);

  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem('themePreference') || 'dark'; // 'light', 'dark', 'auto'
  });


  // Centralized function to set the primary location and update the clocks list
  const setPrimaryLocationAndUpdateClocks = useCallback((locationData) => {
    console.log('[App.js] Setting primary location:', locationData);
    setPrimaryLocation(locationData);

    setClocks((prevClocks) => {
      const existing = prevClocks.find(c => c.id === locationData.id);
      if (existing) {
        return prevClocks.map(c => c.id === locationData.id ? locationData : c);
      }
      return [locationData, ...prevClocks.filter(c => c.id !== 'current-location')];
    });
  }, []);

  useEffect(() => {
    console.log('[App.js] Primary location state changed:', primaryLocation);
  }, [primaryLocation]);

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
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before activating
      // Improves click handling on the cards
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [activeDragItem, setActiveDragItem] = useState(null);

  const [clocks, setClocks] = useState(() => {
    try {
      const savedClocks = localStorage.getItem('clocks');
      const parsedClocks = savedClocks ? JSON.parse(savedClocks) : initialClocks;
      return parsedClocks.filter(c => c.id !== 'current-location');
    } catch (error) {
      console.error("Could not parse clocks from localStorage", error);
      return initialClocks;
    }
  });

  useEffect(() => {
    // Don't save the 'current-location' clock to localStorage
    localStorage.setItem('clocks', JSON.stringify(clocks.filter(c => c.id !== 'current-location')));
  }, [clocks]);

  useEffect(() => {
    if (dailyForecast) {
      const newAlerts = generateWeatherAlerts(dailyForecast);
      setWeatherAlerts(newAlerts);
    }
  }, [dailyForecast]);

  useEffect(() => {
    console.log('[App.js] Attempting to get current location...');
    setCurrentLocationStatus('loading');

    const handleLocationSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`[App.js] Geolocation success. Lat: ${latitude}, Lon: ${longitude}`);
      try {
        const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        console.log('[App.js] Fetching reverse geocoding data from URL:', apiUrl);
        const response = await axios.get(apiUrl);
        const result = response.data;

        if (result) {
          console.log('[App.js] Reverse geocoding successful:', result);
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
        console.error("Error reverse geocoding:", error);
        setCurrentLocationStatus('error');
        setCurrentLocationError('Failed to get location details. Please check your internet connection.');
      }
    };

    const fetchLocationByIp = async () => {
      console.log('[App.js] Falling back to IP-based geolocation...');
      setCurrentLocationStatus('loading');
      setCurrentLocationError('High-accuracy location failed. Trying network-based location...');
      try {
        const response = await axios.get('https://ipinfo.io/json');
        const result = response.data;
        if (result && result.loc) {
          console.log('[App.js] IP-based geolocation successful:', result);
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

    const handleLocationError = (error, fallback) => {
      console.error('[App.js] Geolocation error:', error);
      if (error.code === error.POSITION_UNAVAILABLE) {
        fetchLocationByIp();
      } else {
        let message = 'An error occurred while fetching your location.';
        console.warn(`[App.js] Geolocation failed with code: ${error.code}`);
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
        setCurrentLocationStatus('error');
      }
    };

    const getLocation = () => {
      if (!navigator.geolocation) {
        console.error('[App.js] Geolocation is not supported by this browser.');
        setCurrentLocationStatus('error');
        setCurrentLocationError('Geolocation is not supported by your browser.');
        return;
      }

      console.log('[App.js] Attempting to get location with high accuracy...');
      // 1. Try with high accuracy
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        (err) => handleLocationError(err, () => {
          console.log('[App.js] Attempting to get location with low accuracy (fallback)...');
          // 2. Fallback to low accuracy
          navigator.geolocation.getCurrentPosition(
            handleLocationSuccess,
            (fallbackErr) => handleLocationError(fallbackErr, null),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
          );
        }),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
    };

    getLocation();
  }, [setPrimaryLocationAndUpdateClocks]); // Run once on mount

  const addClock = (clock) => {
    setClocks((prevClocks) => [
      ...prevClocks,
      { ...clock, id: Date.now() },
    ]);
  };

  const removeClock = (id) => {
    setClocks((prevClocks) => prevClocks.filter((clock) => clock.id !== id));
  };

  const removeAllClocks = () => {
    // Keep the primary location if it's the current location, otherwise clear all
    setClocks(clocks.filter(c => c.id === 'current-location'));
  };

  function handleDragStart(event) {
    const { active } = event;
    const item = clocks.find(clock => clock.id === active.id);
    setActiveDragItem(item);
  }

  const [clockTheme, setClockTheme] = useState(() => {
    return localStorage.getItem('clockTheme') || 'metallic';
  });

  const handleThemeChange = (newTheme) => {
    setClockTheme(newTheme);
    localStorage.setItem('clockTheme', newTheme);
  };

  const [timeFormat, setTimeFormat] = useState(() => {
    return localStorage.getItem('timeFormat') || '12h'; // '12h' or '24h'
  });

  const handleTimeFormatChange = (newFormat) => {
    setTimeFormat(newFormat);
    localStorage.setItem('timeFormat', newFormat);
  };

  const [background, setBackground] = useState(() => {
    const savedBg = localStorage.getItem('background');
    return savedBg ? JSON.parse(savedBg) : { type: 'dynamic', value: '' };
  });

  const handleBackgroundChange = (newBackground) => {
    setBackground(newBackground);
    localStorage.setItem('background', JSON.stringify(newBackground));
  };

  const handleThemePreferenceChange = (newPreference) => {
    setThemePreference(newPreference);
    localStorage.setItem('themePreference', newPreference);
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveDragItem(null);

    if (over && active.id !== over.id) {
      setClocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDragCancel() {
    setActiveDragItem(null);
  }

  const handleForecastFetch = useCallback((daily) => {
    setDailyForecast(daily);
  }, []);

  const handleWeatherFetch = useCallback((weather) => {
    console.log('[App.js] Weather fetched for primary location, updating weather code.');
    setClocks(prevClocks => prevClocks.map(c => c.id === 'current-location' ? { ...c, weatherCode: weather.weathercode } : c));
  }, []); // This dependency array is intentionally kept minimal to avoid re-renders.

  const activeAlerts = weatherAlerts.filter(alert => !dismissedAlerts.includes(alert.id));

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box p={5}>
      <AnimatedBackground
        background={background}
        sunrise={dailyForecast?.sunrise?.[0]}
        sunset={dailyForecast?.sunset?.[0]}
        weatherCode={primaryLocation ? clocks.find(c => c.id === primaryLocation.id)?.weatherCode : null}
      />
      <HStack justify="flex-end" mb={4} position="relative" zIndex="10">
        <motion.div>
          <HStack className="glass" p={2} borderRadius="md">
            <Tooltip label={themePreference === 'auto' ? 'Theme is in Auto mode' : 'Toggle theme'}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={toggleColorMode} icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} aria-label="Toggle theme"
                  isDisabled={themePreference === 'auto'}
                />
              </motion.div>
            </Tooltip>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton onClick={() => setShowLogTerminal(!showLogTerminal)} icon={<ViewIcon />} aria-label="Toggle Log Terminal" variant={showLogTerminal ? 'solid' : 'ghost'} />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button ref={btnRef} leftIcon={<SettingsIcon />} colorScheme="teal" variant="ghost" onClick={onOpen}>
                Settings
              </Button>
            </motion.div>
          </HStack>
        </motion.div>
      </HStack>

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
          <Button colorScheme="yellow" size="sm" onClick={onOpen} ml={4}>
            Set Manually
          </Button>
        </Alert>
      )}

      {activeAlerts.length > 0 && (
        <VStack spacing={4} my={4}>
          {activeAlerts.map(alert => (
            <Alert status={alert.status} key={alert.id} borderRadius="md" className="glass">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>{alert.title}</AlertTitle>
                <Text fontSize="sm">{alert.description}</Text>
              </Box>
              <CloseButton position="relative" top="0" right="0" onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])} />
            </Alert>
          ))}
        </VStack>
      )}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="lg">
        <DrawerOverlay />
        <DrawerContent className="glass">
          <DrawerCloseButton />
          <DrawerHeader>Customize Your Dashboard</DrawerHeader>
          <DrawerBody>
            <SettingsPanel
              clocks={clocks}
              addClock={addClock}
              removeClock={removeClock}
              removeAllClocks={removeAllClocks}
              clockTheme={clockTheme} onThemeChange={handleThemeChange}
              timeFormat={timeFormat} onTimeFormatChange={handleTimeFormatChange}
              background={background} onBackgroundChange={handleBackgroundChange} setPrimaryLocation={setPrimaryLocationAndUpdateClocks}
              themePreference={themePreference}
              onThemePreferenceChange={handleThemePreferenceChange}
              onClose={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Grid
        templateColumns={{ base: '1fr', lg: isSidebarOpen ? '380px 1fr' : '80px 1fr' }}
        gap={6}
        h="calc(100vh - 120px)"
        overflow="hidden"
        transition="template-columns 0.3s ease-in-out"
      >
        {/* Sidebar Column */}
        <Box className="glass" borderRadius="xl" p={4} display="flex" flexDirection="column">
          <HStack justify="space-between" mb={4} flexShrink={0}>
            {isSidebarOpen && <Heading size="md">World Clocks</Heading>}
            <Tooltip label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"} placement="right">
              <IconButton
                icon={isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
                variant="ghost"
              />
            </Tooltip>
          </HStack>
          <Box overflowY="auto" flex="1" sx={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' } }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={clocks.map(c => String(c.id))} strategy={rectSortingStrategy}>
                <VStack spacing={4} align="stretch">
                  <AnimatePresence>
                    {clocks.map((clock) => (
                      <motion.div key={clock.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                        <SortableWorldClock clock={clock} clockTheme={clockTheme} timeFormat={timeFormat} isSidebarOpen={isSidebarOpen} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </VStack>
                <DragOverlay>
                  {activeDragItem ? (
                    <WorldClockCard clock={activeDragItem} isDragging clockTheme={clockTheme} timeFormat={timeFormat} isSidebarOpen={isSidebarOpen} />
                  ) : null}
                </DragOverlay>
              </SortableContext>
            </DndContext>
          </Box>
        </Box>

        {/* Main Content Column */}
        <Box overflowY="auto" p={2} sx={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' }, 'scrollbarWidth': 'thin' }}>
          <AnimatePresence>
            {primaryLocation && (
              <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <WeatherCard latitude={primaryLocation.latitude} longitude={primaryLocation.longitude} onForecastFetch={handleForecastFetch} locationName={primaryLocation.location} onWeatherFetch={handleWeatherFetch} timeFormat={timeFormat} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Grid>
      <AnimatePresence>
        {showLogTerminal && (
          <LogTerminal />
        )}
      </AnimatePresence>
    </Box>
  );
}

function App() {
  return (
    <LogProvider>
      <ChakraProvider theme={theme}>
        <AppContent />
      </ChakraProvider>
    </LogProvider>
  );
}

export default App;
