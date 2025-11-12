// src/components/effects/Lightning.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Lightning({ isAnimationPaused, isDay, onFlash }) {
    const [visible, setVisible] = useState(false);
    const flashColor = isDay ? 'white' : 'rgba(200, 220, 255, 0.9)'; // White for day, light blue for night

    useEffect(() => {
        if (isAnimationPaused) return;

        let timeoutId;
        const flash = () => {
            onFlash(); // Trigger the callback
            setVisible(true);
            setTimeout(() => setVisible(false), Math.random() * 100 + 50); // Flash duration
            const nextFlash = Math.random() * 5000 + 2000; // Next flash in 2-7 seconds
            timeoutId = setTimeout(flash, nextFlash);
        };

        const initialDelay = Math.random() * 5000;
        timeoutId = setTimeout(flash, initialDelay);

        return () => clearTimeout(timeoutId);
    }, [isAnimationPaused, onFlash, isDay]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: flashColor, zIndex: 1 }}
                />
            )}
        </AnimatePresence>
    );
}

export default Lightning;