// src/components/HistoryModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    VStack,
    HStack,
    Text,
    Input,
    Spinner,
    Alert,
    AlertIcon,
    FormLabel,
    FormControl,
    AlertDescription,
    Box,
    useColorModeValue,
} from '@chakra-ui/react';

import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend,
} from 'recharts';

const getTwoDaysAgo = () => {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return twoDaysAgo.toISOString().split('T')[0];
};

const getSevenDaysAgo = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    return sevenDaysAgo.toISOString().split('T')[0];
};

function HistoryModal({ isOpen, onClose, latitude, longitude }) {
    const [startDate, setStartDate] = useState(getSevenDaysAgo()); // Default start date remains the same
    const [endDate, setEndDate] = useState(getTwoDaysAgo()); // Default end date is now 2 days ago
    const [historicalData, setHistoricalData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Define color mode values at the top level to adhere to the Rules of Hooks
    const tickColor = useColorModeValue('gray.600', 'gray.400');
    const labelColor = useColorModeValue('gray.600', 'gray.400');
    const tooltipBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
    const tooltipBorder = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        if (!isOpen || !startDate || !endDate) return;

        // Validate date range
        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date cannot be after end date.');
            setHistoricalData(null); // Clear previous data
            return;
        }

        const fetchHistoricalWeather = async () => {
            setLoading(true);
            setError(null);
            setHistoricalData(null);
            try {
                const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
                const response = await axios.get(apiUrl);
                if (response.data && response.data.daily) {
                    const dailyData = response.data.daily;
                    const processedData = dailyData.time.map((time, index) => ({
                        time: time,
                        weathercode: dailyData.weathercode[index],
                        temperature_2m_max: dailyData.temperature_2m_max[index],
                        temperature_2m_min: dailyData.temperature_2m_min[index],
                        precipitation_sum: dailyData.precipitation_sum[index],
                    }));
                    setHistoricalData(processedData);
                } else {
                    throw new Error('No historical data available for this date.');
                }
            } catch (err) {
                console.error('Failed to fetch historical weather:', err);
                if (err.response && err.response.status === 404) {
                    setError('Data not found. The most recent historical data may still be processing. Please try an earlier date.');
                } else {
                    setError('Could not retrieve weather data. Please check your connection and try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if dates are valid
        if (new Date(startDate) <= new Date(endDate)) {
            fetchHistoricalWeather();
        }
    }, [isOpen, startDate, endDate, latitude, longitude]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: 'full', md: '4xl' }}>
            <ModalOverlay />
            <ModalContent className="glass">
                <ModalHeader>Weather History</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <Text>Select a date range to view historical weather:</Text>
                        <HStack>
                            <FormControl flex="1">
                                <FormLabel htmlFor="start-date">Start Date</FormLabel>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    max={endDate} // Start date cannot be after end date
                                />
                            </FormControl>
                            <FormControl flex="1">
                                <FormLabel htmlFor="end-date">End Date</FormLabel>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    max={getTwoDaysAgo()} // End date cannot be yesterday or later
                                />
                            </FormControl>
                        </HStack>
                        {loading && (
                            <HStack justify="center" p={6}>
                                <Spinner />
                                <Text>Fetching historical data...</Text>
                            </HStack>
                        )}
                        {error && (
                            <Alert status="error" borderRadius="md">
                                <AlertIcon />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {historicalData && historicalData.length > 0 && (
                            <Box h="400px" w="100%" mt={4}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={historicalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F6AD55" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#4299E1" stopOpacity={0.4} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="time"
                                            tickFormatter={(timeStr) => new Date(timeStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            stroke={tickColor}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: labelColor }}
                                            stroke={tickColor}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            label={{ value: 'Precipitation (mm)', angle: 90, position: 'insideRight', fill: labelColor }}
                                            stroke={tickColor}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: tooltipBg,
                                                border: '1px solid',
                                                borderColor: tooltipBorder,
                                                borderRadius: 'md',
                                            }}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        />
                                        <Legend />
                                        <Area
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="temperature_2m_max"
                                            name="Max Temp"
                                            stroke="#F6AD55"
                                            fill="url(#colorTemp)"
                                        />
                                        <Area yAxisId="left" type="monotone" dataKey="temperature_2m_min" name="Min Temp" stroke="#4299E1" fill="url(#colorTemp)" />
                                        <Bar yAxisId="right" dataKey="precipitation_sum" name="Precipitation" barSize={20} fill="#63B3ED" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Text fontSize="xs" color="gray.500">
                        Historical data from Open-Meteo
                    </Text>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default HistoryModal;