import { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiRotateCcw, FiSettings, FiTarget, FiCoffee } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useBackgroundTimer } from '../hooks/useBackgroundTimer';

const Timer = ({ onSessionComplete, currentGoal, preferences, onPreferencesChange }) => {
  const [minutes, setMinutes] = useState(preferences?.defaultWorkDuration || 25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(preferences?.defaultWorkDuration || 25);
  const [breakDuration, setBreakDuration] = useState(preferences?.defaultBreakDuration || 5);
  const [longBreakDuration, setLongBreakDuration] = useState(preferences?.longBreakDuration || 15);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);
  const [initialDuration, setInitialDuration] = useState(preferences?.defaultWorkDuration || 25);
  const [alarmAudio] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')); // Completion sound
  const [warningAudio] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3')); // Warning sound
  const [hasPlayedWarning, setHasPlayedWarning] = useState(false);
  const [startTime, setStartTime] = useState(null); // Track when timer actually started
  const [targetEndTime, setTargetEndTime] = useState(null); // Track when timer should end
  const backgroundCheckRef = useRef(null);
  const [wakeLock, setWakeLock] = useState(null);
  const { startBackgroundTimer, stopBackgroundTimer } = useBackgroundTimer();

  // Update timer when preferences change
  useEffect(() => {
    if (preferences) {
      setWorkDuration(preferences.defaultWorkDuration);
      setBreakDuration(preferences.defaultBreakDuration);
      setLongBreakDuration(preferences.longBreakDuration);
      
      // Update current timer if not active
      if (!isActive && !isBreak) {
        setMinutes(preferences.defaultWorkDuration);
        setInitialDuration(preferences.defaultWorkDuration);
      }
    }
  }, [preferences, isActive, isBreak]);

  // Enhanced timer system that works in background
  useEffect(() => {
    if (isActive && targetEndTime) {
      // Primary interval for UI updates
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, targetEndTime - now);
        const remainingMinutes = Math.floor(remaining / (1000 * 60));
        const remainingSeconds = Math.floor((remaining % (1000 * 60)) / 1000);

        setMinutes(remainingMinutes);
        setSeconds(remainingSeconds);

        // Check if timer completed
        if (remaining <= 0) {
          handleTimerComplete();
          return;
        }

        // Check for warning alerts (5 minutes remaining)
        const totalRemainingSeconds = remainingMinutes * 60 + remainingSeconds;
        if (totalRemainingSeconds === 5 * 60 && !hasPlayedWarning && !isBreak) {
          warningAudio.play().catch(err => console.log('Warning audio failed:', err));
          setHasPlayedWarning(true);
          
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Study Session Alert', {
              body: '5 minutes remaining in your study session!',
              icon: '/favicon.ico'
            });
          }
        }
      }, 1000);

      // Background check every 5 seconds (more reliable for background execution)
      backgroundCheckRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, targetEndTime - now);
        
        if (remaining <= 0 && isActive) {
          // Timer completed while in background
          handleTimerComplete();
        }
      }, 5000);

    } else {
      clearInterval(intervalRef.current);
      clearInterval(backgroundCheckRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(backgroundCheckRef.current);
    };
  }, [isActive, targetEndTime, hasPlayedWarning, isBreak, warningAudio]);

  // Listen for background timer events
  useEffect(() => {
    const handleBackgroundComplete = (event) => {
      handleTimerComplete();
    };

    const handleBackgroundUpdate = (event) => {
      if (targetEndTime) {
        const { remaining } = event.detail;
        const remainingMinutes = Math.floor(remaining / (1000 * 60));
        const remainingSeconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setMinutes(Math.max(0, remainingMinutes));
        setSeconds(Math.max(0, remainingSeconds));
      }
    };

    window.addEventListener('backgroundTimerComplete', handleBackgroundComplete);
    window.addEventListener('backgroundTimerUpdate', handleBackgroundUpdate);

    return () => {
      window.removeEventListener('backgroundTimerComplete', handleBackgroundComplete);
      window.removeEventListener('backgroundTimerUpdate', handleBackgroundUpdate);
    };
  }, [targetEndTime]);
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isActive && !isBreak) {
        try {
          const lock = await navigator.wakeLock.request('screen');
          setWakeLock(lock);
          console.log('Wake lock acquired');
        } catch (err) {
          console.log('Wake lock failed:', err);
        }
      }
    };

    const releaseWakeLock = () => {
      if (wakeLock) {
        wakeLock.release();
        setWakeLock(null);
        console.log('Wake lock released');
      }
    };

    if (isActive && !isBreak) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => releaseWakeLock();
  }, [isActive, isBreak, wakeLock]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isActive && targetEndTime) {
        // Page became visible again, sync the timer
        const now = Date.now();
        const remaining = Math.max(0, targetEndTime - now);
        const remainingMinutes = Math.floor(remaining / (1000 * 60));
        const remainingSeconds = Math.floor((remaining % (1000 * 60)) / 1000);

        setMinutes(remainingMinutes);
        setSeconds(remainingSeconds);

        // Check if timer should have completed while in background
        if (remaining <= 0) {
          handleTimerComplete();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isActive, targetEndTime]);

  const handleTimerComplete = () => {
    setIsActive(false);
    setTargetEndTime(null);
    setStartTime(null);
    
    // Stop background timer
    stopBackgroundTimer();
    
    // Play completion alarm sound with multiple attempts for reliability
    const playAlarm = () => {
      alarmAudio.currentTime = 0;
      alarmAudio.play().catch(err => {
        console.log('Alarm audio failed, retrying...', err);
        // Retry after a short delay
        setTimeout(() => {
          alarmAudio.play().catch(e => console.log('Alarm retry failed:', e));
        }, 500);
      });
    };
    
    playAlarm();
    
    // Send browser notification with sound
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isBreak ? 'Break Over!' : 'Work Session Complete!', {
        body: isBreak ? 'Time to get back to work!' : 'Take a break!',
        icon: '/favicon.ico',
        tag: 'timer-complete',
        requireInteraction: true // Keep notification visible until user interacts
      });
    }

    // Vibrate if supported (mobile devices)
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }

    if (!isBreak) {
      // Work session completed
      const completedSessions = sessionsCompleted + 1;
      setSessionsCompleted(completedSessions);
      
      onSessionComplete(initialDuration, 'work');
      
      // Determine break type (long break every 4 sessions)
      const isLongBreak = completedSessions % (preferences?.sessionsUntilLongBreak || 4) === 0;
      const nextBreakDuration = isLongBreak ? longBreakDuration : breakDuration;
      
      setIsBreak(true);
      setMinutes(nextBreakDuration);
      setSeconds(0);
      setInitialDuration(nextBreakDuration);
      setHasPlayedWarning(false); // Reset warning for next session

      // Auto-start break if enabled
      if (preferences?.autoStartBreaks) {
        setTimeout(() => {
          const breakEndTime = Date.now() + (nextBreakDuration * 60 * 1000);
          setTargetEndTime(breakEndTime);
          setStartTime(Date.now());
          startBackgroundTimer(breakEndTime, 'break', currentGoal);
          setIsActive(true);
        }, 1000);
      }
    } else {
      // Break completed
      onSessionComplete(initialDuration, 'break');
      
      setIsBreak(false);
      setMinutes(workDuration);
      setSeconds(0);
      setInitialDuration(workDuration);
      setHasPlayedWarning(false); // Reset warning for next session

      // Auto-start work if enabled
      if (preferences?.autoStartWork) {
        setTimeout(() => {
          const workEndTime = Date.now() + (workDuration * 60 * 1000);
          setTargetEndTime(workEndTime);
          setStartTime(Date.now());
          startBackgroundTimer(workEndTime, 'work', currentGoal);
          setIsActive(true);
        }, 1000);
      }
    }
  };

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    if (!isActive) {
      // Starting timer - set target end time
      const duration = minutes * 60 + seconds;
      const endTime = Date.now() + (duration * 1000);
      setTargetEndTime(endTime);
      setStartTime(Date.now());
      setHasPlayedWarning(false);
      
      // Start background timer
      startBackgroundTimer(endTime, isBreak ? 'break' : 'work', currentGoal);
    } else {
      // Pausing timer - clear target time and stop background timer
      setTargetEndTime(null);
      setStartTime(null);
      stopBackgroundTimer();
    }
    
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(workDuration);
    setSeconds(0);
    setInitialDuration(workDuration);
    setSessionsCompleted(0);
    setTargetEndTime(null);
    setStartTime(null);
    setHasPlayedWarning(false);
    stopBackgroundTimer();
  };

  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = initialDuration * 60;
    const remainingSeconds = minutes * 60 + seconds;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  const getEndTime = () => {
    const now = new Date();
    const remainingMs = (minutes * 60 + seconds) * 1000;
    const endTime = new Date(now.getTime() + remainingMs);
    return endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const updatePreference = (key, value) => {
    if (onPreferencesChange) {
      onPreferencesChange({
        ...preferences,
        [key]: value
      });
    }
  };

  const isLongBreak = isBreak && sessionsCompleted % (preferences?.sessionsUntilLongBreak || 4) === 0;

  return (
    <div className="card text-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute inset-0 bg-gradient-to-br ${
          isBreak 
            ? 'from-green-400 to-blue-500' 
            : 'from-blue-500 to-purple-600'
        } animate-pulse`}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isBreak 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              {isBreak ? (
                <FiCoffee className={`w-6 h-6 ${
                  isBreak ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                }`} />
              ) : (
                <FiTarget className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold">
                {isBreak 
                  ? (isLongBreak ? '🌟 Long Break' : '☕ Short Break')
                  : '🎯 Focus Time'
                }
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Session {sessionsCompleted + (isBreak ? 0 : 1)} • {initialDuration} min
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiSettings className="w-5 h-5" />
          </button>
        </div>

        {/* Current Goal Display */}
        {currentGoal && !isBreak && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <FiTarget className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Current Goal</span>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">{currentGoal}</p>
          </motion.div>
        )}

        {/* Progress Ring */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
              className={`transition-all duration-1000 ${
                isBreak 
                  ? 'text-green-500' 
                  : 'text-blue-500'
              }`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold font-mono mb-2">
              {formatTime(minutes, seconds)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {Math.round(getProgress())}% complete
            </div>
            {isActive && (
              <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <span>Ends at {getEndTime()}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Background timer active"></div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleTimer}
            className={`btn-primary flex items-center gap-2 text-lg px-8 py-3 ${
              isBreak 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            {isActive ? <FiPause /> : <FiPlay />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="btn-secondary flex items-center gap-2 text-lg px-8 py-3"
          >
            <FiRotateCcw />
            Reset
          </button>
        </div>

        {/* Session Progress */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {Array.from({ length: preferences?.sessionsUntilLongBreak || 4 }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < sessionsCompleted
                  ? 'bg-green-500'
                  : index === sessionsCompleted && !isBreak
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
            >
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Timer Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Work (min)</label>
                  <input
                    type="number"
                    value={workDuration}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setWorkDuration(value);
                      updatePreference('defaultWorkDuration', value);
                      if (!isActive && !isBreak) {
                        setMinutes(value);
                        setInitialDuration(value);
                      }
                    }}
                    className="input-field text-center"
                    min="1"
                    max="60"
                    disabled={isActive}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Break (min)</label>
                  <input
                    type="number"
                    value={breakDuration}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setBreakDuration(value);
                      updatePreference('defaultBreakDuration', value);
                    }}
                    className="input-field text-center"
                    min="1"
                    max="30"
                    disabled={isActive}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Long Break (min)</label>
                  <input
                    type="number"
                    value={longBreakDuration}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setLongBreakDuration(value);
                      updatePreference('longBreakDuration', value);
                    }}
                    className="input-field text-center"
                    min="1"
                    max="60"
                    disabled={isActive}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sessions until long break</label>
                  <input
                    type="number"
                    value={preferences?.sessionsUntilLongBreak || 4}
                    onChange={(e) => updatePreference('sessionsUntilLongBreak', Number(e.target.value))}
                    className="input-field text-center"
                    min="2"
                    max="8"
                    disabled={isActive}
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sound Volume: {Math.round((preferences?.soundVolume || 0.3) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={preferences?.soundVolume || 0.3}
                    onChange={(e) => updatePreference('soundVolume', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences?.enableWarningAlerts || false}
                    onChange={(e) => updatePreference('enableWarningAlerts', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">5-minute warning alerts</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences?.autoStartBreaks || false}
                    onChange={(e) => updatePreference('autoStartBreaks', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Auto-start breaks</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences?.autoStartWork || false}
                    onChange={(e) => updatePreference('autoStartWork', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Auto-start work sessions</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Timer;
