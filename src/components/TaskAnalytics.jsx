import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTarget, FiClock, FiAlertTriangle, FiCheckCircle, FiBarChart } from 'react-icons/fi';

const TaskAnalytics = ({ tasks, studySessions, analytics }) => {
  const chartData = useMemo(() => {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt || task.dueDate);
        return taskDate.toDateString() === dateStr;
      });
      
      const completedTasks = dayTasks.filter(t => t.completed).length;
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total: dayTasks.length,
        completed: completedTasks,
        rate: dayTasks.length > 0 ? (completedTasks / dayTasks.length) * 100 : 0
      });
    }
    
    return last7Days;
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const upcoming = tasks
      .filter(task => !task.completed && task.dueDate)
      .map(task => ({
        ...task,
        daysUntil: Math.ceil((new Date(task.dueDate) - now) / (1000 * 60 * 60 * 24))
      }))
      .filter(task => task.daysUntil >= 0 && task.daysUntil <= 7)
      .sort((a, b) => a.daysUntil - b.daysUntil);
    
    return upcoming;
  }, [tasks]);

  const productivityTrends = useMemo(() => {
    const sessions = studySessions || [];
    const recentSessions = sessions.slice(-10);
    
    if (recentSessions.length === 0) return { trend: 'neutral', message: 'No recent study sessions' };
    
    const avgProductivity = recentSessions.reduce((sum, s) => sum + (s.productivity || 3), 0) / recentSessions.length;
    
    if (avgProductivity >= 4) return { trend: 'up', message: 'Excellent productivity trend!' };
    if (avgProductivity >= 3) return { trend: 'stable', message: 'Steady productivity' };
    return { trend: 'down', message: 'Room for improvement' };
  }, [studySessions]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const maxRate = Math.max(...chartData.map(d => d.rate), 1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalTasks}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FiTarget className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analytics.completedTasks}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(analytics.completionRate)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Overdue</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {analytics.overdueTasks}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Completion Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiBarChart className="text-blue-600" />
            7-Day Progress
          </h3>
          <div className="space-y-3">
            {chartData.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 text-sm text-gray-600 dark:text-gray-300">
                  {day.date}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.rate / maxRate) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {day.completed}/{day.total}
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-600 dark:text-gray-300 text-right">
                  {Math.round(day.rate)}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subject Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
          <div className="space-y-3">
            {Object.entries(analytics.subjectStats)
              .filter(([_, stats]) => stats.total > 0)
              .sort(([_, a], [__, b]) => b.rate - a.rate)
              .slice(0, 6)
              .map(([subject, stats]) => (
                <div key={subject} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600 dark:text-gray-300 truncate">
                    {subject}
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.rate}%` }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                    />
                  </div>
                  <div className="w-16 text-sm text-gray-600 dark:text-gray-300 text-right">
                    {stats.completed}/{stats.total}
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Deadlines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiClock className="text-orange-600" />
          Upcoming Deadlines (Next 7 Days)
        </h3>
        {upcomingDeadlines.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No upcoming deadlines in the next 7 days
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingDeadlines.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{task.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    task.daysUntil === 0 ? 'text-red-600 dark:text-red-400' :
                    task.daysUntil <= 2 ? 'text-orange-600 dark:text-orange-400' :
                    'text-gray-600 dark:text-gray-300'
                  }`}>
                    {task.daysUntil === 0 ? 'Due Today' :
                     task.daysUntil === 1 ? 'Due Tomorrow' :
                     `${task.daysUntil} days left`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Productivity Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4">Productivity Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
            <div className={`text-2xl mb-2 ${
              productivityTrends.trend === 'up' ? '📈' :
              productivityTrends.trend === 'down' ? '📉' : '📊'
            }`}>
              {productivityTrends.trend === 'up' ? '📈' :
               productivityTrends.trend === 'down' ? '📉' : '📊'}
            </div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {productivityTrends.message}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              {analytics.completionRate >= 80 ? 'Excellent completion rate!' :
               analytics.completionRate >= 60 ? 'Good progress' :
               'Focus on completing tasks'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {analytics.thisWeekTasks > 5 ? 'Very active this week!' :
               analytics.thisWeekTasks > 2 ? 'Steady progress' :
               'Consider adding more tasks'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskAnalytics;