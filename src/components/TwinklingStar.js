// src/components/TwinklingStar.js
import React from 'react';
import { motion } from 'framer-motion';

function TwinklingStar({ isAnimationPaused }) {
  const starColors = ['#FFFFFF', '#F0F8FF', '#FAFAD2', '#FFFAFA']; // White, AliceBlue, LightGoldenRodYellow, Snow
  const randomColor = starColors[Math.floor(Math.random() * starColors.length)];
  const randomOpacity = 0.3 + Math.random() * 0.5;
  const randomSize = 1 + Math.random() * 2;
  const randomTop = Math.random() * 100;
  const randomLeft = Math.random() * 100;
  const randomDuration = 2 + Math.random() * 5;
  const randomDelay = Math.random() * 5;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: `${randomTop}%`,
        left: `${randomLeft}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        backgroundColor: randomColor,
        borderRadius: '50%',
        boxShadow: `0 0 ${randomSize * 2}px 1px ${randomColor}`,
      }}
      animate={{
        opacity: [randomOpacity, 1, randomOpacity],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: randomDuration,
        repeat: isAnimationPaused ? 0 : Infinity,
        repeatType: 'mirror',
        delay: randomDelay,
      }}
    />
  );
}

export default TwinklingStar;
