// src/components/settings/AboutSettings.js
import React from 'react';
import {
  VStack,
  Heading,
  Text,
  Link,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function AboutSettings({ onUpdateFound }) {
  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">About Skyline</Heading>
      <Text>
        Skyline is a modern weather dashboard designed to provide a beautiful
        and intuitive experience.
      </Text>
      <Text>
        This project is open source. Feel free to explore the code on{' '}
        <Link href="https://github.com/your-repo" isExternal color="purple.300">
          GitHub <Icon as={FaGithub} mx="2px" />
        </Link>
        .
      </Text>
      <Heading size="sm">Credits</Heading>
      <Text>
        Concept and development by{' '}
        <Link href="https://www.linkedin.com/in/kamalesh-k-9a5b3b1b/" isExternal color="purple.300">
          Kamalesh K <Icon as={FaLinkedin} mx="2px" />
        </Link>
      </Text>
      <Button onClick={onUpdateFound}>Check for Updates</Button>
    </VStack>
  );
}

export default AboutSettings;