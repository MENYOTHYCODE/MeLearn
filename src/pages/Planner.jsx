import { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import CalendarView from '../components/CalendarView';
import TaskAnalytics from '../components/TaskAnalytics';
import SmartScheduler from '../components/SmartScheduler';
import { FiPlus, FiFilter, FiCalendar, FiBarChart, FiClock, FiTarget, FiGrid, FiList, FiZap, FiTag, FiRepeat } from 'react-icons/fi';

const Planner = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [studySessions, setStudySessions] = useLocalStorage('studySessions', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // list, calendar, analytics
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSmartScheduler, setShowSmartScheduler] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Other',
    dueDate: '',
    priority: 'medium',
    estimatedTime: 60,
    tags: [],
    subtasks: [],
    resources: [],
    recurring: false,
    recurringPattern: 'weekly',
    reminderTime: '',
    notes: ''
  });
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [newResource, setNewResource] = useState('');

  const subjects = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer', 'Art', 'Music', 'Other'];
  const priorities = [
    { value: 'high', label: 'High Priority', color: 'red' },
    { value: 'medium', label: 'Medium Priority', color: 'yellow' },
    { value: 'low', label: 'Low Priority', color: 'green' }
  ];

  // Analytics calculations
  const analytics = useMemo(() => {
    const now = new Date();
    const thisWeek = tasks.filter(task => {
      const taskDate = new Date(task.dueDate || task.createdAt);
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return taskDate >= weekStart;
    });

    const completionRate = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      return new Date(task.dueDate) < new Date();
    });

    const subjectStats = subjects.reduce((acc, subject) => {
      const subjectTasks = tasks.filter(t => t.subject === subject);
      const completed = subjectTasks.filter(t => t.completed).length;
      acc[subject] = {
        total: subjectTasks.length,
        completed,
        rate: subjectTasks.length > 0 ? (completed / subjectTasks.length) * 100 : 0
      };
      return acc;
    }, {});

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      completionRate,
      overdueTasks: overdueTasks.length,
      thisWeekTasks: thisWeek.length,
      subjectStats
    };
  }, [tasks, subjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...formData, id: task.id, completed: task.completed }
          : task
      ));
    } else {
      setTasks([...tasks, {
        ...formData,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString()
      }]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      subject: 'Other', 
      dueDate: '', 
      priority: 'medium',
      estimatedTime: 60,
      tags: [],
      subtasks: [],
      resources: [],
      recurring: false,
      recurringPattern: 'weekly',
      reminderTime: '',
      notes: ''
    });
    setNewTag('');
    setNewSubtask('');
    setNewResource('');
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      subject: task.subject,
      dueDate: task.dueDate || '',
      priority: task.priority || 'medium',
      estimatedTime: task.estimatedTime || 60,
      tags: task.tags || [],
      subtasks: task.subtasks || [],
      resources: task.resources || [],
      recurring: task.recurring || false,
      recurringPattern: task.recurringPattern || 'weekly',
      reminderTime: task.reminderTime || '',
      notes: task.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleToggle = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return task.subject === filter;
  });

  // Helper functions for form management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        subtasks: [...prev.subtasks, { id: Date.now(), text: newSubtask.trim(), completed: false }] 
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (subtaskId) => {
    setFormData(prev => ({ 
      ...prev, 
      subtasks: prev.subtasks.filter(subtask => subtask.id !== subtaskId) 
    }));
  };

  const addResource = () => {
    if (newResource.trim()) {
      setFormData(prev => ({ ...prev, resources: [...prev.resources, newResource.trim()] }));
      setNewResource('');
    }
  };

  const removeResource = (resourceToRemove) => {
    setFormData(prev => ({ ...prev, resources: prev.resources.filter(resource => resource !== resourceToRemove) }));
  };

  const handleScheduleTask = (scheduledTask) => {
    setTasks(tasks.map(task => 
      task.id === scheduledTask.id ? scheduledTask : task
    ));
    setShowSmartScheduler(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (viewMode === 'calendar') {
      // Optionally filter tasks by selected date
    }
  };

  const handleAddTaskToDate = (date) => {
    setFormData(prev => ({ 
      ...prev, 
      dueDate: date.toISOString().split('T')[0] 
    }));
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Planner</h1>
          <p className="text-gray-600 dark:text-gray-200">
            Organize and track your study tasks with AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSmartScheduler(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <FiZap /> Smart Schedule
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Add Task
          </button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">View:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <FiList className="w-4 h-4" /> List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <FiCalendar className="w-4 h-4" /> Calendar
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  viewMode === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <FiBarChart className="w-4 h-4" /> Analytics
              </button>
            </div>
          </div>
          
          {viewMode === 'list' && (
            <div className="flex items-center gap-2">
              <FiFilter className="w-5 h-5" />
              <span className="font-medium">Filter:</span>
            </div>
          )}
        </div>
        
        {viewMode === 'list' && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Active ({tasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Completed ({tasks.filter(t => t.completed).length})
            </button>
            {subjects.map(subject => {
              const count = tasks.filter(t => t.subject === subject).length;
              return count > 0 ? (
                <button
                  key={subject}
                  onClick={() => setFilter(subject)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === subject ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {subject} ({count})
                </button>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="card text-center py-12">
              <FiTarget className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-200 text-lg mb-2">
                No tasks found
              </p>
              <p className="text-gray-400 dark:text-gray-300">
                {filter === 'all' 
                  ? 'Create your first task to get started!' 
                  : `No ${filter} tasks. Try a different filter.`}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      )}

      {viewMode === 'calendar' && (
        <CalendarView
          tasks={tasks}
          onTaskClick={handleEdit}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          onAddTask={handleAddTaskToDate}
        />
      )}

      {viewMode === 'analytics' && (
        <TaskAnalytics
          tasks={tasks}
          studySessions={studySessions}
          analytics={analytics}
        />
      )}

      {/* Smart Scheduler Modal */}
      {showSmartScheduler && (
        <Modal
          isOpen={showSmartScheduler}
          onClose={() => setShowSmartScheduler(false)}
          title="Smart Scheduler"
        >
          <SmartScheduler
            tasks={tasks}
            studySessions={studySessions}
            onScheduleTask={handleScheduleTask}
            onClose={() => setShowSmartScheduler(false)}
          />
        </Modal>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
                placeholder="Enter task title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Describe your task..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  required
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input-field"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
              <FiClock className="w-5 h-5" />
              Scheduling
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Time (minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  step="15"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reminder Time</label>
              <input
                type="datetime-local"
                value={formData.reminderTime}
                onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="recurring" className="text-sm font-medium">Recurring Task</label>
              {formData.recurring && (
                <select
                  value={formData.recurringPattern}
                  onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value })}
                  className="input-field flex-1"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
              <FiTag className="w-5 h-5" />
              Tags
            </h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input-field flex-1"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Subtasks</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                className="input-field flex-1"
                placeholder="Add a subtask..."
              />
              <button
                type="button"
                onClick={addSubtask}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            
            {formData.subtasks.length > 0 && (
              <div className="space-y-2">
                {formData.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <span className="flex-1">{subtask.text}</span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Resources</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
                className="input-field flex-1"
                placeholder="Add a resource (book, website, etc.)..."
              />
              <button
                type="button"
                onClick={addResource}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            
            {formData.resources.length > 0 && (
              <div className="space-y-2">
                {formData.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <span className="flex-1">{resource}</span>
                    <button
                      type="button"
                      onClick={() => removeResource(resource)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Additional Notes</h3>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Any additional notes or instructions..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Planner;
