import { useState, useEffect } from 'react';
import { Search, Calendar, Filter, Loader2, Sparkles } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getEvents } from '../api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const res = await getEvents();
        setEvents(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === 'all' || evt.category?.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-24 transition-colors duration-200">
      {/* Header Banner */}
      <section className="relative overflow-hidden py-16 sm:py-20 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Challenges & Workshops</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111827] dark:text-white">
            Explore OpenForge Events
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover upcoming hackathons, tech bootcamps, and campus problem-solving tournaments organized by Open Forge and Algorythm.
          </p>

          {/* Search & Filter Bar */}
          <div className="pt-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events by title, keyword, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-soft-peach/40 dark:bg-gray-800 border border-soft-peach dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53E24] text-[#111827] dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-soft-peach/40 dark:bg-gray-800 border border-soft-peach dark:border-gray-700 text-sm font-semibold focus:outline-none text-[#111827] dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="hackathon">Hackathons</option>
                <option value="workshop">Workshops</option>
                <option value="bootcamp">Bootcamps</option>
                <option value="contest">Contests</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-[#4B5563]">
            <Loader2 className="w-10 h-10 animate-spin text-[#E53E24] mb-3" />
            <p className="text-sm font-semibold">Loading live campus events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 space-y-3">
            <Calendar className="w-12 h-12 text-[#E53E24] mx-auto opacity-70" />
            <h3 className="text-lg font-bold text-[#111827] dark:text-white">
              No events found
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-400">
              {searchQuery
                ? `No events match "${searchQuery}". Try a different keyword.`
                : 'Stay tuned! New events will appear here once announced.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}