import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Filter, Loader2, Sparkles, Radio, CheckCircle, Clock } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getEvents } from '../api';

// Helper function to resolve dynamic event lifecycle status
export const resolveEventStatus = (evt) => {
  if (evt.status === 'cancelled') return 'cancelled';

  const now = new Date();
  const startDate = new Date(evt.eventDate);
  // Default end time: 3 hours after start date if not explicitly specified
  const endDate = evt.eventEndDate
    ? new Date(evt.eventEndDate)
    : new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  if (now > endDate || evt.status === 'completed') {
    return 'completed';
  }
  if (now >= startDate && now <= endDate) {
    return 'ongoing';
  }
  return 'upcoming';
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'upcoming' | 'ongoing' | 'completed'

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        const res = await getEvents();
        const data = res.data?.data || res.data || [];
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  // Compute status counts for the lifecycle tabs
  const statusCounts = useMemo(() => {
    const counts = { all: events.length, upcoming: 0, ongoing: 0, completed: 0 };
    events.forEach((evt) => {
      const st = resolveEventStatus(evt);
      if (counts[st] !== undefined) {
        counts[st] += 1;
      }
    });
    return counts;
  }, [events]);

  // Combined filtering: Search Query + Lifecycle Status + Category
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const currentStatus = resolveEventStatus(evt);

      const matchesStatus =
        statusFilter === 'all' || currentStatus === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' ||
        evt.category?.toLowerCase() === categoryFilter.toLowerCase();

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        evt.title?.toLowerCase().includes(query) ||
        evt.description?.toLowerCase().includes(query) ||
        evt.venue?.toLowerCase().includes(query);

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [events, statusFilter, categoryFilter, searchQuery]);

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
            Discover upcoming hackathons, ongoing sessions, and past symposiums organized across the Department of IT at GVPCE.
          </p>

          {/* 1. Event Status Lifecycle Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Events', count: statusCounts.all, icon: Calendar },
              { id: 'ongoing', label: 'Live Now', count: statusCounts.ongoing, icon: Radio, pulse: true },
              { id: 'upcoming', label: 'Upcoming', count: statusCounts.upcoming, icon: Clock },
              { id: 'completed', label: 'Past / Completed', count: statusCounts.completed, icon: CheckCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = statusFilter === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#E53E24] text-white shadow-md shadow-[#E53E24]/20 scale-105'
                      : 'bg-white dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 border border-soft-peach dark:border-gray-700 hover:border-[#E53E24] hover:text-[#E53E24]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.pulse && isActive ? 'animate-pulse' : ''}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 px-2 py-0.2 rounded-full text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-soft-peach dark:bg-gray-700 text-[#4B5563] dark:text-gray-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Search & Category Bar */}
          <div className="pt-4 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-soft-peach/40 dark:bg-gray-800 border border-soft-peach dark:border-gray-700 text-sm font-semibold focus:outline-none text-[#111827] dark:text-white cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Workshop">Workshops</option>
                <option value="Hackathon">Hackathons</option>
                <option value="Coding Challenge">Coding Challenges</option>
                <option value="Bootcamp">Bootcamps</option>
                <option value="Meetup">Meetups</option>
                <option value="General">General</option>
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
              <EventCard 
                key={evt._id} 
                event={evt} 
                effectiveStatus={resolveEventStatus(evt)} 
              />
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
                ? `No events match "${searchQuery}" under the selected filter.`
                : 'No events found in this category or timeline yet.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}