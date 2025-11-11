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
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

function AboutSettings({ onUpdateFound }) {
  const appVersion = process.env.REACT_APP_VERSION || '1.2.0'; // Fallback to package.json version
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.1)');
  const borderColor = useColorModeValue('rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VStack
        spacing={6}
        align="stretch"
        p={6}
        bg={bgColor}
        backdropFilter="blur(20px)"
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="xl"
      >
        <VStack spacing={2} align="center">
          <Heading size="lg">
            Skyline Weather
          </Heading>
          <Tag colorScheme="purple" size="sm" variant="subtle">
            Version {appVersion}
          </Tag>
        </VStack>

        <Text textAlign="center">
          A modern, visually-rich dashboard for exploring weather and astronomical data.
        </Text>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onUpdateFound}
            variant="outline"
            w="full"
            sx={{
              border: '2px solid',
              borderColor: 'purple.300',
              color: 'purple.300',
              _hover: {
                bg: 'purple.500',
                color: 'white',
                borderColor: 'purple.500',
              },
            }}
          >
            Check for Updates
          </Button>
        </motion.div>

        <Divider borderColor="whiteAlpha.300" />

        <Heading as="h3" size="md">
          Credits & Acknowledgements
        </Heading>

        {/* Use a Grid for a cleaner, more organized layout */}
        <Grid templateColumns={{ base: '1fr', md: '150px 1fr' }} gap={{ base: 2, md: 4 }} alignItems="start">
          <Text fontWeight="bold" color="purple.300" textAlign={{ base: 'left', md: 'right' }}>
            Ideas and Concept:
          </Text>
          <Text>Kamalesh</Text>

          <Text fontWeight="bold" color="purple.300" textAlign={{ base: 'left', md: 'right' }}>
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

          <Text fontWeight="bold" color="purple.300" textAlign={{ base: 'left', md: 'right' }}>
            Built With:
          </Text>
          <Text>React, Chakra UI, Framer Motion, Recharts, and other open-source libraries.</Text>
        </Grid>
      </VStack>
    </motion.div>
  );
}

export default AboutSettings;