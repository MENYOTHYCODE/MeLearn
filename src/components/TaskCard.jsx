import { FiCheck, FiTrash2, FiEdit2, FiClock, FiFlag, FiTag, FiList, FiBookOpen } from 'react-icons/fi';
import { getSubjectColor } from '../utils/subjectColors';

const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
    }
  };

  const getPriorityIcon = (priority) => {
    const className = "w-4 h-4";
    switch (priority) {
      case 'high': return <FiFlag className={`${className} text-red-500`} />;
      case 'medium': return <FiFlag className={`${className} text-yellow-500`} />;
      case 'low': return <FiFlag className={`${className} text-green-500`} />;
      default: return <FiFlag className={`${className} text-blue-500`} />;
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div className={`card hover:shadow-lg transition-all border-l-4 ${getPriorityColor(task.priority)} ${
      task.completed ? 'opacity-60' : ''
    } ${isOverdue ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}>
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
          <div className="flex items-start justify-between">
            <h3 className={`font-semibold text-lg ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 ml-4">
              {getPriorityIcon(task.priority)}
              {isOverdue && (
                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                  Overdue
                </span>
              )}
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 dark:text-gray-200 text-sm mt-1 mb-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`${getSubjectColor(task.subject)} text-white text-xs px-2 py-1 rounded`}>
              {task.subject}
            </span>
            
            {task.estimatedTime && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                <FiClock className="w-3 h-3" />
                {task.estimatedTime}m
              </span>
            )}

            {totalSubtasks > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                <FiList className="w-3 h-3" />
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}

            {task.resources && task.resources.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                <FiBookOpen className="w-3 h-3" />
                {task.resources.length}
              </span>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                >
                  <FiTag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{task.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {task.dueDate && (
                <span className={`text-xs ${
                  isOverdue 
                    ? 'text-red-600 dark:text-red-400 font-medium' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              
              {task.scheduledTime && (
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Scheduled: {task.scheduledTime}
                </span>
              )}
            </div>

            {task.recurring && (
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                {task.recurringPattern}
              </span>
            )}
          </div>

          {/* Progress bar for subtasks */}
          {totalSubtasks > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Subtasks Progress</span>
                <span>{Math.round((completedSubtasks / totalSubtasks) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit task"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete task"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
