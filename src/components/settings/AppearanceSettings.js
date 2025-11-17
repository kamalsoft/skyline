// src/components/settings/AppearanceSettings.js
import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Heading,
  Divider,
  ButtonGroup,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useSettings } from '../../contexts/SettingsContext';

function AppearanceSettings() {
  const { settings, dispatch } = useSettings();

  const handleDisplaySettingChange = (settingName, value) => {
    dispatch({
      type: 'SET_DISPLAY_SETTING',
      payload: { settingName, value },
    });
  };

  const handleThemePreferenceChange = (value) => {
    dispatch({ type: 'SET_THEME_PREFERENCE', payload: value });
  };

  const handleClockThemeChange = (value) => {
    dispatch({ type: 'SET_CLOCK_THEME', payload: value });
  };

  const handleTimeFormatChange = (value) => {
    dispatch({ type: 'SET_TIME_FORMAT', payload: value });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">Theme & Layout</Heading>

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="theme-preference" mb="0">
          Application Theme
        </FormLabel>
        <Select
          id="theme-preference"
          value={settings.themePreference}
          onChange={(e) => handleThemePreferenceChange(e.target.value)}
          maxW="150px"
        >
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </Select>
      </FormControl>

      <FormControl as={HStack} justify="space-between">
        <FormLabel htmlFor="time-format" mb="0">
          Time Format
        </FormLabel>
        <ButtonGroup id="time-format" size="sm" isAttached>
          <Button onClick={() => handleTimeFormatChange('12h')} isActive={settings.timeFormat === '12h'}>
            12-Hour
          </Button>
          <Button onClick={() => handleTimeFormatChange('24h')} isActive={settings.timeFormat === '24h'}>
            24-Hour
          </Button>
        </ButtonGroup>
      </FormControl>

      <FormControl as={HStack} justify="space-between">
        <FormLabel htmlFor="clock-theme" mb="0">
          Analog Clock Theme
        </FormLabel>
        <Select
          id="clock-theme"
          value={settings.clockTheme}
          onChange={(e) => handleClockThemeChange(e.target.value)}
          maxW="150px"
        >
          <option value="metallic">Metallic</option>
          <option value="minimalist">Minimalist</option>
          <option value="ocean">Ocean</option>
          <option value="cyberpunk">Cyberpunk</option>
          <option value="forest">Forest</option>
          <option value="sunrise">Sunrise</option>
        </Select>
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
    </VStack>
  );
}

export default AppearanceSettings;