import React from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { IntroSplash } from './components/IntroSplash';
import { PageLoader } from './components/ZeroLoader';
import { AuthPage } from './pages/Auth';
import { LandingPage } from './pages/Landing';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
import { CleanerPayments } from './pages/cleaner/Payments';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminZones } from './pages/admin/Zones';
import { AdminTasks } from './pages/admin/Tasks';
import { AdminReports } from './pages/admin/Reports';
import { AdminProfile } from './pages/admin/Profile';
import { AdminPayments } from './pages/admin/Payments';
import { SuperAdminDashboard } from './pages/superadmin/Dashboard';


// Landing page wrapper to use navigation
const LandingPageWrapper = () => {
  const navigate = useNavigate();
  return <LandingPage onGetStarted={() => navigate('/auth')} />;
};

const IntroGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isIntroDone, setIsIntroDone] = React.useState<boolean>(() => {
    return sessionStorage.getItem('zero_intro_seen') === '1';
  });

  const isLandingRoute = location.pathname === '/' || location.pathname === '';

  const completeIntro = React.useCallback(() => {
    sessionStorage.setItem('zero_intro_seen', '1');
    setIsIntroDone(true);
  }, []);

  if (!isLandingRoute || isIntroDone) {
    return <>{children}</>;
  }

  return <IntroSplash onDone={completeIntro} durationMs={6500} />;
};

const AppContent = () => {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader label="Loading..." className="py-0" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <HashRouter>
        <IntroGate>
          <Routes>
            <Route path="/" element={<LandingPageWrapper />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </IntroGate>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <Layout userRole={user!.role} onLogout={logout}>
        <Routes>
          {/* Redirect root based on role */}
          <Route path="/" element={
            user!.role === 'ADMIN' && user!.isSuperAdmin ? <Navigate to="/superadmin/dashboard" /> :
            user!.role === 'ADMIN' ? <Navigate to="/admin/dashboard" /> :
            user!.role === 'CLEANER' ? <Navigate to="/cleaner/available" /> :
            <Navigate to="/citizen/report" />
          } />

          {/* Citizen Routes */}
          {user!.role === 'CITIZEN' && (
            <>
              <Route path="/citizen/report" element={<ReportWaste />} />
              <Route path="/citizen/reports" element={<MyReports />} />
              <Route path="/citizen/reviews" element={<MyReviews />} />
              <Route path="/citizen/leaderboard" element={<Leaderboard />} />
              <Route path="/citizen/profile" element={<Profile />} />
            </>
          )}

          {/* Cleaner Routes */}
          {user!.role === 'CLEANER' && (
            <>
              <Route path="/cleaner/available" element={<AvailableTasks />} />
              <Route path="/cleaner/tasks" element={<MyTasks />} />
              <Route path="/cleaner/history" element={<CleanerHistory />} />
              <Route path="/cleaner/payments" element={<CleanerPayments />} />
              <Route path="/cleaner/leaderboard" element={<CleanerLeaderboard />} />
              <Route path="/cleaner/profile" element={<CleanerProfile />} />
            </>
          )}

          {/* Admin Routes */}
          {user!.role === 'ADMIN' && user!.isSuperAdmin && (
            <>
              <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            </>
          )}

          {user!.role === 'ADMIN' && !user!.isSuperAdmin && (
            <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/zones" element={<AdminZones />} />
              <Route path="/admin/tasks" element={<AdminTasks />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </>
          )}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;