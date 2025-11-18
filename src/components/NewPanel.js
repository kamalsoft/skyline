// src/components/NewPanel.js
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function NewPanel({ className, appSettings = {} }) {
    return (
        <Box className={`themed-panel ${className}`} p={4} borderRadius="xl">
            <Heading size="md">New Panel</Heading>
            <Text mt={2}>This is your new dashboard panel!</Text>
        </Box>
    );
}

NewPanel.propTypes = {
    className: PropTypes.string,
    appSettings: PropTypes.object,
};

export default NewPanel;