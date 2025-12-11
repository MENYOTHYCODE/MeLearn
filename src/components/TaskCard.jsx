import { FiCheck, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { getSubjectColor } from '../utils/subjectColors';

const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
  return (
    <div className={`card hover:shadow-lg ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
          }`}
        >
          {task.completed && <FiCheck className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 dark:text-gray-200 text-sm mt-1">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className={`${getSubjectColor(task.subject)} text-white text-xs px-2 py-1 rounded`}>
              {task.subject}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-500 dark:text-gray-200">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
