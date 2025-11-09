// src/hooks/useUpdateChecker.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useUpdateChecker({ appVersion, autoUpdateCheckEnabled, onUpdateFound }) {
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(autoUpdateCheckEnabled);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const checkForUpdates = useCallback(async () => {
    const lastCheckedVersion = localStorage.getItem('lastCheckedVersion');
    try {
      const response = await axios.get('/changelog.json', {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' },
      });
      const latestChangelog = response.data;

      if (latestChangelog.version > appVersion) {
        setIsUpdateAvailable(true);
        if (latestChangelog.version !== lastCheckedVersion) {
          onUpdateFound(latestChangelog);
          localStorage.setItem('lastCheckedVersion', latestChangelog.version);
        }
      }
    } catch (error) {
      console.error('Update check failed:', error);
    } finally {
      setIsCheckingForUpdate(false);
    }
  }, [appVersion, onUpdateFound]);

  useEffect(() => {
    if (autoUpdateCheckEnabled) {
      const updateCheckTimeout = setTimeout(checkForUpdates, 3000);
      return () => clearTimeout(updateCheckTimeout);
    } else {
      setIsCheckingForUpdate(false);
    }
  }, [autoUpdateCheckEnabled, checkForUpdates]);

  return { isCheckingForUpdate, isUpdateAvailable };
}
