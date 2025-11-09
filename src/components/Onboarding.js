// src/components/Onboarding.js
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  VStack,
  Text,
  Heading,
  Code,
  Box,
  Icon,
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaCheckCircle, FaRocket } from 'react-icons/fa';

const Onboarding = ({ isOpen, onClose, primaryLocation }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleClose = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    onClose();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <ModalHeader>Welcome to Skyline!</ModalHeader>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Your Personal Weather Dashboard</Heading>
                <Text>
                  To provide you with accurate local weather and time, this app needs to determine your primary
                  location.
                </Text>
                <Text fontWeight="bold">
                  Your privacy is important. Your location data is only stored on this device and is never sent to our
                  servers.
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleNext}>
                Let's Get Started
              </Button>
            </ModalFooter>
          </>
        );
      case 2:
        return (
          <>
            <ModalHeader>Confirm Your Location</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <Icon as={FaMapMarkerAlt} boxSize="40px" color="blue.500" />
                <Text>We've detected your primary location as:</Text>
                <Box p={4} borderWidth="1px" borderRadius="md" w="100%">
                  <Heading size="sm">{primaryLocation?.location || 'Detecting...'}</Heading>
                  <Text fontSize="xs" color="gray.500">
                    Lat: {primaryLocation?.latitude.toFixed(4)}, Lon: {primaryLocation?.longitude.toFixed(4)}
                  </Text>
                </Box>
                <Text fontSize="sm">
                  This will be your default location for the main weather forecast. You can only change this by
                  resetting the app in the settings.
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleNext}>
                Looks Good!
              </Button>
            </ModalFooter>
          </>
        );
      case 3:
        return (
          <>
            <ModalHeader>You're All Set!</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <Icon as={FaRocket} boxSize="40px" color="green.500" />
                <Heading size="md">Welcome Aboard!</Heading>
                <Text>
                  You can add more world clocks, customize the appearance, and manage your data in the{' '}
                  <Code>Settings</Code> panel.
                </Text>
                <Text>Enjoy your personalized weather dashboard!</Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" leftIcon={<FaCheckCircle />} onClick={handleClose}>
                Start Exploring
              </Button>
            </ModalFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent className="glass">{renderStep()}</ModalContent>
    </Modal>
  );
};

export default Onboarding;
