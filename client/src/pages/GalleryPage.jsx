import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Calendar,
  MapPin,
  Loader2,
  FolderOpen,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { getEvents } from '../api';

export default function GalleryPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live events list (1 entry per event)
  const fetchLiveGallery = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      const eventList = res.data?.data || res.data || [];
      setEvents(eventList);
    } catch (err) {
      console.error('Failed to load gallery events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveGallery();
  }, [fetchLiveGallery]);

  // 2. Dynamic Category Pills
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(events.map((e) => e.category).filter(Boolean)));
    return [
      { id: 'all', label: 'All Highlights' },
      ...uniqueCats.map((cat) => ({ id: cat.toLowerCase(), label: cat })),
    ];
  }, [events]);

  // 3. Filter events
  const filteredEvents = useMemo(() => {
    if (activeCategory === 'all') return events;
    return events.filter((e) => (e.category || '').toLowerCase() === activeCategory);
  }, [events, activeCategory]);

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-24 transition-colors duration-200">
      {/* Header Banner */}
      <section className="relative overflow-hidden py-16 sm:py-20 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] border border-[#E53E24]/30 uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Campus Media Archives &bull; Department of IT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#111827] dark:text-white">
            Moments & Milestones
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Select an event album below to explore all documented captures from our technical workshops, hackathons, and symposiums.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
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

      {/* Album Grid (1 Card = 1 Event Album) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#4B5563]">
            <Loader2 className="w-8 h-8 animate-spin text-[#E53E24] mb-3" />
            <p className="text-sm font-semibold">Loading albums...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((event) => {
              // Count all photos in the album
              const totalPhotos =
                event.galleryImages && event.galleryImages.length > 0
                  ? event.galleryImages.length
                  : event.bannerImage
                  ? 1
                  : 0;

              // Use first gallery photo or banner as cover image
              const coverPhoto =
                event.galleryImages?.[0]?.url ||
                (typeof event.galleryImages?.[0] === 'string' ? event.galleryImages[0] : null) ||
                event.bannerImage ||
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';

              return (
                <div
                  key={event._id}
                  onClick={() => navigate(`/gallery/${event._id}`)}
                  className="group relative bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-2xl hover:border-[#E53E24]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-soft-peach/40 dark:bg-gray-800">
                    <img
                      src={coverPhoto}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Category & Photo Count Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold text-white bg-black/60 border border-white/20 backdrop-blur-md">
                        {event.category || 'Event'}
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-[#E53E24] flex items-center gap-1 shadow-md">
                        <Layers className="w-3 h-3" />
                        <span>
                          {totalPhotos} {totalPhotos === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </span>
                    </div>

                    {/* Event Title & Metadata */}
                    <div className="absolute bottom-3 inset-x-3 space-y-1 text-white">
                      <h3 className="font-extrabold text-base line-clamp-1 group-hover:text-[#F97316] transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-gray-200">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                          {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBA'}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                          {event.venue || 'GVPCE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-[#111827] flex items-center justify-between border-t border-soft-peach dark:border-gray-800">
                    <span className="text-xs text-[#4B5563] dark:text-gray-400">
                      Open album
                    </span>
                    <span className="text-xs font-bold text-[#E53E24] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Album</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 space-y-3">
            <FolderOpen className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold">No event albums found</h3>
          </div>
        )}
      </section>
    </div>
  );
}