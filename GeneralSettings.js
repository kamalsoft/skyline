import React from 'react';
import { VStack, Heading, HStack, Text, Switch } from '@chakra-ui/react';

function GeneralSettings({ appSettings, onAppSettingsChange }) {
  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h3" size="md">
        General
      </Heading>
      <HStack justify="space-between" p={4} className="glass" borderRadius="md">
        <Text fontWeight="bold">Check for updates on startup</Text>
        <Switch
          isChecked={appSettings.autoUpdateCheck}
          onChange={(e) => onAppSettingsChange({ ...appSettings, autoUpdateCheck: e.target.checked })}
        />
      </HStack>
    </VStack>
  );
}

export default GeneralSettings;
