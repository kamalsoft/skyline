// src/components/effects/RainDrop.js
import React from 'react';
import { motion } from 'framer-motion';

function RainDrop({ left, duration, isAnimationPaused }) {
    return (
        <motion.div
            style={{
                position: 'absolute',
                left: `${left}%`,
                top: '-50px',
                width: '1.5px',
                height: '20px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0))',
                transform: 'rotate(10deg)',
                willChange: 'transform',
            }}
            animate={{ y: '120vh', x: -10 + Math.random() * 20 }}
            transition={{ duration, repeat: isAnimationPaused ? 0 : Infinity, ease: 'linear' }}
        />
    );
}

export default RainDrop;