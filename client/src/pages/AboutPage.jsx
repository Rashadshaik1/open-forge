import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Calendar,
  Users,
  Terminal,
  ArrowRight,
  Quote,
  Target,
  Rocket,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';

export default function AboutPage() {
  const milestones = [
    {
      badge: 'Genesis',
      date: 'August 2025',
      title: 'Conception & Core Architecture',
      description:
        'OpenForge was conceived to solve fragmented campus event management. Developed the first roll-parsing verification engine and zero-friction digital QR pass terminal.',
      tag: 'Platform Launch',
      highlight: false,
    },
    {
      badge: 'Viral Campus Phenomenon',
      date: 'October 2025',
      title: 'Sherlock: The Digital Case',
      description:
        'Over 300+ students ran across campus decoding cryptographic clues and scanning optical terminal stations. Became the most talked-about technical event of the semester with 1,200+ live clue verifications.',
      tag: '300+ Students &bull; 99.4% Check-in Rate',
      highlight: true,
    },
    {
      badge: 'Hands-on Learning',
      date: 'November 2025',
      title: 'Full-Stack Web Dev Mastery Bootcamps',
      description:
        'Conducted intensive code sprints in college laboratories, helping first and second-year students deploy their first full-stack apps to production.',
      tag: 'Hands-on Workshops',
      highlight: false,
    },
    {
      badge: 'Next Horizon',
      date: 'Early 2026',
      title: 'Statewide Hackathon & Project Incubator',
      description:
        'Expanding OpenForge into a multi-college competitive arena with live mentorship, industry problem statements, and cash prize grants for student startups.',
      tag: 'Upcoming Vision',
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-24 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/70">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-gradient-to-tr from-[#E53E24]/10 via-[#F97316]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30 uppercase tracking-wider">
            <img
              src="/openforgelogo.png"
              alt="OpenForge Logo"
              className="w-4 h-4 object-contain"
            />
            <span>Our Origin &bull; GVPCE Campus Tech Society</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#111827] dark:text-white leading-[1.1]">
            Where Ideas Get Built.
          </h1>

          <p className="text-base sm:text-lg text-[#4B5563] dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            OpenForge was born from a simple realization: engineering students shouldn't spend their best college years sitting through theoretical slideshows. We built an active forge for builders, coders, designers, and organizers to create real software and lead campus-scale experiences.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/team"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#E53E24] hover:bg-[#CB321A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Meet Our Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/community"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-soft-peach dark:border-gray-700 hover:border-[#E53E24] transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#E53E24]" />
              <span>Join Community Board</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* ======================================================== */}
        {/* 2. DEDICATED FOUNDER SPOTLIGHT HERO CARD */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E53E24]">
              LEADERSHIP SPOTLIGHT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              The Founder’s Vision
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#FFF7ED]/40 to-white dark:from-[#111827] dark:via-gray-900 dark:to-[#111827] border-2 border-[#E53E24]/30 p-8 sm:p-12 shadow-xl">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E53E24]/15 to-transparent rounded-bl-full pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Founder Avatar & Quick Badges */}
              <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#E53E24] to-[#F97316] opacity-75 blur group-hover:opacity-100 transition duration-300" />
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80"
                    alt="Rashad Shaik - Founder"
                    className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover border-2 border-white dark:border-gray-800 shadow-2xl"
                  />
                  <div className="absolute -bottom-2 inset-x-4 py-1 rounded-full bg-[#E53E24] text-white text-[11px] font-bold shadow-md">
                    Founder & Lead Architect
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-2xl font-black text-[#111827] dark:text-white">
                    Rashad Shaik
                  </h3>
                  <p className="text-xs text-[#4B5563] dark:text-gray-400 font-mono mt-0.5">
                    Information Technology &bull; GVPCE
                  </p>
                </div>

                {/* Social Connects */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-soft-peach dark:border-gray-700 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] transition-all shadow-xs"
                    title="GitHub Profile"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-soft-peach dark:border-gray-700 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] transition-all shadow-xs"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:founder@openforge.gvpce.ac.in"
                    className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-soft-peach dark:border-gray-700 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] transition-all shadow-xs"
                    title="Email"
                  >
                    <Terminal className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Founder Story & Quote */}
              <div className="lg:col-span-8 space-y-6 text-left">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30">
                    <Quote className="w-3.5 h-3.5" />
                    <span>In His Words</span>
                  </div>

                  <blockquote className="text-base sm:text-xl font-medium text-[#111827] dark:text-gray-100 leading-relaxed italic">
                    "We didn’t just want another student club that hosts talks. We built OpenForge as a software-powered platform where any student can turn a late-night idea into a working reality. Technology becomes exhilarating when you see 300 peers running across campus testing software you forged yourself."
                  </blockquote>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed">
                  <p>
                    OpenForge started with a clean sheet of paper in late 2024 to modernize how GVPCE students engage with tech events. Traditional paper manifests, lost registration emails, and disconnected club databases were replaced with an end-to-end digital suite featuring automated roll decoding, real-time camera scanning, and collaborative community boards.
                  </p>
                  <p>
                    Today, the platform serves as an incubator for engineers across every year and department—turning college life into a launchpad for future founders, full-stack developers, and technical leaders.
                  </p>
                </div>

                {/* Key Accomplishments Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white dark:bg-gray-800/80 border border-soft-peach dark:border-gray-700">
                    <div className="text-xl font-black text-[#E53E24]">300+</div>
                    <div className="text-[11px] text-[#4B5563] dark:text-gray-400 font-medium">Students Enrolled</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-gray-800/80 border border-soft-peach dark:border-gray-700">
                    <div className="text-xl font-black text-[#F97316]">100%</div>
                    <div className="text-[11px] text-[#4B5563] dark:text-gray-400 font-medium">Student Built</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-gray-800/80 border border-soft-peach dark:border-gray-700 col-span-2 sm:col-span-1">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">4.9 ★</div>
                    <div className="text-[11px] text-[#4B5563] dark:text-gray-400 font-medium">Average Event Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. MILESTONE TIMELINE (VIRAL SHERLOCK HIGHLIGHT) */}
        {/* ======================================================== */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E53E24]">
              JOURNEY & IMPACT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Milestones that Shaped OpenForge
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-400 max-w-xl mx-auto">
              How a student-initiated project turned into campus's fastest-growing technical movement.
            </p>
          </div>

          <div className="relative border-l-2 border-[#E53E24]/30 ml-4 sm:ml-8 space-y-10 pl-6 sm:pl-10">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node marker */}
                <div
                  className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full border-4 ${
                    item.highlight
                      ? 'bg-[#E53E24] border-white dark:border-[#111827] shadow-lg shadow-[#E53E24]/40 scale-125 animate-pulse'
                      : 'bg-white dark:bg-gray-800 border-[#E53E24]'
                  }`}
                />

                <div
                  className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
                    item.highlight
                      ? 'bg-gradient-to-r from-orange-50/70 via-white to-orange-50/40 dark:from-[#111827] dark:via-orange-950/20 dark:to-[#111827] border-2 border-[#E53E24] shadow-xl'
                      : 'bg-white dark:bg-[#111827] border-soft-peach dark:border-gray-800 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        item.highlight
                          ? 'bg-[#E53E24] text-white shadow-xs'
                          : 'bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] border border-[#E53E24]/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                    <span className="text-xs font-semibold text-[#4B5563] dark:text-gray-400">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white mt-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed mt-2">
                    {item.description}
                  </p>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F97316] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{item.tag}</span>
                    </span>

                    {item.highlight && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Campus Milestone
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. CORE VALUES / THREE PILLARS */}
        {/* ======================================================== */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E53E24]">
              THE FOUNDATIONAL ETHOS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Built on 3 Core Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-sm space-y-4 hover:border-[#E53E24]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] flex items-center justify-center shadow-xs">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#111827] dark:text-white">
                Learn by Shipping
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed">
                Reading tutorials will only get you so far. At OpenForge, we believe true mastery happens when your code is tested by hundreds of real users.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-sm space-y-4 hover:border-[#F97316]/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-gray-800 text-[#F97316] flex items-center justify-center shadow-xs">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#111827] dark:text-white">
                Open Source & Shared Growth
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed">
                We believe in open code, public roadmaps, and mentoring junior engineers so the flame is continually passed forward to future batches.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-sm space-y-4 hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-gray-800 text-purple-600 flex items-center justify-center shadow-xs">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#111827] dark:text-white">
                Flawless Execution
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed">
                From micro-animations to QR terminal responsiveness, we don't settle for mediocre minimum viable products. Excellence is standard.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
