// src/components/DigitalClock.js
import React from 'react';
import { Text, VStack } from '@chakra-ui/react';

function DigitalClock({ time, compact, timeFormat, timeZone }) {
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: timeFormat === '12h',
        timeZone: timeZone,
    };

    if (compact) {
        return (
            <Text fontSize="md">{time.format(timeFormat === '12h' ? 'hh:mm:ss A' : 'HH:mm:ss')}</Text>
        );
    }

    return (
        <VStack spacing={0}>
            <Text fontSize="2xl">{time.format(timeFormat === '12h' ? 'hh:mm:ss A' : 'HH:mm:ss')}</Text>
            <Text fontSize="md">{time.format('MMMM D, YYYY')}
            </Text>
        </VStack>
    );
}

export default DigitalClock;