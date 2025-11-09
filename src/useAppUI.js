// src/hooks/useAppUI.js
import { useState } from 'react';

/**
 * A custom hook to manage the UI state of the application.
 * This includes visibility of panels, modals, and other UI elements.
 *
 * @returns An object containing UI state variables and their setters.
 */
export function useAppUI() {
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showLogTerminal, setShowLogTerminal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('hasCompletedOnboarding'));

  return {
    showSettingsPanel,
    setShowSettingsPanel,
    showLogTerminal,
    setShowLogTerminal,
    isSidebarOpen,
    setIsSidebarOpen,
    isAnimationPaused,
    setIsAnimationPaused,
    isChangelogOpen,
    setIsChangelogOpen,
    showOnboarding,
    setShowOnboarding,
  };
}
