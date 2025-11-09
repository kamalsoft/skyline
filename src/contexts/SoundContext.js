// src/contexts/SoundContext.js
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Howl, Howler } from 'howler';

const SoundContext = createContext();

const soundFiles = {
  // UI Sounds
  'ui-click': '/sounds/ui-click.mp3',
  'ui-toggle': '/sounds/ui-toggle.mp3',
  'ui-drag': '/sounds/ui-drag.mp3',
  'ui-drop': '/sounds/ui-drop.mp3',

  // Weather Sounds
  'weather-rain': '/sounds/weather-rain.mp3',
  'weather-thunder1': '/sounds/weather-thunder-1.mp3',
  'weather-thunder2': '/sounds/weather-thunder-2.mp3',

  // Ambient Sounds
  'ambient-day': '/sounds/ambient-day.mp3',
  'ambient-night': '/sounds/ambient-night.mp3',
  'ambient-shooting-star': '/sounds/ambient-shooting-star.mp3',
};

export const SoundProvider = ({ children }) => {
  const [sounds, setSounds] = useState({});
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('soundSettings');
      return saved
        ? JSON.parse(saved)
        : {
            masterEnabled: true,
            weatherVolume: 0.5,
            uiVolume: 0.7,
            ambientVolume: 0.3,
          };
    } catch (e) {
      return { masterEnabled: true, weatherVolume: 0.5, uiVolume: 0.7, ambientVolume: 0.3 };
    }
  });

  useEffect(() => {
    const loadedSounds = {};
    Object.keys(soundFiles).forEach((key) => {
      const isLoop = ['rain', 'day', 'night'].includes(key);
      loadedSounds[key] = new Howl({
        src: [soundFiles[key]],
        loop: isLoop,
        html5: true, // Important for performance on mobile
      });
    });
    setSounds(loadedSounds);

    return () => {
      Object.values(loadedSounds).forEach((sound) => sound.unload());
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('soundSettings', JSON.stringify(settings));
    Howler.mute(!settings.masterEnabled);

    // Update volumes of currently playing sounds
    if (sounds['weather-rain'] && sounds['weather-rain'].playing())
      sounds['weather-rain'].volume(settings.weatherVolume);
    if (sounds['ambient-day'] && sounds['ambient-day'].playing()) sounds['ambient-day'].volume(settings.ambientVolume);
    if (sounds['ambient-night'] && sounds['ambient-night'].playing())
      sounds['ambient-night'].volume(settings.ambientVolume);
  }, [settings, sounds]);

  const playSound = useCallback(
    (key, options = {}) => {
      const sound = sounds[key];
      if (!sound) return;

      let volume = 1;
      if (key.startsWith('ui-')) volume = settings.uiVolume;
      else if (key.startsWith('weather-')) volume = settings.weatherVolume;
      else if (key.startsWith('ambient-')) volume = settings.ambientVolume;

      if (options.fade) {
        sound.volume(0);
        sound.play();
        sound.fade(0, volume, 1000);
      } else {
        sound.volume(volume);
        sound.play();
      }
    },
    [sounds, settings]
  );

  const stopSound = useCallback(
    (key, options = {}) => {
      const sound = sounds[key];
      if (!sound || !sound.playing()) return;

      if (options.fade) {
        sound.fade(sound.volume(), 0, 1000);
        sound.once('fade', () => sound.stop());
      } else {
        sound.stop();
      }
    },
    [sounds]
  );

  const value = useMemo(
    () => ({
      settings,
      updateSettings: setSettings,
      playSound,
      stopSound,
    }),
    [settings, playSound, stopSound]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = () => useContext(SoundContext);
