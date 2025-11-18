// src/components/WeatherCardHeader.js
import React from 'react';
import PropTypes from 'prop-types';
import { Heading, Text, VStack } from '@chakra-ui/react';

function WeatherCardHeader({ locationName, lastUpdated }) {
    return (
        <VStack justify="center" mb={4}>
            <Heading as="h3" size="lg" noOfLines={1} title={locationName}>
                {locationName}
            </Heading>
            {lastUpdated && (
                <Text fontSize="xs" color="gray.500">
                    Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            )}
        </VStack>
    );
}

WeatherCardHeader.propTypes = {
    locationName: PropTypes.string.isRequired,
    lastUpdated: PropTypes.instanceOf(Date),
};

export default WeatherCardHeader;