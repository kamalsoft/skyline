// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const fonts = {
    heading: "'Poppins', sans-serif",
    body: "'Poppins', sans-serif",
};

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
    forest: {
        light: {
            bg: 'linear-gradient(145deg, #90ee90, #3cb371)',
            shadowLight: '#c1ffc1',
            shadowDark: '#78c978',
            hands: '#5c4033',
            numbers: '#5c4033',
            secondHand: '#ff4500'
        },
        dark: { bg: 'linear-gradient(145deg, #2e8b57, #006400)', shadowLight: '#3baf71', shadowDark: '#004d00', hands: '#f5deb3', numbers: '#f5deb3', secondHand: '#ffd700' },
    },
};

const styles = {
    global: (props) => ({
        // Keyframes should be defined at the global level, as a sibling to other global styles
        '@keyframes shine': {
            'to': { transform: 'translateX(100%)' },
        },
        '.glass': {
            // Base styles for the glass effect
            bg: props.colorMode === 'dark' ? 'rgba(20, 15, 40, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'lg',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',

            // The animated gradient border effect
            _before: {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                p: '1px',
                bg: `linear-gradient(120deg, transparent, ${props.colorMode === 'dark' ? 'rgba(123, 97, 255, 0.5)' : 'rgba(123, 97, 255, 1)'}, transparent)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                animation: 'shine 3s linear infinite',
            },

            // Subtle hover effect for interactivity
            _hover: {
                boxShadow: 'xl',
                transform: 'translateY(-2px) scale(1.01)',
            },
        },
    }),
};

const components = {
    Heading: {
        baseStyle: {
            fontWeight: '600', // A modern, semi-bold weight for headings
            letterSpacing: 'tight', // Slightly tighter letter spacing for a clean look
        },
    },
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

const theme = extendTheme({ config, fonts, colors, styles, components });

export default theme;