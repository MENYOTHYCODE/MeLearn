import { FiExternalLink, FiBook, FiVideo, FiBookmark } from 'react-icons/fi';
import noteService from '../services/noteService';
import { useNotification } from '../context/NotificationContext';

const ResourceCard = ({ resource, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'book':
        return <FiBook className="w-5 h-5" />;
      case 'video':
        return <FiVideo className="w-5 h-5" />;
      default:
        return <FiExternalLink className="w-5 h-5" />;
    }
  };

  const handleClick = () => {
    if (resource.link) {
      window.open(resource.link, '_blank');
    }
  };

  const saveResource = (e) => {
    e.stopPropagation();
    const title = resource.title || 'Resource';
    const content = `${resource.description ? resource.description + '\n\n' : ''}${resource.link || ''}`;
    const created = noteService.addNote({ title, content, category: 'Resource' });
    if (created) showSuccess('Saved', 'Resource saved to Notes'); else showError('Save failed', 'Could not save the resource.');
  };

  const { showSuccess, showError } = useNotification();

  return (
    <div
      onClick={handleClick}
      className="card hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all"
    >
      {resource.thumbnail && (
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {resource.title}
          </h3>

          {resource.description && (
            <p className="text-gray-600 dark:text-gray-200 text-sm line-clamp-3 mb-2">
              {resource.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            {resource.author && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                By {resource.author}
              </p>
            )}

            <button
              onClick={(e) => saveResource(e)}
              className="p-1 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
              title="Save resource to Notes"
            >
              <FiBookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
