// src/components/SunCalendar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Heading, Grid, Text, HStack, IconButton, Spinner, VStack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { WiSunrise, WiSunset } from 'react-icons/wi';

function SunCalendar({ latitude, longitude }) {
  const [date, setDate] = useState(new Date());
  const [sunData, setSunData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(0);

  useEffect(() => {
    const fetchSunData = async () => {
      setLoading(true);
      const year = date.getFullYear();
      const month = date.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      setFirstDayOfMonth(new Date(year, month, 1).getDay());

      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&start_date=${startDate}&end_date=${endDate}&timezone=auto`
        );
        setSunData(response.data.daily);
      } catch (error) {
        console.error('Error fetching sunrise/sunset data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSunData();
  }, [date, latitude, longitude]);

  const changeMonth = (offset) => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={4}>
        <IconButton icon={<ChevronLeftIcon />} onClick={() => changeMonth(-1)} aria-label="Previous month" />
        <Heading size="md">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</Heading>
        <IconButton icon={<ChevronRightIcon />} onClick={() => changeMonth(1)} aria-label="Next month" />
      </HStack>
      {loading ? (
        <VStack justify="center" minH="200px">
          <Spinner />
        </VStack>
      ) : (
        <Grid templateColumns="repeat(7, 1fr)" gap={2}>
          {weekdays.map((day) => (
            <Text key={day} fontWeight="bold" textAlign="center" fontSize="sm">
              {day}
            </Text>
          ))}
          {/* Render empty boxes for days before the 1st of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <Box key={`empty-${i}`} />
          ))}
          {sunData.time &&
            sunData.time.map((day, index) => {
              const dayDate = new Date(day);
              const isToday =
                dayDate.getFullYear() === today.getFullYear() &&
                dayDate.getMonth() === today.getMonth() &&
                dayDate.getDate() === today.getDate();
              return (
                <VStack
                  key={day}
                  p={2}
                  className="glass"
                  borderRadius="lg"
                  spacing={1}
                  border={isToday ? '2px solid' : '1px solid'}
                  borderColor={isToday ? 'accentPink' : 'transparent'}
                >
                  <Text fontWeight="bold" fontSize="md">
                    {dayDate.getDate()}
                  </Text>
                  <HStack>
                    <Box as={WiSunrise} size="20px" color="yellow.400" />
                    <Text fontSize="xs">
                      {new Date(sunData.sunrise[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </HStack>
                  <HStack>
                    <Box as={WiSunset} size="20px" color="orange.400" />
                    <Text fontSize="xs">
                      {new Date(sunData.sunset[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </HStack>
                </VStack>
              );
            })}
        </Grid>
      )}
    </Box>
  );
}

export default SunCalendar;
