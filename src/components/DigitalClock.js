// src/components/DigitalClock.js
import React from 'react';
import { Text, VStack, HStack } from '@chakra-ui/react';

function DigitalClock({ time, timeFormat }) {
  if (!time) {
    return null;
  }

  return (
    <HStack align="baseline" spacing={2}>
      <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
        {time.format(timeFormat === '12h' ? 'h:mm' : 'HH:mm')}
      </Text>
      <Text fontSize="xl" fontWeight="medium" color="gray.400">
        {time.format('A')}
      </Text>
    </HStack>
  );
}

export default DigitalClock;
