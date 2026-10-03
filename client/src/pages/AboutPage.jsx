import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Target,
  Rocket,
  Code2,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { LinkedinIcon } from '../components/SocialIcons';

export default function AboutPage() {
  const founders = [
    {
      name: 'Sahithi Burada',
      role: 'Founder, Open Forge Club',
      batch: 'Batch of 2022–2026',
      department: 'Department of Information Technology, GVPCE',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      badgeColor: 'bg-[#E53E24] text-white',
      borderColor: 'border-[#E53E24]/30',
      description:
        'Established Open Forge to create an open platform where GVPCE students build, deploy, and collaborate on real-world software solutions and campus initiatives.',
      linkedin: 'https://linkedin.com',
    },
    {
      name: 'Prasanthi Vegi',
      role: 'Founder, Algorythm Club',
      batch: 'Batch of 2022–2026',
      department: 'Department of Information Technology, GVPCE',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      badgeColor: 'bg-[#F97316] text-white',
      borderColor: 'border-[#F97316]/30',
      description:
        'Established Algorythm to inspire a culture of competitive problem-solving, algorithms, and technical mastery among students across campus.',
      linkedin: 'https://linkedin.com',
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
            <span>Campus Innovation &bull; GVPCE (A)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#111827] dark:text-white leading-[1.1]">
            Where Code Meets Campus.
          </h1>

          <p className="text-base sm:text-lg text-[#4B5563] dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Open Forge is the student-driven technical society under the Department of Information Technology at Gayatri Vidya Parishad College of Engineering (Autonomous). We create platforms, hackathons, and software experiences that empower students to build real systems.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/team"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#E53E24] hover:bg-[#CB321A] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore The Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/community"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-white dark:bg-gray-800 text-[#111827] dark:text-white border border-soft-peach dark:border-gray-700 hover:border-[#E53E24] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-[#E53E24]" />
              <span>Join Discussions</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* ======================================================== */}
        {/* 2. FOUNDERS SPOTLIGHT */}
        {/* ======================================================== */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E53E24]">
              FOUNDING LEADERSHIP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              The Visionaries Behind Our Roots
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-400 max-w-xl mx-auto">
              Initiated by visionary seniors from the 2022–2026 batch to establish a culture of technical creation and competitive algorithms at GVPCE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border-2 ${founder.borderColor} p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={founder.avatar}
                      alt={founder.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-md shrink-0"
                    />

                    <div className="space-y-1">
                      <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${founder.badgeColor}`}>
                        {founder.batch}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-white">
                        {founder.name}
                      </h3>
                      <p className="text-xs font-bold text-[#E53E24]">
                        {founder.role}
                      </p>
                      <p className="text-[11px] text-[#4B5563] dark:text-gray-400">
                        {founder.department}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed">
                    {founder.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Club Founder &bull; 2022–2026
                  </span>

                  {founder.linkedin && (
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-soft-peach/60 dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 hover:text-[#E53E24] transition-colors"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. ABOUT OPEN FORGE CLUB */}
        {/* ======================================================== */}
        <section className="bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>About Open Forge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white">
              The Platform for Student Builders
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed">
              Open Forge operates as an open technical ecosystem focused on moving engineering beyond routine classroom lectures. It brings together web developers, AI enthusiasts, software designers, and problem solvers to build real software used by students on campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-[#FFF7ED]/50 dark:bg-gray-800/50 border border-soft-peach dark:border-gray-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] dark:bg-gray-800 text-[#E53E24] flex items-center justify-center shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#111827] dark:text-white">
                Hands-On Engineering
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
                We believe engineering begins with shipping real applications. Members design, code, and deploy functional tools for real events.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-orange-50/50 dark:bg-gray-800/50 border border-soft-peach dark:border-gray-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-gray-800 text-[#F97316] flex items-center justify-center shadow-xs">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#111827] dark:text-white">
                Peer Mentorship
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
                Knowledge shouldn't remain isolated. Seniors guide juniors through modern stacks, Git workflows, and competitive problem solving.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-gray-800/50 border border-soft-peach dark:border-gray-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-gray-800 text-purple-600 flex items-center justify-center shadow-xs">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#111827] dark:text-white">
                Campus-Scale Events
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
                From interactive hackathons and bootcamps to deduction tournaments, Open Forge organizes engaging events for the college.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}