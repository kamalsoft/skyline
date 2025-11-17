// src/components/SettingsPanel.js
import React, { useState, useCallback, useRef } from 'react';
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
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  CloseIcon,
} from '@chakra-ui/icons';
import { motion, useDragControls } from 'framer-motion';
import { FaPalette, FaMagic, FaVolumeUp, FaMapMarkerAlt, FaDatabase, FaInfoCircle, FaWifi, FaBell, FaSync } from 'react-icons/fa';
import GeneralSettings from './settings/GeneralSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import EffectsSettings from './settings/EffectsSettings';
import DataSettings from './settings/DataSettings';
import AudioSettings from './settings/AudioSettings';
import NotificationSettings from './settings/NotificationSettings';
import NetworkSettings from './settings/NetworkSettings';
import AboutSettings from './settings/AboutSettings'; // Ensure this import is correct
import CustomToast from './CustomToast';

function SettingsPanel({
  onClearCache = () => console.warn('[SettingsPanel] onClearCache prop was not provided.'),
  onClose,
  onUpdateFound,
  isUpdateAvailable,
  isAnimationPaused,
  onToggleAnimation,
  onToggleLogger,
}) {
  const [size, setSize] = useState({ width: 700, height: 700 });
  const dragControls = useDragControls();
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();
  const panelRef = useRef(null);

  // Determine layout based on breakpoint
  const isMobile = useBreakpointValue({ base: true, md: false });
  const tabOrientation = isMobile ? 'horizontal' : 'vertical';
  const panelMotionProps = isMobile ? {} : { drag: true, dragListener: false, dragControls: dragControls, dragMomentum: false };

  const handleClearCache = useCallback(async () => {
    console.log('[SettingsPanel] Initiating cache clearing process...');
    if (typeof onClearCache === 'function') {
      await onClearCache();

      // Clear all app-related keys from localStorage
      Object.keys(localStorage).forEach((key) => {
        try {
          localStorage.removeItem(key); // This will clear all settings
          console.log(`- Removed '${key}' from localStorage.`);
        } catch (error) {
          console.error(`  - Failed to remove '${key}':`, error);
        }
      });

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
      ref={panelRef}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...panelMotionProps}
      style={{
        position: 'fixed',
        // Responsive positioning and sizing
        bottom: isMobile ? '0' : '20px',
        left: isMobile ? '0' : '20px',
        width: isMobile ? '100%' : size.width,
        height: isMobile ? '100%' : size.height,
        zIndex: 1400,
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      }}
      aria-label="Settings Panel"
    >
      <VStack spacing={4} align="stretch" className="glass" p={4} borderRadius={{ base: 0, md: 'xl' }} h="100%" boxShadow="2xl">
        <Box
          cursor={!isMobile ? 'move' : 'default'}
          onPointerDown={(e) => !isMobile && dragControls.start(e, { snapToCursor: false })}
          pb={2}
          borderBottomWidth="1px"
          borderColor="whiteAlpha.300"
        >
          <HStack justify="space-between">
            <Heading as="h3" size="md">
              Settings
            </Heading>
            <HStack>
              <Tooltip label="Refresh" placement="bottom">
                <IconButton icon={<FaSync />} size="sm" variant="ghost" onClick={() => window.location.reload()} aria-label="Refresh application" />
              </Tooltip>

              <IconButton icon={<CloseIcon />} size="sm" variant="ghost" onClick={onClose} aria-label="Close settings" />
            </HStack>
          </HStack>
        </Box>
        <Tabs
          orientation={tabOrientation}
          variant="vertical-glass"
          index={activeTab}
          onChange={(index) => setActiveTab(index)}
          flex="1"
          display="flex" // Make Tabs a flex container
          flexDirection={{ base: 'column', md: 'row' }} // Stack vertically on mobile, horizontally on desktop
          overflow="hidden" // Prevent children from overflowing the Tabs container
        >
          {/* TabList remains the same */}
          <TabList
            minW="150px"
            overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' },
            }}
          >
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
            <Tooltip label="Notification Settings" placement="right" hasArrow>
              <Tab id="tab-notifications">
                <Icon as={FaBell} mr={2} /> Notifications
              </Tab>
            </Tooltip>
            <Tooltip label="Network Settings" placement="right" hasArrow>
              <Tab id="tab-network">
                <Icon as={FaWifi} mr={2} /> Network
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

          {/* TabPanels now correctly fills available space and scrolls */}
          <TabPanels
            overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bg: 'gray.600', borderRadius: '24px' },
            }}
            flex="1" // This makes it take up all available space
          >
            <TabPanel role="tabpanel" aria-labelledby="tab-general">
              {/* Components now get data from context, only pass down non-context functions */}
              <GeneralSettings onClosePanel={onClose} />
            </TabPanel>
            <TabPanel role="tabpanel" aria-labelledby="tab-appearance">
              <AppearanceSettings />
            </TabPanel>
            <TabPanel role="tabpanel" aria-labelledby="tab-effects">
              <EffectsSettings
                isAnimationPaused={isAnimationPaused}
                onToggleAnimation={onToggleAnimation}
              />
            </TabPanel>
            <TabPanel role="tabpanel" aria-labelledby="tab-data">
              <DataSettings onClearCache={handleClearCache} onToggleLogger={onToggleLogger} />
            </TabPanel>
            <TabPanel role="tabpanel" aria-labelledby="tab-audio">
              {/* AudioSettings already uses its own context, so no changes needed */}
              <AudioSettings />
            </TabPanel>
            <TabPanel role="tabpanel" aria-labelledby="tab-notifications">
              <NotificationSettings />
            </TabPanel>
            <TabPanel role="tabpanel" aria-labelledby="tab-network">
              <NetworkSettings />
            </TabPanel>
            <TabPanel role="tabpanel" aria-labelledby="tab-about">
              <AboutSettings onUpdateFound={onUpdateFound} />
            </TabPanel>
          </TabPanels>

        </Tabs>
        <motion.div
          drag={true}
          onDrag={(event, info) => {
            setSize((prevSize) => ({
              width: Math.max(500, prevSize.width + info.delta.x),
              height: Math.max(500, prevSize.height + info.delta.y),
            }));
          }}
          dragMomentum={false} // Disable momentum for precise resizing
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '20px',
            height: '20px',
            cursor: 'nwse-resize',
          }}
          aria-label="Resize panel handle"
        />
      </VStack>

    </motion.div>
  );
}

export default SettingsPanel;
