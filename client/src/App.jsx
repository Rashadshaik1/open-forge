import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import DemoSwitcher from './components/DemoSwitcher';

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

function AppContent() {
  const location = useLocation();
  const isGateRoute = location.pathname === '/portal' || location.pathname === '/gate';

  // Splash screen state: display for 1.8 seconds on initial session visit
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('splash') === 'true') return true;
    return !sessionStorage.getItem('openforge_splash_shown');
  });

  // Listen to splash parameter trigger from demo switcher or links
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('splash') === 'true') {
      setShowSplash(true);
    }
  }, [location.search]);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('openforge_splash_shown', 'true');
  };

  // If user arrives at root `/` and hasn't passed the role gate this session, show RoleGate
  const isRoot = location.pathname === '/';
  const hasPassedGate = typeof window !== 'undefined' && sessionStorage.getItem('openforge_gate_passed') === 'true';
  const shouldShowGateAtRoot = isRoot && !hasPassedGate;

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} duration={1800} />}

      {isGateRoute || shouldShowGateAtRoot ? (
        <RoleGate />
      ) : (
        <div className="min-h-screen flex flex-col bg-[#FFF7ED] dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] font-sans selection:bg-[#E53E24]/20 selection:text-[#E53E24] transition-colors duration-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scanner" element={<VolunteerScanner />} />
              <Route path="/volunteer-scanner" element={<VolunteerScanner />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}

      {/* Floating Demo Role Switcher for Club Day booth presentation */}
      <DemoSwitcher />
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

