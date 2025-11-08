// src/components/TwinklingStar.js
import React from 'react';
import { motion } from 'framer-motion';

function TwinklingStar() {
    const randomOpacity = 0.2 + Math.random() * 0.5;
    const randomSize = 1 + Math.random() * 2;
    const randomTop = Math.random() * 100;
    const randomLeft = Math.random() * 100;
    const randomDuration = 3 + Math.random() * 4;
    const randomDelay = Math.random() * 5;

    return (
        <motion.div
            style={{
                position: 'absolute',
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                width: `${randomSize}px`,
                height: `${randomSize}px`,
                backgroundColor: 'white',
                borderRadius: '50%',
                boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.7)',
            }}
            animate={{
                opacity: [randomOpacity, 1, randomOpacity],
            }}
            transition={{
                duration: randomDuration,
                repeat: Infinity,
                repeatType: 'mirror',
                delay: randomDelay,
            }}
        />
    );
}

export default TwinklingStar;