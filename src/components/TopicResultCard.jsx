import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const TopicResultCard = ({ title, summary, keyPoints, url }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FiBookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Wikipedia Summary
              </p>
            </div>
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Summary */}
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            {summary}
          </p>
        </div>

        {/* Key Points */}
        {keyPoints && keyPoints.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-green-500" />
              Key Points
            </h4>
            <div className="space-y-2">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {url && (
        <div className="px-4 pb-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Read more on Wikipedia
            <FiExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default TopicResultCard;