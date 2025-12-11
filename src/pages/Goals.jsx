import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateStudyTime } from '../utils/calculateProgress';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FiTarget, FiTrendingUp } from 'react-icons/fi';

const Goals = () => {
  const [goals, setGoals] = useLocalStorage('goals', {
    daily: 60,
    weekly: 420,
    monthly: 1800
  });
  const [studySessions] = useLocalStorage('studySessions', []);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    bySubject: []
  });

  useEffect(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todaySessions = studySessions.filter(s => new Date(s.date) >= todayStart);
    const weekSessions = studySessions.filter(s => new Date(s.date) >= weekStart);
    const monthSessions = studySessions.filter(s => new Date(s.date) >= monthStart);

    // Calculate by subject (mock data for demo)
    const subjectData = [
      { name: 'Math', value: 120, color: '#3B82F6' },
      { name: 'Science', value: 90, color: '#10B981' },
      { name: 'English', value: 75, color: '#8B5CF6' },
      { name: 'History', value: 60, color: '#F59E0B' },
      { name: 'Other', value: 45, color: '#6B7280' }
    ];

    setStats({
      today: calculateStudyTime(todaySessions),
      week: calculateStudyTime(weekSessions),
      month: calculateStudyTime(monthSessions),
      bySubject: subjectData
    });
  }, [studySessions]);

  const handleGoalChange = (period, value) => {
    setGoals({ ...goals, [period]: Number(value) });
  };

  const GoalCard = ({ title, current, target, period }) => {
    const percentage = Math.min((current / target) * 100, 100);
    
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FiTarget className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              {current} / {target} minutes
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3">
          <div
            className="bg-linear-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{Math.round(percentage)}% Complete</span>
          <input
            type="number"
            value={target}
            onChange={(e) => handleGoalChange(period, e.target.value)}
            className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            min="1"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Goals & Progress</h1>
        <p className="text-gray-600 dark:text-gray-200">
          Track your study goals and achievements
        </p>
      </div>

      {/* Goal Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <GoalCard
          title="Daily Goal"
          current={stats.today}
          target={goals.daily}
          period="daily"
        />
        <GoalCard
          title="Weekly Goal"
          current={stats.week}
          target={goals.weekly}
          period="weekly"
        />
        <GoalCard
          title="Monthly Goal"
          current={stats.month}
          target={goals.monthly}
          period="monthly"
        />
      </div>

      {/* Subject Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiTrendingUp /> Study Time by Subject
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.bySubject}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.bySubject.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold mb-4">Achievement Milestones</h3>
          <div className="space-y-4">
            {[
              { title: 'First Study Session', achieved: studySessions.length > 0 },
              { title: '10 Hours Total', achieved: calculateStudyTime(studySessions) >= 600 },
              { title: '7 Day Streak', achieved: false },
              { title: '50 Tasks Completed', achieved: false },
              { title: '100 Hours Total', achieved: calculateStudyTime(studySessions) >= 6000 }
            ].map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  milestone.achieved
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  milestone.achieved ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {milestone.achieved ? '✓' : '○'}
                </div>
                <span className={milestone.achieved ? 'font-semibold' : ''}>
                  {milestone.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
