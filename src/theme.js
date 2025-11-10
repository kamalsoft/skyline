// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const colors = {
    brand: {
        900: '#1a365d',
        800: '#153e75',
        700: '#2a69ac',
    },
    accentPink: '#ff69b4',
};

const components = {
    Modal: {
        baseStyle: {
            dialog: {
                bg: 'rgba(26, 32, 44, 0.8)', // Dark glass background
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'xl',
                color: 'white',
            },
            header: {
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            },
            closeButton: {
                _hover: {
                    bg: 'whiteAlpha.200',
                },
            },
            footer: {
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            },
        },
    },
};

const theme = extendTheme({ config, colors, components });

export default theme;