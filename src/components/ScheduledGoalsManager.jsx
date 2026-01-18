import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiPlus, FiTrash2, FiPlay, FiEdit3, FiCalendar, FiTarget, FiBell } from 'react-icons/fi';

const ScheduledGoalsManager = ({ scheduledGoals, onScheduledGoalsChange, onStartScheduledSession }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    startTime: '',
    duration: 25,
    date: new Date().toISOString().split('T')[0]
  });

  // Check for upcoming sessions every minute with background support
  useEffect(() => {
    const checkScheduledSessions = () => {
      const now = new Date();
      
      scheduledGoals.forEach(goal => {
        if (goal.status === 'scheduled') {
          const goalDateTime = new Date(`${goal.date}T${goal.startTime}`);
          const timeDiff = goalDateTime.getTime() - now.getTime();
          
          // Alert 5 minutes before
          if (timeDiff <= 5 * 60 * 1000 && timeDiff > 4 * 60 * 1000 && !goal.warningShown) {
            showNotification(`Study session "${goal.title}" starts in 5 minutes!`, 'warning');
            goal.warningShown = true;
            onScheduledGoalsChange([...scheduledGoals]);
          }
          
          // Alert when it's time to start
          if (timeDiff <= 0 && timeDiff > -60 * 1000 && !goal.startAlertShown) {
            showNotification(`Time to start: ${goal.title}`, 'start');
            playAlarmSound();
            goal.startAlertShown = true;
            onScheduledGoalsChange([...scheduledGoals]);
          }
        }
      });
    };

    // Check immediately and then every 30 seconds for better responsiveness
    checkScheduledSessions();
    const interval = setInterval(checkScheduledSessions, 30000);
    
    // Also check when page becomes visible (returning from background)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkScheduledSessions();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [scheduledGoals, onScheduledGoalsChange]);

  const showNotification = (message, type) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MeLearn Study Reminder', {
        body: message,
        icon: '/favicon.ico',
        tag: `study-${type}`,
        requireInteraction: type === 'start', // Keep start notifications visible
        silent: false
      });
    }
  };

  const playAlarmSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.7;
    
    // Multiple attempts to ensure sound plays even in background
    const playWithRetry = (attempts = 3) => {
      audio.play().catch(err => {
        console.log(`Audio play failed (attempt ${4-attempts}):`, err);
        if (attempts > 1) {
          setTimeout(() => playWithRetry(attempts - 1), 500);
        }
      });
    };
    
    playWithRetry();
    
    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([300, 100, 300]);
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.startTime) return;

    const goalDateTime = new Date(`${newGoal.date}T${newGoal.startTime}`);
    const now = new Date();

    if (goalDateTime <= now) {
      alert('Please select a future date and time');
      return;
    }

    const goal = {
      id: Date.now(),
      ...newGoal,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      warningShown: false,
      startAlertShown: false
    };

    onScheduledGoalsChange([...scheduledGoals, goal]);
    setNewGoal({
      title: '',
      description: '',
      startTime: '',
      duration: 25,
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);

    // Request notification permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleDeleteGoal = (goalId) => {
    onScheduledGoalsChange(scheduledGoals.filter(goal => goal.id !== goalId));
  };

  const handleStartSession = (goal) => {
    // Update goal status
    const updatedGoals = scheduledGoals.map(g => 
      g.id === goal.id ? { ...g, status: 'active' } : g
    );
    onScheduledGoalsChange(updatedGoals);
    
    // Start the session
    onStartScheduledSession(goal);
  };

  const getTimeUntilStart = (goal) => {
    const now = new Date();
    const goalDateTime = new Date(`${goal.date}T${goal.startTime}`);
    const diff = goalDateTime.getTime() - now.getTime();

    if (diff <= 0) return 'Ready to start!';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString([], { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const upcomingGoals = scheduledGoals
    .filter(goal => goal.status === 'scheduled')
    .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FiCalendar className="text-purple-600" />
          Scheduled Goals
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2 text-sm px-3 py-2"
        >
          <FiPlus className="w-4 h-4" />
          Schedule
        </button>
      </div>

      {/* Upcoming Goals List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {upcomingGoals.length === 0 ? (
          <div className="text-center py-6">
            <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No scheduled goals</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Click "Schedule" to add one</p>
          </div>
        ) : (
          upcomingGoals.map(goal => {
            const timeUntil = getTimeUntilStart(goal);
            const isReady = timeUntil === 'Ready to start!';
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isReady 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                      {goal.title}
                    </h4>
                    {goal.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        {goal.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {formatDateTime(goal.date, goal.startTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiTarget className="w-3 h-3" />
                        {goal.duration} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-3">
                    <div className={`text-xs font-medium px-2 py-1 rounded ${
                      isReady 
                        ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                    }`}>
                      {timeUntil}
                    </div>
                    
                    {isReady ? (
                      <button
                        onClick={() => handleStartSession(goal)}
                        className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                      >
                        <FiPlay className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Schedule Study Goal
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                  >
                    ×
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Goal Title</label>
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      placeholder="e.g., Math homework, Read chapter 5..."
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description (optional)</label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                      placeholder="What will you work on?"
                      className="input-field resize-none"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <input
                        type="date"
                        value={newGoal.date}
                        onChange={(e) => setNewGoal({...newGoal, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Time</label>
                      <input
                        type="time"
                        value={newGoal.startTime}
                        onChange={(e) => setNewGoal({...newGoal, startTime: e.target.value})}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={newGoal.duration}
                      onChange={(e) => setNewGoal({...newGoal, duration: Number(e.target.value)})}
                      min="5"
                      max="180"
                      className="input-field"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddGoal}
                      disabled={!newGoal.title || !newGoal.startTime}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduledGoalsManager;