import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { getEvents } from '../api';
import api from '../api/axios';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [userLiked, setUserLiked] = useState({});

  // 1. Fetch live events from your actual MongoDB database
  const fetchLiveGallery = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      const events = res.data?.data || [];

      // Transform real MongoDB events into gallery photo cards
      const mappedItems = events.map((event) => ({
        _id: event._id,
        category: (event.category || 'Event').toLowerCase(),
        rawCategory: event.category || 'Campus Event',
        title: event.title,
        caption: event.description || 'OpenForge campus technical event.',
        date: event.eventDate
          ? new Date(event.eventDate).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Date TBA',
        venue: event.venue || 'GVPCE Campus',
        image:
          event.bannerImage ||
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        registeredCount: event.registeredCount || 0,
        photographer: 'OpenForge Media Cell',
      }));

      setGalleryItems(mappedItems);

      // Load initial likes from localStorage or defaults
      const savedLikes = JSON.parse(localStorage.getItem('openforge_gallery_likes') || '{}');
      const initialLikes = {};
      mappedItems.forEach((item) => {
        initialLikes[item._id] = savedLikes[item._id] ?? (item.registeredCount + 12);
      });
      setLikes(initialLikes);
    } catch (err) {
      console.error('Failed to load gallery events from backend:', err);
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveGallery();
  }, [fetchLiveGallery]);

  // 2. Build Category Pills dynamically from actual database categories
  const categories = useMemo(() => {
    const uniqueCats = Array.from(
      new Set(galleryItems.map((item) => item.rawCategory).filter(Boolean))
    );

    const dynamicPills = uniqueCats.map((catName) => ({
      id: catName.toLowerCase(),
      label: catName,
    }));

    return [{ id: 'all', label: 'All Moments' }, ...dynamicPills];
  }, [galleryItems]);

  // 3. Filter items for grid display
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [galleryItems, activeCategory]);

  // 4. Handle Likes
  const handleLike = (e, id) => {
    e.stopPropagation();
    const isCurrentlyLiked = !!userLiked[id];
    const newCount = (likes[id] || 0) + (isCurrentlyLiked ? -1 : 1);

    setUserLiked((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));
    setLikes((prev) => {
      const updated = { ...prev, [id]: newCount };
      localStorage.setItem('openforge_gallery_likes', JSON.stringify(updated));
      return updated;
    });
  };

  // 5. Lightbox Controls
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

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
      {/* 1. PAGE HEADER */}
      <section className="relative overflow-hidden py-16 sm:py-20 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-[#E53E24]/10 via-[#F97316]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30 uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-[#E53E24]" />
            <span>Visual Archives &bull; Live Event Highlights</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] dark:text-white">
            Moments & Milestones
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Live archives and visual highlights of campus hackathons, workshops, and student initiatives at GVPCE.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-[#4B5563] dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#E53E24]" />
              <strong className="text-[#111827] dark:text-white font-bold">{galleryItems.length}</strong> Live Events
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">&bull;</span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#F97316]" />
              <strong className="text-[#111827] dark:text-white font-bold">100%</strong> Live Database Records
            </span>
          </div>

          {/* Dynamic Filter Pills */}
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
              {categories.find((c) => c.id === activeCategory)?.label || 'All Moments'}
            </h2>
            <p className="text-xs text-[#4B5563] dark:text-gray-400 mt-0.5">
              Showing {filteredItems.length} live records &bull; Click any card for full view
            </p>
          </div>

          <span className="text-xs font-semibold text-[#E53E24] hidden sm:inline-flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" />
            Fullscreen Lightbox Enabled
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#4B5563]">
            <Loader2 className="w-8 h-8 animate-spin text-[#E53E24] mb-3" />
            <p className="text-sm font-semibold">Loading live event photos...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, index) => {
              const itemId = item._id;
              const isLiked = !!userLiked[itemId];
              const count = likes[itemId] ?? 0;

              return (
                <div
                  key={itemId}
                  onClick={() => openLightbox(index)}
                  className="group relative bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-2xl hover:border-[#E53E24]/40 dark:hover:border-[#E53E24]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-soft-peach/40 dark:bg-gray-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-[#E53E24] to-[#F97316] shadow-md backdrop-blur-xs">
                        {item.rawCategory}
                      </span>

                      <button
                        onClick={(e) => handleLike(e, itemId)}
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
                        <span className="text-[11px] font-bold pr-0.5">{count}</span>
                      </button>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="px-4 py-2 rounded-full bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md text-xs font-bold text-[#111827] dark:text-white shadow-xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Maximize2 className="w-3.5 h-3.5 text-[#E53E24]" />
                        <span>View Fullscreen</span>
                      </div>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 space-y-1 text-white">
                      <h3 className="font-extrabold text-base leading-snug drop-shadow-sm group-hover:text-[#F97316] transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-3 text-[11px] text-gray-200">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                          {item.date}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                          {item.venue}
                        </span>
                      </div>
                    </div>
                  </div>

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
        ) : (
          <div className="py-16 text-center bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 space-y-3">
            <FolderOpen className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-[#111827] dark:text-white">No live events found</h3>
            <p className="text-xs text-[#4B5563] dark:text-gray-400">
              Create events in the Admin Panel to populate this live gallery.
            </p>
          </div>
        )}
      </section>

      {/* 3. LIGHTBOX MODAL */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
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
                onClick={(e) => handleLike(e, activePhoto._id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  userLiked[activePhoto._id]
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    userLiked[activePhoto._id] ? 'fill-white text-white' : ''
                  }`}
                />
                <span>{likes[activePhoto._id] || 0} Likes</span>
              </button>

              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title="Close Lightbox (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
            title="Previous (Arrow Left)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
            title="Next (Arrow Right)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[88vh] flex flex-col rounded-3xl overflow-hidden bg-[#111827] border border-gray-800 shadow-2xl z-10"
          >
            <div className="relative flex-1 bg-black/60 flex items-center justify-center max-h-[64vh] overflow-hidden">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="max-h-[64vh] w-auto max-w-full object-contain select-none"
              />
            </div>

            <div className="p-5 sm:p-6 bg-[#111827] text-white border-t border-gray-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#E53E24] to-[#F97316]">
                    {activePhoto.rawCategory}
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