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
    Grid,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Tab,
    Switch,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Icon,
    Tooltip,
} from '@chakra-ui/react';
import { DeleteIcon, WarningTwoIcon, CloseIcon } from '@chakra-ui/icons';
import { motion, useDragControls } from 'framer-motion';
import { useSound } from '../contexts/SoundContext';
import { FaPalette, FaMagic, FaVolumeUp, FaVolumeMute, FaMapMarkerAlt } from 'react-icons/fa';

function SettingsPanel({ clocks, addClock, removeClock, removeAllClocks, clockTheme, onThemeChange, timeFormat, onTimeFormatChange, background, onBackgroundChange, setPrimaryLocation, themePreference, onThemePreferenceChange, animationSettings, onAnimationSettingsChange, displaySettings, onDisplaySettingsChange, onClose }) {
    const [size, setSize] = useState({ width: 550, height: 700 });
    const dragControls = useDragControls();
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
    const { isOpen: isDeleteAllAlertOpen, onOpen: onDeleteAllAlertOpen, onClose: onDeleteAllAlertClose } = useDisclosure();
    const [clockToDelete, setClockToDelete] = useState(null);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [bgUrl, setBgUrl] = useState(background.type === 'image' ? background.value : '');
    const toast = useToast();
    const { settings: soundSettings, updateSettings: updateSoundSettings, playSound } = useSound();
    const [activeTab, setActiveTab] = useState(0);

    const handleSoundSettingChange = (key, value) => {
        updateSoundSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleAnimationSettingChange = (key, value) => {
        onAnimationSettingsChange({ ...animationSettings, [key]: value });
    };

    const handleDisplaySettingChange = (key, value) => {
        onDisplaySettingsChange({ ...displaySettings, [key]: value });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, location: e.target.value });
    };

    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }
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
        playSound('ui-click');
        addClock({ ...formData, latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) });
        resetForm();
        onDuplicateAlertClose(); // Close duplicate alert if it was open
    };

    const confirmDelete = (id) => {
        setClockToDelete(id);
        onAlertOpen();
    };

    const executeDelete = () => {
        playSound('ui-click');
        removeClock(clockToDelete);
        onAlertClose();
    }

    const executeDeleteAll = () => {
        playSound('ui-click');
        setIsDeletingAll(true);
        // Simulate a short delay for visual feedback
        setTimeout(() => {
            removeAllClocks();
            setIsDeletingAll(false);
            onDeleteAllAlertClose();
        }, 500);
    };


    const selectLocation = (result) => {
        const newClock = {
            location: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
            timeZone: result.timezone,
            latitude: parseFloat(result.latitude.toFixed(4)),
            longitude: parseFloat(result.longitude.toFixed(4)),
            countryCode: result.country_code.toLowerCase(),
        };

        if (clocks.some(clock => clock.location === newClock.location)) {
            onDuplicateAlertOpen();
        } else {
            playSound('ui-click');
            addClock(newClock);
            resetForm();
        }
    };

    const handleSetPrimary = (result) => {
        playSound('ui-click');
        setPrimaryLocation({
            id: 'manual-primary',
            location: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
            timeZone: result.timezone,
            latitude: result.latitude,
            longitude: result.longitude,
            countryCode: result.country_code.toLowerCase(),
        });
        resetForm();
        onClose(); // Close the drawer after setting the primary location
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -100 }}
            drag
            dragListener={false}
            dragControls={dragControls}
            dragMomentum={false}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                width: size.width,
                height: size.height,
                zIndex: 1400,
            }}
        >
            <VStack
                spacing={4}
                align="stretch"
                className="glass"
                p={4}
                borderRadius="xl"
                h="100%"
                boxShadow="2xl"
            >
                <Box
                    cursor="move"
                    onPointerDown={(e) => dragControls.start(e)}
                    pb={2}
                    borderBottomWidth="1px"
                    borderColor="whiteAlpha.300"
                >
                    <HStack justify="space-between">
                        <Heading as="h3" size="md">Settings</Heading>
                        <IconButton
                            icon={<CloseIcon />}
                            size="sm"
                            variant="ghost"
                            onClick={onClose}
                            aria-label="Close settings"
                        />
                    </HStack>
                </Box>
                <Tabs isFitted variant="enclosed" index={activeTab} onChange={(index) => setActiveTab(index)} flex="1" display="flex" flexDirection="column" overflow="hidden">
                    <TabList>
                        <Tooltip label="General Settings" placement="top">
                            <Tab><Icon as={FaMapMarkerAlt} mr={2} /> General</Tab>
                        </Tooltip>
                        <Tooltip label="Appearance Settings" placement="top">
                            <Tab><Icon as={FaPalette} mr={2} /> Appearance</Tab>
                        </Tooltip>
                        <Tooltip label="Animation & Effects Settings" placement="top">
                            <Tab><Icon as={FaMagic} mr={2} /> Effects</Tab>
                        </Tooltip>
                        <Tooltip label="Audio Settings" placement="top">
                            <Tab><Icon as={FaVolumeUp} mr={2} /> Audio</Tab>
                        </Tooltip>
                    </TabList>
                    <TabPanels overflowY="auto" sx={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' } }}>
                        <TabPanel>
                            <VStack spacing={6} align="stretch">
                                <Heading as="h3" size="md">Primary Location</Heading>
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
                                            <Box key={result.id} p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
                                                <VStack align="stretch">
                                                    <Text fontWeight="semibold">{result.name}, {result.admin1 ? `${result.admin1}, ` : ''}{result.country}</Text>
                                                    <Text fontSize="sm" color="darkGray">Timezone: {result.timezone} | Lat: {result.latitude.toFixed(2)}, Lon: {result.longitude.toFixed(2)}</Text>
                                                    <HStack mt={2}>
                                                        <Button size="xs" colorScheme="blue" onClick={() => handleSetPrimary(result)}>Set as Primary</Button>
                                                        <Button size="xs" onClick={() => selectLocation(result)}>Add to Clocks</Button>
                                                    </HStack>
                                                </VStack>
                                            </Box>
                                        ))}
                                    </List>
                                )}
                                <HStack justify="space-between" mb={4}>
                                    <Heading as="h3" size="md">Manage Clocks</Heading>
                                    <Button size="xs" colorScheme="red" variant="outline" onClick={onDeleteAllAlertOpen} isDisabled={clocks.length === 0} isLoading={isDeletingAll}>Delete All</Button>
                                </HStack>
                                <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
                                    {clocks.map((clock) => (
                                        <VStack key={clock.id} p={3} className="glass" borderRadius="lg" justify="space-between" spacing={3} tabIndex={0} _focus={{ boxShadow: 'outline', outline: 'none' }} onKeyDown={(e) => { if (e.key === 'Delete') { confirmDelete(clock.id); } }}>
                                            <Text textAlign="center" noOfLines={2}>{clock.location}</Text>
                                            <IconButton icon={<DeleteIcon />} size="xs" colorScheme="red" variant="outline" onClick={() => confirmDelete(clock.id)} aria-label={`Delete ${clock.location}`} />
                                        </VStack>
                                    ))}
                                </Grid>
                            </VStack>
                        </TabPanel>
                        <TabPanel>
                            <VStack spacing={6} align="stretch">
                                <Heading as="h3" size="md">Theme</Heading>
                                <FormControl>
                                    <FormLabel>Color Mode</FormLabel>
                                    <RadioGroup onChange={(val) => { playSound('ui-click'); onThemePreferenceChange(val); }} value={themePreference}>
                                        <HStack spacing={5}>
                                            <Radio value="light">Light</Radio>
                                            <Radio value="dark">Dark</Radio>
                                            <Radio value="auto">Auto (Day/Night)</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </FormControl>
                                <Heading as="h3" size="md">Background</Heading>
                                <RadioGroup onChange={(type) => { playSound('ui-click'); onBackgroundChange({ type, value: type === 'image' ? bgUrl : '' }); }} value={background.type}>
                                    <VStack align="start">
                                        <Radio value="dynamic">Dynamic Gradient</Radio>
                                        <Radio value="image">Custom Image (URL)</Radio>
                                    </VStack>
                                </RadioGroup>
                                {background.type === 'image' && (
                                    <HStack mt={2}>
                                        <Input placeholder="https://example.com/image.jpg" value={bgUrl} onChange={(e) => setBgUrl(e.target.value)} />
                                        <Button onClick={() => { playSound('ui-click'); onBackgroundChange({ type: 'image', value: bgUrl }); }}>Apply</Button>
                                    </HStack>
                                )}
                                <Heading as="h3" size="md">Clocks</Heading>
                                <FormControl>
                                    <FormLabel>Analog Clock Style</FormLabel>
                                    <RadioGroup onChange={(val) => { playSound('ui-click'); onThemeChange(val); }} value={clockTheme}>
                                        <HStack spacing={5}>
                                            <Radio value="metallic">Copper</Radio>
                                            <Radio value="minimalist">Minimalist</Radio>
                                            <Radio value="ocean">Ocean</Radio>
                                            <Radio value="cyberpunk">Cyberpunk</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel>Time Format</FormLabel>
                                    <RadioGroup onChange={(val) => { playSound('ui-click'); onTimeFormatChange(val); }} value={timeFormat}>
                                        <HStack spacing={5}>
                                            <Radio value="12h">12-Hour</Radio>
                                            <Radio value="24h">24-Hour</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </FormControl>
                                <Heading as="h3" size="md">Layout</Heading>
                                <VStack spacing={4} align="stretch">
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold">Show World Clock Sidebar</Text>
                                        <Switch isChecked={displaySettings.showWorldClock} onChange={(e) => handleDisplaySettingChange('showWorldClock', e.target.checked)} />
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold">Show Hourly Forecast</Text>
                                        <Switch isChecked={displaySettings.showHourlyForecast} onChange={(e) => handleDisplaySettingChange('showHourlyForecast', e.target.checked)} />
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold">Show Weekly Forecast</Text>
                                        <Switch isChecked={displaySettings.showWeeklyForecast} onChange={(e) => handleDisplaySettingChange('showWeeklyForecast', e.target.checked)} />
                                    </HStack>
                                </VStack>
                            </VStack>
                        </TabPanel>
                        <TabPanel>
                            <Heading size="md" mb={4}>Animation & Effects</Heading>
                            <VStack spacing={6} align="stretch">
                                <HStack justify="space-between">
                                    <Text fontWeight="bold">Weather Effects</Text>
                                    <Switch isChecked={animationSettings.showWeatherEffects} onChange={(e) => handleAnimationSettingChange('showWeatherEffects', e.target.checked)} />
                                </HStack>
                                <HStack justify="space-between">
                                    <Text fontWeight="bold">Ambient Effects (Stars, Aurora)</Text>
                                    <Switch isChecked={animationSettings.showAmbientEffects} onChange={(e) => handleAnimationSettingChange('showAmbientEffects', e.target.checked)} />
                                </HStack>
                            </VStack>
                        </TabPanel>
                        <TabPanel>
                            <Heading size="md" mb={4}>Audio Settings</Heading>
                            <VStack spacing={6} align="stretch">
                                <HStack justify="space-between">
                                    <HStack>
                                        <Icon as={soundSettings.masterEnabled ? FaVolumeUp : FaVolumeMute} />
                                        <Text fontWeight="bold">Master Audio</Text>
                                    </HStack>
                                    <Switch isChecked={soundSettings.masterEnabled} onChange={(e) => {
                                        playSound('ui-toggle');
                                        handleSoundSettingChange('masterEnabled', e.target.checked);
                                    }} />
                                </HStack>
                                <Box>
                                    <Text mb={2}>Weather Effects Volume</Text>
                                    <Slider value={soundSettings.weatherVolume} min={0} max={1} step={0.05} onChange={(v) => handleSoundSettingChange('weatherVolume', v)} onChangeEnd={() => playSound('ui-click')} isDisabled={!soundSettings.masterEnabled}>
                                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </Box>
                                <Box>
                                    <Text mb={2}>UI Sounds Volume</Text>
                                    <Slider value={soundSettings.uiVolume} min={0} max={1} step={0.05} onChange={(v) => handleSoundSettingChange('uiVolume', v)} onChangeEnd={() => playSound('ui-click')} isDisabled={!soundSettings.masterEnabled}>
                                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </Box>
                                <Box>
                                    <Text mb={2}>Ambient Sounds Volume</Text>
                                    <Slider value={soundSettings.ambientVolume} min={0} max={1} step={0.05} onChange={(v) => handleSoundSettingChange('ambientVolume', v)} onChangeEnd={() => playSound('ui-click')} isDisabled={!soundSettings.masterEnabled}>
                                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </Box>
                            </VStack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <motion.div
                    drag="x"
                    onDrag={(event, info) => {
                        setSize(prevSize => ({ ...prevSize, width: Math.max(400, prevSize.width + info.delta.x) }));
                    }}
                    dragMomentum={false}
                    style={{ position: 'absolute', bottom: '0px', right: '0px', width: '20px', height: '20px', cursor: 'nwse-resize' }}
                />
            </VStack>

            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={undefined}
                onClose={onAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent className="glass">
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
                    <AlertDialogContent className="glass">
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

            <AlertDialog
                isOpen={isDeleteAllAlertOpen}
                leastDestructiveRef={undefined}
                onClose={onDeleteAllAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent className="glass">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            <HStack><WarningTwoIcon color="red.500" /> <Text>Delete All Clocks</Text></HStack>
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete all clocks? This action cannot be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onDeleteAllAlertClose}>Cancel</Button>
                            <Button colorScheme="red" onClick={executeDeleteAll} ml={3}>Delete All</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </motion.div>
    );
}

export default SettingsPanel;
