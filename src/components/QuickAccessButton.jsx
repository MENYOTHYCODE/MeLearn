import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiX } from 'react-icons/fi';

const QuickAccessButton = ({ isOpen, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-blue-600 hover:bg-blue-700'
      } text-white px-4 py-3 rounded-l-xl shadow-lg transition-colors duration-200 flex items-center gap-2 font-medium`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ x: 100 }}
      animate={{ x: isOpen ? -320 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {isOpen ? (
        <>
          <FiX className="w-5 h-5" />
          <span className="hidden sm:inline">Close</span>
        </>
      ) : (
        <>
          <FiZap className="w-5 h-5" />
          <span className="hidden sm:inline">Quick Access</span>
        </>
      )}
    </motion.button>
  );
};

export default QuickAccessButton;