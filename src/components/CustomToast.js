// src/components/CustomToast.js
import React from 'react';
import { Box, HStack, VStack, Text, Button, Icon } from '@chakra-ui/react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const statusConfig = {
    info: { icon: FaInfoCircle, color: 'blue.500' },
    success: { icon: FaCheckCircle, color: 'green.500' },
    warning: { icon: FaExclamationTriangle, color: 'orange.500' },
    error: { icon: FaTimesCircle, color: 'red.500' },
};

function CustomToast({ title, description, status = 'info', action }) {
    const { icon, color } = statusConfig[status] || statusConfig.info;

    return (
        <Box color="white" p={4} bg={color} borderRadius="md" boxShadow="lg">
            <HStack align="start">
                <Icon as={icon} mt={1} boxSize="20px" />
                <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{title}</Text>
                    {description && <Text fontSize="sm">{description}</Text>}
                    {action && (
                        <Button
                            size="sm"
                            colorScheme="whiteAlpha"
                            variant="outline"
                            onClick={action.onClick}
                            mt={2}
                        >
                            {action.label}
                        </Button>
                    )}
                </VStack>
            </HStack>
        </Box>
    );
}

export default CustomToast;