import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiExternalLink } from 'react-icons/fi';

const VideoCard = ({ video }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        {/* Video Thumbnail */}
        <div className="flex-shrink-0 relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-20 h-14 object-cover rounded border border-gray-200 dark:border-gray-600"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded flex items-center justify-center">
            <FiPlay className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-2">
            {video.title}
          </h4>
          
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <FiExternalLink className="w-3 h-3" />
            Watch on YouTube
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;