// src/components/AnimatedBackground.js
import React, { useEffect } from 'react';
import { Box, Icon, Tooltip } from '@chakra-ui/react';
import { WiDaySunny, WiCloud } from 'react-icons/wi';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import TwinklingStar from './TwinklingStar';
import ShootingStar from './ShootingStar';
import { getMoonPhaseInfo } from '../utils/moonUtils';

const RainDrop = ({ left, duration }) => (
    <motion.div
        style={{ position: 'absolute', left: `${left}%`, top: '-20px', width: '2px', height: '15px', background: 'rgba(255, 255, 255, 0.5)' }}
        animate={{ y: '110vh' }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
    />
);

const Cloud = ({ left, top, duration, size }) => (
    <motion.div
        style={{ position: 'absolute', left: `${left}%`, top: `${top}%` }}
        animate={{ x: ['-20vw', '120vw'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
        <Box position="relative" w={size} h={size}>
            <Icon as={WiCloud} w="100%" h="100%" position="absolute" top="0" left="0" color="rgba(255, 255, 255, 0.8)" />
            <Icon as={WiCloud} w="80%" h="80%" position="absolute" top="20%" left="10%" color="rgba(255, 255, 255, 0.6)" />
            <Icon as={WiCloud} w="60%" h="60%" position="absolute" top="10%" left="-10%" color="rgba(255, 255, 255, 0.7)" />
        </Box>
    </motion.div>
);

const starArray = Array.from({ length: 70 });


function AnimatedBackground({ sunrise, sunset, weatherCode }) {
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

    const { icon: MoonIcon, name: moonPhaseName } = getMoonPhaseInfo();

    return (
        <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, background: backgroundGradient, overflow: 'hidden' }}>
            {isCloudy && <>
                <Cloud left={10} top={5} duration={60} size={200} />
                <Cloud left={50} top={15} duration={80} size={150} />
            </>}
            {isRainy && Array.from({ length: 50 }).map((_, i) => (
                <RainDrop key={i} left={Math.random() * 100} duration={0.5 + Math.random() * 0.5} />
            ))}
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
            <motion.div
                style={{ position: 'absolute', top: 0, left: 0, color: sunMoonColor }}
                animate={{
                    offsetDistance: `${timeOfDay.get() * 100}%`,
                }}
                transition={{ duration: 1, ease: 'linear' }}
            >
                <Tooltip label={moonPhaseName} placement="top" isDisabled={isDay}>
                    <Icon as={isDay ? WiDaySunny : MoonIcon} w={20} h={20} style={{ motionPath: `path("${path}")` }} />
                </Tooltip>
            </motion.div>
        </motion.div>
    );
}

export default AnimatedBackground;