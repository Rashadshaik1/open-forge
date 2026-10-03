import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Shield,
  HeartHandshake,
  Sparkles,
  Quote,
  Loader2,
  Users2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { getTeam } from '../api';

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [teamData, setTeamData] = useState({ faculty: [], board: [], volunteers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamRoster = async () => {
      try {
        setLoading(true);
        const res = await getTeam();
        const payload = res.data?.data || {};

        // Normalizes both array format and keyed { faculty, board, volunteers } formats
        if (Array.isArray(payload)) {
          setTeamData({
            faculty: payload.filter((m) => m.tier === 'faculty' || m.role === 'faculty'),
            board: payload.filter((m) => m.tier === 'board' || m.role === 'board' || m.role === 'admin'),
            volunteers: payload.filter((m) => m.tier === 'volunteer' || m.role === 'volunteer'),
          });
        } else {
          setTeamData({
            faculty: payload.faculty || [],
            board: payload.board || [],
            volunteers: payload.volunteers || [],
          });
        }
      } catch (err) {
        console.error('Failed to load team roster from live database:', err);
        setTeamData({ faculty: [], board: [], volunteers: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchTeamRoster();
  }, []);

  const facultyList = teamData.faculty || [];
  const boardList = teamData.board || [];
  const volunteerList = teamData.volunteers || [];
  const totalMembers = facultyList.length + boardList.length + volunteerList.length;

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-24 transition-colors duration-200">
      {/* Header Banner */}
      <section className="relative overflow-hidden py-16 sm:py-20 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/80">
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

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: 'all', label: `All Members (${totalMembers})` },
              { id: 'faculty', label: `Faculty (${facultyList.length})` },
              { id: 'board', label: `Board (${boardList.length})` },
              { id: 'volunteers', label: `Volunteers (${volunteerList.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[#4B5563] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#E53E24]" />
            <p className="text-xs font-semibold">Loading live team directory...</p>
          </div>
        ) : totalMembers === 0 ? (
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 p-12 text-center space-y-4">
            <Users2 className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-[#111827] dark:text-white">
              No Team Members Registered Yet
            </h3>
            <p className="text-xs text-[#4B5563] dark:text-gray-400 max-w-sm mx-auto">
              The Admin can now add faculty mentors, core board members, and student coordinators directly through the Admin Console.
            </p>
          </div>
        ) : (
          <>
            {/* TIER 1: FACULTY COORDINATORS */}
            {(activeFilter === 'all' || activeFilter === 'faculty') && facultyList.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-soft-peach dark:border-gray-800 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E53E24]">
                      Academic Guidance
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#111827] dark:text-white">
                      Faculty Coordinators & Mentors
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {facultyList.map((fac) => {
                    const id = fac._id || fac.id;
                    return (
                      <div
                        key={id}
                        className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-soft-peach dark:border-gray-800 shadow-xs flex flex-col justify-between space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            {fac.avatar || fac.photoUrl ? (
                              <img
                                src={fac.avatar || fac.photoUrl}
                                alt={fac.name}
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E53E24]/20 shadow-xs shrink-0"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-2xl bg-[#E53E24]/10 text-[#E53E24] flex items-center justify-center font-black text-xl border border-[#E53E24]/20 shrink-0">
                                {fac.name?.charAt(0) || 'F'}
                              </div>
                            )}

                            <div className="space-y-0.5">
                              <h3 className="font-extrabold text-base sm:text-lg text-[#111827] dark:text-white">
                                {fac.name}
                              </h3>
                              <p className="text-xs font-semibold text-[#E53E24]">
                                {fac.designation || 'Faculty Mentor'}
                              </p>
                              <p className="text-[11px] text-[#4B5563] dark:text-gray-400">
                                {fac.department || 'Department of Information Technology'}
                              </p>
                            </div>
                          </div>

                          {fac.message && (
                            <div className="p-4 rounded-2xl bg-[#FFF7ED]/50 dark:bg-gray-800/50 border border-soft-peach dark:border-gray-700/80">
                              <Quote className="w-4 h-4 text-[#F97316] mb-1 opacity-70" />
                              <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed italic">
                                "{fac.message}"
                              </p>
                            </div>
                          )}
                        </div>

                        {fac.linkedin && (
                          <div className="pt-2 flex items-center gap-2">
                            <a
                              href={fac.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#4B5563] dark:text-gray-400 hover:text-[#E53E24] flex items-center gap-1.5 transition-colors"
                            >
                              <LinkedinIcon className="w-3.5 h-3.5" />
                              <span>Professional Profile</span>
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TIER 2: BOARD MEMBERS */}
            {(activeFilter === 'all' || activeFilter === 'board') && boardList.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-soft-peach dark:border-gray-800 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-gray-800 text-[#F97316] flex items-center justify-center shadow-xs">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
                      Student Leadership & Governance
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#111827] dark:text-white">
                      Core Board Members
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {boardList.map((member) => {
                    const id = member._id || member.rollNumber;
                    return (
                      <div
                        key={id}
                        className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-soft-peach dark:border-gray-800 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center gap-3.5">
                            {member.avatar || member.photoUrl ? (
                              <img
                                src={member.avatar || member.photoUrl}
                                alt={member.name}
                                className="w-14 h-14 rounded-2xl object-cover border border-[#F97316]/30 shadow-xs shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-[#F97316] flex items-center justify-center font-bold text-lg border border-[#F97316]/20 shrink-0">
                                {member.name?.charAt(0) || 'B'}
                              </div>
                            )}

                            <div>
                              <h3 className="font-extrabold text-base text-[#111827] dark:text-white">
                                {member.name}
                              </h3>
                              <p className="text-xs font-bold text-[#F97316] uppercase tracking-wider mt-0.5">
                                {member.designation || (member.role === 'admin' ? 'Lead Admin' : 'Board Member')}
                              </p>
                              {member.rollNumber && (
                                <p className="font-mono text-[11px] text-[#4B5563] dark:text-gray-400 mt-0.5">
                                  {member.rollNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
                            {member.department || 'Department of Information Technology'}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between text-xs">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Core Board Lead
                          </span>
                          <div className="flex items-center gap-2 text-[#4B5563]">
                            {member.linkedin && (
  <a href={member.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#E53E24]">
    <LinkedinIcon className="w-3.5 h-3.5" />
  </a>
)}
{member.github && (
  <a href={member.github} target="_blank" rel="noreferrer" className="hover:text-[#E53E24]">
    <GithubIcon className="w-3.5 h-3.5" />
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

            {/* TIER 3: STUDENT VOLUNTEERS */}
            {(activeFilter === 'all' || activeFilter === 'volunteers') && volunteerList.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-soft-peach dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-gray-800 text-purple-600 flex items-center justify-center shadow-xs">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                        Ground Operations & Scanners
                      </span>
                      <h2 className="text-2xl font-extrabold text-[#111827] dark:text-white">
                        Student Volunteers
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#4B5563] dark:text-gray-400">
                    {volunteerList.length} Active Field Staff
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {volunteerList.map((vol) => {
                    const id = vol._id || vol.rollNumber;
                    return (
                      <div
                        key={id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs flex items-center gap-3.5"
                      >
                        {vol.avatar || vol.photoUrl ? (
                          <img
                            src={vol.avatar || vol.photoUrl}
                            alt={vol.name}
                            className="w-12 h-12 rounded-xl object-cover border border-purple-500/20 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-500/20 shrink-0">
                            {vol.name?.charAt(0) || 'V'}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-[#111827] dark:text-white truncate">
                            {vol.name}
                          </h4>
                          <p className="text-[11px] font-mono text-[#4B5563] dark:text-gray-400 truncate">
                            {vol.rollNumber || 'GVPCE Staff'}
                          </p>
                          <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold truncate">
                            {vol.department || 'Event Crew'}
                          </p>
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