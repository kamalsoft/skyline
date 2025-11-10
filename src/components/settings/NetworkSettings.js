// src/components/settings/NetworkSettings.js
import React from 'react';
import {
    VStack,
    Heading,
    Text,
    Box,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from '@chakra-ui/react';
import { useSettings } from '../../contexts/SettingsContext';

function NetworkSettings() {
    const { settings, dispatch } = useSettings();
    const { appSettings } = settings;

    const handleIntervalChange = (value) => {
        dispatch({ type: 'SET_APP_SETTINGS', payload: { ...appSettings, weatherRefreshInterval: value } });
    };

    return (
        <VStack spacing={6} align="stretch">
            <Heading size="md" mb={4}>
                Network Settings
            </Heading>
            <Box>
                <Text mb={2} fontWeight="bold">
                    Weather Data Refresh Interval: {appSettings.weatherRefreshInterval || 10} minutes
                </Text>
                <Slider
                    aria-label="Weather data refresh interval slider"
                    value={appSettings.weatherRefreshInterval || 10}
                    min={5}
                    max={60}
                    step={5}
                    onChangeEnd={handleIntervalChange}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Text fontSize="xs" color="gray.500" mt={2}>
                    Controls how often the weather data for the main card is automatically updated. Shorter intervals may use more data.
                </Text>
            </Box>
        </VStack>
    );
}

export default NetworkSettings;