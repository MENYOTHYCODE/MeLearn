export const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(task => task.completed).length;
  return Math.round((completed / tasks.length) * 100);
};

export const calculateStudyTime = (sessions) => {
  if (!sessions || sessions.length === 0) return 0;
  return sessions.reduce((total, session) => total + (session.duration || 0), 0);
};

export const calculateStreak = (studyDates) => {
  if (!studyDates || studyDates.length === 0) return 0;
  
  const sortedDates = studyDates.sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let dateStr of sortedDates) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }
  
  return streak;
};

export const getWeeklyData = (sessions) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekData = days.map(day => ({ day, minutes: 0 }));
  
  sessions.forEach(session => {
    const date = new Date(session.date);
    const dayIndex = date.getDay();
    weekData[dayIndex].minutes += session.duration || 0;
  });
  
  return weekData;
};
