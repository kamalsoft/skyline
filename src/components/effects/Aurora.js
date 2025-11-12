// src/components/effects/Aurora.js
import React from 'react';
import { motion } from 'framer-motion';

function Aurora({ colors }) {
    // Randomize properties for each aurora instance to make them unique
    const duration = 15 + Math.random() * 15; // 15-30 seconds
    const delay = Math.random() * 10; // 0-10 second delay
    const initialX = -50 + Math.random() * 100; // Start anywhere from -50vw to 50vw
    const initialY = 5 + Math.random() * 15; // Start in the top 5-20%
    const initialScale = 1 + Math.random() * 0.5;

    return (
        <motion.div
            style={{
                position: 'absolute',
                top: `${initialY}%`,
                left: `calc(50% + ${initialX}vw)`,
                width: '500px',
                height: '200px',
                borderRadius: '50%',
                background: `radial-gradient(ellipse at center, ${colors[0]} 0%, ${colors[1]} 70%)`,
                filter: 'blur(70px) brightness(1.2)',
                mixBlendMode: 'screen',
            }}
            animate={{
                x: [0, 50, -50, 0], // More dynamic horizontal movement
                y: [0, 20, -10, 0], // Add vertical movement
                scale: [initialScale, initialScale * 1.1, initialScale * 0.9, initialScale],
                opacity: [0.3, 0.6, 0.4, 0.3], // Add a subtle pulsing effect
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
            }}
        />
    );
}

export default Aurora;