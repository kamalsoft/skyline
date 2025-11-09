// src/components/SettingsPanel.js
import React, { useState, useCallback } from 'react';
import {
  Badge,
  Box,
  VStack,
  HStack,
  Heading,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Text,
  Tab,
  Icon,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import {
  CloseIcon,
} from '@chakra-ui/icons';
import { motion, useDragControls } from 'framer-motion';
import { FaPalette, FaMagic, FaVolumeUp, FaMapMarkerAlt, FaDatabase, FaInfoCircle } from 'react-icons/fa';
import GeneralSettings from './settings/GeneralSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import EffectsSettings from './settings/EffectsSettings';
import DataSettings from './settings/DataSettings';
import AudioSettings from './settings/AudioSettings';
import AboutSettings from './settings/AboutSettings';
import CustomToast from './CustomToast';
function SettingsPanel({
  clocks,
  addClock,
  removeClock,
  removeAllClocks,
  clockTheme,
  onThemeChange,
  timeFormat,
  onTimeFormatChange,
  background,
  onBackgroundChange,
  setPrimaryLocation,
  themePreference,
  onThemePreferenceChange,
  animationSettings,
  onAnimationSettingsChange,
  displaySettings,
  onDisplaySettingsChange,
  onClearCache,
  onClose,
  onUpdateFound,
  isUpdateAvailable,
  appSettings,
  onAppSettingsChange,
  // New props for the moved buttons
  colorMode,
  toggleColorMode,
  isAnimationPaused,
  onToggleAnimation,
  onToggleLogger,
}) {
  const [size, setSize] = useState({ width: 700, height: 700 });
  const dragControls = useDragControls();
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  const handleClearCache = useCallback(async () => {
    console.log('[SettingsPanel] Initiating cache clearing process...');
    if (typeof onClearCache === 'function') {
      await onClearCache();
      console.log('[SettingsPanel] Cache clearing process completed successfully.');
      toast({
        position: 'bottom-right',
        duration: null, // Stays until action is taken
        isClosable: true,
        render: () => (
          <CustomToast
            title="Cache Cleared"
            description="The application data has been reset. Please refresh to apply the changes."
            status="success"
            action={{ label: 'Refresh Now', onClick: () => window.location.reload() }}
          />
        ),
      });
    } else {
      console.error('[SettingsPanel] onClearCache prop is not a function!');
    }
  }, [onClearCache, toast]);

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
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      }}
      aria-label="Settings Panel"
    >
      <VStack spacing={4} align="stretch" className="glass" p={4} borderRadius="xl" h="100%" boxShadow="2xl">
        <Box
          cursor="move"
          onPointerDown={(e) => dragControls.start(e)}
          pb={2}
          borderBottomWidth="1px"
          borderColor="whiteAlpha.300"
        >
          <HStack justify="space-between">
            <Heading as="h3" size="md">
              Settings
            </Heading>
            <HStack>
              <IconButton icon={<CloseIcon />} size="sm" variant="ghost" onClick={onClose} aria-label="Close settings" />
            </HStack>
          </HStack>
        </Box>
        <Tabs
          orientation="vertical"
          variant="vertical-glass"
          index={activeTab}
          onChange={(index) => setActiveTab(index)}
          flex="1"
          display="flex"
          overflow="hidden"
        >
          <HStack align="stretch" flex="1">
            <TabList minW="150px">
              <Tooltip label="General Settings" placement="right" hasArrow>
                <Tab id="tab-general">
                  <Icon as={FaMapMarkerAlt} mr={2} /> General
                </Tab>
              </Tooltip>
              <Tooltip label="Appearance Settings" placement="right" hasArrow>
                <Tab id="tab-appearance">
                  <Icon as={FaPalette} mr={2} /> Appearance
                </Tab>
              </Tooltip>
              <Tooltip label="Animation & Effects Settings" placement="right" hasArrow>
                <Tab id="tab-effects">
                  <Icon as={FaMagic} mr={2} /> Effects
                </Tab>
              </Tooltip>
              <Tooltip label="Data & Privacy Settings" placement="right" hasArrow>
                <Tab id="tab-data">
                  <Icon as={FaDatabase} mr={2} /> Data
                </Tab>
              </Tooltip>
              <Tooltip label="Audio Settings" placement="right" hasArrow>
                <Tab id="tab-audio">
                  <Icon as={FaVolumeUp} mr={2} /> Audio
                </Tab>
              </Tooltip>
              <Tooltip label="About Skyline" placement="right" hasArrow>
                <Tab id="tab-about">
                  <HStack>
                    <Icon as={FaInfoCircle} mr={2} />
                    <Text>About</Text>
                    {isUpdateAvailable && (
                      <Badge colorScheme="green" ml={2}>
                        New
                      </Badge>
                    )}
                  </HStack>
                </Tab>
              </Tooltip>
            </TabList>
            <TabPanels
              overflowY="auto"
              sx={{
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' },
              }}
              flex="1"
            >
              <TabPanel role="tabpanel" aria-labelledby="tab-general">
                <GeneralSettings
                  clocks={clocks}
                  addClock={addClock}
                  removeClock={removeClock}
                  removeAllClocks={removeAllClocks}
                  setPrimaryLocation={setPrimaryLocation}
                  appSettings={appSettings}
                  onAppSettingsChange={onAppSettingsChange}
                  onClosePanel={onClose}
                />
              </TabPanel>
              <TabPanel role="tabpanel" aria-labelledby="tab-appearance">
                <AppearanceSettings
                  themePreference={themePreference}
                  onThemePreferenceChange={onThemePreferenceChange}
                  background={background}
                  onBackgroundChange={onBackgroundChange}
                  clockTheme={clockTheme}
                  onThemeChange={onThemeChange}
                  timeFormat={timeFormat}
                  onTimeFormatChange={onTimeFormatChange}
                  colorMode={colorMode}
                  toggleColorMode={toggleColorMode}
                  displaySettings={displaySettings}
                  onDisplaySettingsChange={onDisplaySettingsChange}
                />
              </TabPanel>
              <TabPanel role="tabpanel" aria-labelledby="tab-effects">
                <EffectsSettings
                  animationSettings={animationSettings}
                  onAnimationSettingsChange={onAnimationSettingsChange}
                  isAnimationPaused={isAnimationPaused}
                  onToggleAnimation={onToggleAnimation}
                  appSettings={appSettings}
                  onAppSettingsChange={onAppSettingsChange}
                />
              </TabPanel>
              <TabPanel role="tabpanel" aria-labelledby="tab-data">
                <DataSettings onClearCache={handleClearCache} onToggleLogger={onToggleLogger} />
              </TabPanel>
              <TabPanel role="tabpanel" aria-labelledby="tab-audio">
                <AudioSettings />
              </TabPanel>
              <TabPanel role="tabpanel" aria-labelledby="tab-about">
                <AboutSettings
                  onUpdateFound={onUpdateFound}
                  appSettings={appSettings}
                  onAppSettingsChange={onAppSettingsChange}
                />
              </TabPanel>
            </TabPanels>
          </HStack>
        </Tabs>
        <motion.div
          drag="x"
          onDrag={(event, info) => {
            setSize((prevSize) => ({ ...prevSize, width: Math.max(400, prevSize.width + info.delta.x) }));
          }}
          dragMomentum={false}
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '20px',
            height: '20px',
            cursor: 'nwse-resize',
          }}
        />
      </VStack>

    </motion.div>
  );
}

export default SettingsPanel;
