// src/components/settings/EffectsSettings.js
import React, { useMemo } from 'react';
import { VStack, HStack, Heading, Switch, Text, IconButton } from '@chakra-ui/react';
import { FaPlay, FaPause } from 'react-icons/fa';

function EffectsSettings({
  animationSettings,
  onAnimationSettingsChange,
  isAnimationPaused,
  onToggleAnimation,
  appSettings,
  onAppSettingsChange,
}) {
  const handleAnimationSettingChange = (key, value) => {
    onAnimationSettingsChange({ ...animationSettings, [key]: value });
  };

  const AnimationIcon = useMemo(() => (isAnimationPaused ? FaPlay : FaPause), [isAnimationPaused]);

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
      <Heading size="sm" mt={4}>Global Controls</Heading>
      <HStack justify="space-between">
        <Text fontWeight="bold">Pause All Animations</Text>
        <IconButton icon={<AnimationIcon />} onClick={onToggleAnimation} aria-label="Toggle animations" />
      </HStack>
    </VStack>
  );
}

export default EffectsSettings;
