// src/components/CurrentWeather.js
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, HStack, VStack, Text, Badge } from '@chakra-ui/react';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';
import { getAqiColor } from '../utils/aqiUtils';

function CurrentWeather({ current, hourly, airQuality, displayTemp }) {
    const currentHourIndex = hourly ? hourly.time.findIndex((time) => new Date(time) >= new Date()) : -1;
    const currentApparentTemperature = currentHourIndex !== -1 ? hourly.apparent_temperature[currentHourIndex] : undefined;
    const currentHumidity = currentHourIndex !== -1 ? hourly.relative_humidity_2m[currentHourIndex] : undefined;

    return (
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
            </Grid>
        </Box>
    );
}

CurrentWeather.propTypes = {
    current: PropTypes.object.isRequired,
    hourly: PropTypes.object,
    airQuality: PropTypes.object,
    displayTemp: PropTypes.func.isRequired,
};

CurrentWeather.defaultProps = {
    hourly: null,
    airQuality: null,
};

export default CurrentWeather;