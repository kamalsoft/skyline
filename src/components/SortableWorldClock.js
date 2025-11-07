// src/components/SortableWorldClock.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@chakra-ui/react';
import WorldClockCard from './WorldClockCard';

function SortableWorldClock({ clock }) {
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
        boxShadow: isDragging ? 'xl' : 'md',
        transformOrigin: '50% 50%',
    };

    return (
        <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <WorldClockCard clock={clock} />
        </Box>
    );
}

export default SortableWorldClock;