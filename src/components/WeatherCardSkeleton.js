// src/components/WeatherCardSkeleton.js
import React from 'react';
import { Box, VStack, HStack, Skeleton, SkeletonCircle, useColorModeValue } from '@chakra-ui/react';

function WeatherCardSkeleton() {
  const startColor = useColorModeValue('gray.200', 'gray.700');
  const endColor = useColorModeValue('gray.400', 'gray.600');

  return (
    <Box className="themed-panel" p={4} borderRadius="lg">
      <VStack justify="center" mb={4}>
        <Skeleton height="32px" width="200px" startColor={startColor} endColor={endColor} />
        <Skeleton height="20px" width="150px" startColor={startColor} endColor={endColor} />
      </VStack>
      <VStack spacing={6} align="stretch">
        {/* Current Weather Skeleton */}
        <HStack justify="space-around" align="center" p={4} borderRadius="md">
          <HStack>
            <SkeletonCircle size="96px" startColor={startColor} endColor={endColor} />
            <Skeleton height="72px" width="100px" startColor={startColor} endColor={endColor} />
          </HStack>
          <VStack align="flex-start" spacing={3}>
            <Skeleton height="20px" width="120px" startColor={startColor} endColor={endColor} />
            <Skeleton height="20px" width="100px" startColor={startColor} endColor={endColor} />
            <Skeleton height="20px" width="110px" startColor={startColor} endColor={endColor} />
            <Skeleton height="30px" width="70px" startColor={startColor} endColor={endColor} />
          </VStack>
        </HStack>

        {/* Hourly Forecast Skeleton */}
        <Box>
          <Skeleton height="24px" width="80px" mb={2} startColor={startColor} endColor={endColor} />
          <HStack spacing={4} overflow="hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <VStack
                key={index}
                spacing={2}
                p={3}
                borderRadius="md"
                minW="90px"
                borderWidth="1px"
                borderColor="transparent"
              >
                <Skeleton height="20px" width="50px" startColor={startColor} endColor={endColor} />
                <SkeletonCircle size="32px" startColor={startColor} endColor={endColor} />
                <Skeleton height="20px" width="60px" startColor={startColor} endColor={endColor} />
              </VStack>
            ))}
          </HStack>
        </Box>

        {/* Daily Forecast Skeleton */}
        <Box>
          <Skeleton height="24px" width="60px" mb={2} startColor={startColor} endColor={endColor} />
          <HStack spacing={4} overflow="hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <VStack
                key={index}
                spacing={2}
                p={3}
                borderRadius="md"
                minW="90px"
                borderWidth="1px"
                borderColor="transparent"
              >
                <Skeleton height="20px" width="40px" startColor={startColor} endColor={endColor} />
                <SkeletonCircle size="32px" startColor={startColor} endColor={endColor} />
                <Skeleton height="20px" width="80px" startColor={startColor} endColor={endColor} />
              </VStack>
            ))}
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default WeatherCardSkeleton;
