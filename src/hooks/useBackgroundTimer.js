import { useEffect, useRef } from 'react';

export const useBackgroundTimer = () => {
  const workerRef = useRef(null);
  const registrationRef = useRef(null);

  useEffect(() => {
    // Register service worker for background timer support
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/timer-worker.js');
          registrationRef.current = registration;
          console.log('Timer service worker registered');

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', handleWorkerMessage);
        } catch (error) {
          console.log('Service worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();

    return () => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.removeEventListener('message', handleWorkerMessage);
      }
    };
  }, []);

  const handleWorkerMessage = (event) => {
    const { type, data } = event.data;
    
    switch (type) {
      case 'TIMER_COMPLETE':
        // Dispatch custom event for timer completion
        window.dispatchEvent(new CustomEvent('backgroundTimerComplete', { detail: data }));
        break;
      case 'TIMER_UPDATE':
        // Dispatch custom event for timer updates
        window.dispatchEvent(new CustomEvent('backgroundTimerUpdate', { detail: data }));
        break;
    }
  };

  const startBackgroundTimer = (endTime, sessionType, goal) => {
    if (registrationRef.current && registrationRef.current.active) {
      registrationRef.current.active.postMessage({
        type: 'START_TIMER',
        data: {
          endTime,
          sessionType,
          goal
        }
      });
    }
  };

  const stopBackgroundTimer = () => {
    if (registrationRef.current && registrationRef.current.active) {
      registrationRef.current.active.postMessage({
        type: 'STOP_TIMER'
      });
    }
  };

  const checkBackgroundTimer = () => {
    if (registrationRef.current && registrationRef.current.active) {
      registrationRef.current.active.postMessage({
        type: 'CHECK_TIMER'
      });
    }
  };

  return {
    startBackgroundTimer,
    stopBackgroundTimer,
    checkBackgroundTimer
  };
};