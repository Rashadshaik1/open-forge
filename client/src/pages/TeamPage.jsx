import { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Shield,
  HeartHandshake,
  Sparkles,
  Loader2,
  Users2,
  Building2,
  Calendar,
  ChevronDown,
  History,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { getTeam } from '../api';

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [rawTeamList, setRawTeamList] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamRoster = async () => {
      try {
        setLoading(true);
        const res = await getTeam();
        const payload = res.data?.data || [];

        // Flatten whether response is array or structured object
        let list = [];
        if (Array.isArray(payload)) {
          list = payload;
        } else {
          list = [
            ...(payload.faculty || []).map((m) => ({ ...m, tier: 'faculty' })),
            ...(payload.board || []).map((m) => ({ ...m, tier: 'board' })),
            ...(payload.volunteers || []).map((m) => ({ ...m, tier: 'volunteer' })),
          ];
        }

        setRawTeamList(list);

        // Extract available unique academic years
        const years = Array.from(
          new Set(
            list
              .map((m) => m.academicYear || m.tenure || m.year)
              .filter(Boolean)
          )
        ).sort((a, b) => b.localeCompare(a)); // Newest first

        // Default to latest year or fallback to '2025-2026'
        setSelectedYear(years[0] || '2025-2026');
      } catch (err) {
        console.error('Failed to load team roster from live database:', err);
        setRawTeamList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamRoster();
  }, []);

  // Compute all available academic years dynamically
  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(
        rawTeamList
          .map((m) => m.academicYear || m.tenure || m.year)
          .filter(Boolean)
      )
    ).sort((a, b) => b.localeCompare(a));

    if (!years.includes('2025-2026')) years.unshift('2025-2026');
    if (!years.includes('2024-2025')) years.push('2024-2025'); // Founding Board
    return years;
  }, [rawTeamList]);

  // Filter members by the selected academic year (Faculty stays visible across tenures unless assigned a specific year)
  const currentTenureMembers = useMemo(() => {
    return rawTeamList.filter((m) => {
      const memberTier = m.tier || m.role;
      if (memberTier === 'faculty') return true; // Mentors guide across multiple batches
      const memberYear = m.academicYear || m.tenure || m.year;
      return !memberYear || memberYear === selectedYear;
    });
  }, [rawTeamList, selectedYear]);

  const facultyList = currentTenureMembers.filter(
    (m) => m.tier === 'faculty' || m.role === 'faculty'
  );
  const boardList = currentTenureMembers.filter(
    (m) => m.tier === 'board' || m.role === 'board' || m.role === 'admin'
  );
  const volunteerList = currentTenureMembers.filter(
    (m) => m.tier === 'volunteer' || m.role === 'volunteer'
  );

  const totalMembers = facultyList.length + boardList.length + volunteerList.length;
  const isFoundingBoard = selectedYear === '2024-2025';

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-24 transition-colors duration-200">
      {/* Header Banner */}
      <section className="relative overflow-hidden py-14 sm:py-20 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Minds Behind OpenForge</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] dark:text-white">
            Meet the Builders & Mentors
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Faculty guidance, student leadership, and ground operations driving technology innovation at GVPCE.
          </p>

          {/* Academic Year Selector & Tenure Badging */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-100 dark:bg-gray-800/80 border border-soft-peach dark:border-gray-700">
              <Calendar className="w-4 h-4 text-[#E53E24]" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Tenure:</span>
              <div className="relative inline-block">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-transparent pr-7 pl-1 py-0.5 text-xs sm:text-sm font-extrabold text-[#111827] dark:text-white focus:outline-none cursor-pointer"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr} className="bg-white dark:bg-[#111827] text-gray-900 dark:text-white">
                      Academic Year {yr} {yr === '2024-2025' ? '• (Founding Board)' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {isFoundingBoard && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <History className="w-3.5 h-3.5" />
                <span>Founding Executive Committee</span>
              </span>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: `All Members (${totalMembers})` },
              { id: 'faculty', label: `Faculty (${facultyList.length})` },
              { id: 'board', label: `Board (${boardList.length})` },
              { id: 'volunteers', label: `Volunteers (${volunteerList.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#E53E24] text-white shadow-md shadow-[#E53E24]/20 scale-105'
                    : 'bg-white dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 border border-soft-peach dark:border-gray-700 hover:border-[#E53E24] hover:text-[#E53E24]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[#4B5563] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#E53E24]" />
            <p className="text-xs font-semibold">Loading live team directory for {selectedYear}...</p>
          </div>
        ) : totalMembers === 0 ? (
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 p-12 text-center space-y-4">
            <Users2 className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-[#111827] dark:text-white">
              No Records for Academic Year {selectedYear}
            </h3>
            <p className="text-xs text-[#4B5563] dark:text-gray-400 max-w-sm mx-auto">
              Members for this academic tenure haven't been added to the directory yet.
            </p>
          </div>
        ) : (
          <>
            {/* TIER 1: FACULTY COORDINATORS */}
            {(activeFilter === 'all' || activeFilter === 'faculty') && facultyList.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-soft-peach dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] flex items-center justify-center shadow-xs">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#E53E24]">
                        Academic Guidance
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white">
                        Faculty Mentors
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#E53E24] bg-[#FFF7ED] dark:bg-[#E53E24]/20 border border-[#E53E24]/20 px-3 py-1 rounded-full">
                    {facultyList.length} Mentors
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {facultyList.map((fac, idx) => {
                    const id = fac._id || fac.id || `fac-${idx}`;
                    const photo = fac.avatar || fac.photoUrl;

                    return (
                      <div
                        key={id}
                        className="group bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 hover:border-[#E53E24]/50 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-tr from-stone-100 to-amber-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-b border-soft-peach dark:border-gray-800">
                          {photo ? (
                            <img
                              src={photo}
                              alt={fac.name}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-[#E53E24]/10 text-[#E53E24] flex items-center justify-center font-black text-2xl">
                              {fac.name?.charAt(0) || 'F'}
                            </div>
                          )}

                          {/* Primary Red Gradient shade - 40% height from bottom */}
                          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#E53E24]/75 via-[#E53E24]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                          <div className="absolute top-3 left-3 z-10">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs uppercase tracking-wider bg-stone-900 text-white">
                              Mentor
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-base text-[#111827] dark:text-white truncate">
                              {fac.name}
                            </h4>
                            <p className="text-xs font-semibold text-[#E53E24] truncate">
                              {fac.designation || 'Assistant Professor, Dept of IT'}
                            </p>
                            <p className="text-[11px] text-[#4B5563] dark:text-gray-400 truncate">
                              {fac.department || 'Information Technology'}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between">
                            <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> GVPCE
                            </span>

                            {fac.linkedin && (
                              <a
                                href={fac.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] hover:bg-[#E53E24] hover:text-white transition-all shadow-2xs"
                                title="LinkedIn Profile"
                              >
                                <LinkedinIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TIER 2: BOARD MEMBERS */}
            {(activeFilter === 'all' || activeFilter === 'board') && boardList.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-soft-peach dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-gray-800 text-[#F97316] flex items-center justify-center shadow-xs">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
                        {isFoundingBoard ? 'Founding Executive Board' : 'Student Leadership'}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white">
                        Board Members ({selectedYear})
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#F97316] bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 px-3 py-1 rounded-full">
                    {boardList.length} Leaders
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {boardList.map((member, idx) => {
                    const id = member._id || member.rollNumber || `board-${idx}`;
                    const photo = member.avatar || member.photoUrl;

                    return (
                      <div
                        key={id}
                        className="group bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 hover:border-[#F97316]/50 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-tr from-stone-100 to-amber-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-b border-soft-peach dark:border-gray-800">
                          {photo ? (
                            <img
                              src={photo}
                              alt={member.name}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-orange-500/10 text-[#F97316] flex items-center justify-center font-black text-2xl">
                              {member.name?.charAt(0) || 'B'}
                            </div>
                          )}

                          {/* Orange Gradient shade - 40% height from bottom */}
                          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#F97316]/75 via-[#F97316]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs uppercase tracking-wider bg-orange-600 text-white">
                              {member.role === 'admin' ? 'President / Admin' : 'Board'}
                            </span>
                            {isFoundingBoard && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs uppercase tracking-wider bg-amber-500 text-white">
                                Pioneer
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-base text-[#111827] dark:text-white truncate">
                              {member.name}
                            </h4>
                            <p className="text-xs font-semibold text-[#F97316] truncate">
                              {member.designation || (member.role === 'admin' ? 'Lead Administrator' : 'Executive')}
                            </p>
                            <p className="text-[11px] text-[#4B5563] dark:text-gray-400 truncate">
                              {member.department || 'Information Technology'}
                            </p>

                            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] border border-[#E53E24]/20">
                                <Calendar className="w-2.5 h-2.5" />
                                <span>{member.academicYear || selectedYear}</span>
                              </span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#E53E24] truncate max-w-[120px]">
                              {member.rollNumber || 'Core'}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] hover:bg-[#E53E24] hover:text-white transition-all shadow-2xs"
                                  title="LinkedIn"
                                >
                                  <LinkedinIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {member.github && (
                                <a
                                  href={member.github}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[#111827] dark:text-gray-200 hover:bg-black hover:text-white transition-all shadow-2xs"
                                  title="GitHub"
                                >
                                  <GithubIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TIER 3: STUDENT VOLUNTEERS */}
            {(activeFilter === 'all' || activeFilter === 'volunteers') && volunteerList.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-soft-peach dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-gray-800 text-purple-600 flex items-center justify-center shadow-xs">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                        Ground Operations
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white">
                        Student Volunteers ({selectedYear})
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 px-3 py-1 rounded-full">
                    {volunteerList.length} Volunteers
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {volunteerList.map((vol, idx) => {
                    const id = vol._id || vol.rollNumber || `vol-${idx}`;
                    const photo = vol.avatar || vol.photoUrl;

                    return (
                      <div
                        key={id}
                        className="group bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 hover:border-purple-400/50 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-tr from-purple-50 to-stone-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-b border-soft-peach dark:border-gray-800">
                          {photo ? (
                            <img
                              src={photo}
                              alt={vol.name}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center font-black text-2xl">
                              {vol.name?.charAt(0) || 'V'}
                            </div>
                          )}

                          {/* Purple Gradient shade - 40% height from bottom */}
                          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-purple-900/75 via-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                          <div className="absolute top-3 left-3 z-10">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs uppercase tracking-wider bg-purple-600 text-white">
                              Volunteer
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-base text-[#111827] dark:text-white truncate">
                              {vol.name}
                            </h4>
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 truncate">
                              {vol.designation || 'Volunteer'}
                            </p>
                            <p className="text-[11px] text-[#4B5563] dark:text-gray-400 truncate">
                              {vol.department || 'Information Technology'}
                            </p>

                            <div className="pt-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                <Calendar className="w-2.5 h-2.5" />
                                <span>{vol.academicYear || selectedYear}</span>
                              </span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#E53E24] truncate max-w-[120px]">
                              {vol.rollNumber || 'Volunteer'}
                            </span>

                            {vol.linkedin && (
                              <a
                                href={vol.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] hover:bg-[#E53E24] hover:text-white transition-all shadow-2xs"
                                title="LinkedIn"
                              >
                                <LinkedinIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}