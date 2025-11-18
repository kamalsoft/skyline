// src/components/NewPanelSkeleton.js
import React from 'react';
import { Box, Skeleton, SkeletonText, useColorModeValue } from '@chakra-ui/react';

function NewPanelSkeleton() {
    const startColor = useColorModeValue('gray.200', 'gray.700');
    const endColor = useColorModeValue('gray.400', 'gray.600');

    return (
        <Box className="themed-panel" p={4} borderRadius="xl">
            <Skeleton height="24px" width="120px" mb={4} startColor={startColor} endColor={endColor} />
            <SkeletonText noOfLines={2} spacing="4" startColor={startColor} endColor={endColor} />
        </Box>
    );
}

export default NewPanelSkeleton;