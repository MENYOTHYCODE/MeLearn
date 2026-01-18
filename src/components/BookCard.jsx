import React from 'react';
import { FiExternalLink, FiBook, FiUser, FiCalendar } from 'react-icons/fi';

const BookCard = ({ book }) => {
  const volumeInfo = book.volumeInfo || {};
  const title = volumeInfo.title || 'Unknown Title';
  const authors = volumeInfo.authors || ['Unknown Author'];
  const publishedDate = volumeInfo.publishedDate || 'Unknown Date';
  const description = volumeInfo.description || 'No description available';
  const thumbnail = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail;
  const previewLink = volumeInfo.previewLink;
  const infoLink = volumeInfo.infoLink;

  // Truncate description
  const truncatedDescription = description.length > 150 
    ? description.substring(0, 150) + '...' 
    : description;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
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
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
            {title}
          </h4>
          
          <div className="flex items-center gap-1 mb-1">
            <FiUser className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {authors.join(', ')}
            </p>
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            <FiCalendar className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {publishedDate}
            </p>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
            {truncatedDescription}
          </p>

          {/* Links */}
          <div className="flex gap-2">
            {previewLink && (
              <a
                href={previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Preview
                <FiExternalLink className="w-3 h-3" />
              </a>
            )}
            {infoLink && (
              <a
                href={infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                More Info
                <FiExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;