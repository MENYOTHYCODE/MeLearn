import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Timer from '../components/Timer';
import QuickAccessButton from '../components/QuickAccessButton';
import QuickAccessPanel from '../components/QuickAccessPanel';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

const StudyRoom = () => {
  const [studySessions, setStudySessions] = useLocalStorage('studySessions', []);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [quickAccessOpen, setQuickAccessOpen] = useState(false);
  const [audioElement] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'));

  const handleSessionComplete = (duration) => {
    const newSession = {
      id: Date.now(),
      duration,
      date: new Date().toISOString(),
      type: 'pomodoro'
    };
    setStudySessions([...studySessions, newSession]);
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

  const toggleSound = () => {
    if (soundEnabled) {
      audioElement.pause();
      audioElement.currentTime = 0;
    } else {
      audioElement.loop = true;
      audioElement.volume = 0.3;
      audioElement.play().catch(err => console.log('Audio play failed:', err));
    }
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -m-6 p-6 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Room</h1>
            <p className="text-gray-600 dark:text-gray-200">
              Focus mode with Pomodoro timer
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleSound}
              className="btn-secondary flex items-center gap-2"
            >
              {soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </button>
            <button
              onClick={toggleFullscreen}
              className="btn-primary"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>

        {/* Timer */}
        <Timer onSessionComplete={handleSessionComplete} />

        {/* Study Tips */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">📚 Study Tips</h3>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Eliminate distractions - put your phone away</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Take notes while studying to improve retention</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Use breaks to stretch and rest your eyes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Stay hydrated - keep water nearby</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Review what you learned after each session</span>
            </li>
          </ul>
        </div>

        {/* Recent Sessions */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
          {studySessions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-200">
              No study sessions yet. Complete your first Pomodoro!
            </p>
          ) : (
            <div className="space-y-2">
              {studySessions.slice(-5).reverse().map(session => (
                <div
                  key={session.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm">
                    {new Date(session.date).toLocaleString()}
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {session.duration} minutes
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
