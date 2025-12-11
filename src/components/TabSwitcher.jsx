import React from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiBookOpen } from 'react-icons/fi';

const TabSwitcher = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'topics', label: 'Topics', icon: FiBook },
    { id: 'dictionary', label: 'Dictionary', icon: FiBookOpen }
  ];

  return (
    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-200 relative ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-gray-600 rounded-md shadow-sm"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10 text-sm">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitcher;