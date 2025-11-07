// src/components/AnimatedBackground.js
import React, { useEffect, useState } from 'react';
import { Box, Icon, useColorModeValue } from '@chakra-ui/react';
import { WiDaySunny, WiNightClear, WiCloud } from 'react-icons/wi';
import { motion } from 'framer-motion';

const RainDrop = ({ left, duration }) => (
    <motion.div
        style={{ position: 'absolute', left: `${left}%`, top: '-20px', width: '2px', height: '15px', background: 'rgba(255, 255, 255, 0.5)' }}
        animate={{ y: '110vh' }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
    />
);

const Cloud = ({ left, top, duration, size }) => (
    <motion.div
        style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, color: 'rgba(255, 255, 255, 0.7)' }}
        animate={{ x: ['-20vw', '120vw'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
        <Icon as={WiCloud} w={size} h={size} />
    </motion.div>
);


function AnimatedBackground({ sunrise, sunset, weatherCode }) {
    const [timePercentage, setTimePercentage] = useState(0);

    const dayBg = 'linear-gradient(to bottom, #4A90E2, #87CEEB)';
    const nightBg = 'linear-gradient(to bottom, #0c0e2b, #1a202c)';
    const bgColor = useColorModeValue(dayBg, nightBg);

    useEffect(() => {
        if (!sunrise || !sunset) {
            setTimePercentage(0.5); // Default to midday if no data
            return;
        }

        const now = new Date().getTime();
        const sunriseTime = new Date(sunrise).getTime();
        const sunsetTime = new Date(sunset).getTime();

        if (now >= sunriseTime && now <= sunsetTime) {
            // It's day
            const totalDaylight = sunsetTime - sunriseTime;
            const elapsed = now - sunriseTime;
            setTimePercentage(elapsed / totalDaylight); // Map to 0.0 -> 1.0 for the sun's path
        } else {
            // It's night
            const prevSunset = new Date(sunsetTime).setDate(new Date(sunsetTime).getDate() - 1);
            const totalNight = sunriseTime - prevSunset;
            const elapsed = now > sunsetTime ? now - sunsetTime + totalNight : now - prevSunset;
            setTimePercentage(0.5 + (elapsed / totalNight) * 0.5); // Map night to 0.5 -> 1.0 -> 0.5
        }

    }, [sunrise, sunset]);

    const isDay = timePercentage > 0 && timePercentage < 1;
    const isCloudy = weatherCode > 1 && weatherCode <= 3;
    const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);

    // Path for sun/moon to follow (a simple arc)
    const path = `M -50 150 Q 500 -150 1050 150`;

    return (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" zIndex="-1" bg={bgColor} overflow="hidden">
            {isCloudy && <>
                <Cloud left={10} top={5} duration={60} size={200} />
                <Cloud left={50} top={15} duration={80} size={150} />
            </>}
            {isRainy && Array.from({ length: 50 }).map((_, i) => (
                <RainDrop key={i} left={Math.random() * 100} duration={0.5 + Math.random() * 0.5} />
            ))}
            <svg width="100%" height="300px" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMax slice">
                <path d={path} fill="none" stroke="none" id="sun-moon-path" />
            </svg>
            <motion.div
                style={{ position: 'absolute', top: 0, left: 0, color: isDay ? 'yellow.300' : 'gray.200' }}
                animate={{
                    offsetDistance: `${timePercentage * 100}%`,
                }}
                transition={{ duration: 1, ease: 'linear' }}
            >
                <Icon as={isDay ? WiDaySunny : WiNightClear} w={20} h={20} style={{ motionPath: `path("${path}")` }} />
            </motion.div>
        </Box>
    );
}

export default AnimatedBackground;