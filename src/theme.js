// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const colors = {
    // New Vibrant Purple Palette
    primaryPurple: '#7B61FF',
    accentPink: '#FF6EC7',
    deepViolet: '#5A4FCF',
    lightLavender: '#E4D9FF',
    softGray: '#F5F5F5',
    darkGray: '#4A4A4A',

    // Existing clock themes
    metallic: {
        light: { bg: 'linear-gradient(145deg, #d98752, #b87333)', shadowLight: '#ffb87a', shadowDark: '#a15e2c', hands: '#4A4A4A', numbers: '#333', secondHand: '#FF0000' },
        dark: { bg: 'linear-gradient(145deg, #b87333, #8c5829)', shadowLight: '#d98752', shadowDark: '#7a4f24', hands: '#E0E0E0', numbers: '#EEE', secondHand: '#FF4500' },
    },
    minimalist: {
        light: { bg: '#ffffff', hands: '#333333', secondHand: '#E53E3E' },
        dark: { bg: '#1A202C', hands: '#E2E8F0', secondHand: '#FC8181' },
    },
    ocean: {
        light: { bg: 'linear-gradient(145deg, #E4D9FF, #F5F5F5)', shadowLight: '#ffffff', shadowDark: '#c1b7d7', hands: '#5A4FCF', numbers: '#7B61FF', secondHand: '#FF6EC7' },
        dark: { bg: 'linear-gradient(145deg, #5A4FCF, #2c3e50)', shadowLight: '#7c6be0', shadowDark: '#382e7e', hands: '#E4D9FF', numbers: '#FFFFFF', secondHand: '#FF6EC7' },
    },
    cyberpunk: {
        light: { bg: 'linear-gradient(145deg, #e0e0e0, #f5f5f5)', shadowLight: '#ffffff', shadowDark: '#c7c7c7', hands: '#00ffff', numbers: '#ff00ff', secondHand: '#ffff00', numberFontFamily: "'Orbitron', sans-serif" },
        dark: { bg: 'linear-gradient(145deg, #0d0221, #241e4e)', shadowLight: '#3a307b', shadowDark: '#000000', hands: '#00ffff', numbers: '#ff00ff', secondHand: '#ffff00', numberFontFamily: "'Orbitron', sans-serif" },
    },
};

const styles = {
    global: (props) => ({
        '.glass': {
            bg: props.colorMode === 'dark' ? 'rgba(90, 79, 207, 0.25)' : 'rgba(228, 217, 255, 0.5)',
            backdropFilter: 'blur(15px)',
            borderWidth: '1px',
            borderColor: props.colorMode === 'dark' ? 'rgba(228, 217, 255, 0.2)' : 'rgba(90, 79, 207, 0.3)',
            boxShadow: props.colorMode === 'dark' ? '0 8px 20px rgba(0,0,0,0.3)' : `0 8px 20px rgba(90, 79, 207, 0.2)`,
        },
    }),
};

const components = {
    Drawer: { baseStyle: { dialog: { bg: 'transparent' } } },
    Button: {
        variants: {
            ghost: (props) => ({
                color: props.colorMode === 'dark' ? 'white' : 'primaryPurple',
                _hover: {
                    bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(123, 97, 255, 0.1)',
                },
            }),
        },
    },
    Tabs: {
        variants: {
            'vertical-glass': {
                tablist: {
                    borderRight: '1px solid',
                    borderColor: 'whiteAlpha.300',
                },
                tab: {
                    justifyContent: 'flex-start',
                    borderLeft: '3px solid transparent',
                    _selected: {
                        color: 'accentPink',
                        bg: 'whiteAlpha.200',
                        borderColor: 'accentPink',
                    },
                },
            },
        },
    },
    Modal: {
        baseStyle: {
            dialog: {
                bg: 'rgba(26, 32, 44, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'xl',
                color: 'white',
            },
            header: { borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
            closeButton: { _hover: { bg: 'whiteAlpha.200' } },
            footer: { borderTop: '1px solid rgba(255, 255, 255, 0.1)' },
        },
    },
};

const theme = extendTheme({ config, colors, styles, components });

export default theme;