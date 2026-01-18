import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { calculateProgress, calculateStudyTime, calculateStreak, getWeeklyData } from '../utils/calculateProgress';
import ProgressChart from '../components/ProgressChart';
import QuoteCard from '../components/QuoteCard';
import { FiCheckCircle, FiClock, FiFileText, FiTrendingUp, FiUser, FiMail, FiLogOut } from 'react-icons/fi';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tasks] = useLocalStorage('tasks', []);
  const [notes] = useLocalStorage('notes', []);
  const [studySessions] = useLocalStorage('studySessions', []);
  const [goals] = useLocalStorage('goals', { daily: 60, weekly: 420, monthly: 1800 });

  const [stats, setStats] = useState({
    completedTasks: 0,
    totalTasks: 0,
    totalNotes: 0,
    studyTime: 0,
    streak: 0,
    progress: 0
  });

  useEffect(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalStudyTime = calculateStudyTime(studySessions);
    const studyDates = studySessions.map(s => s.date);
    const streak = calculateStreak(studyDates);
    const progress = calculateProgress(tasks);

    setStats({
      completedTasks,
      totalTasks: tasks.length,
      totalNotes: notes.length,
      studyTime: totalStudyTime,
      streak,
      progress
    });
  }, [tasks, notes, studySessions]);

  const weeklyData = getWeeklyData(studySessions);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatUserName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ').map(name => 
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const statCards = [
    {
      icon: FiCheckCircle,
      label: 'Tasks Completed',
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: FiClock,
      label: 'Study Time',
      value: `${Math.floor(stats.studyTime / 60)}h ${stats.studyTime % 60}m`,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: FiFileText,
      label: 'Total Notes',
      value: stats.totalNotes,
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: FiTrendingUp,
      label: 'Study Streak',
      value: `${stats.streak} days`,
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FiUser className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {formatUserName(user?.fullName)}!
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-white/80">
                <div className="flex items-center space-x-1">
                  <FiMail className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="text-sm">
                  Member since {formatJoinDate(user?.createdAt)}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Study Overview</h2>
        <p className="text-gray-600 dark:text-gray-200">
          Here's your learning progress and achievements.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-600 dark:text-gray-200 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quote Card */}
      <QuoteCard />

      {/* Progress Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ProgressChart data={weeklyData} />
        
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Today's Goal</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Daily Goal</span>
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  {stats.studyTime} / {goals.daily} min
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-linear-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((stats.studyTime / goals.daily) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Task Progress</span>
                <span className="text-sm text-gray-600 dark:text-gray-200">
                  {stats.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-linear-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
