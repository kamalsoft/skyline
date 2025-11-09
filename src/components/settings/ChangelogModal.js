// src/components/ChangelogModal.js
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Badge,
  List,
  ListItem,
  ListIcon,
  Button,
} from '@chakra-ui/react';
import { FaPlus, FaWrench, FaSync } from 'react-icons/fa';

const changeTypeIcons = {
  feat: FaPlus,
  fix: FaWrench,
  refactor: FaSync,
};

function ChangelogModal({ isOpen, onClose, changelog }) {
  if (!changelog) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent className="glass">
        <ModalHeader>
          <HStack>
            <Text>What's New in Version {changelog.version}</Text>
            <Badge colorScheme="green">New Update</Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" color="gray.400">
              Released on: {new Date(changelog.date).toLocaleDateString()}
            </Text>
            <List spacing={3}>
              {changelog.changes.map((change, index) => (
                <ListItem key={index}>
                  <HStack align="start">
                    <ListIcon as={changeTypeIcons[change.type] || FaWrench} color="blue.300" mt={1} />
                    <Text>{change.description}</Text>
                  </HStack>
                </ListItem>
              ))}
            </List>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ChangelogModal;
