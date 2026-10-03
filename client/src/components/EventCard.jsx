import { Calendar, MapPin, Users, ArrowRight, Tag, Check, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EventCard({ event, onRegister, isUserRegistered = false }) {
  const { user } = useAuth();

  if (!event) return null;

  const eventId = event._id || event.id;
  const registered = event.registeredCount ?? (event.attendees || 0);
  const totalCapacity = event.capacity ?? (event.maxAttendees || 100);
  const spotsLeft = Math.max(0, totalCapacity - registered);
  const percentFilled = Math.min(100, Math.round((registered / totalCapacity) * 100));

  // Dynamic Deadline & Capacity checks
  const isPastDeadline = Boolean(
    event.registrationDeadline && new Date() > new Date(event.registrationDeadline)
  );
  const isPastEvent = Boolean(
    event.eventDate && new Date() > new Date(event.eventDate)
  );
  const isFull = registered >= totalCapacity;
  const isExplicitlyClosed = event.isRegistrationOpen === false;
  const isCancelled = event.status === 'cancelled';

  const isClosed = isCancelled || isPastEvent || isPastDeadline || isFull || isExplicitlyClosed;

  // Format Date and Time
  const eventDateObj = event.eventDate ? new Date(event.eventDate) : null;
  const formattedDate = eventDateObj
    ? eventDateObj.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Date TBA';

  const formattedTime = eventDateObj
    ? eventDateObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="group bg-white dark:bg-[#111827] rounded-2xl border border-soft-peach dark:border-gray-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-accent/40 dark:hover:border-accent/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Header Banner */}
        <div className="relative h-44 bg-gradient-to-r from-primary to-accent overflow-hidden flex items-end p-4">
          {event.bannerImage ? (
            <img
              src={event.bannerImage}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 z-10">
            {event.isPopular && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/95 dark:bg-gray-800/95 text-primary shadow-xs backdrop-blur-xs">
                Featured
              </span>
            )}
            {event.category && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/95 dark:bg-gray-800/95 text-[#111827] dark:text-white flex items-center gap-1 shadow-xs backdrop-blur-xs">
                <Tag className="w-3 h-3 text-accent" />
                {event.category}
              </span>
            )}
          </div>

          <div className="relative z-10 text-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-soft-peach bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-xs">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 text-left">
          <h3 className="font-bold text-lg text-[#111827] dark:text-white group-hover:text-primary transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="text-sm text-[#4B5563] dark:text-gray-300 line-clamp-2 leading-relaxed">
            {event.description || 'Join us for this exciting student-driven campus event.'}
          </p>

          <div className="space-y-1.5 pt-1 text-xs text-[#4B5563] dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>{formattedDate}</span>
            </div>

            {formattedTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span>{formattedTime}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span className="truncate">{event.venue || event.location || 'GVPCE Campus'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 border-t border-soft-peach/60 dark:border-gray-800 space-y-3">
        {/* Attendees Meter */}
        <div className="pt-3">
          <div className="flex justify-between items-center text-xs text-[#4B5563] dark:text-gray-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium text-[#111827] dark:text-white">{registered}</span> / {totalCapacity} seats
            </span>
            <span>
              {isFull ? (
                <span className="text-red-500 font-semibold">Housefull</span>
              ) : (
                `${spotsLeft} spots left`
              )}
            </span>
          </div>
          <div className="w-full bg-soft-peach dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? 'bg-red-500' : 'bg-gradient-to-r from-accent to-primary'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {isUserRegistered ? (
            <Link
              to="/dashboard"
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 shadow-2xs hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Registered (View Pass)</span>
            </Link>
          ) : isClosed ? (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <AlertCircle className="w-4 h-4" />
              <span>
                {isCancelled
                  ? 'Event Cancelled'
                  : isPastEvent
                  ? 'Event Concluded'
                  : isFull
                  ? 'Capacity Full'
                  : 'Registration Closed'}
              </span>
            </button>
          ) : onRegister ? (
            <button
              type="button"
              onClick={() => onRegister(event)}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
            >
              <span>RSVP / Join Event</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link
              to={user ? "/dashboard" : "/login"}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
            >
              <span>{user ? 'View & Register' : 'Sign in to Register'}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}