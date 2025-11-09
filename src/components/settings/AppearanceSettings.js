// src/components/settings/AppearanceSettings.js
import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useSound } from '../../contexts/SoundContext';

function AppearanceSettings({
  themePreference,
  onThemePreferenceChange,
  background,
  onBackgroundChange,
  clockTheme,
  onThemeChange,
  timeFormat,
  onTimeFormatChange,
  displaySettings,
  onDisplaySettingsChange,
}) {
  const [bgUrl, setBgUrl] = useState(background.type === 'image' ? background.value : '');
  const { playSound } = useSound();

  const handleDisplaySettingChange = (key, value) => {
    onDisplaySettingsChange({ ...displaySettings, [key]: value });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h3" size="md">
        Theme
      </Heading>
      <FormControl>
        <FormLabel>Color Mode</FormLabel>
        <RadioGroup
          onChange={(val) => {
            playSound('ui-click');
            onThemePreferenceChange(val);
          }}
          value={themePreference}
        >
          <HStack spacing={5}>
            <Radio value="light">Light</Radio>
            <Radio value="dark">Dark</Radio>
            <Radio value="auto">Auto (Day/Night)</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <Heading as="h3" size="md">
        Background
      </Heading>
      <RadioGroup
        onChange={(type) => {
          playSound('ui-click');
          onBackgroundChange({ type, value: type === 'image' ? bgUrl : '' });
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
              onBackgroundChange({ type: 'image', value: bgUrl });
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
            onThemeChange(val);
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
            onTimeFormatChange(val);
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
