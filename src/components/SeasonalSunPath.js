// src/components/SeasonalSunPath.js
import React, { useRef, useEffect, useState } from 'react';
import { Box, VStack, Heading, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { FaGlobeAmericas } from 'react-icons/fa';
import { WiDaySunny } from 'react-icons/wi'; // Using sun icon for the sun

function SeasonalSunPath() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    // Key dates in the Earth's orbit (day of the year)
    const vernalEquinox = 80; // ~Mar 20
    const summerSolstice = 172; // ~Jun 21
    const autumnalEquinox = 266; // ~Sep 23
    const winterSolstice = 355; // ~Dec 21

    // Determine current season in the Northern Hemisphere
    let season, explanation;
    if (dayOfYear >= vernalEquinox && dayOfYear < summerSolstice) {
        season = 'Spring';
        explanation = 'The Northern Hemisphere is tilting towards the sun, leading to longer days and warmer weather.';
    } else if (dayOfYear >= summerSolstice && dayOfYear < autumnalEquinox) {
        season = 'Summer';
        explanation = 'The Northern Hemisphere is at its maximum tilt towards the sun, experiencing the longest days of the year.';
    } else if (dayOfYear >= autumnalEquinox && dayOfYear < winterSolstice) {
        season = 'Autumn';
        explanation = 'The Northern Hemisphere is tilting away from the sun, leading to shorter days and cooler weather.';
    } else {
        season = 'Winter';
        explanation = 'The Northern Hemisphere is at its maximum tilt away from the sun, experiencing the shortest days of the year.';
    }

    // Calculate Earth's position on the path (0% to 100%)
    const earthProgress = (dayOfYear / 365) * 100;

    // --- Animation Refactoring ---
    const pathRef = useRef(null);
    const [pathLength, setPathLength] = useState(0);
    const orbitProgress = useMotionValue(earthProgress / 100);

    // Transform the progress (0-1) into values for SVG and CSS
    const pathDraw = useTransform(orbitProgress, (p) => pathLength * (1 - p));
    const earthPosition = useTransform(orbitProgress, (p) => `${p * 100}%`);

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    useEffect(() => {
        if (pathLength > 0) { // Only start animation after path length is measured
            const animation = animate(orbitProgress, 1, {
                duration: 30 * (1 - orbitProgress.get()), // Duration for the rest of the year
                ease: 'linear',
                onComplete: () => {
                    orbitProgress.set(0); // Reset to the beginning
                    animate(orbitProgress, 1, { duration: 30, ease: 'linear', repeat: Infinity });
                },
            });
            return () => animation.stop();
        }
    }, [pathLength, orbitProgress]);

    const labelColor = useColorModeValue('gray.600', 'gray.400');

    const OrbitLabel = ({ children, top, left, right, bottom }) => (
        <Text position="absolute" top={top} left={left} right={right} bottom={bottom} fontSize="10px" fontWeight="bold" color={labelColor} textAlign="center">
            {children}
        </Text>
    );

    return (
        <Box className="glass" p={6} borderRadius="xl" mt={6}>
            <VStack spacing={4} align="stretch">
                <Heading as="h4" size="md" textAlign="center">
                    Earth's Orbit & The Seasons
                </Heading>
                <Text fontSize="sm" color={labelColor}>
                    It is currently <Text as="span" fontWeight="bold" color="white">{season}</Text> in the Northern Hemisphere. {explanation}
                </Text>

                {/* Visual Orbit Diagram */}
                <Box position="relative" w="100%" h={{ base: '200px', md: '250px' }} mt={4}>
                    <svg
                        viewBox="0 0 500 250"
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    >
                        {/* Apsides Line */}
                        <line x1="50" y1="125" x2="450" y2="125" stroke={useColorModeValue('gray.300', 'gray.600')} strokeWidth="1" />
                        {/* Elliptical Orbit Path */}
                        <motion.path
                            ref={pathRef}
                            id="orbit-path"
                            d="M 50,125 a 200,100 0 1,0 400,0 a 200,100 0 1,0 -400,0"
                            fill="none"
                            stroke={useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)')}
                            strokeWidth="2"
                            strokeDasharray={`${pathLength} ${pathLength}`}
                            strokeLinecap="round"
                            style={{ strokeDashoffset: pathDraw }}
                        />
                    </svg>

                    {/* Sun Position (at one focus of the ellipse) */}
                    <motion.div
                        style={{ position: 'absolute', top: '50%', left: 'calc(50% - 80px)', transform: 'translate(-50%, -50%)' }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Icon as={WiDaySunny} color="orange.300" boxSize={{ base: '30px', md: '40px' }} filter="drop-shadow(0 0 15px orange)" />
                    </motion.div>

                    {/* Earth Animation */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            offsetPath: 'path("M 50,125 a 200,100 0 1,0 400,0 a 200,100 0 1,0 -400,0")',
                            width: '20px',
                            height: '20px',
                            offsetDistance: earthPosition,
                        }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Icon as={FaGlobeAmericas} color="blue.300" boxSize="20px" />
                        </motion.div>
                    </motion.div>

                    {/* Labels for Orbital Points */}
                    <Box w="100%" h="100%" position="absolute" top="0" left="0">
                        {/* Solstices & Equinoxes */}
                        <OrbitLabel top="50%" left="calc(50% + 200px - 15px)">Spring</OrbitLabel>
                        <OrbitLabel top="0" left="50%">Summer</OrbitLabel>
                        <OrbitLabel top="50%" right="calc(50% + 200px - 15px)">Autumn</OrbitLabel>
                        <OrbitLabel bottom="0" left="50%">Winter</OrbitLabel>

                        {/* Apsides Line Labels */}
                        <OrbitLabel top="calc(50% + 10px)" left="calc(50% - 200px - 35px)">Perihelion<br />(Closest)</OrbitLabel>
                        <OrbitLabel top="calc(50% + 10px)" right="calc(50% - 200px - 35px)">Aphelion<br />(Farthest)</OrbitLabel>
                    </Box>
                </Box>
            </VStack>
        </Box>
    );
}

export default React.memo(SeasonalSunPath);