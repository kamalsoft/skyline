// src/components/settings/GeneralSettings.js
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
  Switch,
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
  Grid,
  Tooltip,
} from '@chakra-ui/react';
import { DeleteIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { useSound } from '../../contexts/SoundContext';
import { useSettings } from '../../contexts/SettingsContext';

function GeneralSettings({ onClosePanel }) {
  const { settings, dispatch } = useSettings();
  const { clocks, appSettings } = settings;
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
  const {
    isOpen: isDuplicateAlertOpen,
    onOpen: onDuplicateAlertOpen,
    onClose: onDuplicateAlertClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteAllAlertOpen,
    onOpen: onDeleteAllAlertOpen,
    onClose: onDeleteAllAlertClose,
  } = useDisclosure();
  const [clockToDelete, setClockToDelete] = useState(null);
  const [clockToAdd, setClockToAdd] = useState(null); // State to hold the clock when confirming a duplicate
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const toast = useToast();
  const { playSound } = useSound();
  const manageClocksHeadingRef = React.useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, location: e.target.value });
  };

  const handleSearch = useCallback(
    async (searchQuery) => {
      if (!searchQuery) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=5&language=en&format=json`
        );
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
    },
    [toast]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (formData.location) {
        handleSearch(formData.location);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.location, handleSearch]);

  const resetForm = () => {
    setFormData({ location: '', timeZone: '', latitude: '', longitude: '', countryCode: '' });
    setSearchResults([]);
  };

  const selectLocation = (result) => {
    const newClock = {
      location: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
      timeZone: result.timezone,
      latitude: parseFloat(result.latitude.toFixed(4)),
      longitude: parseFloat(result.longitude.toFixed(4)),
      countryCode: result.country_code.toLowerCase(),
    };

    if (clocks.some((clock) => clock.location === newClock.location)) {
      setClockToAdd(newClock); // Store the clock object before opening the dialog
      onDuplicateAlertOpen();
    } else {
      playSound('ui-click');
      dispatch({ type: 'ADD_CLOCK', payload: newClock });
      resetForm();
    }
  };

  const handleSetPrimary = (result) => {
    playSound('ui-click');
    dispatch({
      type: 'SET_PRIMARY_LOCATION', payload: {
        id: 'manual-primary',
        location: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
        timeZone: result.timezone,
        latitude: result.latitude,
        longitude: result.longitude,
        countryCode: result.country_code.toLowerCase(),
      }
    });
    resetForm();
    onClosePanel();
  };

  const confirmDelete = (id) => {
    setClockToDelete(id);
    onAlertOpen();
  };

  const executeDelete = () => {
    playSound('ui-click');
    dispatch({ type: 'REMOVE_CLOCK', payload: clockToDelete });
    onAlertClose();
    if (manageClocksHeadingRef.current) {
      manageClocksHeadingRef.current.focus();
    }
  };

  const executeDeleteAll = () => {
    playSound('ui-click');
    setIsDeletingAll(true);
    setTimeout(() => {
      dispatch({ type: 'REMOVE_ALL_CLOCKS' });
      setIsDeletingAll(false);
      onDeleteAllAlertClose();
    }, 500);
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h3" size="md">
        Application
      </Heading>
      <HStack justify="space-between" p={4} className="glass" borderRadius="md">
        <Text fontWeight="bold">Check for updates on startup</Text>
        <Switch
          isChecked={appSettings.autoUpdateCheck}
          onChange={(e) => dispatch({ type: 'SET_APP_SETTINGS', payload: { ...appSettings, autoUpdateCheck: e.target.checked } })}
        />
      </HStack>
      <HStack justify="space-between" p={4} className="glass" borderRadius="md">
        <Text fontWeight="bold">Enable AI Weather Summary</Text>
        <Switch
          isChecked={appSettings.enableAiSummary}
          onChange={(e) => dispatch({ type: 'SET_APP_SETTINGS', payload: { ...appSettings, enableAiSummary: e.target.checked } })}
        />
      </HStack>

      <Heading as="h3" size="md">
        Primary Location
      </Heading>
      <FormControl>
        <FormLabel htmlFor="location-search-input">Location Name</FormLabel>
        <HStack>
          <Input
            id="location-search-input"
            placeholder="e.g., Tokyo"
            value={formData.location}
            onChange={handleInputChange}
          />
          {isLoading && <Spinner size="md" />}
        </HStack>
      </FormControl>
      {searchResults.length > 0 && !isLoading && (
        <List spacing={2} mt={4} borderWidth="1px" borderRadius="md" p={2}>
          {searchResults.map((result) => (
            <Box key={result.id} p={3} borderWidth="1px" borderRadius="md" boxShadow="sm" role="group">
              <VStack align="stretch">
                <Text fontWeight="semibold">
                  {result.name}, {result.admin1 ? `${result.admin1}, ` : ''}
                  {result.country}
                </Text>
                <Text fontSize="sm" color="darkGray">
                  Timezone: {result.timezone} | Lat: {result.latitude.toFixed(2)}, Lon: {result.longitude.toFixed(2)}
                </Text>
                <HStack mt={2}>
                  <Button size="xs" colorScheme="blue" onClick={() => handleSetPrimary(result)}>
                    Set as Primary
                  </Button>
                  <Button size="xs" onClick={() => selectLocation(result)}>
                    Add to Clocks
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </List>
      )}
      <HStack justify="space-between" mb={4}>
        <Heading as="h3" size="md" ref={manageClocksHeadingRef} tabIndex={-1}>
          Manage Clocks
        </Heading>
        <Button
          size="xs"
          colorScheme="red"
          variant="outline"
          onClick={onDeleteAllAlertOpen}
          isDisabled={clocks.length === 0}
          isLoading={isDeletingAll}
        >
          Delete All
        </Button>
      </HStack>
      <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
        {clocks.map((clock) => (
          <Tooltip
            key={clock.id}
            label={
              clock.id === 'current-location'
                ? 'Primary location cannot be deleted here.'
                : `Press 'Delete' key to remove ${clock.location}`
            }
          >
            <VStack
              p={3}
              className="glass"
              borderRadius="lg"
              justify="space-between"
              spacing={3}
              tabIndex={clock.id === 'current-location' ? -1 : 0}
              _focus={{ boxShadow: 'outline', outline: 'none' }}
              onKeyDown={(e) => {
                if (e.key === 'Delete' && clock.id !== 'current-location') {
                  confirmDelete(clock.id);
                }
              }}
            >
              <Text textAlign="center" noOfLines={2} opacity={clock.id === 'current-location' ? 0.6 : 1}>
                {clock.location}
              </Text>
              <IconButton
                icon={<DeleteIcon />}
                size="xs"
                colorScheme="red"
                variant="outline"
                onClick={() => confirmDelete(clock.id)}
                aria-label={`Delete ${clock.location}`}
                isDisabled={clock.id === 'current-location'}
              />
            </VStack>
          </Tooltip>
        ))}
      </Grid>

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={undefined} onClose={onAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent className="glass">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack>
                <WarningTwoIcon color="red.500" /> <Text>Delete Clock</Text>
              </HStack>
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onAlertClose}>Cancel</Button>
              <Button colorScheme="red" onClick={executeDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={isDuplicateAlertOpen} leastDestructiveRef={undefined} onClose={onDuplicateAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent className="glass">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack>
                <WarningTwoIcon color="orange.500" /> <Text>Duplicate Location</Text>
              </HStack>
            </AlertDialogHeader>
            <AlertDialogBody>This location is already in your clock list. Do you want to add it again?</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDuplicateAlertClose}>Cancel</Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  dispatch({ type: 'ADD_CLOCK', payload: clockToAdd });
                  playSound('ui-click');
                  onDuplicateAlertClose();
                }}
                ml={3}
              >
                Add Anyway
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={isDeleteAllAlertOpen} leastDestructiveRef={undefined} onClose={onDeleteAllAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent className="glass">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack>
                <WarningTwoIcon color="red.500" /> <Text>Delete All Clocks</Text>
              </HStack>
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete all clocks? This action cannot be undone.</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteAllAlertClose}>Cancel</Button>
              <Button colorScheme="red" onClick={executeDeleteAll} ml={3}>
                Delete All
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}

export default GeneralSettings;
