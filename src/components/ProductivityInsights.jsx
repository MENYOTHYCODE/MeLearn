import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiClock, FiTarget, FiCalendar, FiBarChart, FiAward } from 'react-icons/fi';

const ProductivityInsights = ({ sessions, stats }) => {
  const insights = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        weeklyTrend: 0,
        averageProductivity: 0,
        bestTimeOfDay: 'Not enough data',
        totalThisWeek: 0,
        completionRate: 0,
        topAchievements: []
      };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Filter work sessions only
    const workSessions = sessions.filter(s => s.type === 'work');
    
    // This week's sessions
    const thisWeekSessions = workSessions.filter(s => new Date(s.date) >= weekAgo);
    const lastWeekSessions = workSessions.filter(s => {
      const date = new Date(s.date);
      return date >= twoWeeksAgo && date < weekAgo;
    });

    // Weekly trend
    const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + s.duration, 0);
    const lastWeekMinutes = lastWeekSessions.reduce((sum, s) => sum + s.duration, 0);
    const weeklyTrend = lastWeekMinutes > 0 ? ((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100 : 0;

    // Average productivity
    const sessionsWithProductivity = workSessions.filter(s => s.productivity > 0);
    const averageProductivity = sessionsWithProductivity.length > 0
      ? sessionsWithProductivity.reduce((sum, s) => sum + s.productivity, 0) / sessionsWithProductivity.length
      : 0;

    // Best time of day
    const hourCounts = {};
    workSessions.forEach(session => {
      const hour = new Date(session.date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const bestHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b, '0'
    );
    
    const formatHour = (hour) => {
      const h = parseInt(hour);
      if (h === 0) return '12 AM';
      if (h < 12) return `${h} AM`;
      if (h === 12) return '12 PM';
      return `${h - 12} PM`;
    };

    const bestTimeOfDay = Object.keys(hourCounts).length > 0 
      ? `${formatHour(bestHour)} - ${formatHour((parseInt(bestHour) + 1) % 24)}`
      : 'Not enough data';

    // Completion rate (sessions that were completed vs started)
    const completedSessions = workSessions.filter(s => s.completed !== false);
    const completionRate = workSessions.length > 0 ? (completedSessions.length / workSessions.length) * 100 : 0;

    // Top achievements
    const achievementCounts = {};
    workSessions.forEach(session => {
      if (session.achievements) {
        session.achievements.forEach(achievement => {
          achievementCounts[achievement] = (achievementCounts[achievement] || 0) + 1;
        });
      }
    });

    const topAchievements = Object.entries(achievementCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([achievement, count]) => ({ achievement, count }));

    return {
      weeklyTrend,
      averageProductivity,
      bestTimeOfDay,
      totalThisWeek: thisWeekMinutes,
      completionRate,
      topAchievements
    };
  }, [sessions]);

  const getProductivityEmoji = (rating) => {
    if (rating >= 4.5) return '🚀';
    if (rating >= 4) return '😊';
    if (rating >= 3) return '🙂';
    if (rating >= 2) return '😐';
    return '😴';
  };

  const getTrendColor = (trend) => {
    if (trend > 10) return 'text-green-600 dark:text-green-400';
    if (trend > 0) return 'text-blue-600 dark:text-blue-400';
    if (trend > -10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '↗️';
    if (trend < 0) return '↘️';
    return '➡️';
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FiBarChart className="text-purple-600" />
        Productivity Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Weekly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between mb-2">
            <FiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl">{getTrendIcon(insights.weeklyTrend)}</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {insights.weeklyTrend > 0 ? '+' : ''}{Math.round(insights.weeklyTrend)}%
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Weekly Progress</div>
          <div className="text-xs text-blue-500 dark:text-blue-300 mt-1">
            {insights.totalThisWeek} min this week
          </div>
        </motion.div>

        {/* Average Productivity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between mb-2">
            <FiTarget className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-2xl">{getProductivityEmoji(insights.averageProductivity)}</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {insights.averageProductivity.toFixed(1)}/5
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">Avg Productivity</div>
          <div className="text-xs text-green-500 dark:text-green-300 mt-1">
            Based on {sessions.filter(s => s.productivity > 0).length} ratings
          </div>
        </motion.div>

        {/* Best Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center justify-between mb-2">
            <FiClock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-2xl">⏰</span>
          </div>
          <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
            {insights.bestTimeOfDay}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">Peak Focus Time</div>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center justify-between mb-2">
            <FiCalendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
            {Math.round(insights.completionRate)}%
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400">Completion Rate</div>
        </motion.div>

        {/* Top Achievement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-800 md:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <FiAward className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-2xl">🏆</span>
          </div>
          <div className="text-sm font-bold text-yellow-700 dark:text-yellow-300 mb-1">
            Top Achievement
          </div>
          {insights.topAchievements.length > 0 ? (
            <div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">
                {insights.topAchievements[0].achievement}
              </div>
              <div className="text-xs text-yellow-500 dark:text-yellow-300">
                {insights.topAchievements[0].count} times
              </div>
            </div>
          ) : (
            <div className="text-xs text-yellow-500 dark:text-yellow-300">
              Complete sessions to see achievements
            </div>
          )}
        </motion.div>
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">💪</span>
          </div>
          <div>
            <div className="font-semibold text-indigo-700 dark:text-indigo-300">
              {stats.streak > 0 
                ? `Amazing! You're on a ${stats.streak} day streak!`
                : 'Ready to start your productivity journey?'
              }
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400">
              {insights.weeklyTrend > 0 
                ? 'Keep up the great momentum this week!'
                : 'Every study session brings you closer to your goals.'
              }
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductivityInsights;