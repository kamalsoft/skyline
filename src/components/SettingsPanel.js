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
    Radio,
    RadioGroup,
} from '@chakra-ui/react';
import { DeleteIcon, WarningTwoIcon } from '@chakra-ui/icons';

function SettingsPanel({ clocks, addClock, removeClock, clockTheme, onThemeChange, timeFormat, onTimeFormatChange, setPrimaryLocation, onClose }) {
    const [formData, setFormData] = useState({
        location: '',
        timeZone: '',
        latitude: '',
        longitude: '',
        countryCode: '',
    });
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const { isOpen: isDuplicateAlertOpen, onOpen: onDuplicateAlertOpen, onClose: onDuplicateAlertClose } = useDisclosure();
    const [clockToDelete, setClockToDelete] = useState(null);
    const toast = useToast();

    const handleInputChange = (e) => {
        setFormData({ ...formData, location: e.target.value });
    };

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
            handleSearch(formData.location);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [formData.location, handleSearch]);

    const resetForm = () => {
        setFormData({
            location: '', timeZone: '', latitude: '', longitude: '', countryCode: ''
        });
        setSearchResults([]);
    };

    const addClockAndClear = () => {
        addClock({ ...formData, latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) });
        resetForm();
        onDuplicateAlertClose(); // Close duplicate alert if it was open
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
        const newClock = {
            location: `${result.name}, ${result.admin1 || ''} ${result.country_code}`.replace(/, {2}/g, ', '),
            timeZone: result.timezone,
            latitude: parseFloat(result.latitude.toFixed(4)),
            longitude: parseFloat(result.longitude.toFixed(4)),
            countryCode: result.country_code.toLowerCase(),
        };

        if (clocks.some(clock => clock.location === newClock.location)) {
            onDuplicateAlertOpen();
        } else {
            addClock(newClock);
            resetForm();
        }
    };

    const handleSetPrimary = (result) => {
        setPrimaryLocation({
            id: 'manual-primary',
            location: `${result.name}, ${result.admin1 || ''} ${result.country_code}`.replace(/, {2}/g, ', '),
            timeZone: result.timezone,
            latitude: result.latitude,
            longitude: result.longitude,
            countryCode: result.country_code.toLowerCase(),
        });
        resetForm();
        onClose(); // Close the drawer after setting the primary location
    };

    return (
        <VStack spacing={8} align="stretch" className="glass" p={5} borderRadius="lg">
            <Box>
                <Heading as="h3" size="md" mb={4}>Add New Clock</Heading>
                <FormControl>
                    <FormLabel>Location Name</FormLabel>
                    <HStack>
                        <Input placeholder="e.g., Tokyo" value={formData.location} onChange={handleInputChange} />
                        {isLoading && <Spinner size="md" />}
                    </HStack>
                </FormControl>
                {searchResults.length > 0 && !isLoading && (
                    <List spacing={2} mt={4} borderWidth="1px" borderRadius="md" p={2}>
                        {searchResults.map((result) => (
                            <Box
                                key={result.id}
                                p={3}
                                borderWidth="1px"
                                borderRadius="md"
                                boxShadow="sm"
                            >
                                <VStack align="stretch">
                                    <Text fontWeight="semibold">{result.name}, {result.admin1 ? `${result.admin1}, ` : ''}{result.country}</Text>
                                    <Text fontSize="sm" color="gray.600">Timezone: {result.timezone} | Lat: {result.latitude.toFixed(2)}, Lon: {result.longitude.toFixed(2)}</Text>
                                    <HStack mt={2}>
                                        <Button size="xs" colorScheme="blue" onClick={() => handleSetPrimary(result)}>Set as Primary</Button>
                                        <Button size="xs" onClick={() => selectLocation(result)}>Add to Clocks</Button>
                                    </HStack>
                                </VStack>
                            </Box>
                        ))}
                    </List>
                )}
                {/* This button is less useful now that actions are on each item */}
                {/* <Button colorScheme="blue" mt={4} onClick={handleAddClock}>Add Clock</Button> */}
            </Box>
            <Box>
                <Heading as="h3" size="md" mb={4}>Appearance</Heading>
                <FormControl>
                    <FormLabel>Analog Clock Style</FormLabel>
                    <RadioGroup onChange={onThemeChange} value={clockTheme}>
                        <HStack spacing={5}>
                            <Radio value="metallic">Copper</Radio>
                            <Radio value="minimalist">Minimalist</Radio>
                        </HStack>
                    </RadioGroup>
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>Time Format</FormLabel>
                    <RadioGroup onChange={onTimeFormatChange} value={timeFormat}>
                        <HStack spacing={5}>
                            <Radio value="12h">12-Hour</Radio>
                            <Radio value="24h">24-Hour</Radio>
                        </HStack>
                    </RadioGroup>
                </FormControl>
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

            <AlertDialog
                isOpen={isDuplicateAlertOpen}
                leastDestructiveRef={undefined}
                onClose={onDuplicateAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            <HStack><WarningTwoIcon color="orange.500" /> <Text>Duplicate Location</Text></HStack>
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            This location is already in your clock list. Do you want to add it again?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onDuplicateAlertClose}>Cancel</Button>
                            <Button colorScheme="blue" onClick={addClockAndClear} ml={3}>Add Anyway</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </VStack>
    );
}

export default SettingsPanel;