// src/components/settings/AppearanceSettings.js
import React, { useState, useMemo } from 'react';
import {
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Input,
  Button,
  Switch,
  Text,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSound } from '../../contexts/SoundContext';
import { useSettings } from '../../contexts/SettingsContext';

function AppearanceSettings() {
  const { settings, dispatch } = useSettings();
  const { themePreference, background, clockTheme, timeFormat, displaySettings } = settings;
  const { colorMode, toggleColorMode } = useColorMode();
  const [bgUrl, setBgUrl] = useState(background.type === 'image' ? background.value : '');
  const { playSound } = useSound();

  const ThemeIcon = useMemo(() => (colorMode === 'light' ? FaMoon : FaSun), [colorMode]);

  const handleDisplaySettingChange = (key, value) => {
    dispatch({ type: 'SET_DISPLAY_SETTINGS', payload: { ...displaySettings, [key]: value } });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h3" size="md">
        Theme
      </Heading>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontWeight="bold">Toggle Light/Dark Mode</Text>
          <IconButton icon={<ThemeIcon />} onClick={toggleColorMode} aria-label="Toggle theme" />
        </HStack>
        <FormControl>
          <FormLabel>Automatic Theme</FormLabel>
          <RadioGroup
            onChange={(val) => {
              playSound('ui-click');
              dispatch({ type: 'SET_THEME_PREFERENCE', payload: val });
            }}
            value={themePreference}
          >
            <HStack spacing={5}>
              <Radio value="light">Always Light</Radio>
              <Radio value="dark">Always Dark</Radio>
              <Radio value="auto">Auto (Day/Night)</Radio>
            </HStack>
          </RadioGroup>
          <Text fontSize="xs" color="gray.500" mt={2}>
            'Auto' mode switches the theme based on your primary clock's sunrise and sunset times.
          </Text>
        </FormControl>
      </VStack>
      <Heading as="h3" size="md">
        Background
      </Heading>
      <RadioGroup
        onChange={(type) => {
          playSound('ui-click');
          dispatch({ type: 'SET_BACKGROUND', payload: { type, value: type === 'image' ? bgUrl : '' } });
        }}
        value={background.type}
      >
        <VStack align="start">
          <Radio value="dynamic">Dynamic Gradient</Radio>
          <Radio value="image">Custom Image (URL)</Radio>
        </VStack>
      </RadioGroup>
      {background.type === 'image' && (
        <HStack mt={2}>
          <Input placeholder="https://example.com/image.jpg" value={bgUrl} onChange={(e) => setBgUrl(e.target.value)} />
          <Button
            onClick={() => {
              playSound('ui-click');
              dispatch({ type: 'SET_BACKGROUND', payload: { type: 'image', value: bgUrl } });
            }}
          >
            Apply
          </Button>
        </HStack>
      )}
      <Heading as="h3" size="md">
        Clocks
      </Heading>
      <FormControl>
        <FormLabel>Analog Clock Style</FormLabel>
        <RadioGroup
          onChange={(val) => {
            playSound('ui-click');
            dispatch({ type: 'SET_CLOCK_THEME', payload: val });
          }}
          value={clockTheme}
        >
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
        <RadioGroup
          onChange={(val) => {
            playSound('ui-click');
            dispatch({ type: 'SET_TIME_FORMAT', payload: val });
          }}
          value={timeFormat}
        >
          <HStack spacing={5}>
            <Radio value="12h">12-Hour</Radio>
            <Radio value="24h">24-Hour</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <Heading as="h3" size="md">
        Layout
      </Heading>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontWeight="bold">Show World Clock Sidebar</Text>
          <Switch
            isChecked={displaySettings.showWorldClock}
            onChange={(e) => handleDisplaySettingChange('showWorldClock', e.target.checked)}
          />
        </HStack>
        <HStack justify="space-between">
          <Text fontWeight="bold">Show Hourly Forecast</Text>
          <Switch
            isChecked={displaySettings.showHourlyForecast}
            onChange={(e) => handleDisplaySettingChange('showHourlyForecast', e.target.checked)}
          />
        </HStack>
        <HStack justify="space-between">
          <Text fontWeight="bold">Show Weekly Forecast</Text>
          <Switch
            isChecked={displaySettings.showWeeklyForecast}
            onChange={(e) => handleDisplaySettingChange('showWeeklyForecast', e.target.checked)}
          />
        </HStack>
      </VStack>
    </VStack>
  );
}

export default AppearanceSettings;
