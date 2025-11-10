// src/hooks/useClockManager.js
import { useState, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
const initialClocks = [];
// { id: 1, location: 'Naperville, USA', timeZone: 'America/Chicago', latitude: 41.7731, longitude: -88.1502 },
// { id: 2, location: 'Chennai, India', timeZone: 'Asia/Kolkata', latitude: 13.0827, longitude: 80.2707 },


export function useClockManager() {
  const [clocks, setClocks] = useState(() => {
    try {
      const savedClocks = localStorage.getItem('clocks');
      const parsedClocks = savedClocks ? JSON.parse(savedClocks) : initialClocks;
      // Ensure 'current-location' clock is not persisted, as it's dynamically determined
      return parsedClocks.filter((c) => c.id !== 'current-location');
    } catch (error) {
      console.error('Could not parse clocks from localStorage', error);
      return initialClocks;
    }
  });

  const [activeDragItem, setActiveDragItem] = useState(null);

  useEffect(() => {
    // Don't save the 'current-location' clock to localStorage
    localStorage.setItem('clocks', JSON.stringify(clocks.filter((c) => c.id !== 'current-location')));
  }, [clocks]);

  const addClock = (clock) => {
    setClocks((prevClocks) => [...prevClocks, { ...clock, id: Date.now() }]);
  };

  const removeClock = (id) => {
    setClocks((prevClocks) => prevClocks.filter((clock) => clock.id !== id));
  };

  const removeAllClocks = () => {
    // Keep the primary location if it's the current location, otherwise clear all
    setClocks(clocks.filter((c) => c.id === 'current-location'));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const item = clocks.find((clock) => clock.id === active.id);
    setActiveDragItem(item);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragItem(null);
    if (over && active.id !== over.id) {
      setClocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragCancel = () => {
    setActiveDragItem(null);
  };

  return {
    clocks,
    setClocks,
    addClock,
    removeClock,
    removeAllClocks,
    activeDragItem,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
