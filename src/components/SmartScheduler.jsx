import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTarget, FiZap, FiCalendar, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const SmartScheduler = ({ tasks, studySessions, onScheduleTask, onClose }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [schedulingMode, setSchedulingMode] = useState('optimal'); // optimal, custom, batch
  const [preferences, setPreferences] = useState({
    preferredHours: { start: 9, end: 17 },
    breakDuration: 15,
    maxSessionLength: 120,
    difficultyDistribution: 'balanced' // front-loaded, balanced, back-loaded
  });

  // AI-powered scheduling recommendations
  const recommendations = useMemo(() => {
    const uncompletedTasks = tasks.filter(t => !t.completed);
    const now = new Date();
    
    return uncompletedTasks.map(task => {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      const daysUntilDue = dueDate ? Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24)) : null;
      const estimatedTime = task.estimatedTime || 60;
      
      // Calculate urgency score (0-100)
      let urgencyScore = 50;
      if (daysUntilDue !== null) {
        if (daysUntilDue <= 1) urgencyScore = 95;
        else if (daysUntilDue <= 3) urgencyScore = 80;
        else if (daysUntilDue <= 7) urgencyScore = 65;
        else urgencyScore = 30;
      }
      
      // Calculate priority score
      const priorityScore = task.priority === 'high' ? 90 : task.priority === 'medium' ? 60 : 30;
      
      // Calculate difficulty score based on estimated time
      const difficultyScore = estimatedTime > 120 ? 90 : estimatedTime > 60 ? 60 : 30;
      
      // Overall recommendation score
      const recommendationScore = (urgencyScore * 0.4) + (priorityScore * 0.4) + (difficultyScore * 0.2);
      
      // Suggest optimal time slots
      const optimalTimeSlots = getOptimalTimeSlots(task, preferences);
      
      return {
        ...task,
        urgencyScore,
        priorityScore,
        difficultyScore,
        recommendationScore,
        optimalTimeSlots,
        suggestedBreaks: Math.ceil(estimatedTime / 45), // Break every 45 minutes
        energyLevel: getEnergyLevelRecommendation(task, optimalTimeSlots[0])
      };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
  }, [tasks, preferences]);

  const getOptimalTimeSlots = (task, prefs) => {
    const slots = [];
    const estimatedTime = task.estimatedTime || 60;
    const difficulty = task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low';
    
    // Morning slots (high energy)
    if (difficulty === 'high' || prefs.difficultyDistribution === 'front-loaded') {
      slots.push({ time: '09:00', energy: 'high', reason: 'Peak morning focus' });
      slots.push({ time: '10:30', energy: 'high', reason: 'Sustained morning energy' });
    }
    
    // Afternoon slots (medium energy)
    slots.push({ time: '14:00', energy: 'medium', reason: 'Post-lunch recovery' });
    slots.push({ time: '15:30', energy: 'medium', reason: 'Afternoon focus window' });
    
    // Evening slots (variable energy)
    if (difficulty === 'low' || prefs.difficultyDistribution === 'back-loaded') {
      slots.push({ time: '19:00', energy: 'medium', reason: 'Evening review time' });
      slots.push({ time: '20:30', energy: 'low', reason: 'Light study session' });
    }
    
    return slots.slice(0, 3); // Return top 3 recommendations
  };

  const getEnergyLevelRecommendation = (task, timeSlot) => {
    const difficulty = task.priority === 'high' ? 'high' : task.priority === 'medium' ? 'medium' : 'low';
    const energy = timeSlot?.energy || 'medium';
    
    if (difficulty === 'high' && energy === 'high') return 'Perfect match!';
    if (difficulty === 'low' && energy === 'low') return 'Good for review';
    if (difficulty === 'high' && energy === 'low') return 'Consider rescheduling';
    return 'Suitable timing';
  };

  const handleScheduleTask = (task, timeSlot) => {
    const scheduledTask = {
      ...task,
      scheduledTime: timeSlot.time,
      energyLevel: timeSlot.energy,
      scheduledDate: new Date().toISOString().split('T')[0]
    };
    
    onScheduleTask(scheduledTask);
  };

  const generateBatchSchedule = () => {
    const schedule = [];
    const workingHours = preferences.preferredHours;
    let currentTime = workingHours.start;
    
    recommendations.slice(0, 5).forEach((task, index) => {
      const duration = Math.min(task.estimatedTime || 60, preferences.maxSessionLength);
      const endTime = currentTime + (duration / 60);
      
      if (endTime <= workingHours.end) {
        schedule.push({
          task,
          startTime: `${Math.floor(currentTime)}:${(currentTime % 1) * 60 || '00'}`,
          endTime: `${Math.floor(endTime)}:${(endTime % 1) * 60 || '00'}`,
          duration
        });
        
        currentTime = endTime + (preferences.breakDuration / 60);
      }
    });
    
    return schedule;
  };

  const batchSchedule = generateBatchSchedule();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiZap className="text-blue-600" />
            Smart Scheduler
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered task scheduling based on your patterns
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn-secondary"
        >
          Close
        </button>
      </div>

      {/* Scheduling Mode Selector */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Scheduling Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { mode: 'optimal', icon: FiTarget, title: 'Optimal Scheduling', desc: 'AI picks the best times' },
            { mode: 'custom', icon: FiClock, title: 'Custom Scheduling', desc: 'Manual time selection' },
            { mode: 'batch', icon: FiCalendar, title: 'Batch Scheduling', desc: 'Schedule multiple tasks' }
          ].map(({ mode, icon: Icon, title, desc }) => (
            <motion.button
              key={mode}
              onClick={() => setSchedulingMode(mode)}
              className={`p-4 rounded-lg border-2 transition-all ${
                schedulingMode === mode
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${
                schedulingMode === mode ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Scheduling Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Study Hours</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="23"
                value={preferences.preferredHours.start}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  preferredHours: { ...prev.preferredHours, start: parseInt(e.target.value) }
                }))}
                className="input-field w-20"
              />
              <span>to</span>
              <input
                type="number"
                min="0"
                max="23"
                value={preferences.preferredHours.end}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  preferredHours: { ...prev.preferredHours, end: parseInt(e.target.value) }
                }))}
                className="input-field w-20"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Break Duration (minutes)</label>
            <input
              type="number"
              min="5"
              max="60"
              value={preferences.breakDuration}
              onChange={(e) => setPreferences(prev => ({ ...prev, breakDuration: parseInt(e.target.value) }))}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Max Session Length (minutes)</label>
            <input
              type="number"
              min="30"
              max="240"
              value={preferences.maxSessionLength}
              onChange={(e) => setPreferences(prev => ({ ...prev, maxSessionLength: parseInt(e.target.value) }))}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty Distribution</label>
            <select
              value={preferences.difficultyDistribution}
              onChange={(e) => setPreferences(prev => ({ ...prev, difficultyDistribution: e.target.value }))}
              className="input-field"
            >
              <option value="front-loaded">Hard tasks first</option>
              <option value="balanced">Balanced distribution</option>
              <option value="back-loaded">Easy tasks first</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scheduling Content */}
      {schedulingMode === 'optimal' && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-green-600" />
            Recommended Schedule
          </h3>
          <div className="space-y-4">
            {recommendations.slice(0, 5).map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{task.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{task.subject}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {task.priority} priority
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {task.estimatedTime || 60} min
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        Score: {Math.round(task.recommendationScore)}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Recommended time slots:</p>
                      <div className="flex gap-2">
                        {task.optimalTimeSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleScheduleTask(task, slot)}
                            className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                          >
                            {slot.time}
                            <div className="text-xs opacity-75">{slot.reason}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                      task.energyLevel === 'Perfect match!' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      task.energyLevel === 'Consider rescheduling' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {task.energyLevel === 'Perfect match!' ? <FiCheckCircle className="w-3 h-3" /> :
                       task.energyLevel === 'Consider rescheduling' ? <FiAlertCircle className="w-3 h-3" /> :
                       <FiClock className="w-3 h-3" />}
                      {task.energyLevel}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {schedulingMode === 'batch' && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiCalendar className="text-purple-600" />
            Batch Schedule for Today
          </h3>
          <div className="space-y-3">
            {batchSchedule.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">
                    {item.startTime} - {item.endTime}
                  </div>
                  <div>
                    <h4 className="font-medium">{item.task.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.task.subject} • {item.duration} min
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleScheduleTask(item.task, { time: item.startTime, energy: 'medium' })}
                  className="btn-primary text-sm"
                >
                  Schedule
                </button>
              </motion.div>
            ))}
          </div>
          
          {batchSchedule.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                Total study time: {batchSchedule.reduce((sum, item) => sum + item.duration, 0)} minutes
                with {batchSchedule.length - 1} breaks
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartScheduler;