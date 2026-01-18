import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX, FiStar, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';

const SessionReflectionModal = ({ isOpen, onClose, onComplete, session }) => {
  const [productivity, setProductivity] = useState(0);
  const [notes, setNotes] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [challenges, setChallenges] = useState('');

  const productivityLevels = [
    { value: 1, label: 'Low', color: 'red', emoji: '😴' },
    { value: 2, label: 'Fair', color: 'orange', emoji: '😐' },
    { value: 3, label: 'Good', color: 'yellow', emoji: '🙂' },
    { value: 4, label: 'Great', color: 'green', emoji: '😊' },
    { value: 5, label: 'Excellent', color: 'blue', emoji: '🚀' }
  ];

  const commonAchievements = [
    'Completed all planned tasks',
    'Stayed focused throughout',
    'Learned something new',
    'Solved a difficult problem',
    'Made good progress',
    'Took effective notes'
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setProductivity(0);
      setNotes('');
      setAchievements([]);
      setChallenges('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleSkip();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      productivity,
      notes: notes.trim(),
      achievements,
      challenges: challenges.trim(),
      reflectionDate: new Date().toISOString()
    });
  };

  const handleSkip = () => {
    onComplete({
      productivity: 3, // Default to "Good"
      notes: '',
      achievements: [],
      challenges: '',
      reflectionDate: new Date().toISOString()
    });
  };

  const toggleAchievement = (achievement) => {
    setAchievements(prev => 
      prev.includes(achievement)
        ? prev.filter(a => a !== achievement)
        : [...prev, achievement]
    );
  };

  const getProductivityColor = (level) => {
    const colors = {
      1: 'text-red-500',
      2: 'text-orange-500',
      3: 'text-yellow-500',
      4: 'text-green-500',
      5: 'text-blue-500'
    };
    return colors[level] || 'text-gray-400';
  };

  if (!session) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Session Complete! 🎉
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {session.duration} minutes • {session.goal || 'Study session'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Productivity Rating */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <FiTrendingUp className="w-5 h-5" />
                      How productive was this session?
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {productivityLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setProductivity(level.value)}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            productivity === level.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="text-2xl mb-2">{level.emoji}</div>
                          <div className={`text-sm font-medium ${
                            productivity === level.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {level.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <FiStar className="w-5 h-5" />
                      What did you achieve?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {commonAchievements.map((achievement) => (
                        <button
                          key={achievement}
                          type="button"
                          onClick={() => toggleAchievement(achievement)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            achievements.includes(achievement)
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              achievements.includes(achievement)
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {achievements.includes(achievement) && (
                                <FiCheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm">{achievement}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <FiMessageSquare className="w-5 h-5" />
                      Session notes (optional)
                    </h3>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What did you learn? Any insights or key takeaways?"
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Challenges */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Any challenges or distractions?
                    </h3>
                    <textarea
                      value={challenges}
                      onChange={(e) => setChallenges(e.target.value)}
                      placeholder="What made it difficult to focus? How can you improve next time?"
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Skip Reflection
                    </button>
                    <button
                      type="submit"
                      disabled={productivity === 0}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Save Reflection
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SessionReflectionModal;