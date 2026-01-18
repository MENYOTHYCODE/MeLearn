import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Timer from '../components/Timer';
import QuickAccessButton from '../components/QuickAccessButton';
import QuickAccessPanel from '../components/QuickAccessPanel';
import FocusMode from '../components/FocusMode';
import SessionGoalModal from '../components/SessionGoalModal';
import SessionReflectionModal from '../components/SessionReflectionModal';
import ProductivityInsights from '../components/ProductivityInsights';
import StudySessionHistory from '../components/StudySessionHistory';
import ScheduledGoalsManager from '../components/ScheduledGoalsManager';
import { FiVolume2, FiVolumeX, FiTarget, FiEye, FiBarChart, FiClock } from 'react-icons/fi';

const StudyRoom = () => {
  const [studySessions, setStudySessions] = useLocalStorage('studySessions', []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [quickAccessOpen, setQuickAccessOpen] = useState(false);
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [currentSessionGoal, setCurrentSessionGoal] = useState('');
  const [completedSession, setCompletedSession] = useState(null);
  const audioRef = useRef(null);
  const AUDIO_URL = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
  const SOUND_OPTIONS = [
    { label: 'Default Chime', url: AUDIO_URL },
    { label: 'Soft Bell', url: 'https://assets.mixkit.co/active_storage/sfx/1706/1706-preview.mp3' },
    { label: 'Minimal Clicks', url: 'https://assets.mixkit.co/active_storage/sfx/454/454-preview.mp3' },
    { label: 'Nature Ambience', url: 'https://assets.mixkit.co/active_storage/sfx/240/240-preview.mp3' }
  ];

  // Initialize audio element on client-side after mount
  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio(AUDIO_URL);
      a.preload = 'auto';
      a.crossOrigin = 'anonymous';
      a.volume = studyPreferences.soundVolume;
      audioRef.current = a;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enhanced session tracking
  const [sessionStats, setSessionStats] = useLocalStorage('sessionStats', {
    totalSessions: 0,
    totalMinutes: 0,
    streak: 0,
    lastSessionDate: null,
    weeklyGoal: 300, // 5 hours per week
    bestStreak: 0
  });

  const [dailyGoals, setDailyGoals] = useLocalStorage('dailyGoals', {});
  const [scheduledGoals, setScheduledGoals] = useLocalStorage('scheduledGoals', []);
  const [studyPreferences, setStudyPreferences] = useLocalStorage('studyPreferences', {
    defaultWorkDuration: 25,
    defaultBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false,
    soundVolume: 0.3,
    soundUrl: AUDIO_URL
  });

  const handleSoundChange = async (e) => {
    const url = e.target.value;
    setStudyPreferences({ ...studyPreferences, soundUrl: url });
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.volume = studyPreferences.soundVolume;
      if (soundEnabled) {
        try {
          await audioRef.current.play();
        } catch (err) {
          console.warn('Audio play failed after changing sound:', err);
        }
      }
    }
  };

  // Update audio volume when preferences change
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = studyPreferences.soundVolume;
  }, [studyPreferences.soundVolume]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSessionComplete = (duration, sessionType = 'work') => {
    const now = new Date();
    const today = now.toDateString();
    
    const newSession = {
      id: Date.now(),
      duration,
      date: now.toISOString(),
      type: sessionType,
      goal: currentSessionGoal,
      completed: true,
      productivity: null, // Will be set in reflection
      notes: ''
    };

    // Update sessions
    const updatedSessions = [...studySessions, newSession];
    setStudySessions(updatedSessions);

    // Update stats for work sessions only
    if (sessionType === 'work') {
      const lastDate = sessionStats.lastSessionDate;
      const isConsecutiveDay = lastDate && 
        new Date(lastDate).toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();
      
      const newStreak = isConsecutiveDay || (lastDate && new Date(lastDate).toDateString() === today) 
        ? sessionStats.streak + 1 
        : 1;

      setSessionStats({
        ...sessionStats,
        totalSessions: sessionStats.totalSessions + 1,
        totalMinutes: sessionStats.totalMinutes + duration,
        streak: newStreak,
        bestStreak: Math.max(sessionStats.bestStreak, newStreak),
        lastSessionDate: now.toISOString()
      });

      // Set up reflection modal
      setCompletedSession(newSession);
      setShowReflectionModal(true);
    }

    // Clear current goal
    setCurrentSessionGoal('');
  };

  const handleReflectionComplete = (reflection) => {
    if (completedSession) {
      const updatedSessions = studySessions.map(session => 
        session.id === completedSession.id 
          ? { ...session, ...reflection }
          : session
      );
      setStudySessions(updatedSessions);
    }
    setCompletedSession(null);
    setShowReflectionModal(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleSound = async () => {
    const audio = audioRef.current;
    if (!audio) {
      console.warn('Audio not initialized');
      return;
    }

    if (soundEnabled) {
      audio.pause();
      audio.currentTime = 0;
      setSoundEnabled(false);
      return;
    }

    audio.loop = true;
    audio.volume = studyPreferences.soundVolume;
    try {
      await audio.play();
      setSoundEnabled(true);
    } catch (err) {
      console.warn('Audio play failed:', err);
      // Common cause: browser requires a user gesture to enable audio.
      // Leave sound disabled and inform via console; consider showing a UI hint.
    }
  };

  const toggleFocusMode = () => {
    setFocusModeActive(!focusModeActive);
    if (!focusModeActive) {
      // Entering focus mode
      setQuickAccessOpen(false);
    }
  };

  const startStudySession = () => {
    setShowGoalModal(true);
  };

  const handleGoalSet = (goal) => {
    setCurrentSessionGoal(goal);
    setShowGoalModal(false);
  };

  const handleStartScheduledSession = (scheduledGoal) => {
    setCurrentSessionGoal(scheduledGoal.title + (scheduledGoal.description ? ` - ${scheduledGoal.description}` : ''));
    
    // Update timer duration if different
    if (scheduledGoal.duration !== studyPreferences.defaultWorkDuration) {
      setStudyPreferences({
        ...studyPreferences,
        defaultWorkDuration: scheduledGoal.duration
      });
    }
    
    setShowGoalModal(false);
  };

  // Calculate today's progress
  const today = new Date().toDateString();
  const todaySessions = studySessions.filter(session => 
    new Date(session.date).toDateString() === today && session.type === 'work'
  );
  const todayMinutes = todaySessions.reduce((total, session) => total + session.duration, 0);
  const dailyGoal = dailyGoals[today] || 120; // Default 2 hours

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -m-6 p-6 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with enhanced controls */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Me<i>Learn.</i> Study Room
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Keep track of your productivity.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={startStudySession}
              className="btn-primary flex items-center gap-2"
            >
              <FiTarget />
              Set Goal
            </button>
            <button
              onClick={toggleFocusMode}
              className={`btn-secondary flex items-center gap-2 ${
                focusModeActive ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : ''
              }`}
            >
              <FiEye />
              {focusModeActive ? 'Exit Focus' : 'Focus Mode'}
            </button>
            <div className="flex items-center gap-2">
              <select
                value={studyPreferences.soundUrl}
                onChange={handleSoundChange}
                className="input-select mr-2"
                aria-label="Select notification sound"
              >
                {SOUND_OPTIONS.map(opt => (
                  <option key={opt.url} value={opt.url}>{opt.label}</option>
                ))}
              </select>

              <button
                onClick={toggleSound}
                className="btn-secondary flex items-center gap-2"
              >
                {soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
                {soundEnabled ? 'Sound On' : 'Sound Off'}
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="btn-secondary"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>

        {/* Today's Progress Bar */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiClock className="text-blue-600" />
              Today's Progress
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {todayMinutes} / {dailyGoal} minutes
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayMinutes / dailyGoal) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>{todaySessions.length} sessions completed</span>
            <span>{Math.round((todayMinutes / dailyGoal) * 100)}% of daily goal</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            <Timer 
              onSessionComplete={handleSessionComplete}
              currentGoal={currentSessionGoal}
              preferences={studyPreferences}
              onPreferencesChange={setStudyPreferences}
            />

            {/* Productivity Insights */}
            <ProductivityInsights 
              sessions={studySessions}
              stats={sessionStats}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scheduled Goals Manager */}
            <ScheduledGoalsManager 
              scheduledGoals={scheduledGoals}
              onScheduledGoalsChange={setScheduledGoals}
              onStartScheduledSession={handleStartScheduledSession}
            />

            {/* Study Session History */}
            <StudySessionHistory 
              sessions={studySessions}
              onSessionUpdate={setStudySessions}
            />

            {/* Enhanced Study Tips */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                💡 Smart Study Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-blue-800 dark:text-blue-300">Peak Focus Time</p>
                  <p className="text-blue-700 dark:text-blue-400">
                    Your most productive sessions are typically between 2-4 PM
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                  <p className="font-medium text-green-800 dark:text-green-300">Streak Bonus</p>
                  <p className="text-green-700 dark:text-green-400">
                    You're on a {sessionStats.streak} day streak! Keep it up!
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                  <p className="font-medium text-purple-800 dark:text-purple-300">Study Technique</p>
                  <p className="text-purple-700 dark:text-purple-400">
                    Try the Feynman Technique: explain concepts in simple terms
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiBarChart className="text-green-600" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {sessionStats.totalSessions}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">Total Sessions</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {Math.round(sessionStats.totalMinutes / 60)}h
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">Total Time</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {sessionStats.streak}
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">Day Streak</div>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {sessionStats.bestStreak}
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">Best Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Mode Overlay */}
      <FocusMode 
        isActive={focusModeActive}
        onExit={() => setFocusModeActive(false)}
        currentGoal={currentSessionGoal}
      />

      {/* Modals */}
      <SessionGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onGoalSet={handleGoalSet}
      />

      <SessionReflectionModal
        isOpen={showReflectionModal}
        onClose={() => setShowReflectionModal(false)}
        onComplete={handleReflectionComplete}
        session={completedSession}
      />

      {/* Quick Access Panel */}
      <QuickAccessButton 
        isOpen={quickAccessOpen} 
        onClick={() => setQuickAccessOpen(!quickAccessOpen)} 
      />
      <QuickAccessPanel 
        isOpen={quickAccessOpen} 
        onClose={() => setQuickAccessOpen(false)} 
      />
    </div>
  );
};

export default StudyRoom;
