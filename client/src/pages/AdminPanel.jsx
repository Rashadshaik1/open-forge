import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  Shield,
  Plus,
  Users,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  UserCheck,
  Building,
  FileSpreadsheet,
  MapPin,
  Loader2,
  Upload,
  Globe,
  X,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { parseGvpceRoll } from '../utils/parseRollNumber';
import api from '../api/axios';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventRegistration,
  getEventRoster,
} from '../api';

export default function AdminPanel() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const currentRole = user?.role || 'admin';
  const isAdmin = currentRole === 'admin';
  const roleBadgeText = isAdmin ? 'Executive Administrator' : 'Board Representative';

  const [activeTab, setActiveTab] = useState('attendance');
  const [successToast, setSuccessToast] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ----------------------------------------------------
  // 1. LIVE EVENTS STATE
  // ----------------------------------------------------
  const [eventsList, setEventsList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(false);

  const fetchLiveEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const res = await getEvents();
      const events = res.data?.data || res.data || [];
      setEventsList(events);

      if (events.length > 0 && !selectedEventId) {
        setSelectedEventId(events[0]._id);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
      setErrorMessage('Could not load events from server.');
    } finally {
      setLoadingEvents(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchLiveEvents();
  }, [fetchLiveEvents]);

  // ----------------------------------------------------
  // 2. LIVE ATTENDANCE & ROSTER STATE
  // ----------------------------------------------------
  const [roster, setRoster] = useState([]);
  const [rosterSummary, setRosterSummary] = useState({ totalRegistered: 0, totalAttended: 0, turnoutPercentage: '0%' });
  const [loadingRoster, setLoadingRoster] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  const fetchLiveRoster = useCallback(async (eventId) => {
    if (!eventId) return;
    try {
      setLoadingRoster(true);
      const res = await getEventRoster(eventId);
      setRoster(res.data?.data || []);
      if (res.data?.summary) {
        setRosterSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Failed to load roster:', err);
      setRoster([]);
    } finally {
      setLoadingRoster(false);
    }
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchLiveRoster(selectedEventId);
    }
  }, [selectedEventId, fetchLiveRoster]);

  const filteredStudents = useMemo(() => {
    return roster.filter((reg) => {
      const studentName = reg.user?.name || reg.studentName || '';
      const rollNumber = reg.user?.rollNumber || reg.rollNumber || '';
      const department = reg.user?.department || reg.department || '';
      const year = reg.user?.year || reg.year || '';

      const matchesSearch =
        studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All' || department.includes(selectedDept);
      const matchesYear = selectedYear === 'All' || year === selectedYear;

      return matchesSearch && matchesDept && matchesYear;
    });
  }, [roster, searchQuery, selectedDept, selectedYear]);

  const handleExportCSV = async () => {
    if (!selectedEventId) {
      alert('Please select an event to export.');
      return;
    }

    try {
      setSuccessToast('Generating verified attendance report...');

      const response = await api.get(`/registrations/event/${selectedEventId}/export-csv`, {
        responseType: 'blob',
      });

      const currentEvt = eventsList.find((e) => e._id === selectedEventId);
      const safeTitle = (currentEvt?.title || 'Attendance').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${safeTitle}_Attendance_${new Date().toISOString().slice(0, 10)}.csv`;

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setSuccessToast(`✓ Downloaded ${filename}`);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Failed to download attendance CSV. Ensure you have authorized access.');
    } finally {
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  const handleToggleAttendance = async (reg) => {
    try {
      if (!reg.attended) {
        await api.post('/registrations/verify-ticket', {
          ticketCode: reg.ticketCode,
          identifier: reg.ticketCode,
        });
        setSuccessToast(`✓ Marked ${reg.user?.name || 'Student'} as Attended.`);
      } else {
        alert('Attendance has already been verified and locked for this ticket.');
        return;
      }
      fetchLiveRoster(selectedEventId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update attendance status.');
    }
  };

  // ----------------------------------------------------
  // 3. MANAGE EVENTS ACTIONS & MODAL
  // ----------------------------------------------------
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Workshop',
    eventDate: '',
    registrationDeadline: '',
    venue: '',
    capacity: 100,
    bannerImage: '',
    description: '',
  });

  const handleOpenCreateModal = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      category: 'Workshop',
      eventDate: '',
      registrationDeadline: '',
      venue: '',
      capacity: 100,
      bannerImage: '',
      description: '',
    });
    setShowEventModal(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEventId(evt._id);
    setEventForm({
      title: evt.title || '',
      category: evt.category || 'Workshop',
      eventDate: evt.eventDate ? evt.eventDate.slice(0, 16) : '',
      registrationDeadline: evt.registrationDeadline ? evt.registrationDeadline.slice(0, 16) : '',
      venue: evt.venue || '',
      capacity: evt.capacity || 100,
      bannerImage: evt.bannerImage || '',
      description: evt.description || '',
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    try {
      const payload = {
        ...eventForm,
        eventDate: new Date(eventForm.eventDate).toISOString(),
        registrationDeadline: new Date(eventForm.registrationDeadline || eventForm.eventDate).toISOString(),
        capacity: Number(eventForm.capacity),
      };

      if (editingEventId) {
        await updateEvent(editingEventId, payload);
        setSuccessToast(`✓ Updated event "${eventForm.title}" successfully.`);
      } else {
        await createEvent(payload);
        setSuccessToast(`✓ Created event "${eventForm.title}" successfully.`);
      }

      setShowEventModal(false);
      fetchLiveEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save event. Please check inputs.');
    } finally {
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  const handleToggleEventRegistration = async (id, currentStatus) => {
    try {
      await toggleEventRegistration(id, !currentStatus);
      fetchLiveEvents();
      setSuccessToast(`✓ Registration status updated.`);
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle registration.');
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await deleteEvent(id);
        setSuccessToast(`✓ Deleted event "${title}".`);
        fetchLiveEvents();
        setTimeout(() => setSuccessToast(''), 3000);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete event.');
      }
    }
  };

  // ----------------------------------------------------
  // 4. USER ROLES & TEAM PROMOTION STATE (Admin Only)
  // ----------------------------------------------------
  const [roleSearchRoll, setRoleSearchRoll] = useState('');
  const [selectedNewRole, setSelectedNewRole] = useState('volunteer');
  const [memberPhotoBase64, setMemberPhotoBase64] = useState('');
  const [isPhotoExplicitlyDeleted, setIsPhotoExplicitlyDeleted] = useState(false);
  const [memberDesignation, setMemberDesignation] = useState('');
  const [memberLinkedin, setMemberLinkedin] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userDirectorySearch, setUserDirectorySearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const fetchUsersDirectory = useCallback(async () => {
    if (!isAdmin) return;
    try {
      setLoadingUsers(true);
      let res;
      try {
        res = await api.get('/team/all-members');
      } catch {
        res = await api.get('/team');
      }

      const teamData = res.data?.data || res.data || [];

      let combined = [];
      if (Array.isArray(teamData)) {
        combined = teamData;
      } else {
        combined = [
          ...(teamData.board || []),
          ...(teamData.volunteers || []),
          ...(teamData.faculty || []),
        ];
      }
      setUsersList(combined);
    } catch (err) {
      console.error('Failed to load team directory:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (activeTab === 'permissions' && isAdmin) {
      fetchUsersDirectory();
    }
  }, [activeTab, isAdmin, fetchUsersDirectory]);

  const liveParsedRoleSearch = parseGvpceRoll(roleSearchRoll);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Selected image size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMemberPhotoBase64(reader.result);
      setIsPhotoExplicitlyDeleted(false);
    };
    reader.readAsDataURL(file);
  };

  // Explicit photo removal
  const handleRemovePhoto = () => {
    setMemberPhotoBase64('');
    setIsPhotoExplicitlyDeleted(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Download currently loaded photo
  const handleDownloadPhoto = () => {
    if (!memberPhotoBase64) return;
    const link = document.createElement('a');
    link.href = memberPhotoBase64;
    link.download = `${roleSearchRoll || 'member'}_profile_photo.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearEditMode = () => {
    setEditingUserId(null);
    setRoleSearchRoll('');
    setMemberDesignation('');
    setMemberPhotoBase64('');
    setIsPhotoExplicitlyDeleted(false);
    setMemberLinkedin('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Quick Inline Role Change from Directory Table
  const handleQuickRoleChange = async (targetUser, newRole) => {
    try {
      setSuccessToast(`Updating ${targetUser.name} to ${newRole}...`);

      const targetId = targetUser._id || targetUser.rollNumber;
      await api.patch(`/team/role/${targetId}`, {
        role: newRole,
        rollNumber: targetUser.rollNumber,
      });

      setSuccessToast(`✓ ${targetUser.name} is now a ${newRole}!`);
      fetchUsersDirectory();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    } finally {
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  // Synchronized PATCH endpoint directly to /team/role/:id
  const handlePromoteRole = async (e) => {
    e.preventDefault();
    if (!roleSearchRoll.trim()) return;

    const cleaned = roleSearchRoll.trim().toUpperCase();
    const targetId = editingUserId || cleaned;

    // Resolve avatar payload:
    // If explicitly removed -> send empty string "" to overwrite in MongoDB
    // If new base64 -> send memberPhotoBase64
    // If left untouched -> send undefined so backend preserves existing
    let photoPayload = undefined;
    if (isPhotoExplicitlyDeleted) {
      photoPayload = '';
    } else if (memberPhotoBase64) {
      photoPayload = memberPhotoBase64;
    }

    try {
      await api.patch(`/team/role/${targetId}`, {
        rollNumber: cleaned,
        role: selectedNewRole,
        designation: memberDesignation.trim() || undefined,
        photoUrl: photoPayload,
        avatar: photoPayload,
        linkedin: memberLinkedin.trim() || undefined,
      });

      setSuccessToast(`✓ Profile details for ${cleaned} updated successfully.`);
      handleClearEditMode();
      fetchUsersDirectory();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user profile. Verify student exists.');
    } finally {
      setTimeout(() => setSuccessToast(''), 4000);
    }
  };

  const handleSelectMemberForEdit = (m) => {
    setEditingUserId(m._id || null);
    setRoleSearchRoll(m.rollNumber || '');
    setSelectedNewRole(m.role || 'volunteer');
    setMemberPhotoBase64(m.avatar || m.photoUrl || '');
    setIsPhotoExplicitlyDeleted(false);
    setMemberDesignation(m.designation || '');
    setMemberLinkedin(m.linkedin || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const filteredUsersList = useMemo(() => {
    return usersList.filter((u) => {
      const name = u.name?.toLowerCase() || '';
      const roll = u.rollNumber?.toLowerCase() || '';
      const role = u.role?.toLowerCase() || '';
      const query = userDirectorySearch.toLowerCase();

      const matchesSearch = name.includes(query) || roll.includes(query);
      const matchesRole = userRoleFilter === 'All' || role === userRoleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [usersList, userDirectorySearch, userRoleFilter]);

  const totalRegisteredCount = rosterSummary.totalRegistered || 0;
  const attendedCount = rosterSummary.totalAttended || 0;
  const checkedInPercent = rosterSummary.turnoutPercentage || '0%';
  const activeEventsCount = eventsList.filter((e) => e.isRegistrationOpen).length;

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-red-700 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage('')} className="font-bold text-xs cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div className="fixed top-20 right-6 z-50 max-w-md bg-white border border-[#E53E24]/30 shadow-xl rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs font-semibold text-[#111827]">
              {successToast}
            </div>
            <button
              onClick={() => setSuccessToast('')}
              className="text-[#4B5563] hover:text-[#111827] text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. INSTITUTIONAL EXECUTIVE HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] border border-[#E53E24]/20 uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  {roleBadgeText}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  GVPCE &bull; Department of IT
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                OpenForge Executive Console
              </h1>

              <p className="text-sm text-[#4B5563] dark:text-gray-400 max-w-2xl leading-relaxed">
                Centralized platform governance for departmental workshops, technical symposiums, digital attendee validation, and society member registries.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-soft-peach/60 dark:bg-gray-800/80 border border-soft-peach dark:border-gray-700 text-xs font-medium text-[#4B5563] dark:text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Console Active: <strong className="text-[#111827] dark:text-white">{user?.name || 'Administrator'}</strong></span>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. ANALYTICS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4B5563] dark:text-gray-400 uppercase tracking-wider">
              <span>Total Registered</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-black text-[#111827] dark:text-white">
              {totalRegisteredCount}
            </div>
            <div className="text-[11px] text-[#4B5563] dark:text-gray-400">Active event participants</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4B5563] dark:text-gray-400 uppercase tracking-wider">
              <span>Checked-In Attendees</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-primary">
              {attendedCount}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#4B5563] dark:text-gray-400">
                <span>Turnout Rate</span>
                <span className="font-bold text-[#111827] dark:text-white">{checkedInPercent}</span>
              </div>
              <div className="w-full bg-soft-peach dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-accent to-primary h-full rounded-full transition-all duration-500"
                  style={{ width: checkedInPercent }}
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4B5563] dark:text-gray-400 uppercase tracking-wider">
              <span>Host Department</span>
              <Building className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-black text-accent truncate">
              Information Tech
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              GVPCE (Autonomous)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4B5563] dark:text-gray-400 uppercase tracking-wider">
              <span>Active Events</span>
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-black text-[#111827] dark:text-white">
              {activeEventsCount}
            </div>
            <div className="text-[11px] text-[#4B5563] dark:text-gray-400">Open for registrations</div>
          </div>
        </div>

        {/* 3. TABS */}
        <div className="border-b border-soft-peach dark:border-gray-800 flex items-center gap-8">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`relative pb-3 text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'attendance'
                ? 'text-primary'
                : 'text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white'
            }`}
          >
            <span>Live Attendance Roster</span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-primary">
              {roster.length}
            </span>
            {activeTab === 'attendance' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`relative pb-3 text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'events'
                ? 'text-primary'
                : 'text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white'
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

          {isAdmin && (
            <button
              onClick={() => setActiveTab('permissions')}
              className={`relative pb-3 text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'permissions'
                  ? 'text-primary'
                  : 'text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-primary" />
              <span>Team Roster & Roles</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                {usersList.length}
              </span>
              {activeTab === 'permissions' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-full" />
              )}
            </button>
          )}
        </div>

        {/* 4. TAB 1: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-soft-peach dark:border-gray-800">
              <div>
                <label className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider block mb-1">
                  Select Event Roster:
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-primary/30 bg-[#FFF7ED]/30 dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                >
                  {eventsList.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.title} ({new Date(e.eventDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#FFF7ED] text-primary hover:bg-soft-peach border border-primary/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Download Verified CSV</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by Student Name or Roll Number..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="All">All Departments</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Computer Science">CSE</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Electrical & Electronics">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="All">All Years</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-soft-peach dark:border-gray-800">
              {loadingRoster ? (
                <div className="py-12 flex flex-col items-center justify-center text-[#4B5563]">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                  <p className="text-xs">Fetching live attendee roster from database...</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF7ED]/70 dark:bg-gray-800 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300 border-b border-soft-peach dark:border-gray-800">
                    <tr>
                      <th className="px-5 py-3.5">Student Name</th>
                      <th className="px-5 py-3.5">Roll Number</th>
                      <th className="px-5 py-3.5">Department</th>
                      <th className="px-5 py-3.5">Year</th>
                      <th className="px-5 py-3.5">Ticket Code</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-peach dark:divide-gray-800 text-[#111827] dark:text-gray-200">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((reg) => (
                        <tr key={reg._id} className="hover:bg-[#FFF7ED]/20 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="px-5 py-3.5 font-bold">{reg.user?.name || 'Student'}</td>
                          <td className="px-5 py-3.5 font-mono text-primary font-bold">
                            {reg.user?.rollNumber || 'N/A'}
                          </td>
                          <td className="px-5 py-3.5 text-[#4B5563] dark:text-gray-400">{reg.user?.department || '—'}</td>
                          <td className="px-5 py-3.5">{reg.user?.year || '—'}</td>
                          <td className="px-5 py-3.5 font-mono text-[11px] text-[#4B5563] dark:text-gray-400">
                            {reg.ticketCode}
                          </td>
                          <td className="px-5 py-3.5">
                            {reg.attended ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 inline-flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Attended
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF7ED] text-primary border border-primary/20">
                                Registered
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {!reg.attended ? (
                              <button
                                onClick={() => handleToggleAttendance(reg)}
                                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                              >
                                Mark Attended
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-600 font-semibold">Verified</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-[#4B5563] dark:text-gray-400">
                          No registrations found for this event.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* 5. TAB 2: MANAGE EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#111827] dark:text-white">Live Events Management</h2>
                <p className="text-xs text-[#4B5563] dark:text-gray-400">
                  Publish new workshops, configure capacities, and control registration status in real time.
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>

            {loadingEvents ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {eventsList.map((evt) => (
                  <div
                    key={evt._id}
                    className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-soft-peach dark:border-gray-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-accent border border-accent/20">
                          {evt.category}
                        </span>

                        <button
                          onClick={() => handleToggleEventRegistration(evt._id, evt.isRegistrationOpen)}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                            evt.isRegistrationOpen
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}
                          title="Click to toggle registration switch"
                        >
                          {evt.isRegistrationOpen ? 'Registration: Open' : 'Registration: Closed'}
                        </button>
                      </div>

                      <h3 className="font-extrabold text-base text-[#111827] dark:text-white">{evt.title}</h3>
                      <p className="text-xs text-[#4B5563] dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-[#4B5563] dark:text-gray-400 pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{new Date(evt.eventDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between text-xs">
                      <span className="text-[#4B5563] dark:text-gray-400">
                        <Users className="w-3.5 h-3.5 inline mr-1 text-primary" />
                        {evt.registeredCount || 0} / {evt.capacity} Seats
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenEditModal(evt)}
                          className="text-[#4B5563] hover:text-primary transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt._id, evt.title)}
                          className="text-[#4B5563] hover:text-red-600 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. TAB 3: TEAM ROSTER & ROLES (Admin Only) */}
        {activeTab === 'permissions' && isAdmin && (
          <div className="space-y-8">
            {/* Top Form: Promote Roll or Edit Detailed Profile */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 border border-soft-peach dark:border-gray-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-[#111827] dark:text-white">
                    {editingUserId ? 'Edit Profile & Role Details' : 'Assign Team Role & Upload Profile Photo'}
                  </h2>
                  <p className="text-xs text-[#4B5563] dark:text-gray-400">
                    Upload an avatar image to display on the Team page cards.
                  </p>
                </div>
                {editingUserId && (
                  <button
                    type="button"
                    onClick={handleClearEditMode}
                    className="text-xs text-primary font-bold hover:underline cursor-pointer"
                  >
                    Clear Edit Mode
                  </button>
                )}
              </div>

              <form onSubmit={handlePromoteRole} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Photo Upload Area with Image Preview, Delete, and Download */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-5 border-2 border-dashed border-soft-peach dark:border-gray-700 rounded-3xl bg-[#FFF7ED]/20 dark:bg-gray-800/40 min-h-[170px]">
                    {memberPhotoBase64 ? (
                      <div className="relative group flex flex-col items-center gap-2">
                        <img
                          src={memberPhotoBase64}
                          alt="Preview"
                          className="w-28 h-28 rounded-2xl object-cover border-2 border-primary shadow-md"
                        />

                        {/* Control action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleDownloadPhoto}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white dark:bg-gray-800 border border-soft-peach dark:border-gray-700 hover:border-primary text-gray-700 dark:text-gray-200 flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Download Current Photo"
                          >
                            <Download className="w-3 h-3 text-primary" />
                            <span>Download</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-100 flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Remove Photo from Profile"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center cursor-pointer text-center py-2"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-[#111827] dark:text-white">
                          Click to Upload Member Photo
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WebP up to 2MB</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Form Details */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 text-left">
                        <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                          Student Roll Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={roleSearchRoll}
                          onChange={(e) => setRoleSearchRoll(e.target.value)}
                          placeholder="e.g. 324103311051"
                          className="w-full px-4 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono font-bold text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                        />
                        {liveParsedRoleSearch.isValid && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-0.5">
                            ✓ {liveParsedRoleSearch.branch} • {liveParsedRoleSearch.currentYear}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                          Assign Role / Tier *
                        </label>
                        <select
                          value={selectedNewRole}
                          onChange={(e) => setSelectedNewRole(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                        >
                          <option value="student">Student (Standard Access)</option>
                          <option value="volunteer">Volunteer (Scanner Access)</option>
                          <option value="board">Board Member (Core Leadership)</option>
                          <option value="admin">Super Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 text-left">
                        <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                          Designation / Title (Optional)
                        </label>
                        <input
                          type="text"
                          value={memberDesignation}
                          onChange={(e) => setMemberDesignation(e.target.value)}
                          placeholder="e.g. Lead Technical Architect"
                          className="w-full px-4 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-accent" />
                          <span>LinkedIn URL (Optional)</span>
                        </label>
                        <input
                          type="url"
                          value={memberLinkedin}
                          onChange={(e) => setMemberLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-4 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      {editingUserId ? 'Save Profile Changes' : 'Save & Promote'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Bottom Table: Full Registered User Registry */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 shadow-sm p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                <div>
                  <h3 className="font-extrabold text-base text-[#111827] dark:text-white">
                    Registered Members Directory ({filteredUsersList.length})
                  </h3>
                  <span className="text-xs text-[#4B5563] dark:text-gray-400">
                    All registered campus accounts. Promote directly to Volunteer or Board.
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#4B5563] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userDirectorySearch}
                      onChange={(e) => setUserDirectorySearch(e.target.value)}
                      placeholder="Search member or roll..."
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111827] dark:text-white font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="All">All Roles</option>
                    <option value="student">Students</option>
                    <option value="volunteer">Volunteers</option>
                    <option value="board">Board Members</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-soft-peach dark:border-gray-800">
                {loadingUsers ? (
                  <div className="py-8 text-center text-[#4B5563]">Loading directory from database...</div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFF7ED]/70 dark:bg-gray-800 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300 border-b border-soft-peach dark:border-gray-800">
                      <tr>
                        <th className="px-5 py-4">Member</th>
                        <th className="px-5 py-4">Roll Number</th>
                        <th className="px-5 py-4">Department</th>
                        <th className="px-5 py-4">Current Role</th>
                        <th className="px-5 py-4">Designation</th>
                        <th className="px-5 py-4 text-right">Promote / Demote</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-soft-peach dark:divide-gray-800 text-[#111827] dark:text-gray-200">
                      {filteredUsersList.length > 0 ? (
                        filteredUsersList.map((u) => {
                          const avatarSrc = u.avatar || u.photoUrl;
                          const role = u.role || 'student';

                          return (
                            <tr key={u._id || u.rollNumber} className="hover:bg-[#FFF7ED]/20 dark:hover:bg-gray-800/40 transition-colors">
                              <td className="px-5 py-4 flex items-center gap-3.5">
                                {avatarSrc ? (
                                  <img
                                    src={avatarSrc}
                                    alt={u.name}
                                    className="w-12 h-12 rounded-2xl object-cover border border-primary/20 shrink-0 shadow-sm"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                    {u.name?.charAt(0) || 'U'}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-sm block text-[#111827] dark:text-white">{u.name}</span>
                                  <span className="text-[11px] text-[#4B5563] dark:text-gray-400">{u.email}</span>
                                </div>
                              </td>

                              <td className="px-5 py-4 font-mono text-primary font-bold">
                                {u.rollNumber || 'N/A'}
                              </td>

                              <td className="px-5 py-4 text-[#4B5563] dark:text-gray-300">
                                {u.department || 'Information Technology'}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border ${
                                    role === 'admin'
                                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                                      : role === 'board'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : role === 'volunteer'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-gray-100 text-gray-700 border-gray-200'
                                  }`}
                                >
                                  {role}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-[#4B5563] dark:text-gray-300">
                                {u.designation || '—'}
                              </td>

                              <td className="px-5 py-4 text-right space-x-1.5">
                                {role === 'student' && (
                                  <button
                                    onClick={() => handleQuickRoleChange(u, 'volunteer')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-[11px] font-bold transition-all cursor-pointer"
                                    title="Grant Volunteer Scanner Access"
                                  >
                                    + Volunteer
                                  </button>
                                )}

                                {role === 'volunteer' && (
                                  <button
                                    onClick={() => handleQuickRoleChange(u, 'board')}
                                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 text-[11px] font-bold transition-all cursor-pointer"
                                    title="Promote to Core Board"
                                  >
                                    + Board
                                  </button>
                                )}

                                {role !== 'student' && role !== 'admin' && (
                                  <button
                                    onClick={() => handleQuickRoleChange(u, 'student')}
                                    className="px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300 text-[11px] font-semibold transition-all cursor-pointer"
                                    title="Demote back to standard student role"
                                  >
                                    Demote
                                  </button>
                                )}

                                <button
                                  onClick={() => handleSelectMemberForEdit(u)}
                                  className="text-xs font-semibold text-primary hover:underline ml-2 cursor-pointer"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-[#4B5563] dark:text-gray-400">
                            No registered members found matching criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CREATE / EDIT EVENT MODAL */}
        {showEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-soft-peach dark:border-gray-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-soft-peach dark:border-gray-800">
                <h3 className="font-extrabold text-lg text-[#111827] dark:text-white">
                  {editingEventId ? 'Edit Event Details' : 'Create New Campus Event'}
                </h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-[#4B5563] hover:text-[#111827] dark:hover:text-white text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Sherlock: The Digital Case"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                      Category *
                    </label>
                    <select
                      value={eventForm.category}
                      onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Coding Challenge">Coding Challenge</option>
                      <option value="Bootcamp">Bootcamp</option>
                      <option value="Club Day">Club Day</option>
                      <option value="Meetup">Meetup</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={eventForm.capacity}
                      onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                      Event Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={eventForm.eventDate}
                      onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                      Registration Cutoff
                    </label>
                    <input
                      type="datetime-local"
                      value={eventForm.registrationDeadline}
                      onChange={(e) => setEventForm({ ...eventForm, registrationDeadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                    Banner Image URL (Poster)
                  </label>
                  <input
                    type="url"
                    value={eventForm.bannerImage}
                    onChange={(e) => setEventForm({ ...eventForm, bannerImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                    Venue Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    placeholder="e.g. Auditorium Hall B, GVPCE"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                    Event Description
                  </label>
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Brief description of event itinerary and attendee instructions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-soft-peach dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-soft-peach dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#4B5563] hover:text-[#111827] dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
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