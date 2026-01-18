import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiTarget, FiStar, FiMessageSquare, FiChevronDown, FiChevronUp, FiCalendar, FiFilter } from 'react-icons/fi';

const StudySessionHistory = ({ sessions, onSessionUpdate }) => {
  const [expandedSession, setExpandedSession] = useState(null);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [sortBy, setSortBy] = useState('recent'); // recent, duration, productivity

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    
    const sessionDate = new Date(session.date);
    const now = new Date();
    
    if (filter === 'today') {
      return sessionDate.toDateString() === now.toDateString();
    }
    
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return sessionDate >= weekAgo;
    }
    
    if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return sessionDate >= monthAgo;
    }
    
    return true;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'duration') {
      return b.duration - a.duration;
    }
    if (sortBy === 'productivity') {
      return (b.productivity || 0) - (a.productivity || 0);
    }
    return 0;
  });

  const getProductivityColor = (rating) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-blue-500';
    if (rating >= 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProductivityEmoji = (rating) => {
    if (!rating) return '❓';
    if (rating >= 4) return '🚀';
    if (rating >= 3) return '😊';
    if (rating >= 2) return '😐';
    return '😴';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleExpanded = (sessionId) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  if (sortedSessions.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiClock className="text-blue-600" />
          Study History
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FiCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">No study sessions yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Complete your first session to see your progress here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FiClock className="text-blue-600" />
          Study History
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <option value="recent">Recent</option>
            <option value="duration">Duration</option>
            <option value="productivity">Productivity</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedSessions.slice(0, 10).map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
          >
            {/* Session Header */}
            <div
              onClick={() => toggleExpanded(session.id)}
              className="p-3 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <FiClock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {session.duration} min
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(session.date)} • {formatTime(session.date)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {session.productivity && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{getProductivityEmoji(session.productivity)}</span>
                      <span className={`text-xs font-medium ${getProductivityColor(session.productivity)}`}>
                        {session.productivity}/5
                      </span>
                    </div>
                  )}
                  {expandedSession === session.id ? (
                    <FiChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedSession === session.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                    {/* Goal */}
                    {session.goal && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FiTarget className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                          {session.goal}
                        </p>
                      </div>
                    )}

                    {/* Achievements */}
                    {session.achievements && session.achievements.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FiStar className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Achievements</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {session.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {achievement}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {session.notes && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FiMessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                          {session.notes}
                        </p>
                      </div>
                    )}

                    {/* Challenges */}
                    {session.challenges && (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-4 h-4 text-orange-500 text-sm">⚠️</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Challenges</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                          {session.challenges}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {sortedSessions.length > 10 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing 10 of {sortedSessions.length} sessions
          </p>
        </div>
      )}
    </div>
  );
};

export default StudySessionHistory;