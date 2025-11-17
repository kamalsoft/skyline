// src/components/AnimatedBackground.js
import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { getMoonPhaseInfo } from '../utils/moonUtils';
import { useSound } from '../contexts/SoundContext';
import CanvasRenderer from './effects/CanvasRenderer';
import Aurora from './effects/Aurora';
import Lightning from './effects/Lightning';
import Fog from './effects/Fog';
import RainDrop from './effects/RainDrop';
import GlobePanel from './GlobePanel';

function AnimatedBackground({
  sunrise,
  sunset,
  weatherCode,
  background,
  isAnimationPaused,
  animationSettings,
  onLightningFlash,
}) {
  // const background = background || { type: 'gradient', value: '' };
  const timeOfDay = useMotionValue(0); // 0 = midnight, 0.5 = noon, 1 = midnight
  const { playSound, stopSound } = useSound();
  const dragX = useMotionValue(0);


  // --- Performance Optimization 1: Animate opacity of solid layers instead of gradients ---
  const nightOpacity = useTransform(timeOfDay, [0, 0.2, 0.8, 1], [1, 1, 1, 1]);
  const dawnOpacity = useTransform(timeOfDay, [0.2, 0.25, 0.3], [0, 1, 0]);
  const dayOpacity = useTransform(timeOfDay, [0.25, 0.3, 0.7, 0.75], [0, 1, 1, 0]);
  const duskOpacity = useTransform(timeOfDay, [0.7, 0.75, 0.8], [0, 1, 0]);

  const BackgroundLayer = ({ opacity, gradient }) => (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: gradient,
        opacity,
        willChange: 'opacity', // Hint to the browser
      }}
    />
  );
  // --- End Optimization 1 ---

  const cloudColor = useTransform(
    timeOfDay,
    [0, 0.23, 0.28, 0.35, 0.65, 0.72, 0.77, 1],
    [
      'rgba(60, 60, 80, 0.7)', // Midnight (dark grey-purple)
      'rgba(100, 80, 100, 0.8)', // Approaching Dawn
      'rgba(255, 180, 120, 0.8)', // Sunrise glow
      'rgba(255, 255, 255, 0.9)', // Day
      'rgba(255, 255, 255, 0.9)', // Day
      'rgba(255, 150, 100, 0.8)', // Sunset glow
      'rgba(120, 80, 120, 0.7)', // Dusk
      'rgba(60, 60, 80, 0.7)', // Midnight
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
      const totalNight = 24 * 60 * 60 * 1000 - totalDaylight;

      if (now >= sunriseTime && now <= sunsetTime) {
        const elapsed = now - sunriseTime;
        timeOfDay.set(0.25 + (elapsed / totalDaylight) * 0.5); // Map day from 0.25 to 0.75
      } else {
        const elapsed = now > sunsetTime ? now - sunsetTime : now + 24 * 60 * 60 * 1000 - sunsetTime;
        timeOfDay.set((0.75 + (elapsed / totalNight) * 0.5) % 1); // Map night from 0.75 to 1.25 (wraps to 0.25)
      }
    };

    updateCycle();
    const intervalId = setInterval(updateCycle, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [sunrise, sunset, timeOfDay]);

  const isDay = timeOfDay.get() > 0.25 && timeOfDay.get() < 0.75;
  const isNight = !isDay;
  const isPartlyCloudy = weatherCode === 2;
  const isOvercast = weatherCode === 3;
  const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isThunderstorm = weatherCode === 95 || weatherCode === 96 || weatherCode === 99;
  const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode);
  const isFoggy = weatherCode === 45 || weatherCode === 48;

  useEffect(() => {
    // Manage weather sounds
    if (isRainy) {
      playSound('weather-rain', { fade: true });
    } else {
      stopSound('weather-rain', { fade: true });
    }

    if (isThunderstorm) {
      const thunderInterval = setInterval(() => {
        const thunderSound = Math.random() > 0.5 ? 'weather-thunder1' : 'weather-thunder2';
        playSound(thunderSound);
      }, 8000); // Random thunder every 8 seconds on average
      return () => clearInterval(thunderInterval);
    }
  }, [isRainy, isThunderstorm, playSound, stopSound]);

  useEffect(() => {
    // Manage ambient sounds
    playSound(isDay ? 'ambient-day' : 'ambient-night', { fade: true });
    stopSound(isDay ? 'ambient-night' : 'ambient-day', { fade: true });

    return () => {
      stopSound('ambient-day', { fade: true });
      stopSound('ambient-night', { fade: true });
    }; // Cleanup on unmount
  }, [isDay, playSound, stopSound]);

  useEffect(() => {
    // Manage weather sounds
    if (isSnowy) {
      playSound('weather-snow', { fade: true });
    } else {
      stopSound('weather-snow', { fade: true });
    }
  }, [isSnowy, playSound, stopSound]);

  const { icon: MoonIcon, name: moonPhaseName, illumination } = getMoonPhaseInfo();

  if (background.type === 'image' && background.value) {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex="-1"
        bgImage={`url(${background.value})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      />
    );
  }

  return (
    <Box position="fixed" top="0" left="0" right="0" bottom="0" zIndex="-1" overflow="hidden" isolation="isolate">
      {/* Render solid layers and animate their opacity */}
      <BackgroundLayer opacity={nightOpacity} gradient="linear-gradient(to bottom, #0c0e2b, #1a202c)" />
      <BackgroundLayer opacity={dawnOpacity} gradient="linear-gradient(to bottom, #2c3e50, #fd5e53)" />
      <BackgroundLayer opacity={dayOpacity} gradient="linear-gradient(to bottom, #4A90E2, #87CEEB)" />
      <BackgroundLayer opacity={duskOpacity} gradient="linear-gradient(to bottom, #ff7e5f, #2c3e50)" />

      {/* Only render dynamic elements if not using a custom background */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" zIndex="1">
        {animationSettings.showWeatherEffects && (
          <>
            {isThunderstorm && (
              <Lightning isAnimationPaused={isAnimationPaused} isDay={isDay} onFlash={onLightningFlash} />
            )}

            {isFoggy && (
              <>
                <Fog top={60} duration={120} opacity={0.8} />
                <Fog top={50} duration={150} opacity={0.7} />
                <Fog top={55} duration={180} opacity={0.6} />
              </>
            )}
            {isRainy &&
              Array.from({ length: 30 }).map((_, i) => (
                <RainDrop
                  key={i}
                  left={Math.random() * 100}
                  duration={0.5 + Math.random() * 0.5}
                  isAnimationPaused={isAnimationPaused}
                />
              ))}
          </>
        )}
        {animationSettings.showAmbientEffects && isNight && (
          <>
            <Aurora colors={['rgba(0, 255, 150, 0.3)', 'rgba(0, 255, 150, 0)']} />
            <Aurora colors={['rgba(173, 216, 230, 0.3)', 'rgba(173, 216, 230, 0)']} />
            <Aurora colors={['rgba(221, 160, 221, 0.25)', 'rgba(221, 160, 221, 0)']} />
          </>
        )}
        <CanvasRenderer
          isAnimationPaused={isAnimationPaused}
          isNight={isNight}
          isPartlyCloudy={isPartlyCloudy}
          isOvercast={isOvercast}
          isSnowy={isSnowy}
          cloudColor={cloudColor.get()}
        />
        <GlobePanel
          timeOfDay={timeOfDay}
          dragX={dragX}
          isDay={isDay}
          moonPhaseName={moonPhaseName}
          illumination={illumination}
          MoonIcon={MoonIcon}
          playSound={playSound}
          stopSound={stopSound}
        />
      </Box>
    </Box>
  );
}

export default AnimatedBackground;
