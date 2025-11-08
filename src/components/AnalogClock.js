// src/components/AnalogClock.js
import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';

function AnalogClock({ time, clockTheme }) {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondsDegrees = (seconds / 60) * 360 + 90;
    const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6 + 90;
    const hoursDegrees = (hours / 12) * 360 + (minutes / 60) * 30 + 90;

    const clockBg = useColorModeValue(`${clockTheme}.light.bg`, `${clockTheme}.dark.bg`);
    const shadowLight = useColorModeValue(`${clockTheme}.light.shadowLight`, `${clockTheme}.dark.shadowLight`);
    const shadowDark = useColorModeValue(`${clockTheme}.light.shadowDark`, `${clockTheme}.dark.shadowDark`);
    const handColor = useColorModeValue(`${clockTheme}.light.hands`, `${clockTheme}.dark.hands`);
    const secondHandColor = useColorModeValue(`${clockTheme}.light.secondHand`, `${clockTheme}.dark.secondHand`);
    const numberColor = useColorModeValue(`${clockTheme}.light.numbers`, `${clockTheme}.dark.numbers`);

    const handStyle = {
        position: 'absolute',
        top: '50%',
        right: '50%',
        transformOrigin: '100%',
        borderRadius: '3px',
        background: handColor,
        boxShadow: clockTheme === 'metallic' ? '1px 1px 3px rgba(0,0,0,0.3)' : 'none',
    };

    const romanNumerals = { 12: 'XII', 3: 'III', 6: 'VI', 9: 'IX' };
    const dotColor = useColorModeValue(`${clockTheme}.light.numbers`, `${clockTheme}.dark.numbers`);

    const numbers = Array.from({ length: 12 }, (_, i) => {
        const hour = i + 1;
        const angle = hour * 30;
        const x = 50 + 40 * Math.cos((angle - 90) * (Math.PI / 180));
        const y = 50 + 40 * Math.sin((angle - 90) * (Math.PI / 180));

        if (romanNumerals[hour]) {
            return (
                <Box
                    key={i}
                    position="absolute"
                    left={`${x}%`}
                    top={`${y}%`}
                    transform="translate(-50%, -50%)"
                    fontSize="xs"
                    fontWeight="bold"
                    color={numberColor}
                >
                    {romanNumerals[hour]}
                </Box>
            );
        } else {
            return (
                <Box
                    key={i}
                    position="absolute"
                    left={`${x}%`}
                    top={`${y}%`}
                    transform="translate(-50%, -50%)"
                    w="4px"
                    h="4px"
                    bg={dotColor}
                    borderRadius="50%"
                />
            );
        }
    });

    return (
        <Box
            w="120px"
            h="120px"
            bg={clockBg}
            borderRadius="50%"
            position="relative"
            boxShadow={clockTheme === 'metallic' ? `inset 5px 5px 10px ${shadowDark}, inset -5px -5px 10px ${shadowLight}, 3px 3px 8px rgba(0,0,0,0.4)` : 'md'}
            border={clockTheme === 'metallic' ? "3px solid" : "2px solid"}
            borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
            {/* Center Pin */}
            <Box position="absolute" top="50%" left="50%" w="10px" h="10px" bg={handColor} borderRadius="50%" transform="translate(-50%, -50%)" zIndex="12" />

            {/* Clock Hands */}
            <Box
                style={{ ...handStyle, width: '40%', height: '4px', transform: `rotate(${hoursDegrees}deg)` }}
                zIndex="10"
            />
            <Box
                style={{ ...handStyle, width: '50%', height: '3px', transform: `rotate(${minutesDegrees}deg)` }}
                zIndex="11"
            />
            <Box
                style={{
                    ...handStyle,
                    width: '50%',
                    height: '2px',
                    background: secondHandColor,
                    transform: `rotate(${secondsDegrees}deg)`,
                }}
                zIndex="12"
            />

            {/* Numbers */}
            {numbers}
        </Box>
    );
}

export default AnalogClock;