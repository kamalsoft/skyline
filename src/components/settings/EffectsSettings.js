// src/components/settings/EffectsSettings.js
import React from 'react';
import { VStack, HStack, Heading, Switch, Text } from '@chakra-ui/react';

function EffectsSettings({ animationSettings, onAnimationSettingsChange }) {
  const handleAnimationSettingChange = (key, value) => {
    onAnimationSettingsChange({ ...animationSettings, [key]: value });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md" mb={4}>
        Animation & Effects
      </Heading>
      <HStack justify="space-between">
        <Text fontWeight="bold">Weather Effects</Text>
        <Switch
          isChecked={animationSettings.showWeatherEffects}
          onChange={(e) => handleAnimationSettingChange('showWeatherEffects', e.target.checked)}
        />
      </HStack>
      <HStack justify="space-between">
        <Text fontWeight="bold">Ambient Effects (Stars, Aurora)</Text>
        <Switch
          isChecked={animationSettings.showAmbientEffects}
          onChange={(e) => handleAnimationSettingChange('showAmbientEffects', e.target.checked)}
        />
      </HStack>
    </VStack>
  );
}

export default EffectsSettings;
