import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiBook } from 'react-icons/fi';

const BookCard = ({ book }) => {
  const { volumeInfo } = book;
  const thumbnail = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail;
  const previewLink = volumeInfo.previewLink;
  const authors = volumeInfo.authors?.join(', ') || 'Unknown Author';
  const publishedDate = volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : '';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        {/* Book Thumbnail */}
        <div className="flex-shrink-0">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={volumeInfo.title}
              className="w-16 h-20 object-cover rounded border border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="w-16 h-20 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center">
              <FiBook className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
            {volumeInfo.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-200 mb-1">
            by {authors}
          </p>
          {publishedDate && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
              {publishedDate}
            </p>
          )}
          
          {/* Description */}
          {volumeInfo.description && (
            <p className="text-xs text-gray-600 dark:text-gray-200 line-clamp-2 mb-2">
              {volumeInfo.description.replace(/<[^>]*>/g, '')}
            </p>
          )}

          {/* Preview Link */}
          {previewLink && (
            <a
              href={previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <FiExternalLink className="w-3 h-3" />
              Preview Book
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;