import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  GraduationCap,
  QrCode,
  Users,
  Shield,
  Printer,
  RotateCcw,
  PlayCircle,
  X,
  ChevronDown,
  Check,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resetStorageData } from '../utils/storage';

export default function DemoSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [resetStatus, setResetStatus] = useState(false);
  const dropdownRef = useRef(null);

  const { user, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Demo user profiles
  const demoRoles = [
    {
      id: 'student',
      title: 'Student Demo',
      role: 'student',
      name: 'Rashad Shaik',
      subtitle: '2nd Year IT • Roll 324103311037',
      route: '/dashboard',
      icon: GraduationCap,
      color: '#E53E24',
      bgLight: 'bg-orange-50 hover:bg-orange-100/70',
      bgDark: 'dark:bg-orange-950/20 dark:hover:bg-orange-950/40',
      badge: 'Digital Pass',
      userPayload: {
        id: 'student-demo',
        name: 'Rashad Shaik',
        rollNumber: '324103311037',
        email: '324103311037@gvpce.ac.in',
        role: 'student',
        department: 'Information Technology (IT)',
        year: '2nd Year',
      },
    },
    {
      id: 'volunteer',
      title: 'Volunteer Demo',
      role: 'volunteer',
      name: 'Priya Nambiar',
      subtitle: 'Authorized Scanner • Camera QR Check-in',
      route: '/volunteer-scanner',
      icon: QrCode,
      color: '#10B981',
      bgLight: 'bg-emerald-50 hover:bg-emerald-100/70',
      bgDark: 'dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40',
      badge: 'QR Scanner',
      userPayload: {
        id: 'volunteer-demo',
        name: 'Priya Nambiar',
        email: 'volunteer@gvpce.ac.in',
        role: 'volunteer',
        department: 'Information Technology (IT)',
      },
    },
    {
      id: 'board',
      title: 'Board Demo',
      role: 'board',
      name: 'Karthik Varma',
      subtitle: 'Event Operations • Analytics & Sheets',
      route: '/admin',
      icon: Users,
      color: '#8B5CF6',
      bgLight: 'bg-purple-50 hover:bg-purple-100/70',
      bgDark: 'dark:bg-purple-950/20 dark:hover:bg-purple-950/40',
      badge: 'Board Member',
      userPayload: {
        id: 'board-demo',
        name: 'Karthik Varma',
        email: 'board@gvpce.ac.in',
        role: 'board',
        department: 'Information Technology (IT)',
      },
    },
    {
      id: 'admin',
      title: 'Admin Demo',
      role: 'admin',
      name: 'Prof. G. S. Rao',
      subtitle: 'Super Admin • Full System Controls',
      route: '/admin',
      icon: Shield,
      color: '#E53E24',
      bgLight: 'bg-red-50 hover:bg-red-100/70',
      bgDark: 'dark:bg-red-950/20 dark:hover:bg-red-950/40',
      badge: 'Super Admin',
      userPayload: {
        id: 'admin-demo',
        name: 'Prof. G. S. Rao',
        email: 'admin@gvpce.ac.in',
        role: 'admin',
        department: 'Information Technology (IT)',
      },
    },
  ];

  const handleSwitchRole = (demoRole) => {
    switchDemoUser(demoRole.userPayload);
    setIsOpen(false);
    navigate(demoRole.route);
  };

  const handleResetData = () => {
    resetStorageData();
    setResetStatus(true);
    setTimeout(() => setResetStatus(false), 2000);
  };

  const handleReplaySplash = () => {
    sessionStorage.removeItem('openforge_splash_shown');
    sessionStorage.removeItem('openforge_gate_passed');
    setIsOpen(false);
    navigate('/portal?splash=true');
  };

  const handleOpenPoster = () => {
    setIsOpen(false);
    navigate('/poster');
  };

  // Determine currently active role
  const currentRole = user?.role?.toLowerCase() || 'none';

  return (
    <div ref={dropdownRef} className="fixed bottom-5 right-5 z-50 select-none">
      {/* Sleek Popup Card */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 mb-2 w-80 sm:w-92 max-w-[calc(100vw-2rem)] rounded-3xl bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border border-soft-peach dark:border-gray-800 shadow-2xl p-4 sm:p-5 text-[#111827] dark:text-[#F9FAFB] animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-soft-peach dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#E53E24]/10 dark:bg-[#E53E24]/20 text-[#E53E24] flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#111827] dark:text-white leading-tight">
                  Demo Switcher
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  Club Day Booth Presentation Kit
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current Active Status Pill */}
          <div className="mt-3 px-3 py-2 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-soft-peach dark:border-gray-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <div className="truncate">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Active User
                </span>
                <span className="font-bold text-[#111827] dark:text-white text-xs truncate block">
                  {user ? user.name : 'Guest (No active role)'}
                </span>
              </div>
            </div>
            {user?.role && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E53E24]/10 text-[#E53E24] border border-[#E53E24]/20 shrink-0">
                {user.role}
              </span>
            )}
          </div>

          {/* Quick Role Switch Buttons */}
          <div className="mt-3 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E53E24] block px-1">
              One-Click Role Switching
            </span>
            <div className="space-y-1.5">
              {demoRoles.map((demo) => {
                const IconComponent = demo.icon;
                const isActive = currentRole === demo.role && user?.name === demo.name;

                return (
                  <button
                    key={demo.id}
                    onClick={() => handleSwitchRole(demo)}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                      isActive
                        ? 'border-[#E53E24] bg-[#FFF7ED] dark:bg-orange-950/30 shadow-xs'
                        : `border-gray-100 dark:border-gray-800/80 ${demo.bgLight} ${demo.bgDark}`
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: `${demo.color}15`, color: demo.color }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-[#111827] dark:text-white group-hover:text-[#E53E24] transition-colors">
                            {demo.title}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#E53E24] text-white">
                              <Check className="w-2.5 h-2.5" />
                              <span>Live</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                          {demo.subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#E53E24] shrink-0 uppercase tracking-wider">
                      Switch &rarr;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Utility Shortcuts */}
          <div className="mt-3.5 pt-3 border-t border-soft-peach dark:border-gray-800 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block px-1">
              Presentation Shortcuts
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
              {/* 1. Print Stall Poster */}
              <button
                onClick={handleOpenPoster}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 hover:bg-[#FFF7ED] dark:hover:bg-gray-700 text-[#111827] dark:text-gray-200 border border-soft-peach dark:border-gray-700 font-semibold text-[11px] transition-all cursor-pointer group"
                title="Open Printable Stall Poster"
              >
                <Printer className="w-3.5 h-3.5 text-[#E53E24] group-hover:scale-110 transition-transform" />
                <span>Poster</span>
              </button>

              {/* 2. Reset LocalStorage / Seed Data */}
              <button
                onClick={handleResetData}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-[#111827] dark:text-gray-200 border border-soft-peach dark:border-gray-700 font-semibold text-[11px] transition-all cursor-pointer group"
                title="Reset attendee registrations to initial sample dataset"
              >
                {resetStatus ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Reset!</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-500 group-hover:-rotate-90 transition-transform" />
                    <span>Reset Data</span>
                  </>
                )}
              </button>

              {/* 3. Replay Splash Screen */}
              <button
                onClick={handleReplaySplash}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-[#111827] dark:text-gray-200 border border-soft-peach dark:border-gray-700 font-semibold text-[11px] transition-all cursor-pointer group"
                title="Trigger 1.8s branding splash screen & gateway"
              >
                <PlayCircle className="w-3.5 h-3.5 text-purple-500 group-hover:scale-110 transition-transform" />
                <span>Splash</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#111827] dark:bg-white text-white dark:text-[#111827] border-2 border-[#E53E24] shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
        aria-label="Toggle OpenForge Demo Switcher"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E53E24] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E53E24]" />
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[#E53E24] group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-black tracking-tight uppercase">
          Demo Switcher
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 group-hover:text-[#E53E24] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
}
