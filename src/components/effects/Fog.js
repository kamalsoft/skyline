// src/components/effects/Fog.js
import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';

function Fog({ top, duration, opacity }) {
    return (
        <motion.div
            style={{ position: 'absolute', left: '-50vw', top: `${top}%`, width: '200vw', height: '40%' }}
            animate={{ x: ['-50vw', '50vw', '-50vw'], willChange: 'transform' }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
        >
            <Box
                w="100%"
                h="100%"
                bg="radial-gradient(ellipse at center, rgba(200, 200, 200, 0.6) 0%, rgba(200, 200, 200, 0) 70%)"
                opacity={opacity}
            ></Box>
        </motion.div>
    );
}

export default Fog;