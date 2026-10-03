import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  CheckCircle2,
  Users,
  Sparkles,
  LogOut,
  Mail,
  GraduationCap,
  Building,
  Hash,
  Download,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseGvpceRoll } from '../utils/parseRollNumber';
import {
  registerStudent,
  getStudentStatus,
  subscribeToStorage,
} from '../utils/storage';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Parse roll info dynamically from user data or fallback
  const defaultRoll = '324103311037';
  const rollSource =
    user?.rollNumber ||
    (user?.email && user.email.includes('@') ? user.email : defaultRoll);
  const parsedRoll = parseGvpceRoll(rollSource);

  const studentRoll = parsedRoll.isValid ? parsedRoll.rollNumber : (user?.rollNumber || defaultRoll);
  const studentBranch = parsedRoll.isValid ? parsedRoll.branch : (user?.department || 'Information Technology (IT)');
  const studentYear = parsedRoll.isValid ? parsedRoll.currentYear : (user?.year || '2nd Year');
  const studentEmail = user?.email || `${studentRoll}@gvpce.ac.in`;
  const studentName = user?.name || 'Alex Rivera';

  // Navigation Tabs: 'passes' | 'explore'
  const [activeTab, setActiveTab] = useState('passes');
  const [successToast, setSuccessToast] = useState('');

  // Registered Events state
  const [registeredEvents, setRegisteredEvents] = useState([
    {
      id: 'EVT-101',
      title: 'Sherlock: Next Chapter',
      category: 'Hackathon & Mystery',
      date: 'Sat, Oct 18, 2025',
      time: '10:00 AM - 1:00 PM',
      venue: 'Auditorium Hall B',
      status: 'Registered (Entry Confirmed)',
      badgeType: 'confirmed',
      ticketId: `OF-PASS-${studentRoll.slice(-4)}-101`,
    },
    {
      id: 'EVT-102',
      title: 'OpenForge Orientation & Club Day',
      category: 'Community',
      date: 'Oct 10, 2025',
      time: '2:00 PM - 5:00 PM',
      venue: 'Main Quadrangle, GVPCE',
      status: 'Attended',
      badgeType: 'attended',
      ticketId: `OF-PASS-${studentRoll.slice(-4)}-102`,
    },
  ]);

  // Open Events for Exploring
  const [openEvents, setOpenEvents] = useState([
    {
      id: 'EVT-103',
      title: 'Web Dev Bootcamp',
      category: 'Workshop',
      date: 'Sat, Oct 25, 2025',
      time: '10:00 AM - 4:00 PM',
      venue: 'Lab 3, Tech Block',
      spotsLeft: 14,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'EVT-104',
      title: 'Hackathon 2026: AI & Cloud',
      category: 'Hackathon',
      date: 'Nov 01 - 02, 2025',
      time: '24 Hours Sprint',
      venue: 'Main Auditorium & Online',
      spotsLeft: 28,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'EVT-105',
      title: 'Student Leaders Mixer',
      category: 'Networking',
      date: 'Nov 15, 2025',
      time: '4:00 PM - 6:30 PM',
      venue: 'Open Air Amphitheatre',
      spotsLeft: 40,
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80',
    },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sync student profile with centralized storage bridge on mount
  useEffect(() => {
    registerStudent({
      name: studentName,
      email: studentEmail,
      rollNumber: studentRoll,
      department: studentBranch,
      year: studentYear,
      registeredEvent: 'Sherlock: Next Chapter',
      status: 'Registered',
    });
  }, [studentName, studentEmail, studentRoll, studentBranch, studentYear]);

  // Reactively listen to volunteer check-in status
  useEffect(() => {
    const updateCheckInStatus = () => {
      const currentStatus = getStudentStatus(studentRoll);
      if (currentStatus === 'Attended') {
        setRegisteredEvents((prev) =>
          prev.map((evt) =>
            evt.id === 'EVT-101' || evt.title.includes('Sherlock')
              ? { ...evt, status: 'Attended (Check-in Verified)', badgeType: 'attended' }
              : evt
          )
        );
      }
    };

    updateCheckInStatus();
    const unsubscribe = subscribeToStorage((detail) => {
      updateCheckInStatus();
    });
    return unsubscribe;
  }, [studentRoll]);

  const handleRegisterEvent = (event) => {
    // Check if already registered
    if (registeredEvents.some((e) => e.title === event.title)) {
      setSuccessToast(`You are already registered for ${event.title}!`);
      setTimeout(() => setSuccessToast(''), 4000);
      return;
    }

    const newPass = {
      id: `EVT-${Date.now()}`,
      title: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      status: 'Registered (Entry Confirmed)',
      badgeType: 'confirmed',
      ticketId: `OF-PASS-${studentRoll.slice(-4)}-${Math.floor(100 + Math.random() * 900)}`,
    };

    // Save in storage bridge so Admin & Scanner immediately see this registration
    registerStudent({
      name: studentName,
      email: studentEmail,
      rollNumber: studentRoll,
      department: studentBranch,
      year: studentYear,
      registeredEvent: event.title,
      status: 'Registered',
    });

    setRegisteredEvents([newPass, ...registeredEvents]);
    setSuccessToast(`🎉 Successfully registered for ${event.title}! Your entry pass has been generated.`);
    setTimeout(() => setSuccessToast(''), 4500);
  };

  // QR Code URL using api.qrserver.com
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `GVPCE-OPENFORGE-${studentRoll}`
  )}`;

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Success Toast */}
        {successToast && (
          <div className="fixed top-20 right-6 z-50 max-w-md bg-white dark:bg-[#111827] border border-[#E53E24]/30 shadow-xl rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-semibold text-[#111827] dark:text-white">
              {successToast}
            </div>
            <button
              onClick={() => setSuccessToast('')}
              className="text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. HEADER / PROFILE BANNER */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-soft-peach dark:border-gray-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified GVPCE Student
              </span>
              <span className="text-xs font-bold text-[#E53E24] uppercase tracking-wider">
                Student Portal
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Welcome back, {studentName}!
            </h1>

            {/* Profile summary metadata row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#4B5563] dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#E53E24]" />
                <span className="font-semibold text-[#111827] dark:text-gray-200">Roll:</span>
                <span className="font-mono text-[#E53E24] font-bold">{studentRoll}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#F97316]" />
                <span>{studentBranch}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#E53E24]" />
                <span>{studentYear}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#F97316]" />
                <span>{studentEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions / Logout */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-semibold text-[#E53E24] hover:text-white border border-[#E53E24] hover:bg-[#E53E24] dark:hover:bg-[#E53E24] rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* 2. DIGITAL EVENT ENTRY PASS (QR SECTION) */}
        <div className="relative bg-white dark:bg-[#111827] rounded-3xl border-2 border-dashed border-[#F97316]/40 p-6 sm:p-8 shadow-sm overflow-hidden">
          {/* Subtle warm corner accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFF7ED] dark:from-[#E53E24]/10 to-transparent rounded-bl-full pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#FFF7ED] dark:from-[#E53E24]/10 to-transparent rounded-tr-full pointer-events-none -z-0" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Ticket Info Left */}
            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] dark:bg-[#E53E24]/20 text-[#E53E24] border border-[#E53E24]/20 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Official Digital Entry Pass
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#111827] dark:text-white">
                  OpenForge Club Day & Campus Events
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 mt-1 max-w-lg">
                  Show this QR code at the OpenForge Club Day stall for instant check-in.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-[#FFF7ED]/50 dark:bg-gray-800/60 rounded-xl border border-soft-peach dark:border-gray-700">
                  <div className="text-[10px] uppercase font-bold text-[#4B5563] dark:text-gray-400">Attendee</div>
                  <div className="text-xs font-bold text-[#111827] dark:text-white truncate">{studentName}</div>
                </div>
                <div className="p-3 bg-[#FFF7ED]/50 dark:bg-gray-800/60 rounded-xl border border-soft-peach dark:border-gray-700">
                  <div className="text-[10px] uppercase font-bold text-[#4B5563] dark:text-gray-400">Student ID</div>
                  <div className="text-xs font-mono font-bold text-[#E53E24]">{studentRoll}</div>
                </div>
                <div className="p-3 bg-[#FFF7ED]/50 dark:bg-gray-800/60 rounded-xl border border-soft-peach dark:border-gray-700 col-span-2 sm:col-span-1">
                  <div className="text-[10px] uppercase font-bold text-[#4B5563] dark:text-gray-400">Status</div>
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active Access Pass
                  </div>
                </div>
              </div>
            </div>

            {/* Visual QR Pass Right */}
            <div className="flex flex-col items-center justify-center p-5 bg-[#FFF7ED] dark:bg-gray-800 rounded-2xl border border-[#F97316]/30 shadow-md space-y-3 shrink-0">
              <div className="bg-white p-3 rounded-xl shadow-xs border border-soft-peach dark:border-gray-700">
                <img
                  src={qrCodeUrl}
                  alt={`Student QR Code for ${studentRoll}`}
                  className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-md"
                />
              </div>
              <div className="text-center space-y-0.5">
                <span className="font-mono text-xs font-bold text-[#111827] dark:text-white">
                  {studentRoll}
                </span>
                <div className="text-[10px] text-[#4B5563] dark:text-gray-400">Scan at volunteer gate</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TABS NAVIGATION */}
        <div className="border-b border-soft-peach dark:border-gray-800 flex items-center gap-8">
          <button
            onClick={() => setActiveTab('passes')}
            className={`relative pb-3 text-sm font-bold transition-colors ${
              activeTab === 'passes'
                ? 'text-[#E53E24]'
                : 'text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white'
            }`}
          >
            <span>My Passes / Registered Events</span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24]">
              {registeredEvents.length}
            </span>
            {activeTab === 'passes' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E53E24] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`relative pb-3 text-sm font-bold transition-colors ${
              activeTab === 'explore'
                ? 'text-[#E53E24]'
                : 'text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white'
            }`}
          >
            <span>Explore Open Events</span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/50 text-[#F97316]">
              New
            </span>
            {activeTab === 'explore' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E53E24] rounded-full" />
            )}
          </button>
        </div>

        {/* 4. MY PASSES / REGISTERED EVENTS TAB CONTENT */}
        {activeTab === 'passes' && (
          <div className="space-y-6">
            {registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registeredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-soft-peach dark:border-gray-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider">
                            {event.category}
                          </span>
                          <h3 className="font-bold text-lg text-[#111827] dark:text-white mt-0.5">
                            {event.title}
                          </h3>
                        </div>

                        {/* Attendance Status Badge */}
                        {event.badgeType === 'attended' ? (
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                            Attended
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#FFF7ED] dark:bg-[#E53E24]/20 text-[#E53E24] border border-[#E53E24]/20 shrink-0">
                            Registered (Entry Confirmed)
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-[#4B5563] dark:text-gray-400 pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#E53E24] shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#F97316] shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between text-xs">
                      <div className="text-[#4B5563] dark:text-gray-400">
                        Pass Ref: <span className="font-mono text-[#E53E24] font-semibold">{event.ticketId}</span>
                      </div>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Scan at entrance</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-[#111827] dark:text-white">
                    No registered events yet
                  </h3>
                  <p className="text-xs text-[#4B5563] dark:text-gray-400 max-w-sm mx-auto">
                    You haven't RSVP'd to any events yet. Check out open workshops and hackathons!
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="px-5 py-2.5 rounded-xl bg-[#E53E24] hover:bg-[#CB321A] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Browse Upcoming Events
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5. EXPLORE OPEN EVENTS TAB CONTENT */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {openEvents.map((evt) => {
                const isRegistered = registeredEvents.some((r) => r.title === evt.title);

                return (
                  <div
                    key={evt.id}
                    className="bg-white dark:bg-[#111827] rounded-2xl border border-soft-peach dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-44 overflow-hidden bg-soft-peach/60 dark:bg-gray-800">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#FFF7ED] dark:bg-gray-800 text-[#F97316] border border-[#F97316]/20 shadow-xs">
                            {evt.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-base text-[#111827] dark:text-white group-hover:text-[#E53E24] transition-colors">
                          {evt.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-[#4B5563] dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#E53E24] shrink-0" />
                            <span>{evt.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                            <span>{evt.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                            <span>{evt.venue}</span>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between text-xs text-[#4B5563] dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#F97316]" />
                            <span>{evt.spotsLeft} spots remaining</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-5 pt-0">
                      {isRegistered ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 cursor-default"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Registered ✓</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegisterEvent(evt)}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#E53E24] hover:bg-[#CB321A] shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>1-Click Register</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
