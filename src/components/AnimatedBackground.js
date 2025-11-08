// src/components/AnimatedBackground.js
import React, { useEffect } from 'react';
import { Box, Icon, Tooltip, Text, VStack } from '@chakra-ui/react';
import { WiDaySunny, WiCloud } from 'react-icons/wi';
import { motion, useTransform, useMotionValue, animate } from 'framer-motion';
import TwinklingStar from './TwinklingStar';
import ShootingStar from './ShootingStar';
import { getMoonPhaseInfo } from '../utils/moonUtils';

const RainDrop = ({ left, duration, isAnimationPaused }) => {
    const randomX = -10 + Math.random() * 20; // Random horizontal shift
    return (
        <motion.div
            style={{ position: 'absolute', left: `${left}%`, top: '-50px', width: '1.5px', height: '20px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0))', transform: 'rotate(10deg)' }}
            animate={{ y: '120vh', x: randomX }}
            transition={{ duration, repeat: isAnimationPaused ? 0 : Infinity, ease: 'linear' }}
        />
    );
};

const Cloud = ({ left, top, duration, size, opacity }) => (
    <motion.div
        style={{ position: 'absolute', left: `${left}%`, top: `${top}%` }}
        animate={{ x: ['-20vw', '120vw'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
        <Box position="relative" w={size} h={size}>
            <Icon as={WiCloud} w="100%" h="100%" position="absolute" top="0" left="0" color={`rgba(255, 255, 255, ${opacity * 0.8})`} />
            <Icon as={WiCloud} w="80%" h="80%" position="absolute" top="20%" left="10%" color={`rgba(255, 255, 255, ${opacity * 0.6})`} />
            <Icon as={WiCloud} w="60%" h="60%" position="absolute" top="10%" left="-10%" color={`rgba(255, 255, 255, ${opacity * 0.7})`} />
        </Box>
    </motion.div>
);

const cloudLayers = [
    // Back layer (slow, small, less opaque)
    { id: 1, left: 20, top: 10, duration: 120, size: 120, opacity: 0.5 },
    { id: 2, left: 70, top: 12, duration: 150, size: 100, opacity: 0.4 },
    // Mid layer
    { id: 3, left: -10, top: 15, duration: 80, size: 180, opacity: 0.7 },
    { id: 4, left: 60, top: 20, duration: 90, size: 160, opacity: 0.6 },
    // Front layer (fast, large, more opaque)
    { id: 5, left: 30, top: 25, duration: 60, size: 220, opacity: 0.8 },
];

const Aurora = ({ top, left, duration, colors, initial, animate }) => (
    <motion.div
        style={{
            position: 'absolute',
            top: `${top}%`,
            left: `${left}%`,
            width: '400px',
            height: '150px',
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${colors[0]} 0%, ${colors[1]} 70%)`,
            filter: 'blur(60px)',
            mixBlendMode: 'screen',
            opacity: 0.5,
        }}
        initial={initial}
        animate={animate}
        transition={{
            duration: duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut'
        }}
    />
);

const starArray = Array.from({ length: 70 });


function AnimatedBackground({ sunrise, sunset, weatherCode, background }) {
    const timeOfDay = useMotionValue(0); // 0 = midnight, 0.5 = noon, 1 = midnight

    const backgroundGradient = useTransform(
        timeOfDay,
        [0, 0.20, 0.25, 0.30, 0.70, 0.75, 0.80, 1], // Key points in the 24-hour cycle
        [
            'linear-gradient(to bottom, #0c0e2b, #1a202c)', // Midnight
            'linear-gradient(to bottom, #1a202c, #2c3e50)', // Deep Night
            'linear-gradient(to bottom, #2c3e50, #fd5e53)', // Dawn
            'linear-gradient(to bottom, #fd5e53, #87CEEB)', // Sunrise
            'linear-gradient(to bottom, #4A90E2, #87CEEB)', // Daytime
            'linear-gradient(to bottom, #87CEEB, #ff7e5f)', // Sunset
            'linear-gradient(to bottom, #ff7e5f, #2c3e50)', // Dusk
            'linear-gradient(to bottom, #0c0e2b, #1a202c)', // Midnight
        ]
    );

    const sunMoonColor = useTransform(
        timeOfDay,
        [0, 0.23, 0.28, 0.35, 0.65, 0.72, 0.77, 1],
        [
            '#f0f0f0', // Night (Moon)
            '#f0f0f0', // Approaching Dawn
            '#ff8c00', // Sunrise glow
            '#ffdd00', // Day (Sun)
            '#ffdd00', // Day (Sun)
            '#ff4500', // Sunset glow
            '#f0f0f0', // Approaching Night
            '#f0f0f0', // Night (Moon)
        ]
    );

    const glowSize = useMotionValue(15);

    useEffect(() => {
        const animation = animate(glowSize, [15, 25, 15], {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        });

        return () => animation.stop();
    }, [glowSize]);

    const sunMoonGlowColor = useTransform(
        timeOfDay,
        [0, 0.23, 0.28, 0.35, 0.65, 0.72, 0.77, 1],
        [
            '#f0f0f0', // Night (Moon)
            '#f0f0f0', // Approaching Dawn
            '#ff8c00', // Sunrise glow
            '#ffdd00', // Day (Sun)
            '#ffdd00', // Day (Sun)
            '#ff4500', // Sunset glow
            '#f0f0f0', // Approaching Night
            '#f0f0f0', // Night (Moon)
        ]
    );

    const sunMoonGlow = useTransform([glowSize, sunMoonGlowColor], ([size, color]) => `drop-shadow(0 0 ${size}px ${color})`);

    const offsetDistance = useTransform(timeOfDay, [0, 1], ['0%', '100%']);

    useEffect(() => {
        const updateCycle = () => {
            if (!sunrise || !sunset) {
                timeOfDay.set(0.5); // Default to midday
                return;
            }
            const now = new Date().getTime();
            const sunriseTime = new Date(sunrise).getTime();
            const sunsetTime = new Date(sunset).getTime();
            const totalDaylight = sunsetTime - sunriseTime;
            const totalNight = (24 * 60 * 60 * 1000) - totalDaylight;

            if (now >= sunriseTime && now <= sunsetTime) {
                const elapsed = now - sunriseTime;
                timeOfDay.set(0.25 + (elapsed / totalDaylight) * 0.5); // Map day from 0.25 to 0.75
            } else {
                const elapsed = now > sunsetTime ? now - sunsetTime : (now + (24 * 60 * 60 * 1000) - sunsetTime);
                timeOfDay.set((0.75 + (elapsed / totalNight) * 0.5) % 1); // Map night from 0.75 to 1.25 (wraps to 0.25)
            }
        };

        updateCycle();
        const intervalId = setInterval(updateCycle, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, [sunrise, sunset, timeOfDay]);

    const isDay = timeOfDay.get() > 0.25 && timeOfDay.get() < 0.75;
    const isCloudy = weatherCode > 1 && weatherCode <= 3;
    const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);

    // Path for sun/moon to follow (a simple arc)
    const path = `M -50 150 Q 500 -150 1050 150`;

    const { icon: MoonIcon, name: moonPhaseName, illumination } = getMoonPhaseInfo();

    if (background.type === 'image' && background.value) {
        return (
            <Box
                position="fixed" top="0" left="0" right="0" bottom="0" zIndex="-1"
                bgImage={`url(${background.value})`}
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
            />
        );
    }

    return (
        <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, backgroundImage: backgroundGradient, overflow: 'hidden' }}>
            {/* Only render dynamic elements if not using a custom background */}
            <>
                {isCloudy && cloudLayers.map(cloud => (
                    <Cloud key={cloud.id} {...cloud} />
                ))}
                {isRainy && Array.from({ length: 50 }).map((_, i) => (
                    <RainDrop key={i} left={Math.random() * 100} duration={0.5 + Math.random() * 0.5} />
                ))}
                {!isDay && <>
                    <Aurora top={5} left={10} duration={15} colors={['rgba(0, 255, 150, 0.2)', 'rgba(0, 255, 150, 0)']} initial={{ x: 0, scale: 1 }} animate={{ x: 50, scale: 1.2 }} />
                    <Aurora top={10} left={50} duration={20} colors={['rgba(173, 216, 230, 0.2)', 'rgba(173, 216, 230, 0)']} initial={{ x: 0, scale: 1.1 }} animate={{ x: -50, scale: 1 }} />
                    <Aurora top={0} left={30} duration={25} colors={['rgba(221, 160, 221, 0.15)', 'rgba(221, 160, 221, 0)']} initial={{ y: 0, scale: 1 }} animate={{ y: 20, scale: 1.3 }} />
                </>}
                {!isDay && starArray.map((_, i) => (
                    <TwinklingStar key={i} />
                ))}
                {!isDay && <>
                    <ShootingStar />
                    <ShootingStar />
                    <ShootingStar />
                </>}
                <svg width="100%" height="300px" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMax slice">
                    <path d={path} fill="none" stroke="none" id="sun-moon-path" />
                </svg>
                <motion.div style={{ position: 'absolute', top: 0, left: 0, offsetPath: `path("${path}")`, offsetDistance }}>
                    <Tooltip label={isDay ? "Sun" : `${moonPhaseName} (${(illumination * 100).toFixed(0)}%)`} placement="top">
                        <VStack spacing={0}>
                            <motion.div
                                style={{ color: sunMoonColor, filter: sunMoonGlow }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            >
                                <Icon as={isDay ? WiDaySunny : MoonIcon} w={20} h={20} />
                            </motion.div>
                            <motion.div style={{ color: sunMoonColor }}>
                                <Text fontSize="xs" fontWeight="bold">
                                    {isDay ? 'Sun' : moonPhaseName}
                                </Text>
                            </motion.div>
                        </VStack>
                    </Tooltip>
                </motion.div>
            </>
        </motion.div>
    );
}

export default AnimatedBackground;