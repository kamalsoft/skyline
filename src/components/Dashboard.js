// src/components/Dashboard.js
import React from 'react';
import { Box, Grid, VStack, HStack, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';

// This is a placeholder for your actual panel components.
const Panel = ({ title, ...props }) => (
    <Box borderWidth="1px" borderRadius="lg" p={4} {...props}>
        <Text fontWeight="bold">{title}</Text>
        {/* ... panel content goes here */}
    </Box>
);

// Create motion-wrapped versions of Chakra UI layout components
const MotionGrid = motion(Grid);
const MotionVStack = motion(VStack);
const MotionHStack = motion(HStack);


/**
 * An example Dashboard component that dynamically changes its layout
 * based on the `layoutPreference` setting.
 */
function Dashboard() {
    const { settings } = useSettings();
    const layout = settings.layoutPreference || 'grid';

    const animationProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
    };

    // A placeholder list of your dashboard panels.
    const panels = [
        <Panel key="weather" title="Main Weather" />,
        <Panel key="clocks" title="World Clocks" />,
        <Panel key="celestial" title="Celestial Events" />,
        <Panel key="hourly" title="Hourly Forecast" />,
        <Panel key="weekly" title="Weekly Forecast" />,
    ];



    return (
        <AnimatePresence mode="wait">
            {layout === 'vertical' && (
                <MotionVStack key="vertical" spacing={4} align="stretch" p={4} {...animationProps}>
                    {panels}
                </MotionVStack>
            )}

            {layout === 'horizontal' && (
                <MotionHStack
                    key="horizontal"
                    spacing={4}
                    align="stretch"
                    p={4}
                    overflowX="auto"
                    {...animationProps}
                >
                    {panels.map((panel) => React.cloneElement(panel, { minW: '300px' }))}
                </MotionHStack>
            )}

            {layout === 'grid' && (
                <MotionGrid key="grid" p={4} gap={4} templateColumns="repeat(auto-fit, minmax(300px, 1fr))" {...animationProps}>
                    {panels}
                </MotionGrid>
            )}
        </AnimatePresence>
    );
}

export default Dashboard;