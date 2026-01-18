import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTarget, FiClock } from 'react-icons/fi';

const FocusMode = ({ isActive, onExit, currentGoal }) => {
  // Prevent scrolling when focus mode is active
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isActive]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isActive) {
        onExit();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isActive, onExit]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
        >
          {/* Subtle animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-white">
            {/* Exit button */}
            <button
              onClick={onExit}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Focus content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center max-w-2xl"
            >
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <FiTarget className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Focus Mode
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Eliminate distractions and maximize your productivity
                </p>
              </div>

              {/* Current goal display */}
              {currentGoal && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <FiTarget className="w-5 h-5 text-blue-300" />
                    <span className="text-lg font-semibold text-blue-300">Current Goal</span>
                  </div>
                  <p className="text-2xl font-medium text-white">{currentGoal}</p>
                </motion.div>
              )}

              {/* Focus tips */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h3 className="font-semibold mb-2">Deep Work</h3>
                  <p className="text-sm text-gray-300">Focus on one task at a time for maximum productivity</p>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="font-semibold mb-2">No Distractions</h3>
                  <p className="text-sm text-gray-300">Put away your phone and close unnecessary tabs</p>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <h3 className="font-semibold mb-2">Time Blocks</h3>
                  <p className="text-sm text-gray-300">Work in focused 25-minute intervals</p>
                </div>
              </motion.div>

              {/* Breathing exercise */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <p className="text-lg text-gray-300 mb-4">Take a deep breath and center yourself</p>
                <div className="relative w-32 h-32 mx-auto">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"
                  />
                  <div className="absolute inset-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌟</span>
                  </div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-400"
              >
                Press <kbd className="px-2 py-1 bg-white/10 rounded text-white">Esc</kbd> or click the X to exit focus mode
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusMode;