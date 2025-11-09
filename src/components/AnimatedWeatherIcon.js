// src/components/AnimatedWeatherIcon.js
import React from 'react';
import { Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { getWeatherIcon } from '../utils/weatherUtils';

const animations = {
  spin: {
    rotate: 360,
    transition: { repeat: Infinity, ease: 'linear', duration: 25 },
  },
  juggle: {
    y: [0, -4, 0, 2, 0],
    transition: { repeat: Infinity, repeatType: 'reverse', duration: 6, ease: 'easeInOut' },
  },
  rain: {
    y: [0, 2, 0],
    transition: { repeat: Infinity, repeatType: 'reverse', duration: 2, ease: 'easeInOut' },
  },
  fog: {
    opacity: [0.7, 1, 0.7],
    transition: { repeat: Infinity, repeatType: 'reverse', duration: 4, ease: 'easeInOut' },
  },
  default: {
    // No continuous animation
  },
};

const getAnimationType = (code) => {
  if (code <= 1) return 'spin'; // Sun
  if (code > 1 && code <= 3) return 'juggle'; // Clouds
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'; // Drizzle/Rain
  if (code >= 45 && code <= 48) return 'fog'; // Fog
  return 'default';
};

function AnimatedWeatherIcon({ weatherCode, ...rest }) {
  const IconComponent = getWeatherIcon(weatherCode);
  const animationType = getAnimationType(weatherCode);
  const animationProps = animations[animationType];

  return (
    <motion.div
      // Initial "pop-in" animation
      initial={{ scale: 0.5, opacity: 0 }}
      // Continuous animation combined with pop-in
      animate={{
        scale: 1,
        opacity: 1,
        ...animationProps,
      }}
      // The transition for the continuous animation is defined in the animation object itself
      transition={{
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
        ...animationProps.transition,
      }}
    >
      <Icon as={IconComponent} {...rest} />
    </motion.div>
  );
}

export default AnimatedWeatherIcon;
