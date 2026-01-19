import React from 'react';
import { FiExternalLink, FiPlay, FiYoutube, FiBookmark } from 'react-icons/fi';
import noteService from '../services/noteService';
import { useNotification } from '../context/NotificationContext';

const VideoCard = ({ video }) => {
  const { title, thumbnail, url } = video;

  const { showSuccess, showError } = useNotification();

  const saveVideo = () => {
    const content = `${title}\n\nWatch: ${url}`;
    const created = noteService.addNote({ title, content, category: 'Video' });
    if (created) showSuccess('Saved', 'Video saved to Notes'); else showError('Save failed', 'Could not save the video.');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        {/* Video Thumbnail */}
        <div className="flex-shrink-0 relative">
          <div className="w-20 h-14 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiYoutube className="w-6 h-6 text-red-500" />
              </div>
            )}
          </div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <FiPlay className="w-3 h-3 text-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 leading-tight">
            {title}
          </h4>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <FiYoutube className="w-3 h-3 text-red-500" />
            <span>YouTube</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Watch on YouTube
              <FiExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={saveVideo}
              className="p-1 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Save video to Notes"
            >
              <FiBookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;