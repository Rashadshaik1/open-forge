import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Check,
  ShieldCheck,
  LogOut,
  RefreshCw,
  QrCode,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseGvpceRoll } from '../utils/parseRollNumber';
import api from '../api/axios';
import { getEvents, getEventRoster } from '../api';

// Synthesize native audio cue for instant gate verification
const playSoundCue = (type = 'success') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.setValueAtTime(240, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    }
  } catch (e) {
    // Graceful fallback for audio restrictions
  }
};

export default function VolunteerScanner() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [cameraActive, setCameraActive] = useState(true);
  const [typedInput, setTypedInput] = useState('');
  const [alertState, setAlertState] = useState(null); // { type: 'success'|'warning'|'error', title, message }
  const [isVerifying, setIsVerifying] = useState(false);
  const manualInputRef = useRef(null);
  const scannerRef = useRef(null);
  const lastScannedRef = useRef({ code: '', time: 0 });

  // Live Backend States
  const [eventsList, setEventsList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [rosterSummary, setRosterSummary] = useState({
    totalRegistered: 0,
    totalAttended: 0,
    turnoutPercentage: '0%',
  });

  // 1. Fetch Live Events for the scanner dropdown
  const loadEvents = useCallback(async () => {
    try {
      const res = await getEvents();
      const events = res.data?.data || res.data || [];
      setEventsList(events);
      if (events.length > 0 && !selectedEventId) {
        setSelectedEventId(events[0]._id);
      }
    } catch (err) {
      console.error('Failed to load events for scanner:', err);
    }
  }, [selectedEventId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // 2. Fetch live event attendee roster & turnout metrics
  const loadRosterData = useCallback(async (eventId) => {
    if (!eventId) return;
    try {
      const res = await getEventRoster(eventId);
      const list = res.data?.data || [];
      if (res.data?.summary) {
        setRosterSummary(res.data.summary);
      } else {
        const attended = list.filter((r) => r.attended || r.status === 'attended');
        const percentage =
          list.length > 0 ? `${Math.round((attended.length / list.length) * 100)}%` : '0%';
        setRosterSummary({
          totalRegistered: list.length,
          totalAttended: attended.length,
          turnoutPercentage: percentage,
        });
      }

      // Filter verified attendees for the bottom recent check-in feed
      const attendedOnes = list
        .filter((r) => r.attended || r.status === 'attended')
        .map((r) => ({
          id: r._id,
          name: r.user?.name || r.studentName || 'Verified Student',
          rollNumber: r.user?.rollNumber || r.rollNumber || 'N/A',
          department: r.user?.department || r.department || 'Information Technology',
          timestamp: new Date(r.attendedAt || r.updatedAt || r.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }))
        .reverse();

      setRecentCheckIns(attendedOnes);
    } catch (err) {
      console.error('Failed to fetch roster metrics:', err);
    }
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadRosterData(selectedEventId);
    }
  }, [selectedEventId, loadRosterData]);

  // Robust extraction of ticket code or payload
  const extractTicketPayload = (rawInput) => {
    if (!rawInput) return '';
    const trimmed = String(rawInput).trim();

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parsed.ticketCode || parsed.identifier || parsed.code || trimmed;
      } catch (e) {
        return trimmed;
      }
    }
    return trimmed;
  };

  // 3. Process Check-In via Backend API
  const processCheckIn = useCallback(
    async (rawInput) => {
      const cleanPayload = extractTicketPayload(rawInput);
      if (!cleanPayload || !selectedEventId || isVerifying) return;

      try {
        setIsVerifying(true);
        setAlertState(null);

        // Send full verification payload so registrationController can match either code or roll
        const res = await api.post('/registrations/verify-ticket', {
          eventId: selectedEventId,
          ticketCode: cleanPayload,
          identifier: cleanPayload,
          rollNumber: cleanPayload,
        });

        const reg = res.data?.data || res.data?.attendee || {};
        playSoundCue('success');

        setAlertState({
          type: 'success',
          title: `Check-in Confirmed: ${reg.user?.name || reg.name || 'Student'}`,
          message: `${reg.user?.rollNumber || reg.rollNumber || cleanPayload} • ${
            reg.user?.department || reg.department || 'GVPCE'
          } • Ticket Verified`,
        });

        await loadRosterData(selectedEventId);
        setTypedInput('');
      } catch (err) {
        playSoundCue('warning');
        const data = err.response?.data;
        const errorMsg = data?.message || 'Verification failed. Invalid or expired ticket.';

        if (errorMsg.toLowerCase().includes('already') || data?.alreadyCheckedIn) {
          setAlertState({
            type: 'warning',
            title: 'Already Checked In',
            message: errorMsg,
          });
        } else {
          setAlertState({
            type: 'error',
            title: 'Verification Error',
            message: errorMsg,
          });
        }
      } finally {
        setIsVerifying(false);
        if (manualInputRef.current) {
          manualInputRef.current.focus();
        }
      }
    },
    [selectedEventId, isVerifying, loadRosterData]
  );

  // 4. Mount optical camera QR Scanner via html5-qrcode
  useEffect(() => {
    if (!cameraActive || !selectedEventId) return;

    const timer = setTimeout(() => {
      const scannerElement = document.getElementById('qr-scanner-box');
      if (!scannerElement) return;

      const scanner = new Html5QrcodeScanner(
        'qr-scanner-box',
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          const now = Date.now();
          if (
            lastScannedRef.current.code === decodedText &&
            now - lastScannedRef.current.time < 3500
          ) {
            return;
          }
          lastScannedRef.current = { code: decodedText, time: now };
          processCheckIn(decodedText);
        },
        () => {
          // Suppress continuous scan framing errors
        }
      );

      scannerRef.current = scanner;
    }, 150);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [cameraActive, selectedEventId, processCheckIn]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    processCheckIn(typedInput);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const liveParsed = parseGvpceRoll ? parseGvpceRoll(typedInput) : { isValid: false };

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. HEADER SECTION */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-soft-peach dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Authorized Gate Scanner
              </span>
              <span className="text-xs font-bold text-[#E53E24] uppercase tracking-wider">
                Staff Terminal
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Volunteer Check-In Terminal
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-400">
              Department of Information Technology • Real-time Attendance Tracker
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-[#FFF7ED] dark:bg-gray-800 border border-[#E53E24]/20 text-xs font-semibold text-[#111827] dark:text-white">
              Volunteer: <span className="font-bold text-[#E53E24]">{user?.name || 'Staff Member'}</span>
            </div>

            <Link
              to="/events"
              className="px-3.5 py-1.5 text-xs font-semibold text-[#4B5563] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Events
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold text-[#E53E24] hover:text-white border border-[#E53E24] hover:bg-[#E53E24] rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* EVENT SELECTION DROPDOWN */}
        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-soft-peach dark:border-gray-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-white">
              Active Event Target:
            </span>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setAlertState(null);
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-[#E53E24]/30 bg-[#FFF7ED]/30 dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:border-[#E53E24]"
            >
              {eventsList.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.title} ({new Date(e.eventDate || e.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-[#4B5563] dark:text-gray-400">
            Door attendance syncs directly to student credentials.
          </span>
        </div>

        {/* 2. STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-white">
                {rosterSummary.totalAttended}
              </div>
              <div className="text-xs text-[#4B5563] dark:text-gray-400">Total Checked In</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#E53E24]">
                {rosterSummary.totalRegistered}
              </div>
              <div className="text-xs text-[#4B5563] dark:text-gray-400">Total Registered RSVPs</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
                {rosterSummary.turnoutPercentage}
              </div>
              <div className="text-xs text-[#4B5563] dark:text-gray-400">Attendance Turnout Rate</div>
            </div>
          </div>
        </div>

        {/* 3. INSTANT VERIFICATION ALERT BANNER */}
        {alertState && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-3 shadow-sm transition-all duration-300 animate-in fade-in zoom-in-95 ${
              alertState.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                : alertState.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {alertState.type === 'success' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              )}
              <div className="space-y-0.5">
                <div className="font-extrabold text-sm sm:text-base">{alertState.title}</div>
                <div className="text-xs opacity-90">{alertState.message}</div>
              </div>
            </div>

            <button
              onClick={() => setAlertState(null)}
              className="text-xs font-bold hover:opacity-75 p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4. DUAL CHECK-IN INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Camera QR Viewfinder */}
          <div className="lg:col-span-6 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-soft-peach dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#111827] dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#E53E24]" />
                Live Camera QR Scanner
              </span>
              <button
                type="button"
                onClick={() => setCameraActive(!cameraActive)}
                className="text-xs font-semibold text-[#E53E24] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}</span>
              </button>
            </div>

            {cameraActive ? (
              <div className="overflow-hidden rounded-2xl border-2 border-dashed border-soft-peach dark:border-gray-700 bg-stone-900/50 p-2">
                <div id="qr-scanner-box" className="w-full"></div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-xs text-[#4B5563] dark:text-gray-400">
                <QrCode className="w-10 h-10 text-gray-400 mb-2" />
                <span>Camera scanner is turned off</span>
              </div>
            )}

            <p className="text-[11px] text-[#4B5563] dark:text-gray-400 text-center">
              Scanning directly verifies ticket uniqueness and locks against multiple gate entries.
            </p>
          </div>

          {/* RIGHT: Ticket Code / Roll Number Fast Search */}
          <div className="lg:col-span-6 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-soft-peach dark:border-gray-800 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#111827] dark:text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#E53E24]" />
                  Rapid Ticket / Roll Check-In
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Instant Verification
                </span>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                    Scan Ticket Code or Roll Number
                  </label>
                  <div className="relative">
                    <input
                      ref={manualInputRef}
                      type="text"
                      value={typedInput}
                      onChange={(e) => setTypedInput(e.target.value)}
                      placeholder="e.g. OF-M6X1-A9F or 324103311051"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-base font-mono font-bold text-[#111827] dark:text-white placeholder:text-gray-400 placeholder:font-sans placeholder:font-normal focus:outline-none focus:border-[#E53E24] tracking-wide"
                    />
                  </div>
                </div>

                {liveParsed?.isValid && (
                  <div className="p-3.5 rounded-xl bg-[#FFF7ED] dark:bg-gray-800 border border-[#E53E24]/20 space-y-1 animate-in fade-in duration-150">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-700 dark:text-emerald-400">
                        <span>✓ Valid GVPCE Format</span>
                        <span className="font-mono text-[#E53E24] font-bold">
                          {liveParsed.rollNumber}
                        </span>
                      </div>
                      <div className="text-[#111827] dark:text-gray-300 font-semibold">
                        {liveParsed.branch || liveParsed.department}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!typedInput.trim() || isVerifying}
                  className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-[#E53E24] hover:bg-[#CB321A] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Ticket Pass...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Attended / Check In</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700 text-xs text-[#4B5563] dark:text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Supports manual typing, USB barcode lasers, and optical camera QR scans.</span>
            </div>
          </div>
        </div>

        {/* 5. LIVE RECENT CHECK-IN FEED */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-soft-peach dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-soft-peach dark:border-gray-800">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-[#111827] dark:text-white">
                Live Door Attendance Feed
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Live MongoDB Roster
              </span>
            </div>
            <span className="text-xs text-[#4B5563] dark:text-gray-400">
              Showing {recentCheckIns.length} verified attendees
            </span>
          </div>

          <div className="space-y-3">
            {recentCheckIns.length > 0 ? (
              recentCheckIns.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FFF7ED]/50 dark:bg-gray-800/40 border border-soft-peach dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FFF7ED] dark:hover:bg-gray-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-[#111827] dark:text-white">
                        {item.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#4B5563] dark:text-gray-400">
                        <span className="font-mono text-[#E53E24] font-bold">{item.rollNumber}</span>
                        <span>•</span>
                        <span>{item.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Attended
                    </span>
                    <div className="text-[11px] text-[#4B5563] dark:text-gray-400 font-mono">
                      {item.timestamp}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#4B5563] dark:text-gray-400">
                No attendees scanned for this event yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}