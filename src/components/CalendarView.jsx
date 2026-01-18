import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlus, FiClock, FiFlag } from 'react-icons/fi';

const CalendarView = ({ tasks, onTaskClick, onDateSelect, selectedDate, onAddTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month'); // month, week

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === current.toDateString();
      });

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        isSelected: current.toDateString() === selectedDate.toDateString(),
        tasks: dayTasks
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate, tasks, selectedDate]);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const handleDateClick = (day) => {
    onDateSelect(day.date);
  };

  const handleAddTaskToDate = (date, e) => {
    e.stopPropagation();
    onAddTask(date);
  };

  return (
    <div className="card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewType('month')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewType === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewType('week')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewType === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-sm">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarData.map((day, index) => (
          <motion.div
            key={index}
            onClick={() => handleDateClick(day)}
            className={`min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
              !day.isCurrentMonth ? 'opacity-30' : ''
            } ${
              day.isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : ''
            } ${
              day.isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${
                day.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
              }`}>
                {day.date.getDate()}
              </span>
              {day.isCurrentMonth && (
                <button
                  onClick={(e) => handleAddTaskToDate(day.date, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                  title="Add task"
                >
                  <FiPlus className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Tasks for this day */}
            <div className="space-y-1">
              {day.tasks.slice(0, 3).map((task, taskIndex) => (
                <motion.div
                  key={task.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick(task);
                  }}
                  className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                    task.completed 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 line-through' 
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    <span className="truncate flex-1">{task.title}</span>
                    {task.estimatedTime && (
                      <FiClock className="w-3 h-3 opacity-60" />
                    )}
                  </div>
                </motion.div>
              ))}
              
              {day.tasks.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  +{day.tasks.length - 3} more
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-300">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-300">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-300">Low Priority</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;