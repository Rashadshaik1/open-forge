import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  GitPullRequest,
  TrendingUp,
  Sparkles,
  Star,
  MessageSquare,
} from 'lucide-react';
import EventFeedbackModal from '../components/EventFeedbackModal';

export default function LandingPage() {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const upcomingEvents = [
    {
      id: 1,
      badge: 'Workshop',
      title: 'Build Your First Web App',
      date: 'Sat, Oct 18, 2025',
      time: '10:00 AM - 1:00 PM',
      venue: 'Lab 3, Tech Block',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      badge: 'Hackathon',
      title: 'OpenForge Hackathon 2025',
      date: 'Nov 01 - 02, 2025',
      time: '24 Hours Sprint',
      venue: 'Main Auditorium & Online',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      badge: 'Community',
      title: 'Student Leaders Mixer',
      date: 'Nov 15, 2025',
      time: '4:00 PM - 6:30 PM',
      venue: 'Open Air Amphitheatre',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const pillars = [
    {
      title: 'Learn',
      description: 'Gain new skills through workshops, talks and hands-on experiences.',
      icon: BookOpen,
    },
    {
      title: 'Contribute',
      description: 'Share your ideas, build solutions and make a real impact on campus.',
      icon: GitPullRequest,
    },
    {
      title: 'Connect',
      description: 'Meet like-minded peers, mentors and industry experts.',
      icon: Users,
    },
    {
      title: 'Grow',
      description: 'Expand your network, find mentors and unlock new opportunities.',
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
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Kicker */}
              <div className="text-xs sm:text-sm font-bold tracking-[0.28em] text-[#E53E24] uppercase">
                LEARN &nbsp;/&nbsp; CONTRIBUTE &nbsp;/&nbsp; GROW
              </div>

              {/* Title with distinct period on each line */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#111827] dark:text-white tracking-tight leading-[1.08]">
                Discover.
                <br />
                Participate.
                <br />
                Create.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#4B5563] dark:text-gray-300 leading-relaxed max-w-xl">
                OpenForge is a vibrant platform for students and tech enthusiasts to discover events, join communities, learn new skills, and build something meaningful.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#events"
                  className="rounded-full px-6 py-3 bg-[#E53E24] hover:bg-[#CB321A] text-white font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to="/register"
                  className="rounded-full px-6 py-3 bg-white dark:bg-gray-800 border border-[#E53E24]/30 hover:border-[#E53E24] text-[#E53E24] dark:text-white font-semibold flex items-center gap-2 hover:bg-soft-peach/60 dark:hover:bg-gray-700 shadow-xs transition-all duration-200"
                >
                  <Users className="w-4 h-4 text-[#E53E24]" />
                  <span>Join OpenForge</span>
                </Link>
              </div>
            </div>

            {/* Right Side Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Radial aura glow */}
              <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-tr from-[#E53E24]/25 via-[#F97316]/20 to-[#FFF7ED] dark:to-transparent rounded-[48%_52%_60%_40%/42%_45%_55%_58%] blur-3xl -z-10 animate-pulse" />

              {/* Organic curved/blob shaped container */}
              <div className="relative w-full max-w-md aspect-[4/3] rounded-[2.5rem_4rem_2.5rem_5rem] overflow-hidden border-2 border-[#E53E24]/20 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
                  alt="Auditorium tech conference crowd"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Overlay banner text: Build Innovate Together */}
                <div className="absolute bottom-5 inset-x-5 text-center">
                  <div className="inline-block px-5 py-2 rounded-full bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border border-white/40 dark:border-gray-700 shadow-lg">
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#E53E24] to-[#F97316] bg-clip-text text-transparent">
                      Build &bull; Innovate &bull; Together
                    </span>
                  </div>
                </div>

                {/* 3 small curved decorative orange accent marks at top-right */}
                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                  <svg className="w-12 h-12" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18 10 C 32 6, 46 8, 54 18"
                      stroke="#F97316"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M26 18 C 36 15, 46 17, 52 25"
                      stroke="#F97316"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M34 26 C 40 24, 46 26, 50 32"
                      stroke="#F97316"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UPCOMING EVENTS SECTION */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        {/* Header row: "Upcoming Events" on left and "View All Events ->" on right */}
        <div className="flex items-center justify-between border-b border-soft-peach dark:border-gray-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
            Upcoming Events
          </h2>
          <a
            href="#events"
            className="text-[#E53E24] hover:text-[#CB321A] text-sm sm:text-base font-semibold flex items-center gap-1 group transition-colors"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 3 Event Cards with image banners, clean borders, rounded-2xl */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-soft-peach dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E53E24]/40 dark:hover:border-[#E53E24]/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Event Image Banner */}
                <div className="relative h-48 overflow-hidden bg-soft-peach/60 dark:bg-gray-800">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF7ED] dark:bg-gray-800 text-[#F97316] border border-[#F97316]/20 shadow-xs">
                      {evt.badge}
                    </span>
                  </div>
                </div>

                {/* Event Card Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-[#111827] dark:text-white group-hover:text-[#E53E24] transition-colors line-clamp-1">
                    {evt.title}
                  </h3>

                  <div className="space-y-2 text-xs text-[#4B5563] dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#E53E24] shrink-0" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#F97316] shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Link: View Details -> */}
              <div className="p-5 pt-0">
                <Link
                  to="/login"
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#E53E24] hover:text-white border border-[#E53E24] hover:bg-[#E53E24] dark:hover:bg-[#E53E24] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* EVENT RATINGS & FEEDBACK HIGHLIGHT STRIP */}
        <div className="bg-gradient-to-r from-[#FFF7ED] via-white to-[#FFF7ED] dark:from-[#111827] dark:via-[#161F30] dark:to-[#111827] p-6 sm:p-8 rounded-3xl border border-[#F97316]/20 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E53E24] to-[#F97316] flex items-center justify-center text-white shadow-lg shrink-0">
              <Star className="w-7 h-7 fill-white text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1.5 border border-amber-500/20">
                <span>★ 4.9 / 5.0 Average Rating</span>
                <span>•</span>
                <span>180+ GVPCE Reviews</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white">
                Attended Sherlock or our Web Dev Bootcamps?
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-400 mt-1 max-w-lg">
                Share your experience, rate campus workshops, and help our board coordinate even better tech events for students.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="px-5 py-2.5 rounded-xl font-bold bg-[#E53E24] hover:bg-[#CB321A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Rate & Review</span>
            </button>
            <Link
              to="/community"
              className="px-5 py-2.5 rounded-xl font-semibold border border-gray-300 dark:border-gray-700 hover:border-[#E53E24] dark:hover:border-[#E53E24] text-[#111827] dark:text-white hover:text-[#E53E24] dark:hover:text-[#E53E24] bg-white dark:bg-gray-800 transition-all flex items-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Community</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHY OPENFORGE? / MORE THAN JUST EVENTS SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Subtitle + Heading + 2x2 Grid */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-[#E53E24]">
                WHY OPENFORGE?
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                More Than Just Events
              </h2>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-soft-peach dark:border-gray-800 shadow-xs hover:border-[#E53E24]/30 dark:hover:border-[#E53E24]/30 transition-all flex flex-col space-y-3"
                  >
                    {/* Circular solid orange/red container with clean white icon */}
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

          {/* Right Column: Clean Community / Stylized Flame Graphic on Soft Peach */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-3xl bg-soft-peach/60 dark:bg-[#111827] border border-soft-peach dark:border-gray-800 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
              {/* Ambient circular pulse */}
              <div className="absolute w-44 h-44 rounded-full bg-[#E53E24]/10 blur-2xl -z-0 animate-pulse" />

              {/* Official OpenForge Logo Badge */}
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

              {/* Floating Pill Badges */}
              <div className="relative z-10 flex flex-wrap justify-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 text-[#E53E24] border border-[#E53E24]/20 shadow-xs">
                  50+ Active Clubs
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 text-[#F97316] border border-[#F97316]/20 shadow-xs">
                  10k+ Builders
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 text-[#111827] dark:text-gray-200 border border-soft-peach dark:border-gray-700 shadow-xs">
                  Campus Mentorship
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E53E24] via-[#E53E24] to-[#F97316] p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold tracking-widest uppercase text-soft-peach">
              READY TO GET STARTED?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Join a community that builds the future.
            </h2>
          </div>

          {/* Right Action Button */}
          <a
            href="#events"
            className="px-7 py-3.5 rounded-full font-bold bg-white text-[#E53E24] hover:bg-soft-peach shadow-lg hover:shadow-xl transition-all duration-200 shrink-0 flex items-center gap-2 group"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* 5. EVENT FEEDBACK & RATING MODAL */}
      <EventFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </div>
  );
}
