// src/components/LocationSearch.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Input, List, ListItem, Box, Text, Spinner, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import { debounce } from 'lodash';

function LocationSearch({ onLocationSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue('whiteAlpha.800', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600');

  // Debounced search function to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 3) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=5&language=en&format=json`
        );
        if (response.data && response.data.results) {
          setResults(response.data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Geocoding API error:', err);
        setError('Failed to fetch locations. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300), // 300ms delay
    []
  );

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleSelect = (location) => {
    onLocationSelect({
      id: location.id,
      location: `${location.name}, ${location.admin1 || location.country}`,
      timeZone: location.timezone,
      latitude: location.latitude,
      longitude: location.longitude,
      countryCode: location.country_code.toLowerCase(),
    });
    setQuery('');
    setResults([]);
  };

  return (
    <VStack align="stretch" position="relative">
      <Input placeholder="Search for a city..." value={query} onChange={handleChange} autoComplete="off" />
      {loading && <Spinner size="sm" position="absolute" right="10px" top="10px" />}
      {(results.length > 0 || error) && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          bg={bgColor}
          boxShadow="lg"
          borderRadius="md"
          mt={1}
          p={2}
          zIndex="dropdown"
        >
          {error ? (
            <Text color="red.500" p={2}>
              {error}
            </Text>
          ) : (
            <List spacing={1}>
              {results.map((location) => (
                <ListItem
                  key={location.id}
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: hoverBgColor, cursor: 'pointer' }}
                  onClick={() => handleSelect(location)}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="bold">
                      {location.name}, {location.country}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {location.admin1}
                    </Text>
                  </HStack>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
    </VStack>
  );
}

export default LocationSearch;
