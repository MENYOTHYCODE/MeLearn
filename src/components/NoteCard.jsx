import { FiTrash2, FiEdit2 } from 'react-icons/fi';

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className={`${note.color} border-2 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
          {note.title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-4">
        {note.content}
      </p>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-200">
        {new Date(note.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default NoteCard;
