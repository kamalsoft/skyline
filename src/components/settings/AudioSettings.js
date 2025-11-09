// src/components/settings/AudioSettings.js
import React from 'react';
import {
  VStack,
  HStack,
  Heading,
  Switch,
  Text,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Icon,
} from '@chakra-ui/react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useSound } from '../../contexts/SoundContext';

function AudioSettings() {
  const { settings: soundSettings, updateSettings: updateSoundSettings, playSound } = useSound();

  const handleSoundSettingChange = (key, value) => {
    updateSoundSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md" mb={4}>
        Audio Settings
      </Heading>
      <HStack justify="space-between">
        <HStack>
          <Icon as={soundSettings.masterEnabled ? FaVolumeUp : FaVolumeMute} />
          <Text fontWeight="bold">Master Audio</Text>
        </HStack>
        <Switch
          isChecked={soundSettings.masterEnabled}
          onChange={(e) => {
            playSound('ui-toggle');
            handleSoundSettingChange('masterEnabled', e.target.checked);
          }}
        />
      </HStack>
      <Box>
        <Text mb={2}>Weather Effects Volume</Text>
        <Slider
          aria-label="Weather effects volume"
          value={soundSettings.weatherVolume}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => handleSoundSettingChange('weatherVolume', v)}
          onChangeEnd={() => playSound('ui-click')}
          isDisabled={!soundSettings.masterEnabled}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <Box>
        <Text mb={2}>UI Sounds Volume</Text>
        <Slider
          aria-label="User interface sounds volume"
          value={soundSettings.uiVolume}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => handleSoundSettingChange('uiVolume', v)}
          onChangeEnd={() => playSound('ui-click')}
          isDisabled={!soundSettings.masterEnabled}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <Box>
        <Text mb={2}>Ambient Sounds Volume</Text>
        <Slider
          aria-label="Ambient sounds volume"
          value={soundSettings.ambientVolume}
          min={0}
          max={1}
          step={0.05}
          onChange={(v) => handleSoundSettingChange('ambientVolume', v)}
          onChangeEnd={() => playSound('ui-click')}
          isDisabled={!soundSettings.masterEnabled}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    </VStack>
  );
}

export default AudioSettings;
