// src/components/SortableWorldClock.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import WorldClockCard from './WorldClockCard';

function SortableWorldClock({ clock, clockTheme }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: String(clock.id) });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1, // Hide the original item while dragging
        transformOrigin: '50% 50%',
    };

    return (
        <motion.div layout>
            <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {/* We pass props to the underlying card */}
                <WorldClockCard clock={clock} clockTheme={clockTheme} />
            </Box>
        </motion.div>
    );
}

export default SortableWorldClock;