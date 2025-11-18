// src/components/settings/AppearanceSettings.js
import React from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  Heading,
  Divider,
  SimpleGrid,
  Box,
  Text,
  Icon,
  VStack,
  Switch,
} from '@chakra-ui/react';
import { useSettings } from '../../contexts/SettingsContext';
import { useTheme } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

function AppearanceSettings() {
  const { settings, dispatch } = useSettings();
  const theme = useTheme();

  const handleThemeChange = (themeId) => {
    dispatch({ type: 'SET_THEME', payload: themeId });
  };

  const handleAnimationSettingChange = (settingName, value) => {
    dispatch({
      type: 'SET_ANIMATION_SETTING',
      payload: { settingName, value },
    });
  };

  const handleDisplaySettingChange = (settingName, value) => {
    dispatch({
      type: 'SET_DISPLAY_SETTING',
      payload: { settingName, value },
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">Theme Selection</Heading>
      <Text fontSize="sm" color="gray.400">Select a theme to change the application's background and panel appearance.</Text>

      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
        {Object.entries(theme.themes).map(([themeId, themeData]) => (
          <Box
            key={themeId}
            p={4}
            borderRadius="lg"
            borderWidth="2px"
            borderColor={settings.themeId === themeId ? 'purple.400' : 'transparent'}
            cursor="pointer"
            onClick={() => handleThemeChange(themeId)}
            bg="whiteAlpha.200"
            transition="all 0.2s ease"
            position="relative"
            _hover={{ transform: 'scale(1.05)', shadow: 'md' }}
          >
            {settings.themeId === themeId && (
              <Icon as={FaCheckCircle} color="purple.400" position="absolute" top={2} right={2} />
            )}
            <Heading size="sm">{themeData.name}</Heading>
            <Text fontSize="xs" mt={1} noOfLines={2}>
              {themeData.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Divider />

      <Heading size="md">Animation & Effects</Heading>

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="gradient-speed" mb="0" flex="1">
          Glass Effect Speed
        </FormLabel>
        <Select
          id="gradient-speed"
          value={settings.animationSettings.gradientSpeed || 'normal'}
          onChange={(e) => handleAnimationSettingChange('gradientSpeed', e.target.value)}
          maxW="150px"
        >
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </Select>
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-weather-effects" mb="0" flex="1">
          Show Weather Effects (Rain, Snow, etc.)
        </FormLabel>
        <Switch
          id="show-weather-effects"
          isChecked={settings.animationSettings.showWeatherEffects}
          onChange={(e) => handleAnimationSettingChange('showWeatherEffects', e.target.checked)}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-ambient-effects" mb="0" flex="1">
          Show Ambient Effects (Stars, Aurora)
        </FormLabel>
        <Switch
          id="show-ambient-effects"
          isChecked={settings.animationSettings.showAmbientEffects}
          onChange={(e) => handleAnimationSettingChange('showAmbientEffects', e.target.checked)}
        />
      </FormControl>

      <Divider />
      <Heading size="sm">Layout Components</Heading>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-celestial-events" mb="0">
          Show Celestial Events Panel
        </FormLabel>
        <Switch
          id="show-celestial-events"
          isChecked={settings.displaySettings.showCelestialEvents}
          onChange={(e) =>
            handleDisplaySettingChange('showCelestialEvents', e.target.checked)
          }
          colorScheme="purple"
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-panchangam-panel" mb="0">
          Show Tamil Panchangam Panel
        </FormLabel>
        <Switch
          id="show-panchangam-panel"
          isChecked={settings.displaySettings.showPanchangamPanel}
          onChange={(e) =>
            handleDisplaySettingChange('showPanchangamPanel', e.target.checked)
          }
          colorScheme="purple"
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-hourly-forecast" mb="0">
          Show Hourly Forecast
        </FormLabel>
        <Switch
          id="show-hourly-forecast"
          isChecked={settings.displaySettings.showHourlyForecast}
          onChange={(e) =>
            handleDisplaySettingChange('showHourlyForecast', e.target.checked)
          }
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-weekly-forecast" mb="0">
          Show Weekly Forecast
        </FormLabel>
        <Switch
          id="show-weekly-forecast"
          isChecked={settings.displaySettings.showWeeklyForecast}
          onChange={(e) =>
            handleDisplaySettingChange('showWeeklyForecast', e.target.checked)
          }
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-sun-path" mb="0">
          Show Earth Orbit Panel
        </FormLabel>
        <Switch
          id="show-sun-path"
          isChecked={settings.displaySettings.showSunPath}
          onChange={(e) => handleDisplaySettingChange('showSunPath', e.target.checked)}
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-world-clock" mb="0">
          Show World Clock
        </FormLabel>
        <Switch
          id="show-world-clock"
          isChecked={settings.displaySettings.showWorldClock}
          onChange={(e) => handleDisplaySettingChange('showWorldClock', e.target.checked)}
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-new-panel" mb="0">
          Show New Panel
        </FormLabel>
        <Switch
          id="show-new-panel"
          isChecked={settings.displaySettings.showNewPanel}
          onChange={(e) =>
            handleDisplaySettingChange('showNewPanel', e.target.checked)
          }
        />
      </FormControl>
    </VStack>
  );
}

export default AppearanceSettings;