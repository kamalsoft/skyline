// src/components/SortableWorldClock.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { CSS } from '@dnd-kit/utilities';
import WorldClockCard from './WorldClockCard';

/**
 * This component acts as a wrapper around the WorldClockCard to make it sortable.
 * It uses the useSortable hook from dnd-kit to handle drag and drop states.
 */
function SortableWorldClock({ clock, clockTheme, timeFormat, isSidebarOpen }) {
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
        transition: transition || 'transform 0.2s ease', // Fallback transition
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            aria-label={`Draggable clock for ${clock.location}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout // This enables the smooth re-ordering animation
            whileTap={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.2)' }}
        >
            <WorldClockCard clock={clock} isDragging={isDragging} clockTheme={clockTheme} timeFormat={timeFormat} isSidebarOpen={isSidebarOpen} />
        </motion.div>
    );
}

export default SortableWorldClock;