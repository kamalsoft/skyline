// src/components/AnimatedBackground.js
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Icon, Tooltip } from '@chakra-ui/react';
import { WiDaySunny, WiCloud, WiDayCloudy, WiCloudy } from 'react-icons/wi';
import { motion, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import TwinklingStar from './TwinklingStar';

import ShootingStar from './ShootingStar';
import { getMoonPhaseInfo } from '../utils/moonUtils';
import { useSound } from '../contexts/SoundContext';

// Create a motion-enabled version of Chakra's Box component
const MotionBox = motion(Box);

const RainDrop = ({ left, duration, isAnimationPaused }) => {
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
};

const Cloud = ({ left, top, duration, size, opacity, icon, color }) => (
  <motion.div
    style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, willChange: 'transform' }}
    animate={{ x: ['-20vw', '120vw'] }}
    transition={{ duration, repeat: Infinity, ease: 'linear' }}
  >
    <Box position="relative" w={size} h={size}>
      <Icon as={icon} w="100%" h="100%" position="absolute" top="0" left="0" color={color} filter="blur(1px)" />
    </Box>
  </motion.div>
);

const Fog = ({ top, duration, opacity }) => (
  <motion.div
    style={{ position: 'absolute', left: '-50vw', top: `${top}%`, width: '200vw', height: '40%' }}
    animate={{ x: ['-50vw', '50vw', '-50vw'], willChange: 'transform' }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Box
      w="100%"
      h="100%"
      bg="radial-gradient(ellipse at center, rgba(200, 200, 200, 0.6) 0%, rgba(200, 200, 200, 0) 70%)"
      opacity={opacity}
    ></Box>
  </motion.div>
);

const Lightning = ({ isAnimationPaused, isDay, onFlash }) => {
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
  }, [isAnimationPaused, onFlash]);

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
};

const partlyCloudyLayers = [
  { id: 1, left: 10, top: 15, duration: 100, size: 150, opacity: 0.6, icon: WiDayCloudy },
  { id: 2, left: 80, top: 10, duration: 130, size: 120, opacity: 0.5, icon: WiCloud },
];

const overcastLayers = [
  { id: 1, left: 20, top: 10, duration: 120, size: 120, opacity: 0.7, icon: WiCloudy },
  { id: 2, left: 70, top: 12, duration: 150, size: 100, opacity: 0.6, icon: WiCloudy },
  { id: 3, left: -10, top: 15, duration: 80, size: 180, opacity: 0.8, icon: WiCloud },
  { id: 4, left: 60, top: 20, duration: 90, size: 160, opacity: 0.7, icon: WiCloudy },
  { id: 5, left: 30, top: 25, duration: 60, size: 220, opacity: 0.9, icon: WiCloud },
  { id: 6, left: 0, top: 5, duration: 110, size: 140, opacity: 0.65, icon: WiCloudy },
  { id: 7, left: 85, top: 18, duration: 100, size: 130, opacity: 0.75, icon: WiCloud },
];

const Aurora = ({ top, left, duration, colors, initial, animate }) => (
  <motion.div
    style={{
      position: 'absolute',
      top: `${top}%`,
      left: `${left}%`,
      width: '400px',
      height: '150px',
      borderRadius: '50%',
      background: `radial-gradient(ellipse at center, ${colors[0]} 0%, ${colors[1]} 70%)`,
      filter: 'blur(60px)',
      mixBlendMode: 'screen',
      opacity: 0.5,
    }}
    initial={initial}
    animate={animate}
    transition={{
      duration: duration,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
    }}
  />
);

const MemoizedTwinklingStars = React.memo(({ count, isAnimationPaused }) => {
  const stars = useMemo(
    () => Array.from({ length: count }).map((_, i) => <TwinklingStar key={i} isAnimationPaused={isAnimationPaused} />),
    [count, isAnimationPaused]
  );
  return <>{stars}</>;
});

