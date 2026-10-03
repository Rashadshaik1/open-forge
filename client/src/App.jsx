import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import VolunteerScanner from './pages/VolunteerScanner';
import AdminPanel from './pages/AdminPanel';
import RoleGate from './pages/RoleGate';
import TeamPage from './pages/TeamPage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';
import GalleryPage from './pages/GalleryPage';
import PosterPage from './pages/PosterPage';

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED] dark:bg-[#0B0F17]">
        <div className="text-xs font-bold text-[#E53E24] animate-pulse">Authenticating session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If unauthorized for this level, send them to their natural landing
    if (user?.role === 'volunteer') return <Navigate to="/volunteer-scanner" replace />;
    if (user?.role === 'board' || user?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const isGateRoute = location.pathname === '/portal' || location.pathname === '/gate';

  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('splash') === 'true') return true;
    return !sessionStorage.getItem('openforge_splash_shown');
  });

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('openforge_splash_shown', 'true');
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} duration={1800} />}

      {isGateRoute ? (
        <RoleGate />
      ) : (
        <div className="min-h-screen flex flex-col bg-[#FFF7ED] dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] font-sans selection:bg-[#E53E24]/20 selection:text-[#E53E24] transition-colors duration-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Access */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/portal" element={<RoleGate />} />
              <Route path="/gate" element={<RoleGate />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/poster" element={<PosterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Student Portal (Any authenticated user) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student', 'volunteer', 'board', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Staff Terminal (Volunteers, Board, and Admins) */}
              <Route
                path="/scanner"
                element={
                  <ProtectedRoute allowedRoles={['volunteer', 'board', 'admin']}>
                    <VolunteerScanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer-scanner"
                element={
                  <ProtectedRoute allowedRoles={['volunteer', 'board', 'admin']}>
                    <VolunteerScanner />
                  </ProtectedRoute>
                }
              />

              {/* Super Admin & Board Management */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['board', 'admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}