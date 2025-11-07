// src/components/SettingsPanel.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    HStack,
    Heading,
    Text,
    Spinner,
    Tooltip,
    IconButton,
    useToast,
    List,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon, WarningTwoIcon } from '@chakra-ui/icons';

function SettingsPanel({ clocks, addClock, removeClock }) {
    const [location, setLocation] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const [clockToDelete, setClockToDelete] = useState(null);
    const toast = useToast();

    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery) {
            setSearchResults([]);
            return;
        };
        setIsLoading(true);
        try {
            const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=5&language=en&format=json`);
            setSearchResults(response.data.results || []);
        } catch (error) {
            toast({
                title: 'Error fetching location.',
                description: 'Could not fetch coordinates for the specified location.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch(location);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [location, handleSearch]);

    const handleAddClock = () => {
        if (!location || !timeZone || !latitude || !longitude) {
            toast({
                title: 'Missing Information',
                description: 'Please search for a location and select one from the list.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        addClock({
            location,
            timeZone,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            countryCode,
        });
        setLocation('');
        setTimeZone('');
        setLatitude('');
        setLongitude('');
        setSearchResults([]);
    };

    const confirmDelete = (id) => {
        setClockToDelete(id);
        onAlertOpen();
    };

    const executeDelete = () => {
        removeClock(clockToDelete);
        onAlertClose();
    }


    const selectLocation = (result) => {
        setLocation(`${result.name}, ${result.admin1 || ''} ${result.country_code}`);
        setTimeZone(result.timezone);
        setLatitude(result.latitude.toFixed(4));
        setLongitude(result.longitude.toFixed(4));
        setCountryCode(result.country_code.toLowerCase());
        setSearchResults([]);
    }

    return (
        <VStack spacing={8} align="stretch" className="glass" p={5} borderRadius="lg">
            <Box>
                <Heading as="h3" size="md" mb={4}>Add New Clock</Heading>
                <FormControl>
                    <FormLabel>Location Name</FormLabel>
                    <HStack>
                        <Input placeholder="e.g., Tokyo" value={location} onChange={(e) => setLocation(e.target.value)} />
                        {isLoading && <Spinner size="md" />}
                    </HStack>
                </FormControl>
                {searchResults.length > 0 && !isLoading && (
                    <List spacing={2} mt={4} borderWidth="1px" borderRadius="md" p={2}>
                        {searchResults.map((result) => (
                            <Tooltip key={result.id} label="Click to select this location" aria-label="Select location tooltip">
                                <Box
                                    p={3}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    boxShadow="sm"
                                    _hover={{ bg: 'blue.50', borderColor: 'blue.200', boxShadow: 'md', cursor: 'pointer' }}
                                    onClick={() => selectLocation(result)}
                                >
                                    <Text fontWeight="semibold">{result.name}, {result.admin1 ? `${result.admin1}, ` : ''}{result.country}</Text>
                                    <Text fontSize="sm" color="gray.600">Timezone: {result.timezone} | Lat: {result.latitude.toFixed(2)}, Lon: {result.longitude.toFixed(2)}</Text>
                                </Box>
                            </Tooltip>
                        ))}
                    </List>
                )}
                <Button colorScheme="blue" mt={4} onClick={handleAddClock}>Add Clock</Button>
            </Box>
            <Box>
                <Heading as="h3" size="md" mb={4}>Manage Clocks</Heading>
                {clocks.map((clock) => (
                    <HStack
                        key={clock.id}
                        justify="space-between"
                        p={2}
                        borderWidth="1px"
                        borderRadius="md"
                        mb={2}
                        tabIndex={0} // Make it focusable
                        _focus={{ boxShadow: 'outline', outline: 'none' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Delete') {
                                confirmDelete(clock.id);
                            }
                        }}
                    >
                        <Text>{clock.location}</Text>
                        <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => confirmDelete(clock.id)} aria-label={`Delete ${clock.location}`} />
                    </HStack>
                ))}
            </Box>

            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={undefined}
                onClose={onAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            <HStack><WarningTwoIcon color="red.500" /> <Text>Delete Clock</Text></HStack>
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onAlertClose}>Cancel</Button>
                            <Button colorScheme="red" onClick={executeDelete} ml={3}>Delete</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </VStack>
    );
}

export default SettingsPanel;