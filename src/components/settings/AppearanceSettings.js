// src/components/settings/AppearanceSettings.js
import React, { useMemo, useState } from 'react';
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
  Divider,
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
      {/* --- Theme Section --- */}
      <VStack className="glass" p={4} borderRadius="lg" align="stretch" spacing={4}>
        <Heading size="sm">Theme</Heading>
        <HStack justify="space-between">
          <Text fontWeight="bold">Toggle Light/Dark Mode</Text>
          <IconButton icon={<ThemeIcon />} onClick={toggleColorMode} aria-label="Toggle theme" />
        </HStack>
        <Divider />
        <FormControl>
          <FormLabel>Automatic Theme</FormLabel>
          <RadioGroup
            onChange={(val) => {
              playSound('ui-click');
              dispatch({ type: 'SET_THEME_PREFERENCE', payload: val });
            }}
            value={themePreference}
          >
            <VStack align="start">
              <Radio value="light">Always Light</Radio>
              <Radio value="dark">Always Dark</Radio>
              <Radio value="auto">Auto (Day/Night)</Radio>
            </VStack>
          </RadioGroup>
          <Text fontSize="xs" color="gray.500" mt={2}>
            'Auto' mode switches the theme based on your primary clock's sunrise and sunset times.
          </Text>
        </FormControl>
      </VStack>

      {/* --- Background Section --- */}
      <VStack className="glass" p={4} borderRadius="lg" align="stretch" spacing={4}>
        <Heading size="sm">Background</Heading>
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
      </VStack>

      {/* --- Clocks & Time Section --- */}
      <VStack className="glass" p={4} borderRadius="lg" align="stretch" spacing={4}>
        <Heading size="sm">Clocks & Time</Heading>
        <FormControl>
          <FormLabel>Analog Clock Style</FormLabel>
          <RadioGroup
            onChange={(val) => {
              playSound('ui-click');
              dispatch({ type: 'SET_CLOCK_THEME', payload: val });
            }}
            value={clockTheme}
          >
            <HStack spacing={5} wrap="wrap">
              <Radio value="metallic">Copper</Radio>
              <Radio value="minimalist">Minimalist</Radio>
              <Radio value="ocean">Ocean</Radio>
              <Radio value="cyberpunk">Cyberpunk</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
        <Divider />
        <FormControl>
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
      </VStack>

      {/* --- Layout Section --- */}
      <VStack className="glass" p={4} borderRadius="lg" align="stretch" spacing={4}>
        <Heading size="sm">Layout</Heading>
        <HStack justify="space-between">
          <Text fontWeight="bold">Show World Clock Sidebar</Text>
          <Switch
            isChecked={displaySettings.showWorldClock}
            onChange={(e) => handleDisplaySettingChange('showWorldClock', e.target.checked)}
          />
        </HStack>
        <Divider />
        <HStack justify="space-between">
          <Text fontWeight="bold">Show Hourly Forecast</Text>
          <Switch
            isChecked={displaySettings.showHourlyForecast}
            onChange={(e) => handleDisplaySettingChange('showHourlyForecast', e.target.checked)}
          />
        </HStack>
        <Divider />
        <HStack justify="space-between">
          <Text fontWeight="bold">Show Weekly Forecast</Text>
          <Switch
            isChecked={displaySettings.showWeeklyForecast}
            onChange={(e) => handleDisplaySettingChange('showWeeklyForecast', e.target.checked)}
          />
        </HStack>
        <Divider />
        <HStack justify="space-between">
          <Text fontWeight="bold">Show Sun's Seasonal Path</Text>
          <Switch
            isChecked={displaySettings.showSunPath}
            onChange={(e) => handleDisplaySettingChange('showSunPath', e.target.checked)}
          />
        </HStack>
      </VStack>
    </VStack>
  );
}

export default AppearanceSettings;
