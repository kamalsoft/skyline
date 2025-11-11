// src/useAppUI.js
import { useState } from 'react';

export function useAppUI() {
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showLogTerminal, setShowLogTerminal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);

  return {
    showSettingsPanel,
    setShowSettingsPanel,
    showLogTerminal,
    setShowLogTerminal,
    isSidebarOpen,
    setIsSidebarOpen,
    isAnimationPaused,
    setIsAnimationPaused,
  };
}