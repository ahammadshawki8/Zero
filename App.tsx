import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from './types';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/Auth';
import { LandingPage } from './pages/Landing';
import { ThemeProvider } from './contexts/ThemeContext';

// Citizen Pages
import { ReportWaste } from './pages/citizen/ReportWaste';
import { MyReports } from './pages/citizen/MyReports';
import { MyReviews } from './pages/citizen/MyReviews';
import { Leaderboard } from './pages/citizen/Leaderboard';
import { Profile } from './pages/citizen/Profile';

// Cleaner Pages
import { AvailableTasks } from './pages/cleaner/AvailableTasks';
import { MyTasks } from './pages/cleaner/MyTasks';
import { CleanerHistory } from './pages/cleaner/History';
import { CleanerLeaderboard } from './pages/cleaner/Leaderboard';
import { CleanerProfile } from './pages/cleaner/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminZones } from './pages/admin/Zones';
import { AdminTasks } from './pages/admin/Tasks';
import { AdminReports } from './pages/admin/Reports';
import { AdminProfile } from './pages/admin/Profile';


const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState<{ role: UserRole; isAuthenticated: boolean }>({
    role: 'CITIZEN',
    isAuthenticated: false,
  });

  const handleLogin = (role: UserRole) => {
    setUser({ role, isAuthenticated: true });
  };

  const handleLogout = () => {
    setUser({ role: 'CITIZEN', isAuthenticated: false });
    setShowLanding(true);
  };

  if (showLanding && !user.isAuthenticated) {
    return (
      <ThemeProvider>
        <LandingPage onGetStarted={() => setShowLanding(false)} />
      </ThemeProvider>
    );
  }

  if (!user.isAuthenticated) {
    return (
      <ThemeProvider>
        <AuthPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
    <HashRouter>
      <Layout userRole={user.role} onLogout={handleLogout}>
        <Routes>
          {/* Redirect root based on role */}
          <Route path="/" element={
            user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> :
            user.role === 'CLEANER' ? <Navigate to="/cleaner/available" /> :
            <Navigate to="/citizen/report" />
          } />

          {/* Citizen Routes */}
          {user.role === 'CITIZEN' && (
            <>
              <Route path="/citizen/report" element={<ReportWaste />} />
              <Route path="/citizen/reports" element={<MyReports />} />
              <Route path="/citizen/reviews" element={<MyReviews />} />
              <Route path="/citizen/leaderboard" element={<Leaderboard />} />
              <Route path="/citizen/profile" element={<Profile />} />
            </>
          )}

          {/* Cleaner Routes */}
          {user.role === 'CLEANER' && (
            <>
              <Route path="/cleaner/available" element={<AvailableTasks />} />
              <Route path="/cleaner/tasks" element={<MyTasks />} />
              <Route path="/cleaner/history" element={<CleanerHistory />} />
              <Route path="/cleaner/leaderboard" element={<CleanerLeaderboard />} />
              <Route path="/cleaner/profile" element={<CleanerProfile />} />
            </>
          )}

          {/* Admin Routes */}
          {user.role === 'ADMIN' && (
            <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/zones" element={<AdminZones />} />
              <Route path="/admin/tasks" element={<AdminTasks />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
    </ThemeProvider>
  );
};

export default App;