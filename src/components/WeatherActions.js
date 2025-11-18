// src/components/WeatherActions.js
import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, IconButton, Tooltip, useBreakpointValue, VStack } from '@chakra-ui/react';
import { RepeatIcon, CalendarIcon, ViewIcon } from '@chakra-ui/icons';
import { FaHistory } from 'react-icons/fa';
import { useSound } from '../contexts/SoundContext';

function WeatherActions({ onRefresh, onCalendarOpen, onMapOpen, onHistoryOpen, unit, onUnitChange, isLoading }) {
    const { playSound } = useSound();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const ResponsiveButtonGroup = ({ children }) => (
        <VStack spacing={isMobile ? 2 : 0} align={isMobile ? 'stretch' : 'flex-end'} w={isMobile ? 'full' : 'auto'}>
            {children}
        </VStack>
    );

    return (
        <ResponsiveButtonGroup>
            <ButtonGroup isAttached={!isMobile} size="sm" variant="outline">
                <Tooltip label="Refresh weather" placement="top">
                    <IconButton
                        icon={<RepeatIcon />}
                        onClick={() => {
                            playSound('ui-click');
                            onRefresh();
                        }}
                        isLoading={isLoading}
                        aria-label="Refresh weather"
                    />
                </Tooltip>
                <Tooltip label="Open Sunrise/Sunset Calendar" placement="top">
                    <IconButton icon={<CalendarIcon />} onClick={() => { playSound('ui-click'); onCalendarOpen(); }} aria-label="Open sunrise/sunset calendar" />
                </Tooltip>
                <Tooltip label="Open Weather Map" placement="top">
                    <IconButton icon={<ViewIcon />} onClick={() => { playSound('ui-click'); onMapOpen(); }} aria-label="Open weather map" />
                </Tooltip>
                <Tooltip label="View Weather History" placement="top">
                    <IconButton icon={<FaHistory />} onClick={() => { playSound('ui-click'); onHistoryOpen(); }} aria-label="View weather history" />
                </Tooltip>
            </ButtonGroup>
            <ButtonGroup isAttached={!isMobile} size="sm">
                <Button onClick={() => { playSound('ui-click'); onUnitChange('C'); }} isActive={unit === 'C'}>
                    °C
                </Button>
                <Button onClick={() => { playSound('ui-click'); onUnitChange('F'); }} isActive={unit === 'F'}>
                    °F
                </Button>
            </ButtonGroup>
        </ResponsiveButtonGroup>
    );
}

WeatherActions.propTypes = {
    onRefresh: PropTypes.func.isRequired,
    onCalendarOpen: PropTypes.func.isRequired,
    onMapOpen: PropTypes.func.isRequired,
    onHistoryOpen: PropTypes.func.isRequired,
    unit: PropTypes.string.isRequired,
    onUnitChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

WeatherActions.defaultProps = {
    isLoading: false,
};

export default WeatherActions;