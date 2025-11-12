// src/components/SeasonalPathPanel.js
import React from 'react';
import { motion } from 'framer-motion';
import SeasonalPath from './SeasonalPath';

function SeasonalPathPanel() {
    return (
        <motion.div
            drag
            dragMomentum={false}
            style={{
                position: 'fixed',
                top: '100px',
                right: '20px',
                width: '450px',
                zIndex: 1300,
            }}
            whileDrag={{
                scale: 1.02,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            }}
        >
            <SeasonalPath />
        </motion.div>
    );
}

export default SeasonalPathPanel;