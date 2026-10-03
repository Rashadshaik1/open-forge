import { Calendar, MapPin, Users, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventCard({
  event = {
    id: 1,
    title: 'Open Source Community Summit 2026',
    description: 'Join developers, designers, and organizers from around the world to build high-impact open source tools.',
    date: 'Oct 24, 2026 • 10:00 AM',
    location: 'San Francisco, CA & Online',
    category: 'Conference',
    attendees: 142,
    maxAttendees: 200,
    isPopular: true,
  },
  onRegister,
}) {
  const percentFilled = Math.min(
    100,
    Math.round(((event.attendees || 0) / (event.maxAttendees || 100)) * 100)
  );

  return (
    <div className="group bg-surface rounded-2xl border border-soft-peach overflow-hidden shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Header Banner */}
        <div className="relative h-44 bg-gradient-to-r from-primary to-accent overflow-hidden flex items-end p-4">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          <div className="absolute top-3 right-3 flex gap-2">
            {event.isPopular && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-surface text-primary shadow-sm">
                Featured
              </span>
            )}
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-soft-peach text-text-dark flex items-center gap-1 shadow-sm">
              <Tag className="w-3 h-3 text-accent" />
              {event.category || 'Event'}
            </span>
          </div>
          <div className="relative z-10 text-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-soft-peach">
              {event.date}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-text-dark group-hover:text-primary transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-2 pt-2 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 border-t border-soft-peach/60 space-y-3">
        {/* Attendees Meter */}
        <div className="pt-3">
          <div className="flex justify-between items-center text-xs text-text-muted mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-text-dark" />
              <span className="font-medium text-text-dark">{event.attendees}</span> registered
            </span>
            <span>{percentFilled}% capacity</span>
          </div>
          <div className="w-full bg-soft-peach rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent to-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {onRegister ? (
            <button
              onClick={() => onRegister(event)}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group/btn"
            >
              <span>RSVP / Join Event</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group/btn"
            >
              <span>View & Register</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
