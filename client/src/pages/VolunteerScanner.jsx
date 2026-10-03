import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseGvpceRoll } from '../utils/parseRollNumber';
import {
  getRegisteredStudents,
  getRecentCheckIns,
  markStudentAttended,
  subscribeToStorage,
} from '../utils/storage';

// Synthesize pleasant native sound cue for instant feedback
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
    // Autoplay policy or unsupported audio environment fallback
  }
};

export default function VolunteerScanner() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [cameraActive, setCameraActive] = useState(true);
  const [typedRoll, setTypedRoll] = useState('');
  const [alertState, setAlertState] = useState(null); // { type: 'success'|'warning'|'error', title, message }
  const manualInputRef = useRef(null);

  const [registeredList, setRegisteredList] = useState(() => getRegisteredStudents());
  const [recentCheckIns, setRecentCheckIns] = useState(() => getRecentCheckIns());

  // Listen to centralized storage updates
  useEffect(() => {
    const syncData = () => {
      setRegisteredList(getRegisteredStudents());
      setRecentCheckIns(getRecentCheckIns());
    };
    syncData();
    const unsubscribe = subscribeToStorage(() => syncData());
    return unsubscribe;
  }, []);

  // Student directory samples for mock names & realistic check-in simulation
  const sampleStudents = registeredList.slice(0, 8).map((s) => ({
    roll: s.rollNumber,
    name: s.name,
  }));

  const totalRegistered = registeredList.length;
  const checkedInCount = registeredList.filter((s) => s.status === 'Attended').length;
  const attendanceRate = totalRegistered > 0 ? ((checkedInCount / totalRegistered) * 100).toFixed(1) : '0.0';

  // Parse roll live from input to show branch preview
  const liveParsed = parseGvpceRoll(typedRoll);

  // Clean incoming QR payloads like GVPCE-OPENFORGE-324103311037 or emails
  const cleanRollInput = (input) => {
    if (!input) return '';
    return input.replace(/^GVPCE-OPENFORGE-/, '').trim().split('@')[0];
  };

  const processCheckIn = (rawInput, studentNameOverride) => {
    const cleaned = cleanRollInput(rawInput);
    const parsed = parseGvpceRoll(cleaned);

    if (!parsed.isValid) {
      playSoundCue('warning');
      setAlertState({
        type: 'error',
        title: 'Invalid Roll Number',
        message: `"${cleaned}" does not match the 12-digit GVPCE roll format (3-YY-1033-BB-XXX).`,
      });
      return;
    }

    // Check duplicate
    const existing = recentCheckIns.find((item) => item.rollNumber === parsed.rollNumber);
    if (existing) {
      playSoundCue('warning');
      setAlertState({
        type: 'warning',
        title: 'Already Checked In',
        message: `${existing.name} (${parsed.rollNumber}) was already marked attended at ${existing.timestamp}.`,
      });
      return;
    }

    // Lookup known student in registered directory
    const foundRegistered = registeredList.find((s) => s.rollNumber === parsed.rollNumber);
    const resolvedName =
      studentNameOverride || (foundRegistered ? foundRegistered.name : `Student (${parsed.rollNumber.slice(-3)})`);

    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Mark attended in centralized storage bridge
    const result = markStudentAttended(parsed.rollNumber, currentTime);
    playSoundCue('success');

    setRecentCheckIns(getRecentCheckIns());
    setRegisteredList(getRegisteredStudents());

    setAlertState({
      type: 'success',
      title: `Check-in Confirmed: ${result.student?.name || resolvedName}`,
      message: `${parsed.rollNumber} • ${parsed.branch} • Year: ${parsed.currentYear || '2nd Year'}`,
    });

    // Reset input ready for next student
    setTypedRoll('');
    if (manualInputRef.current) {
      manualInputRef.current.focus();
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!typedRoll.trim()) return;
    processCheckIn(typedRoll);
  };

  // Simulate scanning a test student
  const handleSimulateScan = () => {
    const unChecked = sampleStudents.filter(
      (s) => !recentCheckIns.some((r) => r.rollNumber === s.roll)
    );
    const candidate = unChecked.length > 0 ? unChecked[0] : sampleStudents[0];
    processCheckIn(`GVPCE-OPENFORGE-${candidate.roll}`, candidate.name);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 1. HEADER SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-soft-peach shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Authorized Scanner
              </span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Staff Terminal
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Volunteer Check-In Terminal
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              OpenForge Club Day • Real-time Attendance Tracker
            </p>
          </div>

          {/* Volunteer Profile & Quick Nav */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-primary/20 text-xs font-semibold text-[#111827]">
              Volunteer: <span className="font-bold text-primary">{user?.name || 'Staff Member'}</span>
            </div>

            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#111827] rounded-xl hover:bg-gray-100 transition-colors"
            >
              Events Overview
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold text-primary hover:text-white border border-primary hover:bg-primary rounded-xl transition-all flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Checked In */}
          <div className="p-5 rounded-2xl bg-white border border-soft-peach shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#111827]">
                {checkedInCount}
              </div>
              <div className="text-xs text-[#4B5563]">Total Checked In</div>
            </div>
          </div>

          {/* Total Registered */}
          <div className="p-5 rounded-2xl bg-white border border-soft-peach shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] text-primary flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-primary">
                {totalRegistered}
              </div>
              <div className="text-xs text-[#4B5563]">Total Registered RSVPs</div>
            </div>
          </div>

          {/* Attendance Rate */}
          <div className="p-5 rounded-2xl bg-white border border-soft-peach shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-accent flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-accent">
                {attendanceRate}%
              </div>
              <div className="text-xs text-[#4B5563]">Attendance Turnout Rate</div>
            </div>
          </div>
        </div>

        {/* 3. INSTANT VERIFICATION ALERT BANNER */}
        {alertState && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-3 shadow-sm transition-all duration-300 animate-in fade-in zoom-in-95 ${
              alertState.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : alertState.type === 'warning'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {alertState.type === 'success' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : alertState.type === 'warning' ? (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-extrabold text-sm sm:text-base">
                  {alertState.title}
                </div>
                <div className="text-xs opacity-90">{alertState.message}</div>
              </div>
            </div>

            <button
              onClick={() => setAlertState(null)}
              className="text-xs font-bold hover:opacity-75 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2. DUAL CHECK-IN INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Camera QR Viewfinder */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-soft-peach shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#111827] flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                Optical QR Scanner Viewfinder
              </span>
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}</span>
              </button>
            </div>

            {/* Viewfinder Screen */}
            <div className="relative aspect-video w-full bg-stone-950 rounded-2xl overflow-hidden flex items-center justify-center border-4 border-stone-800 shadow-inner">
              {cameraActive ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900 to-stone-950 opacity-95" />

                  {/* Corner Target Box */}
                  <div className="relative w-52 h-52 border border-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
                    {/* 4 Corner Markers */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br" />

                    {/* Animated vertical laser scan bar */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E53E24] to-transparent shadow-[0_0_12px_#E53E24] animate-pulse" />

                    <QrCode className="w-24 h-24 text-white/10" />
                  </div>

                  <div className="absolute bottom-3 inset-x-0 text-center">
                    <span className="text-[11px] font-medium text-stone-300 bg-stone-900/90 px-3 py-1 rounded-full border border-stone-700">
                      Align student ticket QR inside the guide box
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center text-stone-400 space-y-2">
                  <Camera className="w-8 h-8 mx-auto text-stone-600" />
                  <div className="text-xs font-medium">Camera is currently paused</div>
                </div>
              )}
            </div>

            {/* Simulate Scan Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-primary hover:text-white border border-primary/40 hover:bg-primary transition-all flex items-center justify-center gap-2 bg-[#FFF7ED]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulate Scan (Test Roll)</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Rapid Manual Roll Search & Check-in */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-soft-peach shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#111827] flex items-center gap-2">
                  <Search className="w-4 h-4 text-accent" />
                  Rapid Roll Number Check-In
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Instant Verification
                </span>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Enter Roll Number
                  </label>
                  <div className="relative">
                    <input
                      ref={manualInputRef}
                      type="text"
                      autoFocus
                      value={typedRoll}
                      onChange={(e) => setTypedRoll(e.target.value)}
                      placeholder="e.g. 324103311037"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-soft-peach bg-[#FFF7ED]/30 text-base font-mono font-bold text-[#111827] placeholder:text-gray-400 placeholder:font-sans placeholder:font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors tracking-wide"
                    />
                  </div>
                </div>

                {/* Live Roll Preview Box */}
                {typedRoll.trim().length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#FFF7ED] border border-primary/20 space-y-1 animate-in fade-in duration-150">
                    {liveParsed.isValid ? (
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-emerald-700">
                          <span>✓ Valid GVPCE Format</span>
                          <span className="font-mono text-primary font-bold">{liveParsed.rollNumber}</span>
                        </div>
                        <div className="text-[#111827] font-semibold">
                          {liveParsed.branch}
                        </div>
                        <div className="text-[#4B5563] text-[11px]">
                          Joining Year: {liveParsed.joiningYear} ({liveParsed.currentYear})
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-700 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Format: 12-digit GVPCE roll number (3-YY-1033-BB-XXX)</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Prominent Action Button: Mark Attended / Check In */}
                <button
                  type="submit"
                  disabled={!liveParsed.isValid}
                  className="w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Attended / Check In</span>
                </button>
              </form>
            </div>

            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-[#4B5563] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Supports both manual entry and automated scanner payloads.</span>
            </div>
          </div>
        </div>

        {/* 4. LIVE RECENT CHECK-IN FEED (BOTTOM SECTION) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-soft-peach shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-soft-peach">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-[#111827]">
                Live Attendance Feed
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Real-Time
              </span>
            </div>
            <span className="text-xs text-[#4B5563]">
              Showing last {recentCheckIns.length} check-ins
            </span>
          </div>

          <div className="space-y-3">
            {recentCheckIns.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#FFF7ED]/50 border border-soft-peach flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FFF7ED] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-[#111827]">
                      {item.name}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#4B5563]">
                      <span className="font-mono text-primary font-bold">
                        {item.rollNumber}
                      </span>
                      <span>•</span>
                      <span>{item.department}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Attended
                  </span>
                  <div className="text-[11px] text-[#4B5563]">{item.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
