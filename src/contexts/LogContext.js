// src/contexts/LogContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

const LogContext = createContext();

export const useLogs = () => useContext(LogContext);

export const LogProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);

    const addLog = useCallback((message, level = 'info') => {
        const newLog = {
            message: message,
            level,
            timestamp: new Date().toLocaleTimeString(),
        };
        // Add new log and keep only the last 100 entries
        setLogs(prevLogs => [...prevLogs, newLog].slice(-100));
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
                caches.keys().then(cacheNames => {
                    return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
                }).then(() => {
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

        console.log = (...args) => {
            originalConsole.log(...args);
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
            addLog(message, 'info');
        };

        console.warn = (...args) => {
            originalConsole.warn(...args);
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
            addLog(message, 'warn');
        };

        console.error = (...args) => {
            originalConsole.error(...args);
            // For errors, also include the stack trace if available
            const message = args.map(arg => {
                if (arg instanceof Error) return arg.stack || arg.message;
                return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
            }).join(' ');
            addLog(message, 'error');
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

    return (
        <LogContext.Provider value={value}>{children}</LogContext.Provider>
    );
};