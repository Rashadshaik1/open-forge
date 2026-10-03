import { useState, useEffect, useCallback } from 'react';
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
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseGvpceRoll } from '../utils/parseRollNumber';
import {
  getEvents,
  getMyTickets,
  registerForEvent,
} from '../api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Parse roll info dynamically from user data
  const rollSource =
    user?.rollNumber ||
    (user?.email && user.email.includes('@') ? user.email : '324103311037');
  const parsedRoll = parseGvpceRoll(rollSource);

  const studentRoll = parsedRoll.isValid ? parsedRoll.rollNumber : (user?.rollNumber || rollSource);
  const studentBranch = parsedRoll.isValid ? parsedRoll.branch : (user?.department || 'Information Technology (IT)');
  const studentYear = parsedRoll.isValid ? parsedRoll.currentYear : (user?.year || '2nd Year');
  const studentEmail = user?.email || `${studentRoll}@gvpce.ac.in`;
  const studentName = user?.name || 'OpenForge Member';

  // Navigation Tabs: 'passes' | 'explore'
  const [activeTab, setActiveTab] = useState('passes');
  const [successToast, setSuccessToast] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ----------------------------------------------------
  // 1. LIVE DATA STATES
  // ----------------------------------------------------
  const [registeredTickets, setRegisteredTickets] = useState([]);
  const [openEvents, setOpenEvents] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  // Fetch student's registered tickets from backend
  const fetchTickets = useCallback(async () => {
    try {
      setLoadingTickets(true);
      const res = await getMyTickets();
      setRegisteredTickets(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  // Fetch open campus events from backend
  const fetchAllEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const res = await getEvents();
      setOpenEvents(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
    fetchAllEvents();
  }, [fetchTickets, fetchAllEvents]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ----------------------------------------------------
  // 2. 1-CLICK REGISTRATION HANDLER
  // ----------------------------------------------------
  const handleRegisterEvent = async (event) => {
    try {
      setRegisteringId(event._id);
      setErrorMessage('');
      const res = await registerForEvent(event._id);

      setSuccessToast(`🎉 Successfully registered for "${event.title}"! Entry pass issued.`);
      setTimeout(() => setSuccessToast(''), 4500);

      // Refresh tickets and available events
      await fetchTickets();
      await fetchAllEvents();
      setActiveTab('passes');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setRegisteringId(null);
    }
  };

  // Select the latest registered pass for the featured QR banner
  const featuredPass = registeredTickets.length > 0 ? registeredTickets[0] : null;

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Notification */}
        {errorMessage && (
          <div className="fixed top-20 right-6 z-50 max-w-md bg-red-50 border border-red-200 shadow-xl rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-semibold text-red-800">
              {errorMessage}
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-red-500 hover:text-red-800 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

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
        {featuredPass ? (
          <div className="relative bg-white dark:bg-[#111827] rounded-3xl border-2 border-dashed border-[#F97316]/40 p-6 sm:p-8 shadow-sm overflow-hidden">
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
                    {featuredPass.event?.title || 'OpenForge Campus Event'}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 mt-1 max-w-lg">
                    Show this QR code at the entrance verification desk for instant check-in.
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
                      {featuredPass.attended ? 'Attended & Verified' : 'Active Access Pass'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual QR Pass Right */}
              <div className="flex flex-col items-center justify-center p-5 bg-[#FFF7ED] dark:bg-gray-800 rounded-2xl border border-[#F97316]/30 shadow-md space-y-3 shrink-0">
                <div className="bg-white p-3 rounded-xl shadow-xs border border-soft-peach dark:border-gray-700">
                  <img
                    src={featuredPass.qrCodeDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(featuredPass.ticketCode)}`}
                    alt={`Pass QR Code for ${featuredPass.ticketCode}`}
                    className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-md"
                  />
                </div>
                <div className="text-center space-y-0.5">
                  <span className="font-mono text-xs font-bold text-[#111827] dark:text-white">
                    {featuredPass.ticketCode}
                  </span>
                  <div className="text-[10px] text-[#4B5563] dark:text-gray-400">Scan at volunteer gate</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

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
              {registeredTickets.length}
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
              {openEvents.length} Live
            </span>
            {activeTab === 'explore' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E53E24] rounded-full" />
            )}
          </button>
        </div>

        {/* 4. MY PASSES / REGISTERED EVENTS TAB CONTENT */}
        {activeTab === 'passes' && (
          <div className="space-y-6">
            {loadingTickets ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#4B5563]">
                <Loader2 className="w-6 h-6 animate-spin text-[#E53E24] mb-2" />
                <p className="text-xs">Loading verified entry passes...</p>
              </div>
            ) : registeredTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registeredTickets.map((reg) => {
                  const ev = reg.event || {};
                  return (
                    <div
                      key={reg._id}
                      className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-soft-peach dark:border-gray-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider">
                              {ev.category || 'Event'}
                            </span>
                            <h3 className="font-bold text-lg text-[#111827] dark:text-white mt-0.5">
                              {ev.title || 'Untitled Event'}
                            </h3>
                          </div>

                          {/* Attendance Status Badge */}
                          {reg.attended ? (
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
                            <span>
                              {ev.eventDate
                                ? new Date(ev.eventDate).toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'TBA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#F97316] shrink-0" />
                            <span>
                              {ev.eventDate
                                ? new Date(ev.eventDate).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'TBA'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
                            <span>{ev.venue || 'GVPCE Campus'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between text-xs">
                        <div className="text-[#4B5563] dark:text-gray-400">
                          Pass Ref:{' '}
                          <span className="font-mono text-[#E53E24] font-semibold">
                            {reg.ticketCode}
                          </span>
                        </div>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Scan at entrance
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
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
            {loadingEvents ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#4B5563]">
                <Loader2 className="w-6 h-6 animate-spin text-[#E53E24] mb-2" />
                <p className="text-xs">Fetching campus events...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {openEvents.map((evt) => {
                  const isRegistered = registeredTickets.some(
                    (reg) => (reg.event?._id || reg.event) === evt._id
                  );
                  const spotsLeft = Math.max(0, evt.capacity - (evt.registeredCount || 0));

                  return (
                    <div
                      key={evt._id}
                      className="bg-white dark:bg-[#111827] rounded-2xl border border-soft-peach dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="relative h-44 overflow-hidden bg-soft-peach/60 dark:bg-gray-800">
                          <img
                            src={
                              evt.bannerImage ||
                              'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
                            }
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
                              <span>
                                {new Date(evt.eventDate).toLocaleDateString('en-IN', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                              <span>
                                {new Date(evt.eventDate).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                              <span>{evt.venue}</span>
                            </div>
                          </div>

                          <div className="pt-1 flex items-center justify-between text-xs text-[#4B5563] dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-[#F97316]" />
                              <span>{spotsLeft} spots remaining</span>
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
                        ) : !evt.isRegistrationOpen || spotsLeft === 0 ? (
                          <button
                            disabled
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                          >
                            <span>Registration Closed</span>
                          </button>
                        ) : (
                          <button
                            disabled={registeringId === evt._id}
                            onClick={() => handleRegisterEvent(evt)}
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#E53E24] hover:bg-[#CB321A] shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {registeringId === evt._id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Registering...</span>
                              </>
                            ) : (
                              <span>1-Click Register</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}