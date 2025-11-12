// src/components/SeasonalPath.js
import React from 'react';
import { Box, Heading, VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { WiDaySunny } from 'react-icons/wi';

const orbitalTilt = 23.5;

const SeasonMarker = React.memo(({ label, position }) => (
    <Box position="absolute" top={position.top} left={position.left} transform="translate(-50%, -50%)">
        <Text fontSize="xs" color="whiteAlpha.700" fontWeight="bold">
            {label}
        </Text>
    </Box>
));

function SeasonalPath() {
    const earthX = useMotionValue(0);
    const earthY = useMotionValue(0);

    // Create a dynamic shadow effect based on the Earth's position relative to the sun (at 0,0)
    const shadowDirectionX = useTransform(earthX, (x) => (x > 0 ? -1 : 1));
    const shadowDirectionY = useTransform(earthY, (y) => (y > 0 ? -1 : 1));
    const shadowOpacity = useTransform([earthX, earthY], ([x, y]) => {
        const distance = Math.sqrt(x * x + y * y);
        return 0.2 + (distance / 200) * 0.5; // Shadow is more pronounced when further away
    });

    const shadowGradient = useTransform(
        [shadowDirectionX, shadowDirectionY, shadowOpacity],
        ([dx, dy, opacity]) =>
            `radial-gradient(circle at ${50 + dx * 20}% ${50 + dy * 20}%, transparent, rgba(0,0,0,${opacity}))`
    );

    return (
        <VStack className="glass" p={4} borderRadius="xl" spacing={4} cursor="default">
            <VStack spacing={1} align="center">
                <Heading size="sm">The Sun's Seasonal Path</Heading>
                <HStack>
                    <Text fontSize="xs" color="whiteAlpha.800">
                        Axial Tilt:
                    </Text>
                    <Text fontSize="xs" fontWeight="bold" color="red.300">
                        {orbitalTilt}°
                    </Text>
                </HStack>
            </VStack>

            <Box w="400px" h="250px" position="relative" display="flex" alignItems="center" justifyContent="center">
                {/* Sun in the center */}
                <motion.div
                    animate={{ scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        color: '#ffdd00',
                        filter: 'drop-shadow(0 0 15px #ffdd00)',
                    }}
                >
                    <Icon as={WiDaySunny} boxSize="40px" />
                </motion.div>

                {/* Seasonal Markers */}
                <SeasonMarker label="Spring" position={{ top: '50%', left: '-5%' }} />
                <SeasonMarker label="Summer" position={{ top: '0%', left: '50%' }} />
                <SeasonMarker label="Autumn" position={{ top: '50%', left: '105%' }} />
                <SeasonMarker label="Winter" position={{ top: '100%', left: '50%' }} />

                {/* The Earth's Orbital Path */}
                <Box
                    position="absolute"
                    w="350px"
                    h="150px"
                    borderRadius="50%"
                    border="1px dashed rgba(255, 255, 255, 0.3)"
                />

                {/* The Draggable Earth */}
                <motion.div
                    drag
                    dragConstraints={{ top: -67, left: -167, right: 167, bottom: 67 }} // Ellipse bounds
                    dragElastic={0} // Don't allow dragging outside the path
                    style={{
                        x: earthX,
                        y: earthY,
                        position: 'absolute',
                        width: '50px',
                        height: '50px',
                        cursor: 'grab',
                    }}
                    whileTap={{ cursor: 'grabbing' }}
                >
                    <Tooltip label="Drag the Earth to see the seasons change" placement="top" hasArrow>
                        <motion.div
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                position: 'relative',
                                overflow: 'hidden',
                                // Earth texture and base color
                                bg: 'radial-gradient(circle at 30% 30%, #87CEEB, #1a202c)',
                                boxShadow: 'inset 0 0 10px #000',
                                // The axis is tilted relative to the orbit
                                transform: `rotate(${orbitalTilt}deg)`,
                            }}
                        >
                            {/* Dynamic shadow layer */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    backgroundImage: shadowGradient,
                                    // Counter-rotate the shadow to keep it oriented towards the sun
                                    transform: `rotate(-${orbitalTilt}deg)`,
                                }}
                            />
                            {/* Earth's Axis Line (inside the globe) */}
                            <Box
                                position="absolute"
                                top="-25%"
                                left="50%"
                                w="2px"
                                h="150%"
                                bg="rgba(255, 100, 100, 0.7)"
                                transform="translateX(-50%)"
                                boxShadow="0 0 5px rgba(255, 100, 100, 0.8)"
                            />
                        </motion.div>
                    </Tooltip>
                </motion.div>
            </Box>
            <Text fontSize="xs" color="whiteAlpha.600" textAlign="center" maxW="90%">
                The Earth's tilted axis always points in the same direction. As it orbits, different parts of the Earth get the Sun’s direct rays.
            </Text>
        </VStack>
    );
}

export default React.memo(SeasonalPath);