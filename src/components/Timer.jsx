import { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiRotateCcw } from 'react-icons/fi';

const Timer = ({ onSessionComplete }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    // Send browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isBreak ? 'Break Over!' : 'Work Session Complete!', {
        body: isBreak ? 'Time to get back to work!' : 'Take a break!',
        icon: '/favicon.ico'
      });
    }

    if (!isBreak) {
      // Work session completed
      onSessionComplete(workDuration);
      setIsBreak(true);
      setMinutes(breakDuration);
      setSeconds(0);
    } else {
      // Break completed
      setIsBreak(false);
      setMinutes(workDuration);
      setSeconds(0);
    }
  };

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(workDuration);
    setSeconds(0);
  };

  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="card text-center">
      <h2 className="text-2xl font-bold mb-4">
        {isBreak ? '☕ Break Time' : '📚 Focus Time'}
      </h2>
      
      <div className="text-7xl font-bold mb-8 font-mono">
        {formatTime(minutes, seconds)}
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={toggleTimer}
          className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Work (min)</label>
          <input
            type="number"
            value={workDuration}
            onChange={(e) => {
              setWorkDuration(Number(e.target.value));
              if (!isActive && !isBreak) setMinutes(Number(e.target.value));
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
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="input-field text-center"
            min="1"
            max="30"
            disabled={isActive}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
