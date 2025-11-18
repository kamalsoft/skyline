// src/theme.js
import { extendTheme } from '@chakra-ui/react';

export const fontOptions = {
    poppins: `"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    orbitron: `"Orbitron", sans-serif`,
};

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const themes = {
    midnight: {
        name: 'Midnight',
        description: 'A dark, sleek theme with a subtle animated gradient.',
        background: { type: 'gradient', gradientTheme: 'default' },
        panelStyle: 'glassmorphism',
    },
    aurora: {
        name: 'Aurora',
        description: 'A soft, shifting gradient that mimics the northern lights.',
        background: { type: 'gradient', gradientTheme: 'aurora' },
        panelStyle: 'aurora',
    },
    ocean: {
        name: 'Ocean',
        description: 'A cool, refreshing theme inspired by the sea.',
        background: { type: 'gradient', gradientTheme: 'ocean' },
        panelStyle: 'glassmorphism',
    },
    sunset: {
        name: 'Sunset',
        description: 'A warm, vibrant theme that captures the colors of a sunset.',
        background: { type: 'gradient', gradientTheme: 'sunset' },
        panelStyle: 'glassmorphism',
    },
    epaper: {
        name: 'E-Paper',
        description: 'A high-contrast, low-glare style mimicking an e-ink display.',
        background: { type: 'solid', value: '#F5F5F5' },
        panelStyle: 'epaper',
    },
    brutalism: {
        name: 'Brutalism',
        description: 'A raw, high-contrast style with sharp edges and bold shadows.',
        background: { type: 'solid', value: 'yellow.200' },
        panelStyle: 'brutalism',
    },
    desert: {
        name: 'Desert',
        description: 'Warm tones of a desert landscape under the sun and moon.',
        background: { type: 'gradient', gradientTheme: 'desert' },
        panelStyle: 'glassmorphism',
    },
    cosmic: {
        name: 'Cosmic',
        description: 'Deep space colors with a touch of cosmic dust.',
        background: { type: 'gradient', gradientTheme: 'cosmic' },
        panelStyle: 'glassmorphism',
    },
    minimal: {
        name: 'Minimal',
        description: 'A flat, simple style with no extra effects for a clean look.',
        background: { type: 'solid', value: 'gray.100' },
        panelStyle: 'none',
    },
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
    sunset: {
        light: {
            bg: 'linear-gradient(145deg, #ffb75e, #ed8f03)',
            shadowLight: '#ffc77e',
            shadowDark: '#d47a00',
            hands: '#ffffff',
            numbers: '#ffffff',
            secondHand: '#ff4500',
        },
        dark: { bg: 'linear-gradient(145deg, #4b0082, #8a2be2)', shadowLight: '#6a00b8', shadowDark: '#2c004c', hands: '#ffb75e', numbers: '#ffb75e', secondHand: '#ff6347' },
    },
    sunrise: {
        light: {
            bg: 'linear-gradient(145deg, #ffecd2, #fcb69f)',
            shadowLight: '#ffffff',
            shadowDark: '#f8a98a',
            hands: '#d9534f',
            numbers: '#d9534f',
            secondHand: '#f0ad4e',
        },
        dark: { bg: 'linear-gradient(145deg, #2c3e50, #4b79a1)', shadowLight: '#5c8bb2', shadowDark: '#1a2a38', hands: '#ffecd2', numbers: '#ffecd2', secondHand: '#fcb69f' },
    },
    gradients: {
        default: {
            night: 'linear-gradient(to bottom, #0c0e2b, #1a202c)',
            dawn: 'linear-gradient(to bottom, #2c3e50, #fd5e53)',
            day: 'linear-gradient(to bottom, #4A90E2, #87CEEB)',
            dusk: 'linear-gradient(to bottom, #ff7e5f, #2c3e50)',
        },
        ocean: {
            night: 'linear-gradient(to bottom, #09203f, #537895)',
            dawn: 'linear-gradient(to bottom, #2B32B2, #1488CC)',
            day: 'linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF)',
            dusk: 'linear-gradient(to bottom, #00467F, #A5CC82)',
        },
        sunset: {
            night: 'linear-gradient(to bottom, #232526, #414345)',
            dawn: 'linear-gradient(to bottom, #ff7e5f, #feb47b)',
            day: 'linear-gradient(to bottom, #fceabb, #f8b500)',
            dusk: 'linear-gradient(to bottom, #c33764, #1d2671)',
        },
        desert: {
            night: 'linear-gradient(to bottom, #202028, #39384D)',
            dawn: 'linear-gradient(to bottom, #EDC09F, #FFDAB9)',
            day: 'linear-gradient(to bottom, #FAD6A5, #F5A623)',
            dusk: 'linear-gradient(to bottom, #8A2387, #E94057, #F27121)',
        },
        aurora: {
            night: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
            dawn: 'linear-gradient(to bottom, #7474BF, #348AC7)',
            day: 'linear-gradient(to bottom, #89f7fe, #66a6ff)',
            dusk: 'linear-gradient(to bottom, #4e54c8, #8f94fb)',
        },
        cosmic: {
            night: 'linear-gradient(to bottom, #000000, #434343)',
            dawn: 'linear-gradient(to bottom, #3E5151, #DECBA4)',
            day: 'linear-gradient(to bottom, #1c92d2, #f2fcfe)',
            dusk: 'linear-gradient(to bottom, #23074d, #cc5333)',
        },
    },
};

const styles = {
    global: (props) => ({
        ':root': {
            // Define CSS variables for animation speed
            '--shine-duration-slow': '6s',
            '--shine-duration-normal': '3s',
            '--shine-duration-fast': '1.5s',
        },
        // Keyframes should be defined at the global level, as a sibling to other global styles
        '@keyframes shine': {
            'to': { transform: 'translateX(100%)' },
        },
        '@keyframes liquid': {
            '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
            '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 70%' },
        },
        '@keyframes aurora': { '0%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' } },
        '.themed-panel': (props) => ({
            // Base styles for the glass effect
            bg: props.colorMode === 'dark' ? 'rgba(20, 15, 40, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'lg',
            position: 'relative',
            overflow: 'hidden',
            // Ensure text is bright by default for better contrast on dark/gradient themes
            color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
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
                animation: `shine var(--shine-duration-${props.theme?.settings?.animationSettings?.gradientSpeed || 'normal'}) linear infinite`,
            },

            // Subtle hover effect for interactivity
            _hover: {
                boxShadow: 'xl',
                transform: 'translateY(-2px) scale(1.01)',
            },
        }),
        // --- New UI Effect Styles ---
        '.effect-preview.glassmorphism, .themed-panel.glassmorphism': (props) => ({
            bg: props.colorMode === 'dark' ? 'rgba(20, 15, 40, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }),
        '.effect-preview.neumorphism, .themed-panel.neumorphism': (props) => ({
            bg: props.colorMode === 'dark' ? '#2c313a' : '#e0e5ec',
            borderRadius: 'xl',
            boxShadow: props.colorMode === 'dark'
                ? '7px 7px 14px #23272e, -7px -7px 14px #353b46'
                : '7px 7px 14px #a3b1c6, -7px -7px 14px #ffffff',
        }),
        '.effect-preview.claymorphism, .themed-panel.claymorphism': (props) => ({
            bg: props.colorMode === 'dark' ? '#3a3f4c' : '#f2f2f2',
            borderRadius: '30px',
            boxShadow: `inset 4px 4px 8px ${props.colorMode === 'dark' ? '#2c313a' : '#d9d9d9'}, inset -4px -4px 8px ${props.colorMode === 'dark' ? '#484d59' : '#ffffff'}`,
        }),
        '.effect-preview.skeuomorphism, .themed-panel.skeuomorphism': (props) => ({
            bg: props.colorMode === 'dark' ? '#383838' : '#d8d8d8',
            border: '1px solid',
            borderColor: props.colorMode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
            borderRadius: 'xl',
            boxShadow: `inset 0 1px 1px ${props.colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}, 0 2px 4px rgba(0,0,0,0.3)`,
            backgroundImage: props.colorMode === 'dark'
                ? 'linear-gradient(rgba(255,255,255,0.05), rgba(0,0,0,0.05))'
                : 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.2))',
        }),
        '.effect-preview.liquid, .themed-panel.liquid': (props) => ({
            bg: props.colorMode === 'dark' ? 'purple.800' : 'purple.200',
            filter: 'blur(5px)',
            animation: 'liquid 8s ease-in-out infinite',
            transition: 'border-radius 2s ease-in-out',
        }),
        '.effect-preview.retro-pixelation, .themed-panel.retro-pixelation': (props) => ({
            bg: props.colorMode === 'dark' ? '#3d3d3d' : '#e0e0e0',
            border: '4px solid',
            borderColor: props.colorMode === 'dark' ? 'black' : 'black',
            boxShadow: `8px 8px 0px ${props.colorMode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}`,
            borderRadius: '0px',
        }),
        '.effect-preview.aurora, .themed-panel.aurora': (props) => ({
            bgGradient: props.colorMode === 'dark'
                ? 'linear-gradient(125deg, #0f0c29, #302b63, #24243e, #7474BF, #348AC7)'
                : 'linear-gradient(125deg, #e0c3fc, #8ec5fc, #fceabb, #ff8c8c)',
            backgroundSize: '400% 400%',
            animation: 'aurora 15s ease infinite',
            border: 'none',
        }),
        '.effect-preview.brutalism, .themed-panel.brutalism': (props) => ({
            bg: props.colorMode === 'dark' ? 'yellow.400' : 'yellow.300',
            border: '3px solid black',
            borderRadius: '0',
            boxShadow: '8px 8px 0px black',
        }),
        '.effect-preview.epaper, .themed-panel.epaper': (props) => ({
            bg: props.colorMode === 'dark' ? '#D3D3D3' : '#F5F5F5',
            color: 'black',
            border: '2px solid black',
            borderRadius: 'sm',
            boxShadow: 'none',
            // Ensure text inside is always black for readability
            '*': { color: 'black !important' },
            '.effect-preview.epaper &, .chakra-ui-dark .themed-panel.epaper': {
                bg: '#333333',
                color: 'white',
            },
        }),
        '.effect-preview.none, .themed-panel.none': (props) => ({
            bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
            border: '1px solid',
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
        }),
        // Style for the settings panel to make it more readable
        '.settings-panel': (props) => ({
            bg: props.colorMode === 'dark' ? 'rgba(26, 32, 44, 0.95)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(15px)',
            boxShadow: '2xl',
        }),
        '.settings-panel-midnight': (props) => ({
            bg: props.colorMode === 'dark' ? 'rgba(10, 10, 25, 0.9)' : 'rgba(230, 230, 250, 0.9)',
            backdropFilter: 'blur(25px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }),
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

const theme = extendTheme({
    config,
    fonts: {
        heading: fontOptions.poppins,
        body: fontOptions.poppins,
    },
    colors,
    styles,
    themes,
    components,
});

export default theme;