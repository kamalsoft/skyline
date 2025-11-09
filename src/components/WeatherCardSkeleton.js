// src/components/WeatherCardSkeleton.js
import React from 'react';
import { Box, VStack, HStack, Skeleton, SkeletonCircle } from '@chakra-ui/react';

function WeatherCardSkeleton() {
  return (
    <Box className="glass" p={4} borderRadius="lg">
      <VStack justify="center" mb={4}>
        <Skeleton height="32px" width="200px" />
        <Skeleton height="20px" width="150px" />
      </VStack>
      <VStack spacing={6} align="stretch">
        {/* Current Weather Skeleton */}
        <HStack justify="space-around" align="center" className="glass" p={4} borderRadius="md">
          <HStack>
            <SkeletonCircle size="96px" />
            <Skeleton height="72px" width="100px" />
          </HStack>
          <VStack align="flex-start" spacing={3}>
            <Skeleton height="20px" width="120px" />
            <Skeleton height="20px" width="100px" />
            <Skeleton height="20px" width="110px" />
            <Skeleton height="30px" width="70px" />
          </VStack>
        </HStack>

        {/* Hourly Forecast Skeleton */}
        <Box>
          <Skeleton height="24px" width="80px" mb={2} />
          <HStack spacing={4}>
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
                <Skeleton height="20px" width="50px" />
                <SkeletonCircle size="32px" />
                <Skeleton height="20px" width="60px" />
              </VStack>
            ))}
          </HStack>
        </Box>

        {/* Daily Forecast Skeleton */}
        <Box>
          <Skeleton height="24px" width="60px" mb={2} />
          <HStack spacing={4}>
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
                <Skeleton height="20px" width="40px" />
                <SkeletonCircle size="32px" />
                <Skeleton height="20px" width="80px" />
              </VStack>
            ))}
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default WeatherCardSkeleton;
