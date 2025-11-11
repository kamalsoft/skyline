// src/components/settings/AboutSettings.js
import React from 'react';
import {
  VStack,
  Heading,
  Text,
  Button,
  Divider,
  Grid,
  Tag,

  Link,
} from '@chakra-ui/react';

function AboutSettings({ onUpdateFound }) {
  const appVersion = process.env.REACT_APP_VERSION || '1.2.0'; // Fallback to package.json version

  return (
    <VStack spacing={6} align="stretch">
      <VStack spacing={2} align="center">
        <Heading size="lg">Skyline Weather</Heading>
        <Tag colorScheme="blue" size="sm">
          Version {appVersion}
        </Tag>
      </VStack>

      <Text textAlign="center">
        A modern, visually-rich dashboard for exploring weather and astronomical data.
      </Text>

      <Button onClick={onUpdateFound} colorScheme="teal" variant="outline">
        Check for Updates
      </Button>

      <Divider />

      <Heading as="h3" size="md">
        Credits & Acknowledgements
      </Heading>

      {/* Use a Grid for a cleaner, more organized layout */}
      <Grid templateColumns={{ base: '1fr', md: '150px 1fr' }} gap={{ base: 2, md: 4 }} alignItems="start">
        <Text fontWeight="bold" textAlign={{ base: 'left', md: 'right' }}>
          Ideas and Concept:
        </Text>
        <Text>Kamalesh</Text>

        <Text fontWeight="bold" textAlign={{ base: 'left', md: 'right' }}>
          Data Sources:
        </Text>
        <VStack align="start" spacing={1}>
          <Text>
            Weather and astronomical data provided by{' '}
            <Link href="https://open-meteo.com/" isExternal color="teal.300">
              Open-Meteo
            </Link>
            .
          </Text>
          <Text>
            Geocoding services provided by{' '}
            <Link href="https://www.bigdatacloud.com/" isExternal color="teal.300">
              BigDataCloud
            </Link>
            .
          </Text>
        </VStack>

        <Text fontWeight="bold" textAlign={{ base: 'left', md: 'right' }}>
          Built With:
        </Text>
        <Text>React, Chakra UI, Framer Motion, Recharts, and other open-source libraries.</Text>
      </Grid>
    </VStack>
  );
}

export default AboutSettings;