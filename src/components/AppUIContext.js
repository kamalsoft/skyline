// src/contexts/AppUIContext.js
import React, { createContext, useContext, useState } from 'react';

const AppUIContext = createContext();

export const useAppUI = () => useContext(AppUIContext);

export const AppUIProvider = ({ children }) => {
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);
    const [showLogTerminal, setShowLogTerminal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAnimationPaused, setIsAnimationPaused] = useState(false);

    const value = {
        showSettingsPanel,
        setShowSettingsPanel,
        showLogTerminal,
        setShowLogTerminal,
        isSidebarOpen,
        setIsSidebarOpen,
        isAnimationPaused,
        setIsAnimationPaused,
    };

    return <AppUIContext.Provider value={value}>{children}</AppUIContext.Provider>;
};