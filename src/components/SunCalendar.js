// src/components/SunCalendar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  VStack,
  HStack,
  Text,
  Grid,
  IconButton,
  Heading,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { WiSunrise, WiSunset } from 'react-icons/wi';
import dayjs from 'dayjs';

function SunCalendar({ latitude, longitude }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define color mode value at the top level to adhere to the Rules of Hooks
  const dayLengthBg = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=auto`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.daily) {
          const { time, sunrise, sunset } = response.data.daily;
          const processedData = time.map((t, i) => {
            const day = dayjs(t);
            const sunriseTime = dayjs(sunrise[i]);
            const sunsetTime = dayjs(sunset[i]);
            const dayLength = sunsetTime.diff(sunriseTime, 'minute');
            return {
              date: day,
              sunrise: sunriseTime.format('h:mm A'),
              sunset: sunsetTime.format('h:mm A'),
              dayLength,
            };
          });
          setCalendarData(processedData);
        } else {
          throw new Error('No data returned from API.');
        }
      } catch (err) {
        console.error('Failed to fetch sun calendar data:', err);
        setError('Could not retrieve calendar data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentMonth, latitude, longitude]);

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));
  const isNextMonthDisabled = currentMonth.isAfter(dayjs(), 'month');

  const today = dayjs().format('YYYY-MM-DD');
  const dayLengthMin = Math.min(...calendarData.map(d => d.dayLength), 24 * 60);
  const dayLengthMax = Math.max(...calendarData.map(d => d.dayLength), 0);

  // --- Generate full calendar grid including placeholder days ---
  const firstDayOfMonth = currentMonth.startOf('month').day();

  const calendarGrid = [];

  // Add placeholders for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push({ placeholder: true, id: `prev-${i}` });
  }

  // Add actual days of the month
  calendarData.forEach(day => {
    calendarGrid.push({ ...day, id: day.date.toString() });
  });
  // --- End of grid generation ---

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between" align="center">
        <IconButton icon={<ChevronLeftIcon />} onClick={handlePrevMonth} aria-label="Previous month" variant="ghost" />
        <Heading size="md">{currentMonth.format('MMMM YYYY')}</Heading>
        <IconButton icon={<ChevronRightIcon />} onClick={handleNextMonth} aria-label="Next month" variant="ghost" isDisabled={isNextMonthDisabled} />
      </HStack>

      {loading && (
        <HStack justify="center" p={10}>
          <Spinner />
          <Text>Loading calendar...</Text>
        </HStack>
      )}
      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          {/* Weekday Headers */}
          <Grid templateColumns="repeat(7, 1fr)" gap={2} textAlign="center" fontWeight="bold" color="gray.500">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <Text key={day}>{day}</Text>
            ))}
          </Grid>

          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' }} gap={3}>
            {calendarGrid.map((day) => {
              if (day.placeholder) {
                return <Box key={day.id} />;
              }

              const isToday = day.date.format('YYYY-MM-DD') === today;
              const dayLengthPercent = ((day.dayLength - dayLengthMin) / (dayLengthMax - dayLengthMin)) * 100;

              return (
                <VStack
                  key={day.id}
                  className="glass"
                  p={3}
                  borderRadius="lg"
                  align="stretch"
                  spacing={2}
                  border={isToday ? '2px solid' : '1px solid'}
                  borderColor={isToday ? 'purple.300' : 'transparent'}
                  boxShadow={isToday ? '0 0 15px rgba(123, 97, 255, 0.5)' : 'md'}
                >
                  <Text fontWeight="bold" fontSize="sm" textAlign="center" color={isToday ? 'purple.300' : 'inherit'}>
                    {day.date.format('D')}
                  </Text>
                  <Box h="4px" w="100%" borderRadius="full" bg={dayLengthBg} overflow="hidden">
                    <Box h="100%" w={`${dayLengthPercent}%`} bgGradient="linear(to-r, orange.300, pink.400)" />
                  </Box>
                  <VStack spacing={1} align="start" fontSize="xs">
                    <HStack>
                      <Icon as={WiSunrise} boxSize={5} color="orange.300" />
                      <Text>{day.sunrise}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={WiSunset} boxSize={5} color="purple.300" />
                      <Text>{day.sunset}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              );
            })}
          </Grid>
        </>
      )}
    </VStack>
  );
}

export default SunCalendar;