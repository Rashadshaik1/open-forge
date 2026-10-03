import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Shield,
  HeartHandshake,
  Sparkles,
  Mail,
  Quote,
  ArrowRight,
  Award,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';

export default function TeamPage() {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'faculty' | 'board' | 'volunteers'

  // Tier 1: Faculty Coordinators
  const facultyMembers = [
    {
      id: 'fac-1',
      name: 'Dr. K. N. Brahmaji Rao',
      designation: 'Professor & Lead Faculty Advisor',
      department: 'Department of Information Technology',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      message:
        'OpenForge exemplifies student leadership at GVPCE. By combining innovation with disciplined execution, our students build real software that serves the campus community.',
      linkedin: 'https://linkedin.com',
      email: 'brahmaji@gvpce.ac.in',
    },
    {
      id: 'fac-2',
      name: 'Dr. B. Jaya Lakshmi',
      designation: 'Associate Professor & Student Activity Mentor',
      department: 'Department of Computer Science & Engineering',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      message:
        'Watching technical concepts from the classroom transform into full-scale 300+ attendee hackathons and puzzle tournaments has been immensely inspiring.',
      linkedin: 'https://linkedin.com',
      email: 'jayalakshmi@gvpce.ac.in',
    },
    {
      id: 'fac-3',
      name: 'Prof. S. R. K. Prasad',
      designation: 'Assistant Professor & Innovation Cell Mentor',
      department: 'Department of Electronics & Communication',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      message:
        'Bridging the gap between software and student enthusiasm is what OpenForge is all about. Proud to guide these young builders.',
      linkedin: 'https://linkedin.com',
      email: 'prasad_srk@gvpce.ac.in',
    },
  ];

  // Tier 2: Board Members
  const boardMembers = [
    {
      id: 'board-1',
      name: 'Rashad Shaik',
      role: 'Founder & Lead Architect',
      track: 'Full-Stack Architecture & Systems',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: 'Architected the OpenForge ecosystem, digital QR entry engine, and campus puzzle platforms.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'board-2',
      name: 'Ananya Sharma',
      role: 'Vice President & Tech Lead',
      track: 'Cloud Infrastructure & AI Systems',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      bio: 'Leading backend scalability, API security, and developer workshop curricula.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'board-3',
      name: 'Rohan Varma',
      role: 'Lead Product Designer',
      track: 'UI/UX & Brand Design Systems',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      bio: 'Obsessed with fluid micro-interactions, dark mode aesthetics, and human-centric design.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'board-4',
      name: 'Sneha Patel',
      role: 'Head of Operations & Logistics',
      track: 'Event Orchestration & Logistics',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'Coordinates 30+ volunteers, venue management, and frictionless on-ground check-ins.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'board-5',
      name: 'Vikram Adithya',
      role: 'Workshops & Hackathon Lead',
      track: 'Open Source Community',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Curates hands-on coding challenges and mentors first-year builders into web developers.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    {
      id: 'board-6',
      name: 'Meghana Rao',
      role: 'Community & Media Director',
      track: 'Content & Campus Outreach',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      bio: 'Amplifies club achievements, runs social campaigns, and hosts campus podcasts.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  ];

  // Tier 3: Volunteers
  const volunteers = [
    {
      name: 'Tarun Kumar',
      roll: '324103311012',
      branch: 'IT • 2nd Year',
      duty: 'QR Scanner & Gate Lead',
    },
    {
      name: 'Meera Nambiar',
      roll: '324103310055',
      branch: 'CSE • 2nd Year',
      duty: 'Stage & Speaker Relations',
    },
    {
      name: 'Sai Krishna',
      roll: '324103312040',
      branch: 'ECE • 3rd Year',
      duty: 'Audio & Visual Engineering',
    },
    {
      name: 'Preeti Sen',
      roll: '324103311029',
      branch: 'IT • 2nd Year',
      duty: 'Helpdesk & Attendee Experience',
    },
    {
      name: 'Rahul Joshi',
      roll: '324103382015',
      branch: 'AIML • 2nd Year',
      duty: 'Scoring Bot & Live Tally',
    },
    {
      name: 'Divya Murthy',
      roll: '324103310088',
      branch: 'CSE • 2nd Year',
      duty: 'Photography & Media',
    },
    {
      name: 'Harish Varma',
      roll: '324103314022',
      branch: 'EEE • 3rd Year',
      duty: 'Campus Ambience & Setup',
    },
    {
      name: 'Tanmay Roy',
      roll: '324103337004',
      branch: 'Cyber • 2nd Year',
      duty: 'Crowd Flow & Security',
    },
    {
      name: 'Kavya Pillai',
      roll: '324103383021',
      branch: 'DS • 2nd Year',
      duty: 'Analytics & RSVP Tracker',
    },
    {
      name: 'Nikhil Chowdary',
      roll: '324103320018',
      branch: 'Mech • 3rd Year',
      duty: 'Logistics & Equipment',
    },
    {
      name: 'Sravani Das',
      roll: '324103311064',
      branch: 'IT • 2nd Year',
      duty: 'Certificate Manifests',
    },
    {
      name: 'Pranathi S.',
      roll: '324103310103',
      branch: 'CSE • 2nd Year',
      duty: 'Social Engagement Host',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-24 transition-colors duration-200">
      {/* Top Banner Header */}
      <section className="relative overflow-hidden py-16 sm:py-20 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-[#E53E24]/10 to-[#F97316]/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Minds Behind OpenForge</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] dark:text-white">
            Meet the Builders & Mentors
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From visionary faculty guides to dedicated core leads and energetic student volunteers, OpenForge is powered by passionate campus innovators.
          </p>

          {/* Filter Pills at Top */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: 'all', label: 'All Team' },
              { id: 'faculty', label: 'Faculty Coordinators' },
              { id: 'board', label: 'Board Members' },
              { id: 'volunteers', label: 'Student Volunteers' },
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20">
        {/* ======================================================== */}
        {/* TIER 1: FACULTY COORDINATORS */}
        {/* ======================================================== */}
        {(activeFilter === 'all' || activeFilter === 'faculty') && (
          <section className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 border-b border-soft-peach dark:border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] flex items-center justify-center shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E53E24]">
                  Tier 1 &bull; Academic Guidance
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white">
                  Faculty Coordinators & Mentors
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {facultyMembers.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-soft-peach dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#E53E24]/30 transition-all duration-300 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={fac.avatar}
                        alt={fac.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E53E24]/20 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg text-[#111827] dark:text-white">
                          {fac.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#E53E24]">
                          {fac.designation}
                        </p>
                        <p className="text-[11px] text-[#4B5563] dark:text-gray-400">
                          {fac.department}
                        </p>
                      </div>
                    </div>

                    {/* Faculty quote */}
                    <div className="relative p-4 rounded-2xl bg-[#FFF7ED]/50 dark:bg-gray-800/50 border border-soft-peach dark:border-gray-700/80">
                      <Quote className="w-4 h-4 text-[#F97316] mb-1 opacity-70" />
                      <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed italic">
                        "{fac.message}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#4B5563] dark:text-gray-400">
                      GVPCE Faculty Council
                    </span>
                    <a
                      href={fac.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] hover:bg-[#E53E24] hover:text-white transition-all shadow-xs"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TIER 2: BOARD MEMBERS */}
        {/* ======================================================== */}
        {(activeFilter === 'all' || activeFilter === 'board') && (
          <section className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 border-b border-soft-peach dark:border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-gray-800 text-[#F97316] flex items-center justify-center shadow-xs">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F97316]">
                  Tier 2 &bull; Student Governance
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white">
                  Core Board Members
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-soft-peach dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-[#F97316]/40 transition-all duration-300 flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F97316]/20 shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E53E24] text-white flex items-center justify-center text-[10px] shadow-xs">
                          ★
                        </div>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-base text-[#111827] dark:text-white">
                          {member.name}
                        </h3>
                        <p className="text-xs font-bold text-[#E53E24]">
                          {member.role}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#F97316] bg-orange-50 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-[#F97316]/20">
                          {member.track}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Lead
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl text-[#4B5563] dark:text-gray-300 hover:text-[#111827] dark:hover:text-white hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors"
                        title="GitHub Profile"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors"
                        title="LinkedIn Profile"
                      >
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* TIER 3: STUDENT VOLUNTEERS */}
        {/* ======================================================== */}
        {(activeFilter === 'all' || activeFilter === 'volunteers') && (
          <section className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-soft-peach dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-gray-800 text-purple-600 flex items-center justify-center shadow-xs">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                    Tier 3 &bull; Ground Crew & Field Operations
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white">
                    Event Coordinators & Volunteers
                  </h2>
                </div>
              </div>

              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] border border-[#E53E24]/20">
                {volunteers.length} Active Volunteers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {volunteers.map((vol, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs hover:border-[#E53E24]/30 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#111827] dark:text-white">
                        {vol.name}
                      </h4>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-[11px] font-mono text-[#4B5563] dark:text-gray-400">
                      {vol.branch}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-soft-peach dark:border-gray-800">
                    <span className="inline-block text-[10px] font-bold text-[#E53E24] bg-[#FFF7ED] dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-[#E53E24]/20">
                      🎯 {vol.duty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Join the Team Callout */}
        <section className="rounded-3xl bg-gradient-to-r from-[#E53E24] via-[#E53E24] to-[#F97316] p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FFF7ED]">
              WANT TO JOIN THE CREW?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Become an OpenForge Volunteer or Core Member
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              Gain hands-on experience in event organization, full-stack systems, campus operations, and design leadership.
            </p>
          </div>

          <Link
            to="/register"
            className="px-6 py-3 rounded-full font-bold bg-white text-[#E53E24] hover:bg-[#FFF7ED] shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <span>Apply as Volunteer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
