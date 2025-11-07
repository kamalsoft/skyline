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
  DrawerCloseButton,
  Text,
  Spinner,
  IconButton,
  useDisclosure,
  useColorMode,
  extendTheme,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, InfoIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
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
import SortableWorldClock from './components/SortableWorldClock'; // This should now wrap WorldClockCard
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
  // Define custom metallic colors for the analog clock
  colors: {
    metallic: {
      light: {
        bg: 'linear-gradient(145deg, #d98752, #b87333)', // Copper
        shadowLight: '#ffb87a',
        shadowDark: '#a15e2c',
        hands: '#4A4A4A',
        numbers: '#333',
        secondHand: '#FF0000',
      },
      dark: {
        bg: 'linear-gradient(145deg, #b87333, #8c5829)', // Dark Copper
        shadowLight: '#d98752',
        shadowDark: '#7a4f24',
        hands: '#E0E0E0',
        numbers: '#EEE',
        secondHand: '#FF4500',
      },
    },
  },
  styles: {
    global: (props) => ({
      'body': {
        bg: props.colorMode === 'dark' ? 'linear-gradient(to bottom right, #1a202c, #2d3748)' : 'linear-gradient(to bottom right, #edf2f7, #e2e8f0)',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      },
      '.glass': {
        bg: props.colorMode === 'dark' ? 'rgba(26, 32, 44, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        borderWidth: '1px',
        borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        boxShadow: props.colorMode === 'dark' ? '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
      }
    }),
  },
  components: {
    Drawer: { baseStyle: { dialog: { bg: 'transparent' } } }, // Merged Drawer and Button
    Button: {
      variants: {
        ghost: (props) => ({
          color: props.colorMode === 'dark' ? 'whiteAlpha.800' : 'gray.700',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200',
          },
        }),
      },
    },
  },
});

function AppContent() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const [currentLocationStatus, setCurrentLocationStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [currentLocationError, setCurrentLocationError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [clocks, setClocks] = useState(() => {
    try {
      const savedClocks = localStorage.getItem('clocks');
      return savedClocks ? JSON.parse(savedClocks) : initialClocks;
    } catch (error) {
      console.error("Could not parse clocks from localStorage", error);
      return initialClocks;
    }
  });

  useEffect(() => {
    localStorage.setItem('clocks', JSON.stringify(clocks));
  }, [clocks]);

  useEffect(() => {
    setCurrentLocationStatus('loading');

    const handleLocationSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
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
          setCurrentLocation(newClock);

          setClocks((prevClocks) => {
            const existing = prevClocks.find(c => c.id === 'current-location');
            if (existing) {
              return prevClocks.map(c => c.id === 'current-location' ? newClock : c);
            }
            return [newClock, ...prevClocks];
          });
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

    const handleLocationError = (error, fallback) => {
      if (error.code === error.TIMEOUT && fallback) {
        // If high accuracy timed out, try with low accuracy
        fallback();
      } else {
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
        setCurrentLocationStatus('error');
      }
    };

    const getLocation = () => {
      if (!navigator.geolocation) {
        setCurrentLocationStatus('error');
        setCurrentLocationError('Geolocation is not supported by your browser.');
        return;
      }

      // 1. Try with high accuracy
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        (err) => handleLocationError(err, () => {
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
  }, []); // Run once on mount

  const addClock = (clock) => {
    setClocks((prevClocks) => [
      ...prevClocks,
      { ...clock, id: Date.now() },
    ]);
  };

  const removeClock = (id) => {
    setClocks((prevClocks) => prevClocks.filter((clock) => clock.id !== id));
  };

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setClocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleForecastFetch = useCallback((daily) => {
    setDailyForecast(daily);
  }, []);

  const handleWeatherFetch = useCallback((weather) => {
    setClocks(clocks => clocks.map(c => c.id === 'current-location' ? { ...c, weatherCode: weather.weather_code } : c));
  }, []);

  return (
    <Box p={5}>
      <AnimatedBackground
        sunrise={dailyForecast?.sunrise?.[0]}
        sunset={dailyForecast?.sunset?.[0]}
        weatherCode={currentLocation ? clocks.find(c => c.id === 'current-location')?.weatherCode : null}
      />
      <HStack justify="flex-end" mb={4} position="relative" zIndex="10">
        <HStack className="glass" p={2} borderRadius="md">
          <IconButton onClick={toggleColorMode} icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} aria-label="Toggle theme" />
          <Button ref={btnRef} leftIcon={<SettingsIcon />} colorScheme="teal" variant="ghost" onClick={onOpen}>
            Settings
          </Button>
        </HStack>
      </HStack>

      {currentLocationStatus === 'loading' && (
        <HStack justify="center" mb={4}>
          <Spinner size="sm" />
          <Text>Fetching current location...</Text>
        </HStack>
      )}
      {currentLocationStatus === 'error' && (
        <HStack justify="center" mb={4} color="red.500">
          <InfoIcon />
          <Text>{currentLocationError}</Text>
          <Button colorScheme="yellow" size="sm" onClick={onOpen}>
            Set Manually
          </Button>
        </HStack>
      )}


      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef} size="md">
        <DrawerOverlay />
        <DrawerContent className="glass">
          <DrawerCloseButton />
          <DrawerHeader>Customize Your Dashboard</DrawerHeader>
          <DrawerBody>
            <SettingsPanel clocks={clocks} addClock={addClock} removeClock={removeClock} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' }} gap={6} h="calc(100vh - 80px)" overflow="hidden">
        <Box overflowY="auto" p={2} sx={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' }, 'scrollbarWidth': 'thin' }}>
          {currentLocation && (
            <WeatherCard
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              onForecastFetch={handleForecastFetch}
              locationName={currentLocation.location}
              onWeatherFetch={handleWeatherFetch}
            />
          )}
        </Box>
        <Box overflowY="auto" p={2} sx={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' } }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={clocks.map(c => String(c.id))} strategy={rectSortingStrategy}>
              <VStack spacing={4} align="stretch">
                <AnimatePresence>
                  {clocks.map((clock) => (
                    <motion.div key={clock.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                      <SortableWorldClock clock={clock} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </VStack>
            </SortableContext>
          </DndContext>
        </Box>
      </Grid>
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AppContent />
    </ChakraProvider>
  );
}

export default App;
