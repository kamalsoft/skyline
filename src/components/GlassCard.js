// src/components/GlassCard.js
import React from 'react';
import { Box } from '@chakra-ui/react';

/**
 * A reusable component that applies the global 'glass' style.
 * It forwards all props to the underlying Chakra UI Box component,
 * so you can use any style props like `p`, `m`, `w`, `borderRadius`, etc.
 * @param {object} props - The props to pass to the Box component.
 * @param {React.ReactNode} props.children - The content to render inside the card.
 */
function GlassCard({ children, ...rest }) {
    return (
        <Box className="glass" {...rest}>
            {children}
        </Box>
    );
}

export default GlassCard;