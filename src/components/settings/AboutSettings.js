// src/components/settings/AboutSettings.js
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { VStack, Heading, Text, Link, HStack, Icon, Box, Divider, Button, useToast } from '@chakra-ui/react';
import { FaGithub, FaInfoCircle } from 'react-icons/fa';
import packageJson from '../../../package.json';

function AboutSettings({ onUpdateFound }) {
  const appVersion = packageJson.version;
  const [updateInfo, setUpdateInfo] = useState({ loading: false, message: '' });
  const toast = useToast();

  const checkForUpdates = useCallback(async () => {
    setUpdateInfo({ loading: true, message: '' });
    toast({ title: 'Checking for updates...', status: 'info', duration: 2000 });

    try {
      const response = await axios.get('/changelog.json', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      const latestChangelog = response.data;

      if (latestChangelog.version > appVersion) {
        onUpdateFound(latestChangelog);
      } else {
        toast({
          title: 'Up to date!',
          description: `You are running the latest version (${appVersion}).`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to fetch changelog:', error);
      toast({
        title: 'Update Check Failed',
        description: 'Could not fetch update information.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdateInfo({ loading: false, message: '' });
    }
  }, [appVersion, onUpdateFound, toast]);

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h3" size="md">
        About Skyline
      </Heading>
      <Box p={4} className="glass" borderRadius="md">
        <VStack spacing={3} align="stretch">
          <HStack>
            <Icon as={FaInfoCircle} color="blue.300" />
            <Text>
              <strong>Version:</strong> {appVersion}
            </Text>
          </HStack>
          <Divider />
          <Text>
            Skyline is a dynamic, personalized weather dashboard designed to provide a beautiful and functional way to
            view weather from around the world.
          </Text>
          <Text>
            This project is open source. Feel free to explore the code, contribute, or report issues on GitHub.
          </Text>
        </VStack>
      </Box>

      <Heading as="h3" size="md">
        Updates & Resources
      </Heading>
      <HStack spacing={4}>
        <Button as={Link} href="https://github.com/kamalsoft/skyline" isExternal leftIcon={<FaGithub />}>
          Source Code
        </Button>
        <Button onClick={checkForUpdates} isLoading={updateInfo.loading} loadingText="Checking...">
          Check for Updates
        </Button>
      </HStack>
      {updateInfo.message && (
        <Text mt={2} fontSize="sm" color="gray.400">
          {updateInfo.message}
        </Text>
      )}
    </VStack>
  );
}

export default AboutSettings;
