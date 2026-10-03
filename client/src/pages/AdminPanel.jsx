import { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  Plus,
  Users,
  Calendar,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  UserCheck,
  TrendingUp,
  Tag,
  Clock,
  MapPin,
  FileSpreadsheet,
  Building,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseGvpceRoll } from '../utils/parseRollNumber';
import {
  getRegisteredStudents,
  markStudentAttended,
  subscribeToStorage,
  exportStudentsCsv,
} from '../utils/storage';

export default function AdminPanel() {
  const { user } = useAuth();

  // Role detection: 'admin' has Super Admin permissions
  const currentRole = user?.role || 'admin';
  const isAdmin = currentRole === 'admin';
  const roleBadgeText = isAdmin ? 'Super Admin' : 'Board Member';

  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'events' | 'permissions'
  const [successToast, setSuccessToast] = useState('');

  // ----------------------------------------------------
  // 1. ATTENDANCE & REGISTRATIONS STATE
  // ----------------------------------------------------
  const [students, setStudents] = useState(() => getRegisteredStudents());

  // Listen to centralized storage updates
  useEffect(() => {
    const syncData = () => {
      setStudents(getRegisteredStudents());
    };
    syncData();
    const unsubscribe = subscribeToStorage(() => syncData());
    return unsubscribe;
  }, []);

  // Filters for Attendance Table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All' || (s.department || '').includes(selectedDept);
      const matchesYear = selectedYear === 'All' || s.year === selectedYear;
      return matchesSearch && matchesDept && matchesYear;
    });
  }, [students, searchQuery, selectedDept, selectedYear]);

  // CSV Export function
  const exportAttendanceCSV = () => {
    if (filteredStudents.length === 0) {
      alert('No attendance records to export based on current filters.');
      return;
    }

    exportStudentsCsv(filteredStudents);
    setSuccessToast(`✓ Exported ${filteredStudents.length} attendance records to CSV.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const toggleStudentStatus = (id) => {
    const target = students.find((s) => s.id === id);
    if (!target) return;

    if (target.status === 'Attended') {
      const updated = students.map((s) =>
        s.id === id ? { ...s, status: 'Registered', checkedInTime: null } : s
      );
      setStudents(updated);
      localStorage.setItem('openforge_registered_students', JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent('openforge_storage_update', { detail: { type: 'STATUS_TOGGLED' } })
      );
    } else {
      markStudentAttended(target.rollNumber);
      setStudents(getRegisteredStudents());
    }
  };

  // ----------------------------------------------------
  // 2. MANAGE EVENTS STATE & MODAL
  // ----------------------------------------------------
  const [eventsList, setEventsList] = useState([
    {
      id: 1,
      title: 'Sherlock: The Digital Case',
      category: 'Hackathon',
      date: 'Sat, Oct 18, 2025 • 10:00 AM',
      venue: 'Auditorium Hall B',
      description: 'An interactive clue-hunting hackathon for students.',
      registrationOpen: true,
      attendeesCount: 94,
    },
    {
      id: 2,
      title: 'Club Day Stall 2026',
      category: 'Community',
      date: 'Fri, Oct 24, 2025 • 01:00 PM',
      venue: 'Campus Quadrangle',
      description: 'Orientation and live QR ticket desk for OpenForge club day.',
      registrationOpen: true,
      attendeesCount: 142,
    },
    {
      id: 3,
      title: 'Web Dev Bootcamp',
      category: 'Workshop',
      date: 'Sat, Nov 01, 2025 • 09:30 AM',
      venue: 'Lab 3, Tech Block',
      description: 'Full-day hands-on workshop on building web apps.',
      registrationOpen: false,
      attendeesCount: 65,
    },
  ]);

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Workshop',
    date: '',
    venue: '',
    description: '',
  });

  const handleOpenCreateModal = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      category: 'Workshop',
      date: '',
      venue: '',
      description: '',
    });
    setShowEventModal(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEventId(evt.id);
    setEventForm({
      title: evt.title,
      category: evt.category,
      date: evt.date,
      venue: evt.venue,
      description: evt.description,
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    if (editingEventId) {
      setEventsList(
        eventsList.map((evt) => (evt.id === editingEventId ? { ...evt, ...eventForm } : evt))
      );
      setSuccessToast(`✓ Updated event "${eventForm.title}" successfully.`);
    } else {
      const newEvent = {
        id: Date.now(),
        ...eventForm,
        registrationOpen: true,
        attendeesCount: 0,
      };
      setEventsList([newEvent, ...eventsList]);
      setSuccessToast(`✓ Created event "${eventForm.title}" successfully.`);
    }

    setShowEventModal(false);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const toggleEventRegistration = (id) => {
    setEventsList(
      eventsList.map((evt) =>
        evt.id === id ? { ...evt, registrationOpen: !evt.registrationOpen } : evt
      )
    );
  };

  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setEventsList(eventsList.filter((e) => e.id !== id));
      setSuccessToast(`Deleted event "${title}".`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  // ----------------------------------------------------
  // 3. USER ROLES & PERMISSIONS STATE (Admin Only)
  // ----------------------------------------------------
  const [roleSearchRoll, setRoleSearchRoll] = useState('');
  const [selectedNewRole, setSelectedNewRole] = useState('volunteer');
  const [usersList, setUsersList] = useState([
    {
      id: 101,
      name: 'Rashad Shaik',
      rollNumber: '324103311037',
      department: 'Information Technology (IT)',
      role: 'board',
    },
    {
      id: 102,
      name: 'Ananya Sharma',
      rollNumber: '324103310042',
      department: 'Computer Science & Engineering (CSE)',
      role: 'volunteer',
    },
    {
      id: 103,
      name: 'Karthik Varma',
      rollNumber: '323103312019',
      department: 'Electronics & Communication Engineering (ECE)',
      role: 'student',
    },
    {
      id: 104,
      name: 'Aditya Kumar',
      rollNumber: '324103382023',
      department: 'CSE (Artificial Intelligence & Machine Learning)',
      role: 'volunteer',
    },
  ]);

  const liveParsedRoleSearch = parseGvpceRoll(roleSearchRoll);

  const handlePromoteRole = (e) => {
    e.preventDefault();
    if (!roleSearchRoll.trim()) return;

    const cleaned = roleSearchRoll.trim().split('@')[0];
    const existing = usersList.find((u) => u.rollNumber === cleaned);

    if (existing) {
      setUsersList(
        usersList.map((u) =>
          u.rollNumber === cleaned ? { ...u, role: selectedNewRole } : u
        )
      );
      setSuccessToast(`✓ Role for ${existing.name} (${cleaned}) updated to "${selectedNewRole}".`);
    } else {
      const parsed = parseGvpceRoll(cleaned);
      const newUser = {
        id: Date.now(),
        name: `Student (${cleaned.slice(-4)})`,
        rollNumber: cleaned,
        department: parsed.isValid ? parsed.branch : 'General Engineering',
        role: selectedNewRole,
      };
      setUsersList([newUser, ...usersList]);
      setSuccessToast(`✓ Assigned "${selectedNewRole}" role to ${cleaned}.`);
    }

    setRoleSearchRoll('');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleQuickRoleChange = (id, newRole) => {
    setUsersList(usersList.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    setSuccessToast(`✓ Updated user role to ${newRole}.`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // ----------------------------------------------------
  // ANALYTICS CALCULATIONS
  // ----------------------------------------------------
  const totalRegisteredCount = 248;
  const attendedCount = students.filter((s) => s.status === 'Attended').length + 137;
  const checkedInPercent = ((attendedCount / totalRegisteredCount) * 100).toFixed(1);
  const activeEventsCount = eventsList.filter((e) => e.registrationOpen).length;

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Success Toast */}
        {successToast && (
          <div className="fixed top-20 right-6 z-50 max-w-md bg-white border border-[#E53E24]/30 shadow-xl rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-semibold text-[#111827]">
              {successToast}
            </div>
            <button
              onClick={() => setSuccessToast('')}
              className="text-[#4B5563] hover:text-[#111827] text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. HEADER & ROLE DISPLAY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-soft-peach shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF7ED] text-primary border border-primary/20">
                <Shield className="w-3.5 h-3.5" />
                {roleBadgeText}
              </span>
              <span className="text-xs text-[#4B5563]">
                Admin Console: <strong className="text-[#111827]">{user?.name || 'Authorized Member'}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              OpenForge Command Center
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Manage campus events, oversee attendee verification, and govern staff authorizations.
            </p>
          </div>

          {/* Action Buttons: Create New Event & Export Attendance CSV */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportAttendanceCSV}
              className="px-4 py-2.5 rounded-xl border border-primary/30 text-primary hover:bg-[#FFF7ED] text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Attendance CSV</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>
        </div>

        {/* 2. ANALYTICS OVERVIEW CARDS (4 METRICS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Registered */}
          <div className="p-5 rounded-2xl bg-white border border-soft-peach shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4B5563] uppercase tracking-wider">
              <span>Total Registered</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-black text-[#111827]">
              {totalRegisteredCount}
            </div>
            <div className="text-[11px] text-[#4B5563]">Students across all batches</div>
          </div>

          {/* Card 2: Checked-In Attendees + Live Bar */}
          <div className="p-5 rounded-2xl bg-white border border-soft-peach shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4B5563] uppercase tracking-wider">
              <span>Checked-In Attendees</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-primary">
              {attendedCount}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#4B5563]">
                <span>Turnout Rate</span>
                <span className="font-bold text-[#111827]">{checkedInPercent}%</span>
              </div>
              <div className="w-full bg-soft-peach rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-accent to-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${checkedInPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Leading Department */}
          <div className="p-5 rounded-2xl bg-white border border-soft-peach shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4B5563] uppercase tracking-wider">
              <span>Leading Dept</span>
              <Building className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-black text-accent truncate">
              Information Tech
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              38% of total registrations
            </div>
          </div>

          {/* Card 4: Active Events */}
          <div className="p-5 rounded-2xl bg-white border border-soft-peach shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4B5563] uppercase tracking-wider">
              <span>Active Events</span>
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-black text-[#111827]">
              {activeEventsCount}
            </div>
            <div className="text-[11px] text-[#4B5563]">Registration currently live</div>
          </div>
        </div>

        {/* 3. NAVIGATION TABS */}
        <div className="border-b border-soft-peach flex items-center gap-8">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`relative pb-3 text-sm font-bold transition-colors ${
              activeTab === 'attendance'
                ? 'text-primary'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <span>Attendance & Registrations</span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-primary">
              {students.length}
            </span>
            {activeTab === 'attendance' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`relative pb-3 text-sm font-bold transition-colors ${
              activeTab === 'events'
                ? 'text-primary'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <span>Manage Events</span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent">
              {eventsList.length}
            </span>
            {activeTab === 'events' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-full" />
            )}
          </button>

          {/* Tab 3: User Roles & Permissions (Visible only if user.role === 'admin') */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('permissions')}
              className={`relative pb-3 text-sm font-bold transition-colors flex items-center gap-1.5 ${
                activeTab === 'permissions'
                  ? 'text-primary'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-primary" />
              <span>User Roles & Permissions</span>
              {activeTab === 'permissions' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-full" />
              )}
            </button>
          )}
        </div>

        {/* 4. TAB 1: ATTENDANCE & REGISTRATIONS */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-3xl border border-soft-peach shadow-sm p-6 space-y-6">
            {/* Search Bar & Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by Student Name or Roll Number..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-soft-peach bg-[#FFF7ED]/30 text-[#111827] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Department Filter */}
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-soft-peach bg-white text-[#111827] font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="All">All Departments</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Computer Science">CSE</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Electrical & Electronics">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Artificial Intelligence">AI & ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>

                {/* Year Filter */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-soft-peach bg-white text-[#111827] font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="All">All Years</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>

                <button
                  onClick={exportAttendanceCSV}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#FFF7ED] text-primary hover:bg-soft-peach border border-primary/20 flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Interactive Data Table */}
            <div className="overflow-x-auto rounded-2xl border border-soft-peach">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF7ED]/70 font-bold uppercase tracking-wider text-[#4B5563] border-b border-soft-peach">
                  <tr>
                    <th className="px-5 py-3.5">Student Name</th>
                    <th className="px-5 py-3.5">Roll Number</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Year</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Checked-In Time</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-soft-peach text-[#111827]">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-[#FFF7ED]/20 transition-colors">
                        <td className="px-5 py-3.5 font-bold">{student.name}</td>
                        <td className="px-5 py-3.5 font-mono text-primary font-bold">
                          {student.rollNumber}
                        </td>
                        <td className="px-5 py-3.5 text-[#4B5563]">{student.department}</td>
                        <td className="px-5 py-3.5">{student.year}</td>
                        <td className="px-5 py-3.5">
                          {student.status === 'Attended' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Attended
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF7ED] text-primary border border-primary/20">
                              Registered
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-[#4B5563] font-mono">
                          {student.checkedInTime || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => toggleStudentStatus(student.id)}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            {student.status === 'Attended' ? 'Mark Registered' : 'Mark Attended'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-[#4B5563]">
                        No matching student records found for the current search/filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. TAB 2: MANAGE EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#111827]">Club Events Directory</h2>
                <p className="text-xs text-[#4B5563]">
                  Configure registrations, update dates, and publish upcoming campus workshops.
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {eventsList.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl p-6 border border-soft-peach shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-accent border border-accent/20">
                        {evt.category}
                      </span>

                      {/* Registration Open/Closed Toggle Badge */}
                      <button
                        onClick={() => toggleEventRegistration(evt.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                          evt.registrationOpen
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                        title="Click to toggle registration status"
                      >
                        {evt.registrationOpen ? 'Registration: Open' : 'Registration: Closed'}
                      </button>
                    </div>

                    <h3 className="font-extrabold text-base text-[#111827]">{evt.title}</h3>
                    <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-[#4B5563] pt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="pt-3 border-t border-soft-peach flex items-center justify-between text-xs">
                    <span className="text-[#4B5563]">
                      <Users className="w-3.5 h-3.5 inline mr-1 text-primary" />
                      {evt.attendeesCount} RSVP'd
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenEditModal(evt)}
                        className="text-[#4B5563] hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id, evt.title)}
                        className="text-[#4B5563] hover:text-red-600 transition-colors flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB 3: USER ROLES & PERMISSIONS (Admin Only) */}
        {activeTab === 'permissions' && isAdmin && (
          <div className="space-y-8">
            {/* Promotion Form Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-soft-peach shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-[#111827]">
                  Assign Volunteer or Board Permissions
                </h2>
                <p className="text-xs text-[#4B5563]">
                  Super Admins can grant verified students volunteer scanner access or board member governance rights.
                </p>
              </div>

              <form onSubmit={handlePromoteRole} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                {/* Roll Number Search Input */}
                <div className="sm:col-span-6 space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Student Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    value={roleSearchRoll}
                    onChange={(e) => setRoleSearchRoll(e.target.value)}
                    placeholder="e.g. 324103311037"
                    className="w-full px-4 py-2.5 rounded-xl border border-soft-peach bg-[#FFF7ED]/30 text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  {liveParsedRoleSearch.isValid && (
                    <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                      ✓ {liveParsedRoleSearch.branch} • {liveParsedRoleSearch.currentYear}
                    </div>
                  )}
                </div>

                {/* Role Choice Dropdown */}
                <div className="sm:col-span-4 space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Assign Role
                  </label>
                  <select
                    value={selectedNewRole}
                    onChange={(e) => setSelectedNewRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-soft-peach bg-white text-xs font-semibold text-[#111827] focus:outline-none focus:border-primary"
                  >
                    <option value="student">Student (Standard)</option>
                    <option value="volunteer">Volunteer (Scanner Access)</option>
                    <option value="board">Board Member (Event Organizer)</option>
                  </select>
                </div>

                {/* Submit Action */}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Save Role
                  </button>
                </div>
              </form>
            </div>

            {/* Current Team Members Table */}
            <div className="bg-white rounded-3xl border border-soft-peach shadow-sm p-6 space-y-4">
              <h3 className="font-extrabold text-base text-[#111827]">
                Current Staff & Volunteers
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-soft-peach">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF7ED]/70 font-bold uppercase tracking-wider text-[#4B5563] border-b border-soft-peach">
                    <tr>
                      <th className="px-5 py-3.5">Name</th>
                      <th className="px-5 py-3.5">Roll Number</th>
                      <th className="px-5 py-3.5">Department</th>
                      <th className="px-5 py-3.5">Active Role</th>
                      <th className="px-5 py-3.5 text-right">Quick Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-peach text-[#111827]">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FFF7ED]/20 transition-colors">
                        <td className="px-5 py-3.5 font-bold">{u.name}</td>
                        <td className="px-5 py-3.5 font-mono text-primary font-bold">
                          {u.rollNumber}
                        </td>
                        <td className="px-5 py-3.5 text-[#4B5563]">{u.department}</td>
                        <td className="px-5 py-3.5">
                          {u.role === 'board' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF7ED] text-primary border border-primary/20">
                              Board Member
                            </span>
                          ) : u.role === 'volunteer' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Volunteer
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                              Student
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleQuickRoleChange(u.id, 'volunteer')}
                              className="text-xs text-emerald-700 hover:underline font-semibold"
                            >
                              Make Volunteer
                            </button>
                            <span className="text-gray-300">•</span>
                            <button
                              onClick={() => handleQuickRoleChange(u.id, 'board')}
                              className="text-xs text-primary hover:underline font-semibold"
                            >
                              Make Board
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CREATE / EDIT EVENT MODAL */}
        {showEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-soft-peach shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-soft-peach">
                <h3 className="font-extrabold text-lg text-[#111827]">
                  {editingEventId ? 'Edit Event Details' : 'Create New Campus Event'}
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-[#4B5563] hover:text-[#111827] text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Sherlock: The Digital Case"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach bg-[#FFF7ED]/30 text-xs text-[#111827] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-soft-peach bg-white text-xs font-semibold text-[#111827] focus:outline-none focus:border-primary"
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Community">Community</option>
                      <option value="Conference">Conference</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                      Date & Time
                    </label>
                    <input
                      type="text"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      placeholder="e.g. Oct 24, 2025 • 10:00 AM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach bg-[#FFF7ED]/30 text-xs text-[#111827] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Venue Location
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    placeholder="e.g. Auditorium Hall B, GVPCE"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach bg-[#FFF7ED]/30 text-xs text-[#111827] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Event Description
                  </label>
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Brief description of event itinerary and attendee instructions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach bg-[#FFF7ED]/30 text-xs text-[#111827] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-soft-peach">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#4B5563] hover:text-[#111827]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all"
                  >
                    {editingEventId ? 'Save Changes' : 'Publish Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