function AnimatedBackground({
  sunrise,
  sunset,
  weatherCode,
  background,
  isAnimationPaused,
  animationSettings,
  onLightningFlash,
}) {
  const timeOfDay = useMotionValue(0); // 0 = midnight, 0.5 = noon, 1 = midnight
  const { playSound, stopSound } = useSound();

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

  const sunMoonColor = useTransform(
    timeOfDay,
    [0, 0.23, 0.28, 0.35, 0.65, 0.72, 0.77, 1],
    [
      '#f0f0f0', // Night (Moon)
      '#f0f0f0', // Approaching Dawn
      '#ff8c00', // Sunrise glow
      '#ffdd00', // Day (Sun)
      '#ffdd00', // Day (Sun)
      '#ff4500', // Sunset glow
      '#f0f0f0', // Approaching Night
      '#f0f0f0', // Night (Moon)
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
  const isPartlyCloudy = weatherCode === 2;
  const isOvercast = weatherCode === 3;
  const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isThunderstorm = weatherCode === 95 || weatherCode === 96 || weatherCode === 99;
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

  // A fixed tilt for the globe, representing Earth's natural axis.
  // The seasonal explanation is now in a dedicated component.
  const orbitalTilt = 23.5;

  // Motion values for interactive globe dragging
  const dragX = useMotionValue(0);
  // The sun/moon's base rotation based on the time of day
  const timeBasedRotate = useTransform(timeOfDay, [0, 1], [0, 360]);
  // The final rotation is a sum of the time-based rotation and the user's drag interaction
  const rotateZ = useTransform([timeBasedRotate, dragX], ([time, drag]) => time + drag);

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
    <Box position="fixed" top="0" left="0" right="0" bottom="0" zIndex="-1" overflow="hidden">
      {/* Render solid layers and animate their opacity */}
      <BackgroundLayer opacity={nightOpacity} gradient="linear-gradient(to bottom, #0c0e2b, #1a202c)" />
      <BackgroundLayer opacity={dawnOpacity} gradient="linear-gradient(to bottom, #2c3e50, #fd5e53)" />
      <BackgroundLayer opacity={dayOpacity} gradient="linear-gradient(to bottom, #4A90E2, #87CEEB)" />
      <BackgroundLayer opacity={duskOpacity} gradient="linear-gradient(to bottom, #ff7e5f, #2c3e50)" />

      {/* Only render dynamic elements if not using a custom background */}
      <>
        {animationSettings.showWeatherEffects && (
          <>
            {isThunderstorm && (
              <Lightning isAnimationPaused={isAnimationPaused} isDay={isDay} onFlash={onLightningFlash} />
            )}
            {isPartlyCloudy &&
              partlyCloudyLayers.map((cloud) => <Cloud key={cloud.id} {...cloud} color={cloudColor.get()} />)}
            {isOvercast && overcastLayers.map((cloud) => <Cloud key={cloud.id} {...cloud} color={cloudColor.get()} />)}
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
        {animationSettings.showAmbientEffects && !isDay && (
          <>
            <Aurora
              top={5}
              left={10}
              duration={15}
              colors={['rgba(0, 255, 150, 0.2)', 'rgba(0, 255, 150, 0)']}
              initial={{ x: 0, scale: 1 }}
              animate={{ x: 50, scale: 1.2 }}
            />
            <Aurora
              top={10}
              left={50}
              duration={20}
              colors={['rgba(173, 216, 230, 0.2)', 'rgba(173, 216, 230, 0)']}
              initial={{ x: 0, scale: 1.1 }}
              animate={{ x: -50, scale: 1 }}
            />
            <Aurora
              top={0}
              left={30}
              duration={25}
              colors={['rgba(221, 160, 221, 0.15)', 'rgba(221, 160, 221, 0)']}
              initial={{ y: 0, scale: 1 }}
              animate={{ y: 20, scale: 1.3 }}
            />
            <MemoizedTwinklingStars count={50} isAnimationPaused={isAnimationPaused} />
            <>
              <ShootingStar isAnimationPaused={isAnimationPaused} />
              <ShootingStar isAnimationPaused={isAnimationPaused} />
              <ShootingStar isAnimationPaused={isAnimationPaused} />
            </>
          </>
        )}
        {/* New Globe and Orbit Animation */}
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
          <MotionBox
            drag="x"
            dragConstraints={{ left: -200, right: 200 }}
            dragElastic={0.2}
            style={{ x: dragX }} // Bind the motion value to the component's style for dragging
          >
            <Tooltip label="Drag to spin the globe" placement="top" hasArrow>
              <Box cursor="grab" as="div"
                w="400px"
                h="400px"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {/* The Globe */}
                <Box
                  w="150px"
                  h="150px"
                  borderRadius="50%"
                  bg="radial-gradient(circle at 30% 30%, #87CEEB, #1a202c)"
                  boxShadow="inset 0 0 20px #000, 0 0 30px #1a202c"
                  zIndex="10"
                />

                {/* The Sun/Moon's Orbital Path */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    transformStyle: 'preserve-3d',
                    rotateX: orbitalTilt, // Tilt of the orbit based on season
                  }}
                >
                  {/* The Sun/Moon Body */}
                  <motion.div
                    style={{
                      // The rotation is now controlled by the drag gesture
                      rotateZ,
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      transform: 'translate(-50%, -50%)',
                      color: sunMoonColor.get(),
                      filter: `drop-shadow(0 0 15px ${sunMoonColor.get()})`,
                    }}
                  >
                    <Tooltip label={isDay ? 'Sun' : `${moonPhaseName} (${(illumination * 100).toFixed(0)}%)`} placement="top">
                      {/* Wrap the Icon in a Box to fix the ref warning */}
                      <Box>
                        <Icon as={isDay ? WiDaySunny : MoonIcon} boxSize="40px" />
                      </Box>
                    </Tooltip>
                  </motion.div>
                </motion.div>
              </Box>
            </Tooltip>
          </MotionBox>
        </Box>
      </>
    </Box>
  );
}

export default AnimatedBackground;
