// src/components/ShootingStar.js
import React from 'react';
import { motion } from 'framer-motion';

function ShootingStar() {
    // Randomize properties for each star to make them unique
    const randomTop = Math.random() * 60; // Start position from top (0% to 60%)
    const randomDelay = 2 + Math.random() * 8; // Animation delay (2s to 10s)
    const randomDuration = 0.5 + Math.random() * 1; // Animation duration (0.5s to 1.5s)

    return (
        <motion.div
            style={{
                position: 'absolute',
                top: `${randomTop}%`,
                left: '-100px', // Start off-screen to the left
                width: '150px',
                height: '2px',
                background: 'linear-gradient(to right, white, transparent)',
                transform: 'rotate(-20deg)', // Angle of the streak
                opacity: 0,
            }}
            animate={{
                x: '120vw', // Animate across the full viewport width
                opacity: [0, 1, 0], // Fade in, then fade out
            }}
            transition={{
                x: {
                    duration: randomDuration,
                    repeat: Infinity,
                    repeatType: 'loop',
                    repeatDelay: randomDelay,
                    ease: 'linear',
                },
                opacity: {
                    duration: randomDuration,
                    repeat: Infinity,
                    repeatType: 'loop',
                    repeatDelay: randomDelay,
                    ease: [0.5, 0, 1, 1], // Custom ease for a quick fade in and slow fade out
                },
            }}
        />
    );
}

export default ShootingStar;