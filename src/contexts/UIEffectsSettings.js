// src/components/settings/UIEffectsSettings.js
import React, { useState } from 'react';
import {
    VStack,
    Heading,
    Text,
    SimpleGrid,
    Box,
    Button,
    useColorModeValue,
    Icon,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { useSettings } from '../../contexts/SettingsContext';

const uiEffects = [
    {
        id: 'glassmorphism',
        name: 'Glassmorphism',
        description: 'A frosted-glass effect with a blurred background and a subtle border.',
    },
    {
        id: 'neumorphism',
        name: 'Neumorphism',
        description: 'A soft, extruded plastic look with subtle shadows and highlights.',
    },
    {
        id: 'claymorphism',
        name: 'Claymorphism',
        description: 'A playful, clay-like 3D effect with rounded corners and distinct shadows.',
    },
    {
        id: 'skeuomorphism',
        name: 'Skeuomorphism',
        description: 'A realistic, textured style that mimics real-world objects.',
    },
    {
        id: 'liquid',
        name: 'Liquid Effects',
        description: 'A fluid, blob-like effect using animated gradients and filters.',
    },
    {
        id: 'retro-pixelation',
        name: 'Retro Pixelation',
        description: 'A pixelated, 8-bit gaming style with a hard shadow.',
    },
    {
        id: 'aurora',
        name: 'Aurora Gradients',
        description: 'A soft, shifting gradient that mimics the northern lights.',
    },
    {
        id: 'none',
        name: 'Minimal',
        description: 'A flat, simple style with no extra effects for a clean look.',
    },
];

const EffectCard = ({ effect, isSelected, onSelect }) => {
    const bg = useColorModeValue('gray.50', 'gray.700');

    return (
        <Box
            p={4}
            borderRadius="lg"
            border="2px solid"
            borderColor={isSelected ? 'purple.400' : 'transparent'}
            cursor="pointer"
            onClick={() => onSelect(effect.id)}
            bg={bg}
            transition="all 0.2s ease"
            position="relative"
            _hover={{ transform: 'scale(1.05)' }}
        >
            {isSelected && (
                <Icon as={FaCheckCircle} color="purple.400" position="absolute" top={2} right={2} />
            )}
            <Heading size="sm">{effect.name}</Heading>
            <Text fontSize="xs" mt={1}>
                {effect.description}
            </Text>
        </Box>
    );
};

function UIEffectsSettings() {
    const { settings, dispatch } = useSettings();
    const [selectedEffect, setSelectedEffect] = useState(settings.appSettings.uiEffect);

    const handleSelectEffect = (effectId) => {
        setSelectedEffect(effectId);
    };

    const handleApplyEffect = () => {
        dispatch({
            type: 'SET_APP_SETTING',
            payload: { settingName: 'uiEffect', value: selectedEffect },
        });
    };

    const previewBg = useColorModeValue('gray.100', 'gray.800');

    return (
        <VStack spacing={6} align="stretch">
            <Heading size="md">UI Effects</Heading>
            <Text>Choose a visual style for the application panels. Select an effect to preview it below, then click "Apply" to save your changes.</Text>

            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                {uiEffects.map((effect) => (
                    <EffectCard
                        key={effect.id}
                        effect={effect}
                        isSelected={selectedEffect === effect.id}
                        onSelect={handleSelectEffect}
                    />
                ))}
            </SimpleGrid>

            <VStack spacing={4} p={6} bg={previewBg} borderRadius="xl">
                <Heading size="sm">Preview</Heading>
                <Box
                    p={6}
                    borderRadius="xl"
                    w="200px"
                    h="120px"
                    className={`effect-preview ${selectedEffect}`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text fontWeight="bold">Panel</Text>
                </Box>
            </VStack>

            <Button
                colorScheme="purple"
                onClick={handleApplyEffect}
                isDisabled={selectedEffect === settings.appSettings.uiEffect}
            >
                Apply Effect
            </Button>
        </VStack>
    );
}

export default UIEffectsSettings;