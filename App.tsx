import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from './types';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/Auth';
import { LandingPage } from './pages/Landing';

// Citizen Pages
import { ReportWaste } from './pages/citizen/ReportWaste';
import { MyReports } from './pages/citizen/MyReports';

// Cleaner Pages
import { CleanerDashboard } from './pages/cleaner/CleanerDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminZones } from './pages/admin/Zones';
import { AdminTasks } from './pages/admin/Tasks';
import { AdminReports } from './pages/admin/Reports';
import { AdminAnalytics } from './pages/admin/Analytics';

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
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!user.isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout userRole={user.role} onLogout={handleLogout}>
        <Routes>
          {/* Redirect root based on role */}
          <Route path="/" element={
            user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> :
            user.role === 'CLEANER' ? <Navigate to="/cleaner/tasks" /> :
            <Navigate to="/citizen/report" />
          } />

          {/* Citizen Routes */}
          {user.role === 'CITIZEN' && (
            <>
              <Route path="/citizen/report" element={<ReportWaste />} />
              <Route path="/citizen/reports" element={<MyReports />} />
            </>
          )}

          {/* Cleaner Routes */}
          {user.role === 'CLEANER' && (
            <>
              <Route path="/cleaner/tasks" element={<CleanerDashboard />} />
              <Route path="/cleaner/history" element={<CleanerDashboard />} />
            </>
          )}

          {/* Admin Routes */}
          {user.role === 'ADMIN' && (
            <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/zones" element={<AdminZones />} />
              <Route path="/admin/tasks" element={<AdminTasks />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;