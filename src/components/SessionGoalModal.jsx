import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiX, FiBook, FiCode, FiPenTool, FiZap } from 'react-icons/fi';

const SessionGoalModal = ({ isOpen, onClose, onGoalSet }) => {
  const [customGoal, setCustomGoal] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');

  const presetGoals = [
    {
      id: 'math',
      icon: FiZap,
      title: 'Mathematics Study',
      description: 'Focus on solving math problems and understanding concepts',
      color: 'blue'
    },
    {
      id: 'reading',
      icon: FiBook,
      title: 'Reading & Research',
      description: 'Deep reading and note-taking session',
      color: 'green'
    },
    {
      id: 'coding',
      icon: FiCode,
      title: 'Programming',
      description: 'Code development and debugging session',
      color: 'purple'
    },
    {
      id: 'writing',
      icon: FiPenTool,
      title: 'Writing & Essays',
      description: 'Creative or academic writing session',
      color: 'orange'
    }
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCustomGoal('');
      setSelectedPreset('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const goal = customGoal.trim() || selectedPreset;
    if (goal) {
      onGoalSet(goal);
    }
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.title);
    setCustomGoal('');
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
    };
    return colors[color] || colors.blue;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FiTarget className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Set Study Goal
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      What would you like to focus on this session?
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Preset Goals */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Quick Goals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {presetGoals.map((preset) => {
                        const Icon = preset.icon;
                        const isSelected = selectedPreset === preset.title;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handlePresetSelect(preset)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? getColorClasses(preset.color)
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-600'
                              }`}>
                                <Icon className={`w-5 h-5 ${
                                  isSelected ? 'text-current' : 'text-gray-600 dark:text-gray-300'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-semibold ${
                                  isSelected ? 'text-current' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {preset.title}
                                </h4>
                                <p className={`text-sm ${
                                  isSelected ? 'text-current opacity-80' : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                  {preset.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Goal */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Custom Goal
                    </h3>
                    <textarea
                      value={customGoal}
                      onChange={(e) => {
                        setCustomGoal(e.target.value);
                        setSelectedPreset('');
                      }}
                      placeholder="Describe what you want to accomplish in this study session..."
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!customGoal.trim() && !selectedPreset}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Start Session
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

export default SessionGoalModal;