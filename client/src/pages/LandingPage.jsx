import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Calendar,
  BookOpen,
  GitPullRequest,
  TrendingUp,
  Loader2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import EventCard from '../components/EventCard';
import { getEvents, getTeam } from '../api';

export default function LandingPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [teamMembers, setTeamMembers] = useState({ faculty: [], board: [], volunteers: [] });
  const [loading, setLoading] = useState(true);

  // 3D Perspective Tilt State (Zero zoom / pure rotation)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false, glareX: 50, glareY: 50 });
  const heroCardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, isHovered: true, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false, glareX: 50, glareY: 50 });
  };

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        const [eventsRes, teamRes] = await Promise.allSettled([
          getEvents(),
          getTeam(),
        ]);

        if (eventsRes.status === 'fulfilled') {
          const events = eventsRes.value.data?.data || [];
          setUpcomingEvents(events.slice(0, 3));
        }

        if (teamRes.status === 'fulfilled') {
          const payload = teamRes.value.data?.data || {};
          if (Array.isArray(payload)) {
            setTeamMembers({
              faculty: payload.filter((m) => m.tier === 'faculty' || m.role === 'faculty'),
              board: payload.filter((m) => m.tier === 'board' || m.role === 'board' || m.role === 'admin'),
              volunteers: payload.filter((m) => m.tier === 'volunteer' || m.role === 'volunteer'),
            });
          } else {
            setTeamMembers({
              faculty: payload.faculty || [],
              board: payload.board || [],
              volunteers: payload.volunteers || [],
            });
          }
        }
      } catch (err) {
        console.error('Failed to load live landing page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  const totalTeamCount =
    (teamMembers.faculty?.length || 0) +
    (teamMembers.board?.length || 0) +
    (teamMembers.volunteers?.length || 0);

  const pillars = [
    {
      title: 'Learn',
      description: 'Gain hands-on skills through intensive workshops, code sprints, and interactive bootcamps.',
      icon: BookOpen,
    },
    {
      title: 'Contribute',
      description: 'Collaborate on open repositories and build tools that power real campus initiatives.',
      icon: GitPullRequest,
    },
    {
      title: 'Connect',
      description: 'Network with senior developers, faculty mentors, and fellow campus innovators.',
      icon: Users,
    },
    {
      title: 'Grow',
      description: 'Sharpen your engineering mindset, lead event crews, and unlock industry-ready opportunities.',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 lg:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="text-xs sm:text-sm font-bold tracking-[0.28em] text-[#E53E24] uppercase">
                GVPCE &bull; IT &bull; OPEN FORGE
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#111827] dark:text-white tracking-tight leading-[1.08]">
                Discover.
                <br />
                Participate.
                <br />
                Create.
              </h1>

              <p className="text-base sm:text-lg text-[#4B5563] dark:text-gray-300 leading-relaxed max-w-xl">
                OpenForge is the student-driven technical society under the Department of Information Technology at GVPCE. We build real platforms, organize campus-scale challenges, and foster open collaborative software engineering.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#events"
                  className="rounded-full px-6 py-3 bg-[#E53E24] hover:bg-[#CB321A] text-white font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to="/community"
                  className="rounded-full px-6 py-3 bg-white dark:bg-gray-800 border border-[#E53E24]/30 hover:border-[#E53E24] text-[#E53E24] dark:text-white font-semibold flex items-center gap-2 hover:bg-soft-peach/60 dark:hover:bg-gray-700 shadow-xs transition-all duration-200"
                >
                  <MessageSquare className="w-4 h-4 text-[#E53E24]" />
                  <span>Join OpenForge Community</span>
                </Link>
              </div>
            </div>

            {/* Right Side Visual: 3D Perspective Rotation ONLY (No Zoom) */}
            <div className="lg:col-span-6 relative flex items-center justify-center [perspective:1200px]">
              <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-tr from-[#E53E24]/25 via-[#F97316]/20 to-[#FFF7ED] dark:to-transparent rounded-full blur-3xl -z-10 animate-pulse" />

              <div
                ref={heroCardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: tilt.isHovered
                    ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                  transition: tilt.isHovered
                    ? 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
                    : 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-[#E53E24]/40 shadow-2xl group cursor-pointer"
              >
                <img
                  src="/team-full.jpg"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
                  }}
                  alt="OpenForge Official Full Team"
                  className="w-full h-full object-cover select-none"
                />

                {/* Glare Sheen Reflection Layer */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: tilt.isHovered ? 0.35 : 0,
                    background: `radial-gradient(circle 320px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.7), transparent 70%)`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                <div
                  className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white z-10"
                  style={{ transform: 'translateZ(28px)' }}
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#F97316] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>OpenForge Collective</span>
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base drop-shadow-sm">
                      Our Full Team & Coordinators
                    </h3>
                  </div>

                  <Link
                    to="/team"
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 hover:bg-white text-white hover:text-[#111827] backdrop-blur-md border border-white/30 transition-all flex items-center gap-1 shrink-0 shadow-lg"
                  >
                    <span>View Roster</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE UPCOMING EVENTS */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-soft-peach dark:border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-400 mt-0.5">
              Live campus challenges, workshops, and hackathons open for RSVP.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-[#E53E24] hover:text-[#CB321A] text-sm sm:text-base font-semibold flex items-center gap-1 group transition-colors"
          >
            <span>View All in Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-[#4B5563]">
            <Loader2 className="w-8 h-8 animate-spin text-[#E53E24] mb-3" />
            <p className="text-sm font-semibold">Loading live campus events...</p>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 space-y-2">
            <Calendar className="w-10 h-10 text-[#E53E24] mx-auto opacity-70" />
            <h3 className="text-base font-bold text-[#111827] dark:text-white">No upcoming events scheduled right now</h3>
            <p className="text-xs text-[#4B5563] dark:text-gray-400">Check back soon or create new events via the Admin Panel.</p>
          </div>
        )}
      </section>

      {/* 3. DEDICATED FULL TEAM BANNER (50% - 60% GRADIENT HOVER TINT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-soft-peach dark:border-gray-800">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E53E24]">
                THE PEOPLE BEHIND THE PLATFORM
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                Our Team & Mentors
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-400 max-w-xl">
                Led by student architects, governed by the core board, and guided by experienced faculty advisors from the Department of IT.
              </p>
            </div>

            <Link
              to="/team"
              className="px-6 py-2.5 rounded-xl bg-[#E53E24] hover:bg-[#CB321A] text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 self-start md:self-end"
            >
              <span>Explore Full Roster ({totalTeamCount})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative rounded-3xl overflow-hidden border-2 border-soft-peach dark:border-gray-800 hover:border-[#E53E24]/40 shadow-xl aspect-video w-full group cursor-pointer transition-colors duration-500">
            <img
              src="/team-full.jpg"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80';
              }}
              alt="OpenForge Entire Collective"
              className="w-full h-full object-cover select-none"
            />

            {/* Base Subtle Dark Vignette for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Soft Primary Color Hover Shade: Extended to 55% from bottom */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#E53E24]/28 via-[#F97316]/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 flex flex-wrap items-end justify-between gap-4 text-white z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F97316] group-hover:text-orange-300 flex items-center gap-1.5 mb-1 transition-colors duration-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  GVPCE IT Society
                </span>
                <h3 className="text-xl sm:text-3xl font-black tracking-tight drop-shadow-md">
                  OpenForge Collective & Coordinators
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 group-hover:text-white mt-1 transition-colors duration-300">
                  Batch of 2022–2026 &bull; Gayatri Vidya Parishad College of Engineering (Autonomous)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-white/20 group-hover:bg-white/30 backdrop-blur-md text-xs font-bold border border-white/30 transition-all">
                  {teamMembers.board?.length || 0} Core Board
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/20 group-hover:bg-white/30 backdrop-blur-md text-xs font-bold border border-white/30 transition-all">
                  {teamMembers.volunteers?.length || 0} Volunteers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-[#E53E24]">
                WHY OPENFORGE?
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                More Than Just Events
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs hover:border-[#E53E24]/30 dark:hover:border-[#E53E24]/30 transition-all flex flex-col space-y-3"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#E53E24] to-[#F97316] flex items-center justify-center text-white shadow-sm shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <h3 className="font-bold text-base text-[#111827] dark:text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-3xl bg-soft-peach/60 dark:bg-[#111827] border border-soft-peach dark:border-gray-800 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
              <div className="absolute w-44 h-44 rounded-full bg-[#E53E24]/10 blur-2xl -z-0 animate-pulse" />

              <div className="relative z-10 w-24 h-24 rounded-3xl bg-white dark:bg-gray-800 border-2 border-soft-peach dark:border-gray-700 flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300 p-3">
                <img
                  src="/openforgelogo.png"
                  alt="OpenForge Official Logo"
                  className="w-16 h-16 object-contain drop-shadow"
                />
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-xl font-extrabold text-[#111827] dark:text-white">
                  Student Driven Community
                </h3>
                <p className="text-xs text-[#4B5563] dark:text-gray-400 max-w-xs mx-auto">
                  Built for engineering campuses, university clubs, and passionate innovators.
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap justify-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 text-[#E53E24] border border-[#E53E24]/20 shadow-xs">
                  GVPCE (A)
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 text-[#F97316] border border-[#F97316]/20 shadow-xs">
                  Dept of IT
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 text-[#111827] dark:text-gray-200 border border-soft-peach dark:border-gray-700 shadow-xs">
                  Campus Mentorship
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E53E24] via-[#E53E24] to-[#F97316] p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold tracking-widest uppercase text-soft-peach">
              READY TO GET STARTED?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Join a community that builds the future.
            </h2>
          </div>

          <Link
            to="/register"
            className="px-7 py-3.5 rounded-full font-bold bg-white text-[#E53E24] hover:bg-soft-peach shadow-lg hover:shadow-xl transition-all duration-200 shrink-0 flex items-center gap-2 group"
          >
            <span>Claim Your Digital Pass</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}