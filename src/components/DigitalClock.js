// src/components/DigitalClock.js
import React from 'react';
import { Text, VStack } from '@chakra-ui/react';

function DigitalClock({ time, compact }) {
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };

    if (compact) {
        return (
            <Text fontSize="md">{new Date(time).toLocaleString('en-US', timeOptions)}</Text>
        );
    }

    return (
        <VStack spacing={0}>
            <Text fontSize="2xl">{time.toLocaleString('en-US', timeOptions)}</Text>
            <Text fontSize="md">{time.toLocaleDateString('en-US', { // The date part is now also derived from the corrected time object
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}
            </Text>
        </VStack>
    );
}

export default DigitalClock;