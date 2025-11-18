// src/components/TamilPanchangamPanel.js
import React, { useState, useEffect } from 'react';
import { Heading, Text, VStack, Divider, Box } from '@chakra-ui/react';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import PanchangamSkeleton from './skeletons/PanchangamSkeleton';
import { MhahPanchang } from 'mhah-panchang';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Calculates Rahu Kalam based on sunrise and sunset times for a given date.
 * @param {Date} sunrise - The sunrise time for the day.
 * @param {Date} sunset - The sunset time for the day.
 * @param {Date} date - The current date.
 * @returns {string} The formatted Rahu Kalam time range.
 */
function calculateRahuKalam(sunrise, sunset, date) {
    const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ...

    // Rahu Kalam occurs during one of 8 segments of the day.
    // The segment number depends on the day of the week.
    const rahuKalamPeriods = {
        1: 2, // Monday: 2nd segment
        6: 3, // Saturday: 3rd segment
        5: 4, // Friday: 4th segment
        3: 5, // Wednesday: 5th segment
        4: 6, // Thursday: 6th segment
        2: 7, // Tuesday: 7th segment
        0: 8, // Sunday: 8th segment
    };

    const periodNumber = rahuKalamPeriods[dayOfWeek];
    if (!periodNumber) return "N/A";

    const dayDurationMs = sunset.getTime() - sunrise.getTime();
    const segmentDurationMs = dayDurationMs / 8;

    const rahuKalamStartMs = sunrise.getTime() + (segmentDurationMs * (periodNumber - 1));
    const rahuKalamEndMs = sunrise.getTime() + (segmentDurationMs * periodNumber);

    const formatTime = (ms) => new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return `${formatTime(rahuKalamStartMs)} - ${formatTime(rahuKalamEndMs)}`;
}

/**
 * Calculates Yamagandam based on sunrise and sunset times for a given date.
 * @param {Date} sunrise - The sunrise time for the day.
 * @param {Date} sunset - The sunset time for the day.
 * @param {Date} date - The current date.
 * @returns {string} The formatted Yamagandam time range.
 */
function calculateYamagandam(sunrise, sunset, date) {
    const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ...

    // Yamagandam occurs during one of 8 segments of the day.
    const yamagandamPeriods = {
        4: 1, // Thursday: 1st segment
        3: 2, // Wednesday: 2nd segment
        2: 3, // Tuesday: 3rd segment
        1: 4, // Monday: 4th segment
        0: 5, // Sunday: 5th segment
        6: 6, // Saturday: 6th segment
        5: 7, // Friday: 7th segment
    };

    const periodNumber = yamagandamPeriods[dayOfWeek];
    if (!periodNumber) return "N/A";

    const dayDurationMs = sunset.getTime() - sunrise.getTime();
    const segmentDurationMs = dayDurationMs / 8;

    const startMs = sunrise.getTime() + (segmentDurationMs * (periodNumber - 1));
    const endMs = sunrise.getTime() + (segmentDurationMs * periodNumber);

    const formatTime = (ms) => new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return `${formatTime(startMs)} - ${formatTime(endMs)}`;
}

function TamilPanchangamPanel({ primaryLocation, className, appSettings = {} }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const [rahuKalam, setRahuKalam] = useState('');
    const [yamagandam, setYamagandam] = useState('');

    useEffect(() => {
        async function loadData() {
            if (!primaryLocation) return;

            // Use the client-side library instead of a network request
            const panchangamEngine = new MhahPanchang();
            const today = new Date();
            const panchangamData = panchangamEngine.calendar(today, primaryLocation.latitude, primaryLocation.longitude);

            setData(panchangamData);

            // Calculate Rahu Kalam using sunrise/sunset from the library
            if (panchangamData.sunRise && panchangamData.sunSet) {
                const rahuKalamTime = calculateRahuKalam(panchangamData.sunRise, panchangamData.sunSet, today);
                setRahuKalam(rahuKalamTime);
                const yamagandamTime = calculateYamagandam(panchangamData.sunRise, panchangamData.sunSet, today);
                setYamagandam(yamagandamTime);
            }
            setIsLoading(false);
        }
        loadData();

        // Set up a timer to update the current time every second
        const timer = setInterval(() => {
            if (primaryLocation) {
                setCurrentTime(dayjs().tz(primaryLocation.timeZone).format('h:mm:ss A'));
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on unmount
    }, [primaryLocation]);

    if (isLoading) {
        return <PanchangamSkeleton />;
    }

    return (
        <Box className={`themed-panel ${appSettings.uiEffect} ${className}`} p={4} borderRadius="xl" w="full">
            <Heading size="md" mb={4}>
                Tamil Panchangam
            </Heading>
            {data ? (
                <VStack align="stretch" spacing={3}>
                    <Text><b>{dayjs().tz(primaryLocation.timeZone).format('MMMM D, YYYY')}</b></Text>
                    <Text fontWeight="bold" fontSize="lg">{currentTime}</Text>
                    <Divider />
                    <Text><b>Tithi:</b> {data.Tithi?.name}</Text>
                    <Text><b>Nakshatra:</b> {data.Nakshatra?.name}</Text>
                    <Text><b>Rahu Kalam:</b> {rahuKalam}</Text>
                    <Text><b>Yamagandam:</b> {yamagandam}</Text>
                </VStack>
            ) : <Text>Could not load Panchangam data.</Text>}
        </Box>
    );
}

export default TamilPanchangamPanel;