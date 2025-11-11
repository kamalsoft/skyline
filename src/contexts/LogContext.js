// src/contexts/LogContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

const LogContext = createContext();

export const useLogs = () => useContext(LogContext);

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((message, level = 'info', source = 'system') => {
    const newLog = {
      message: message,
      level,
      source,
      timestamp: new Date().toLocaleTimeString(),
    };
    // Add new log and keep only the last 100 entries
    setLogs((prevLogs) => [...prevLogs, newLog].slice(-100));
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    addLog('Logs cleared.', 'info');
  }, [addLog]);

  const clearCacheAndReload = useCallback(() => {
    addLog('Clearing all caches and local storage...', 'warn');
    try {
      // Clear local storage
      localStorage.clear();
      addLog('localStorage cleared.', 'info');

      // Unregister service workers
      serviceWorkerRegistration.unregister();
      addLog('Service worker unregistered.', 'info');

      // Clear all caches and reload
      if ('caches' in window) {
        caches
          .keys()
          .then((cacheNames) => {
            return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
          })
          .then(() => {
            addLog('All caches cleared. Reloading page...', 'info');
            window.location.reload();
          });
      } else {
        window.location.reload();
      }
    } catch (error) {
      addLog(`Error during cache clearing: ${error.message}`, 'error');
    }
  }, [addLog]);

  // Override console methods to automatically capture logs
  useEffect(() => {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
    };

    const getLogSource = () => {
      try {
        throw new Error();
      } catch (e) {
        // The stack gives us the call trace. We want the caller of the console function.
        // The stack format varies by browser, but generally the third or fourth line is what we want.
        const stackLines = e.stack.split('\n');
        if (stackLines.length > 3) {
          const callerLine = stackLines[3]; // e.g., " at AppContent (http://.../App.js:123:4)"
          const match = callerLine.match(/at\s+(?:.*\s+)?\((?:.*\/)?(.*?):\d+:\d+\)/);
          if (match && match[1]) {
            return match[1]; // Extracts "App.js"
          }
          // Fallback for anonymous functions or different stack formats
          const simpleMatch = callerLine.match(/(?:.*\/)?(.*?):\d+:\d+/);
          if (simpleMatch && simpleMatch[1]) {
            return simpleMatch[1];
          }
        }
        return 'unknown';
      }
    };

    console.log = (...args) => {
      originalConsole.log(...args);
      const message = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(' ');
      // Defer state update to avoid running during another component's render cycle
      setTimeout(() => addLog(message, 'info', getLogSource()), 0);
    };

    console.warn = (...args) => {
      originalConsole.warn(...args);
      const message = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(' ');
      setTimeout(() => addLog(message, 'warn', getLogSource()), 0);
    };

    console.error = (...args) => {
      originalConsole.error(...args);
      // For errors, also include the stack trace if available
      const message = args
        .map((arg) => {
          if (arg instanceof Error) return arg.stack || arg.message;
          return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
        })
        .join(' ');
      setTimeout(() => addLog(message, 'error', getLogSource()), 0);
    };

    addLog('Log terminal initialized.', 'info');

    // Restore original console methods on component unmount
    return () => {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    };
  }, [addLog]);

  const value = { logs, addLog, clearLogs, clearCacheAndReload };

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
};
