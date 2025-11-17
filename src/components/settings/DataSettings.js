// src/components/settings/DataSettings.js
import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react'; // Removed InfoIcon from here
import { WarningTwoIcon } from '@chakra-ui/icons'; // InfoIcon was here
import { FaTerminal } from 'react-icons/fa';

function DataSettings({ onClearCache, onToggleLogger }) {
  const { isOpen: isResetAlertOpen, onOpen: onResetAlertOpen, onClose: onResetAlertClose } = useDisclosure();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAndReset = async () => {
    console.log('[DataSettings] User confirmed cache clear. Executing onClearCache...');
    setIsClearing(true);
    await onClearCache();
    // The parent component will now handle showing the final "refresh" alert.
    setIsClearing(false);
    onResetAlertClose();
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md" mb={4}>
        Data & Privacy
      </Heading>

      <Heading size="sm">Developer Tools</Heading>
      <Box p={4} borderWidth="1px" borderColor="gray.500" borderRadius="md">
        <HStack justify="space-between">
          <VStack align="start">
            <Text fontWeight="bold">Log Terminal</Text>
            <Text fontSize="sm">Show or hide the developer logging console.</Text>
          </VStack>
          <Button leftIcon={<FaTerminal />} onClick={onToggleLogger}>
            Toggle Logger
          </Button>
        </HStack>
      </Box>

      <Text>Your settings and clock list are stored locally on your device. This data is not sent to any server.</Text>
      <Heading size="sm" color="red.400">
        Danger Zone
      </Heading>
      <Box p={4} borderWidth="1px" borderColor="red.500" borderRadius="md">
        <Text mb={4}>
          Clearing the cache will remove all your saved clocks and settings, resetting the application to its initial
          state. This is the only way to change your primary location.
        </Text>
        <Button colorScheme="red" onClick={onResetAlertOpen} isLoading={isClearing}>
          Clear Cache & Reset App
        </Button>
      </Box>

      <AlertDialog isOpen={isResetAlertOpen} leastDestructiveRef={undefined} onClose={onResetAlertClose}>
        <AlertDialogOverlay>
          <AlertDialogContent className="glass">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack>
                <WarningTwoIcon color="red.500" /> <Text>Clear Cache and Reset?</Text>
              </HStack>
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This will remove all saved clocks and settings, and the app will reload. This action cannot
              be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onResetAlertClose} isDisabled={isClearing}>Cancel</Button>
              <Button colorScheme="red" onClick={handleClearAndReset} ml={3} isLoading={isClearing}>
                Clear & Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}

export default DataSettings;
