// src/components/effects/SeasonalGlobe.js
import React from 'react';
import { Box, Icon, Tooltip, Text } from '@chakra-ui/react';
import { motion, useTransform } from 'framer-motion';
import { WiDaySunny } from 'react-icons/wi';

// Create a motion-enabled version of Chakra's Box component
const MotionBox = motion(Box);

const orbitalTilt = 23.5;

const SeasonMarker = React.memo(({ label, position }) => (
    <Box position="absolute" top={position.top} left={position.left} transform="translate(-50%, -50%)">
        <Text fontSize="xs" color="whiteAlpha.700" fontWeight="bold">
            {label}
        </Text>
    </Box>
));

const SeasonalGlobe = React.memo(({
    timeOfDay,
    dragX,
    isDay,
    moonPhaseName,
    illumination,
    MoonIcon,
    playSound,
    stopSound,
}) => {
    // These hooks are lightweight and designed to be called on every render
    const timeBasedRotate = useTransform(timeOfDay, [0, 1], [0, 360]);
    // The final rotation is a sum of the time-based rotation and the user's drag interaction
    const rotateZ = useTransform([timeBasedRotate, dragX], ([time, drag]) => time + drag);

    // Make the Earth globe itself rotate in the opposite direction of the drag for a more realistic feel
    const earthRotateY = useTransform(dragX, (val) => -val / 2);

    const sunMoonColor = useTransform(
        timeOfDay,
        [0, 0.23, 0.28, 0.35, 0.65, 0.72, 0.77, 1],
        ['#f0f0f0', '#f0f0f0', '#ff8c00', '#ffdd00', '#ffdd00', '#ff4500', '#f0f0f0', '#f0f0f0']
    );
    const sunMoonFilter = useTransform(sunMoonColor, (c) => `drop-shadow(0 0 15px ${c})`);

    return (
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
            <MotionBox
                drag="x"
                dragConstraints={{ left: -200, right: 200 }}
                dragElastic={0.2}
                onDragStart={() => playSound('ui-globe-drag')}
                onDragEnd={() => stopSound('ui-globe-drag')}
                style={{ x: dragX, zIndex: 10, willChange: 'transform' }}
            >
                <Tooltip label="Drag to spin the globe" placement="top" hasArrow>
                    <Box
                        cursor="grab"
                        as="div"
                        w="400px"
                        h="400px"
                        position="relative"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {/* --- NEW: Seasonal Markers --- */}
                        <SeasonMarker label="Spring Equinox" position={{ top: '50%', left: '-15%' }} />
                        <SeasonMarker label="Summer Solstice" position={{ top: '5%', left: '50%' }} />
                        <SeasonMarker label="Autumn Equinox" position={{ top: '50%', left: '115%' }} />
                        <SeasonMarker label="Winter Solstice" position={{ top: '95%', left: '50%' }} />

                        {/* The Globe */}
                        <MotionBox
                            w="150px"
                            h="150px"
                            borderRadius="50%"
                            position="relative"
                            overflow="hidden"
                            bg="radial-gradient(circle at 30% 30%, #87CEEB, #1a202c)"
                            boxShadow="inset 0 0 20px #000, 0 0 30px #1a202c"
                            zIndex="10"
                            style={{ rotateY: earthRotateY, willChange: 'transform' }} // Syncs Earth's rotation with drag
                        >
                            {/* --- NEW: Earth's Axis Line --- */}
                            <Box
                                position="absolute"
                                top="-20%"
                                left="50%"
                                w="2px"
                                h="140%"
                                bg="rgba(255, 100, 100, 0.6)"
                                transformOrigin="center"
                                transform={`translateX(-50%) rotate(${orbitalTilt}deg)`}
                                boxShadow="0 0 5px rgba(255, 100, 100, 0.8)"
                            />
                        </MotionBox>

                        {/* The Sun/Moon's Orbital Path */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                width: '300px',
                                height: '300px',
                                borderRadius: '50%',
                                border: '1px dashed rgba(255, 255, 255, 0.2)',
                                transformStyle: 'preserve-3d',
                                rotateX: orbitalTilt,
                                willChange: 'transform',
                            }}
                        >
                            {/* The Sun/Moon Body */}
                            <motion.div
                                style={{
                                    rotateZ,
                                    position: 'absolute',
                                    top: '50%',
                                    left: 0,
                                    transform: 'translate(-50%, -50%)',
                                    color: sunMoonColor,
                                    filter: sunMoonFilter,
                                    willChange: 'transform, color, filter',
                                }}
                            >
                                <Tooltip
                                    label={isDay ? 'Sun' : `${moonPhaseName} (${(illumination * 100).toFixed(0)}%)`}
                                    placement="top"
                                >
                                    <Box>
                                        <Icon as={isDay ? WiDaySunny : MoonIcon} boxSize="40px" />
                                    </Box>
                                </Tooltip>
                            </motion.div>
                        </motion.div>
                    </Box>
                </Tooltip>
            </MotionBox>
        </Box>
    );
});

export default SeasonalGlobe;