// src/components/CelestialEventsPanel.js
import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Spinner, HStack, Icon } from '@chakra-ui/react';
import GlassCard from './GlassCard';
import { FaSatellite, FaMeteor } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Mock function to simulate fetching data from an astronomy API.
// In a real application, you would replace this with a call to a real API.
async function fetchCelestialData(latitude, longitude) {
    console.log(`[CelestialEventsPanel] Fetching data for ${latitude}, ${longitude}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        issPasses: [
            { time: '2025-11-15T21:45:00Z', duration: '5 mins', direction: 'from NW to SE', magnitude: -3.5 },
            { time: '2025-11-16T20:30:00Z', duration: '4 mins', direction: 'from W to E', magnitude: -3.1 },
            { time: '2025-11-17T22:10:00Z', duration: '6 mins', direction: 'from W to NE', magnitude: -3.8 },
        ],
        meteorShowers: [
            { name: 'Geminids', peak: 'December 13-14, 2025', rate: 'up to 120/hr' },
            { name: 'Quadrantids', peak: 'January 3-4, 2026', rate: 'up to 110/hr' },
        ],
    };
}

function CelestialEventsPanel({ latitude, longitude }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!latitude || !longitude) return;
            setIsLoading(true);
            const celestialData = await fetchCelestialData(latitude, longitude);
            setData(celestialData);
            setIsLoading(false);
        }
        loadData();
    }, [latitude, longitude]);

    return (
        <motion.div
            drag
            dragMomentum={false}
            style={{ position: 'fixed', top: '150px', left: '50px', width: '380px', zIndex: 1300 }}
            whileDrag={{ scale: 1.02, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
        >
            <GlassCard p={4} borderRadius="xl" w="full" cursor="grab">
                <Heading size="md" mb={4}>Celestial Events</Heading>
                {isLoading ? (
                    <HStack justify="center" minH="150px">
                        <Spinner />
                        <Text>Loading celestial events...</Text>
                    </HStack>
                ) : (
                    <Tabs variant="soft-rounded" colorScheme="purple">
                        <TabList>
                            <Tab><Icon as={FaSatellite} mr={2} /> ISS Passes</Tab>
                            <Tab><Icon as={FaMeteor} mr={2} /> Meteors</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <VStack align="stretch" spacing={3}>
                                    {data?.issPasses.map(pass => (
                                        <Box key={pass.time}>
                                            <Text fontWeight="bold">{new Date(pass.time).toLocaleString()}</Text>
                                            <Text fontSize="sm" color="whiteAlpha.800">Duration: {pass.duration}, Path: {pass.direction}</Text>
                                        </Box>
                                    ))}
                                </VStack>
                            </TabPanel>
                            <TabPanel>
                                <VStack align="stretch" spacing={3}>
                                    {data?.meteorShowers.map(shower => (
                                        <Box key={shower.name}>
                                            <Text fontWeight="bold">{shower.name}</Text>
                                            <Text fontSize="sm" color="whiteAlpha.800">Peak: {shower.peak}, Rate: {shower.rate}</Text>
                                        </Box>
                                    ))}
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                )}
            </GlassCard>
        </motion.div>
    );
}

export default CelestialEventsPanel;