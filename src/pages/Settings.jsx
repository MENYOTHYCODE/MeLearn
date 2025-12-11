import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext';
import { calculateStudyTime, calculateStreak } from '../utils/calculateProgress';
import { FiUser, FiMoon, FiSun, FiTrash2, FiAward } from 'react-icons/fi';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useLocalStorage('profile', {
    name: '',
    subjects: []
  });
  const [tasks] = useLocalStorage('tasks', []);
  const [notes] = useLocalStorage('notes', []);
  const [studySessions] = useLocalStorage('studySessions', []);
  
  const [formData, setFormData] = useState(profile);

  const subjects = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer', 'Art', 'Music'];

  const handleSave = () => {
    setProfile(formData);
    alert('Profile updated successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all app data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleSubject = (subject) => {
    const subjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject];
    setFormData({ ...formData, subjects });
  };

  const totalStudyTime = calculateStudyTime(studySessions);
  const studyDates = studySessions.map(s => s.date);
  const streak = calculateStreak(studyDates);
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-200">
          Manage your profile and app preferences
        </p>
      </div>

      {/* Profile Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FiUser className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preferred Subjects</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    formData.subjects.includes(subject)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary">
            Save Profile
          </button>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium mb-1">Theme</p>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              Choose your preferred color scheme
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'light' ? (
              <>
                <FiMoon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <FiSun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <FiAward className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Your Stats</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-1">Total Study Time</p>
            <p className="text-2xl font-bold">
              {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-1">Current Streak</p>
            <p className="text-2xl font-bold">{streak} days</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-1">Tasks Completed</p>
            <p className="text-2xl font-bold">{completedTasks}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-1">Total Notes</p>
            <p className="text-2xl font-bold">{notes.length}</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-2 border-red-500">
        <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Danger Zone</h2>
        <p className="text-gray-600 dark:text-gray-200 mb-4">
          Reset all app data including tasks, notes, goals, and study sessions. This action cannot be undone.
        </p>
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <FiTrash2 />
          Reset All Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
