// src/hooks/useWorldClock.js
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with the necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export function useWorldClock(timeZone) {
  // This hook now correctly calculates the time in the specified timezone.
  const [time, setTime] = useState(() => dayjs().tz(timeZone));

  useEffect(() => {
    const timerId = setInterval(() => {
      // Use dayjs to get the current time in the target timezone
      // and convert it back to a standard Date object.
      setTime(dayjs().tz(timeZone));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeZone]); // Rerun effect if timeZone changes

  return time;
}
