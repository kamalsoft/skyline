// src/components/GlobePanel.js
import React from 'react';
import { Heading, VStack, HStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import SeasonalGlobe from './effects/SeasonalGlobe';

const orbitalTilt = 23.5;

function GlobePanel({ timeOfDay, dragX, isDay, moonPhaseName, illumination, MoonIcon, playSound, stopSound }) {
    return (
        <motion.div
            drag
            dragMomentum={false}
            style={{
                position: 'fixed',
                top: '100px',
                right: '20px',
                width: '450px',
                zIndex: 1300, // Ensure it's above the background but below modals
            }}
            whileDrag={{
                scale: 1.02,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            }}
        >
            <VStack className="glass" p={4} borderRadius="xl" spacing={2} cursor="grab">
                <SeasonalGlobe
                    timeOfDay={timeOfDay}
                    dragX={dragX}
                    isDay={isDay}
                    moonPhaseName={moonPhaseName}
                    illumination={illumination}
                    MoonIcon={MoonIcon}
                    playSound={playSound}
                    stopSound={stopSound}
                />
                {/* The informational text is now part of the panel itself */}
                <VStack pt={2} spacing={1} align="center">
                    <Heading size="sm">Earth's Orbit & The Seasons</Heading>
                    <HStack>
                        <Text fontSize="xs" color="whiteAlpha.800">
                            Axial Tilt:
                        </Text>
                        <Text fontSize="xs" fontWeight="bold" color="red.300">
                            {orbitalTilt}°
                        </Text>
                    </HStack>
                    <Text fontSize="xs" color="whiteAlpha.600" textAlign="center" maxW="90%">
                        The {orbitalTilt}° tilt of Earth's axis is the primary cause of the seasons. Drag the globe to see how its orientation to the sun changes throughout the year.
                    </Text>
                </VStack>
            </VStack>
        </motion.div>
    );
}

export default GlobePanel;