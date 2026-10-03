import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  QrCode,
  Users,
  Shield,
  ArrowRight,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RoleGate() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleEnterPublic = (e) => {
    if (e) e.preventDefault();
    sessionStorage.setItem('openforge_gate_passed', 'true');
    navigate('/');
  };

  const handleRoleSelection = (targetRole) => {
    sessionStorage.setItem('openforge_gate_passed', 'true');

    // If already authenticated with this matching role, route directly to the tool
    if (isAuthenticated && user?.role === targetRole) {
      if (targetRole === 'volunteer') {
        navigate('/volunteer-scanner');
      } else if (targetRole === 'board' || targetRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      return;
    }

    // If authenticated under a different role, log out to ensure clean token state
    if (isAuthenticated && user?.role !== targetRole) {
      logout();
    }

    // Direct to role-prefixed login
    navigate(`/login?role=${targetRole}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={handleEnterPublic}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <img
            src="/openforgelogo.png"
            alt="OpenForge Logo"
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col text-left">
            <span className="font-black text-xl tracking-tight uppercase text-[#111827] dark:text-white leading-none">
              OPEN<span className="text-[#E53E24]">FORGE</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[#E53E24] uppercase mt-1 leading-none">
              DEPT. OF INFORMATION TECHNOLOGY
            </span>
          </div>
        </button>

        <button
          onClick={handleEnterPublic}
          className="text-xs font-semibold text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] dark:hover:text-[#E53E24] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Skip to Public Website</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Role Selection Area */}
      <div className="max-w-5xl mx-auto w-full py-10 space-y-10 text-center">
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Gateway Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#111827] dark:text-white">
            Select Your OpenForge Portal
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] dark:text-gray-300">
            Choose your campus role to access personalized passes, volunteer terminal scanners, or club governance.
          </p>
        </div>

        {/* 4 Distinct Entry Doors/Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* 1. STUDENT DOOR */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border-2 border-soft-peach dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#E53E24] dark:hover:border-[#E53E24] transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E53E24] bg-[#FFF7ED] dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-[#E53E24]/20">
                  Open Access
                </span>
                <h2 className="text-xl font-extrabold text-[#111827] dark:text-white mt-2">
                  Student
                </h2>
                <p className="text-xs text-[#4B5563] dark:text-gray-300 mt-1 leading-relaxed">
                  Explore, Register, & Share Ideas across all campus tech events and workshops.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-soft-peach dark:border-gray-800">
              <button
                onClick={handleEnterPublic}
                className="w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Enter Public Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleRoleSelection('student')}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-gray-800 border border-primary/30 hover:border-primary text-primary text-xs font-semibold text-center block transition-all cursor-pointer"
              >
                Sign Up / Login
              </button>
            </div>
          </div>

          {/* 2. VOLUNTEER DOOR */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border-2 border-soft-peach dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#F97316] dark:hover:border-[#F97316] transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-gray-800 text-[#F97316] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F97316] bg-orange-50 dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-[#F97316]/20">
                  Staff Access
                </span>
                <h2 className="text-xl font-extrabold text-[#111827] dark:text-white mt-2">
                  Volunteer
                </h2>
                <p className="text-xs text-[#4B5563] dark:text-gray-300 mt-1 leading-relaxed">
                  Operations & Check-ins. Rapid camera QR scanner and gate attendance logging.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-soft-peach dark:border-gray-800">
              <button
                onClick={() => handleRoleSelection('volunteer')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Volunteer Terminal</span>
              </button>
              <div className="text-[10px] text-center text-[#4B5563] dark:text-gray-400 mt-2">
                Scanner Terminal &bull; Staff Creds
              </div>
            </div>
          </div>

          {/* 3. BOARD MEMBER DOOR */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border-2 border-soft-peach dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#E53E24] dark:hover:border-[#E53E24] transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-gray-800 text-[#E53E24] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E53E24] bg-red-50 dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-[#E53E24]/20">
                  Club Governance
                </span>
                <h2 className="text-xl font-extrabold text-[#111827] dark:text-white mt-2">
                  Board Member
                </h2>
                <p className="text-xs text-[#4B5563] dark:text-gray-300 mt-1 leading-relaxed">
                  Club Management & Events. Create workshop agendas and view real-time rosters.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-soft-peach dark:border-gray-800">
              <button
                onClick={() => handleRoleSelection('board')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#E53E24] hover:bg-[#CB321A] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Board Console</span>
              </button>
              <div className="text-[10px] text-center text-[#4B5563] dark:text-gray-400 mt-2">
                Event Oversight &bull; Board Creds
              </div>
            </div>
          </div>

          {/* 4. ADMIN DOOR */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border-2 border-soft-peach dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-gray-800 text-purple-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Super Governance
                </span>
                <h2 className="text-xl font-extrabold text-[#111827] dark:text-white mt-2">
                  Admin
                </h2>
                <p className="text-xs text-[#4B5563] dark:text-gray-300 mt-1 leading-relaxed">
                  Master Console & Analytics. Oversee permissions, CSV manifests, and full security.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-soft-peach dark:border-gray-800">
              <button
                onClick={() => handleRoleSelection('admin')}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
              <div className="text-[10px] text-center text-[#4B5563] dark:text-gray-400 mt-2">
                Full Authorization
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[#4B5563] dark:text-gray-400 pt-6">
        OpenForge Community Portal &bull; GVPCE Campus Event Operations &bull; Need access? Contact the Super Admin
      </div>
    </div>
  );
}