import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import LearnMore from './pages/LearnMore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Notes from './pages/Notes';
import StudyRoom from './pages/StudyRoom';
import Goals from './pages/Goals';
import Resources from './pages/Resources';
import Settings from './pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50 dark:bg-blue-900 w-[580px]">
                    <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <div className="flex">
                      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
                      <main className="flex-1 p-6 lg:ml-0">
                        <div className="max-w-7xl mx-auto">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/planner" element={<Planner />} />
                            <Route path="/notes" element={<Notes />} />
                            <Route path="/study-room" element={<StudyRoom />} />
                            <Route path="/goals" element={<Goals />} />
                            <Route path="/resources" element={<Resources />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                          </Routes>
                        </div>
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
