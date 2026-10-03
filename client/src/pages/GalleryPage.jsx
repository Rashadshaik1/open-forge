import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Calendar,
  MapPin,
  Flame,
  Award,
  Users,
  Search,
} from 'lucide-react';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null); // number | null
  const [likes, setLikes] = useState({
    1: 142,
    2: 189,
    3: 264,
    4: 115,
    5: 98,
    6: 176,
    7: 210,
    8: 133,
    9: 245,
  });
  const [userLiked, setUserLiked] = useState({});

  const categories = [
    { id: 'all', label: 'All Moments' },
    { id: 'sherlock', label: 'Sherlock: Digital Case' },
    { id: 'bootcamps', label: 'Bootcamps' },
    { id: 'club-day', label: 'Club Day' },
    { id: 'mixers', label: 'Community Mixers' },
  ];

  const galleryItems = [
    {
      id: 1,
      category: 'sherlock',
      title: 'Midnight Clue Decryption',
      caption:
        'Teams of student detectives deciphering base64 cryptographic coordinates in real-time during the campus-wide mystery challenge.',
      tag: 'Sherlock Flagship',
      tagColor: 'from-[#E53E24] to-[#F97316]',
      date: 'Oct 18, 2025',
      venue: 'Tech Block Concourse',
      photographer: 'GVPCE Media Cell • Sai Teja',
      image:
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      featured: true,
    },
    {
      id: 2,
      category: 'sherlock',
      title: 'Optical Checkpoint Terminal Station',
      caption:
        'Volunteer scanner checking in the fastest 2nd-year team after they decoded the puzzle clue hidden behind the mechanical workshop.',
      tag: 'Live Checkpoint',
      tagColor: 'from-amber-500 to-orange-500',
      date: 'Oct 18, 2025',
      venue: 'Open Air Amphitheatre',
      photographer: 'OpenForge Ops • Harshitha',
      image:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      featured: false,
    },
    {
      id: 3,
      category: 'sherlock',
      title: 'Master Cryptogram Auditorium Reveal',
      caption:
        'Over 300+ attendees witnessing the final master cipher unlocking on the mega projector screen.',
      tag: 'Mega Clue Reveal',
      tagColor: 'from-[#E53E24] to-red-600',
      date: 'Oct 18, 2025',
      venue: 'Main Auditorium',
      photographer: 'GVPCE Media Cell • Tarun K.',
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      featured: true,
    },
    {
      id: 4,
      category: 'sherlock',
      title: 'Trophy & Prize Ceremony',
      caption:
        'The victorious 4-member squad receiving their engraved OpenForge wooden cipher trophy and certificate of distinction.',
      tag: 'Award Ceremony',
      tagColor: 'from-yellow-500 to-amber-600',
      date: 'Oct 18, 2025',
      venue: 'Main Auditorium Stage',
      photographer: 'Student Council • Ananya',
      image:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      featured: false,
    },
    {
      id: 5,
      category: 'bootcamps',
      title: 'React & Vite Full-Stack Lab Sprint',
      caption:
        'Second-year coders building their first REST API backends and modern frontend web apps with Tailwind CSS in Lab 3.',
      tag: 'Hands-on Bootcamp',
      tagColor: 'from-blue-600 to-indigo-600',
      date: 'Nov 02, 2025',
      venue: 'Computing Lab 3',
      photographer: 'Tech Lead • Rashad',
      image:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      featured: false,
    },
    {
      id: 6,
      category: 'bootcamps',
      title: 'System Architecture & Git Deep Dive',
      caption:
        'Whiteboard breakdown of distributed microservices, Docker containers, and branch merge etiquette for hackathons.',
      tag: 'Architecture Sprint',
      tagColor: 'from-cyan-600 to-blue-600',
      date: 'Nov 03, 2025',
      venue: 'Seminar Hall 2',
      photographer: 'OpenForge Media',
      image:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      featured: false,
    },
    {
      id: 7,
      category: 'club-day',
      title: 'OpenForge Expo Booth & Demo Station',
      caption:
        'First-year students experiencing live interactive web passes and registering for the upcoming tech tracks at our club booth.',
      tag: 'Club Day Showcase',
      tagColor: 'from-emerald-600 to-teal-600',
      date: 'Sep 12, 2025',
      venue: 'Student Activity Concourse',
      photographer: 'PR Team • Rahul M.',
      image:
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
      featured: true,
    },
    {
      id: 8,
      category: 'mixers',
      title: 'Open Source Mentorship Circle',
      caption:
        'Senior students sharing GSoC guidance, open source pull request strategies, and portfolio advice under the campus tree quad.',
      tag: 'Peer Mentorship',
      tagColor: 'from-purple-600 to-pink-600',
      date: 'Nov 15, 2025',
      venue: 'Campus Lawn Garden',
      photographer: 'Community Lead • Sneha',
      image:
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
      featured: false,
    },
    {
      id: 9,
      category: 'mixers',
      title: 'Late-Night Hackathon Ideation',
      caption:
        'Fueling on passion and code: students drafting hardware IoT prototypes and web apps till sunrise before project demo day.',
      tag: '24h Hack Sprint',
      tagColor: 'from-[#E53E24] to-amber-500',
      date: 'Nov 22, 2025',
      venue: 'Incubation Center',
      photographer: 'GVPCE Media Cell',
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      featured: false,
    },
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleLike = (e, id) => {
    e.stopPropagation();
    setUserLiked((prev) => {
      const isCurrentlyLiked = !!prev[id];
      setLikes((likeCounts) => ({
        ...likeCounts,
        [id]: likeCounts[id] + (isCurrentlyLiked ? -1 : 1),
      }));
      return { ...prev, [id]: !isCurrentlyLiked };
    });
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

  // Prevent body scroll when lightbox is active
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxIndex]);

  const activePhoto = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-24 transition-colors duration-200">
      {/* 1. PAGE HEADER & HIGHLIGHTS */}
      <section className="relative overflow-hidden py-16 sm:py-20 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-[#E53E24]/10 via-[#F97316]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30 uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-[#E53E24]" />
            <span>Visual Archives &bull; OpenForge Campus Events</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] dark:text-white">
            Moments & Milestones
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Visual archives of OpenForge hackathons, hands-on engineering workshops, and campus deduction mysteries at GVPCE.
          </p>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-[#4B5563] dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E53E24]" />
              <strong className="text-[#111827] dark:text-white font-bold">500+</strong> Students Captured
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">&bull;</span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#F97316]" />
              <strong className="text-[#111827] dark:text-white font-bold">1,200+</strong> Clue Scans Verified
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">&bull;</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <strong className="text-[#111827] dark:text-white font-bold">9</strong> Flagship Highlights
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#E53E24] text-white shadow-md shadow-[#E53E24]/20 scale-105'
                    : 'bg-white dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 border border-soft-peach dark:border-gray-700 hover:border-[#E53E24] hover:text-[#E53E24]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between pb-6 border-b border-soft-peach dark:border-gray-800 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-white">
              {categories.find((c) => c.id === activeCategory)?.label}
            </h2>
            <p className="text-xs text-[#4B5563] dark:text-gray-400 mt-0.5">
              Showing {filteredItems.length} archival photographs &bull; Click any card for high-res preview
            </p>
          </div>

          <span className="text-xs font-semibold text-[#E53E24] hidden sm:inline-flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" />
            Fullscreen Lightbox Enabled
          </span>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => {
            const isLiked = !!userLiked[item.id];
            const likeCount = likes[item.id] || 0;

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#E53E24]/40 dark:hover:border-[#E53E24]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container with subtle hover zoom */}
                <div className="relative aspect-[4/3] overflow-hidden bg-soft-peach/40 dark:bg-gray-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient dark scrim for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${item.tagColor} shadow-md backdrop-blur-xs`}
                    >
                      {item.tag}
                    </span>

                    {/* Like / Heart Button */}
                    <button
                      onClick={(e) => handleLike(e, item.id)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 shadow-md ${
                        isLiked
                          ? 'bg-red-500 text-white scale-110'
                          : 'bg-black/40 text-white/90 hover:bg-black/60 hover:text-red-400'
                      }`}
                      title="Like photo"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isLiked ? 'fill-white text-white' : ''
                        }`}
                      />
                      <span className="text-[11px] font-bold pr-0.5">{likeCount}</span>
                    </button>
                  </div>

                  {/* Enlarge Indicator on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="px-4 py-2 rounded-full bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md text-xs font-bold text-[#111827] dark:text-white shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5 text-[#E53E24]" />
                      <span>View Fullscreen</span>
                    </div>
                  </div>

                  {/* Bottom Meta Overlay on Card Image */}
                  <div className="absolute bottom-3 inset-x-3 space-y-1 text-white">
                    <h3 className="font-extrabold text-base leading-snug drop-shadow-sm group-hover:text-[#F97316] transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-3 text-[11px] text-gray-200">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#F97316]" />
                        {item.date}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <MapPin className="w-3 h-3 text-[#F97316]" />
                        {item.venue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Description & Photographer Footer */}
                <div className="p-4 space-y-3 bg-white dark:bg-[#111827]">
                  <p className="text-xs text-[#4B5563] dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>

                  <div className="pt-2 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between text-[11px]">
                    <span className="text-[#4B5563] dark:text-gray-400 truncate max-w-[200px]">
                      {item.photographer}
                    </span>
                    <span className="text-[#E53E24] font-semibold group-hover:underline">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE FULLSCREEN LIGHTBOX MODAL */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white z-20 pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20">
                Photo {lightboxIndex + 1} of {filteredItems.length}
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-gray-300">
                {activePhoto.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleLike(e, activePhoto.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  userLiked[activePhoto.id]
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    userLiked[activePhoto.id] ? 'fill-white text-white' : ''
                  }`}
                />
                <span>{likes[activePhoto.id] || 0} Likes</span>
              </button>

              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                title="Close Lightbox (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-110"
            title="Previous (Arrow Left)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-110"
            title="Next (Arrow Right)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[88vh] flex flex-col rounded-3xl overflow-hidden bg-[#111827] border border-gray-800 shadow-2xl z-10"
          >
            {/* Main Image Frame */}
            <div className="relative flex-1 bg-black/60 flex items-center justify-center max-h-[64vh] overflow-hidden">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="max-h-[64vh] w-auto max-w-full object-contain select-none"
              />
            </div>

            {/* Lightbox Caption & Details Drawer */}
            <div className="p-5 sm:p-6 bg-[#111827] text-white border-t border-gray-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${activePhoto.tagColor}`}
                  >
                    {activePhoto.tag}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                    {activePhoto.date}
                  </span>
                  <span className="text-gray-500">&bull;</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                    {activePhoto.venue}
                  </span>
                </div>

                <div className="text-xs text-gray-400 font-mono">
                  {activePhoto.photographer}
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {activePhoto.title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-4xl">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
