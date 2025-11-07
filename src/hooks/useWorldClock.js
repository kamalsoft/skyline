// src/hooks/useWorldClock.js
import { useState, useEffect } from 'react';

export function useWorldClock(timeZone) {
    // This hook now provides a simple, ticking timestamp.
    // The formatting is handled by the component that uses the time.
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, [timeZone]);

    return time;
}