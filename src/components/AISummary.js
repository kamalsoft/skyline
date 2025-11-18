// src/components/AISummary.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, HStack, Text, Spinner } from '@chakra-ui/react';
import { generateWeatherSummary, generateActivitySuggestion } from '../utils/aiSummaryUtils';

function AISummary({ weatherData, isEnabled }) {
    const [summary, setSummary] = useState('');
    const [suggestion, setSuggestion] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isEnabled && weatherData) {
            setIsGenerating(true);
            const timer = setTimeout(() => {
                setSummary(generateWeatherSummary(weatherData));
                setSuggestion(generateActivitySuggestion(weatherData));
                setIsGenerating(false);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setSummary('');
            setSuggestion(null);
        }
    }, [weatherData, isEnabled]);

    if (!isEnabled) {
        return null;
    }

    return (
        <>
            {isGenerating ? (
                <HStack className="glass" p={3} borderRadius="md" w="full" justify="center">
                    <Spinner size="xs" />
                    <Text fontSize="sm" fontStyle="italic">Generating AI weather brief...</Text>
                </HStack>
            ) : (
                summary && <Box className="glass" p={3} borderRadius="md" w="full">
                    <Text fontSize="sm" fontStyle="italic">{summary}</Text>
                </Box>
            )}
            {suggestion && !isGenerating && (
                <Box className="glass" p={3} borderRadius="md" w="full">
                    <HStack>
                        <Box as={suggestion.icon} size="20px" color="accentPink" />
                        <Text fontSize="sm" fontWeight="bold">Suggestion:{' '}<Text as="span" fontWeight="normal">{suggestion.text}</Text></Text>
                    </HStack>
                </Box>
            )}
        </>
    );
}

AISummary.propTypes = {
    weatherData: PropTypes.object,
    isEnabled: PropTypes.bool.isRequired,
};

export default AISummary;