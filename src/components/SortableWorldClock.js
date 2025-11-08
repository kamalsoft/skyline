// src/components/SortableWorldClock.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@chakra-ui/react';
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
        transition,
        opacity: isDragging ? 0 : 1, // Hide the original item while dragging
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <WorldClockCard clock={clock} isDragging={isDragging} clockTheme={clockTheme} timeFormat={timeFormat} isSidebarOpen={isSidebarOpen} />
        </Box>
    );
}

export default SortableWorldClock;