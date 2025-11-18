// src/components/NewPanel.js
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

function NewPanel({ className }) {
    return (
        <Box className={`glass ${className}`} p={4} borderRadius="xl">
            <Heading size="md">New Panel</Heading>
            <Text mt={2}>This is your new dashboard panel!</Text>
        </Box>
    );
}

export default NewPanel;