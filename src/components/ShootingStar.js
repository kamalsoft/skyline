// src/components/ShootingStar.js
import React from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../contexts/SoundContext';

// Define different animation paths for the shooting stars
const scenarios = [
  // Left to Right
  {
    initial: { x: '-10vw', y: '10vh', opacity: 0, rotate: -20 },
    animate: { x: '110vw', y: '40vh', opacity: [0, 1, 0] },
  },
  // Top-Left to Bottom-Right
  {
    initial: { x: '10vw', y: '-10vh', opacity: 0, rotate: 45 },
    animate: { x: '90vw', y: '90vh', opacity: [0, 1, 0] },
  },
  // Top-Right to Bottom-Left
  {
    initial: { x: '90vw', y: '-10vh', opacity: 0, rotate: 135 },
    animate: { x: '-10vw', y: '90vh', opacity: [0, 1, 0] },
  },
  // High Arc Left to Right
  {
    initial: { x: '-10vw', y: '30vh', opacity: 0, rotate: -10 },
    animate: { x: '110vw', y: '50vh', opacity: [0, 1, 0] },
  },
];

function ShootingStar({ isAnimationPaused }) {
  const { playSound } = useSound();
  // Randomly select a scenario
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  // Randomize timing properties
  const randomDelay = 2 + Math.random() * 8; // Animation delay (2s to 10s)
  const randomDuration = 1 + Math.random() * 1.5; // Animation duration (1s to 2.5s)

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '150px',
        height: '2px',
        background: 'linear-gradient(to right, white, transparent)',
      }}
      initial={scenario.initial}
      animate={scenario.animate}
      transition={{
        duration: randomDuration,
        repeat: isAnimationPaused ? 0 : Infinity,
        repeatType: 'loop',
        repeatDelay: randomDelay,
        ease: 'easeIn',
      }}
      onAnimationStart={() => playSound('ambient-shooting-star')}
    />
  );
}

export default ShootingStar;
