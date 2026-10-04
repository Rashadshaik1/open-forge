import { Calendar, MapPin, Users, ArrowRight, Tag, Check, Clock, AlertCircle, Radio, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EventCard({ event, onRegister, isUserRegistered = false, effectiveStatus }) {
  const { user } = useAuth();

  if (!event) return null;

  const eventId = event._id || event.id;
  const registered = event.registeredCount ?? (event.attendees || 0);
  const totalCapacity = event.capacity ?? (event.maxAttendees || 100);
  const spotsLeft = Math.max(0, totalCapacity - registered);
  const percentFilled = Math.min(100, Math.round((registered / totalCapacity) * 100));

  // Determine Lifecycle Status (upcoming, ongoing, completed, cancelled)
  const now = new Date();
  const eventDateObj = event.eventDate ? new Date(event.eventDate) : null;
  const eventEndDateObj = event.eventEndDate
    ? new Date(event.eventEndDate)
    : eventDateObj
    ? new Date(eventDateObj.getTime() + 3 * 60 * 60 * 1000)
    : null;

  let computedStatus = effectiveStatus;
  if (!computedStatus) {
    if (event.status === 'cancelled') {
      computedStatus = 'cancelled';
    } else if (event.status === 'completed' || (eventEndDateObj && now > eventEndDateObj)) {
      computedStatus = 'completed';
    } else if (eventDateObj && now >= eventDateObj && eventEndDateObj && now <= eventEndDateObj) {
      computedStatus = 'ongoing';
    } else {
      computedStatus = 'upcoming';
    }
  }

  const isOngoing = computedStatus === 'ongoing';
  const isCompleted = computedStatus === 'completed';
  const isCancelled = computedStatus === 'cancelled';

  // Dynamic Deadline & Capacity checks
  const isPastDeadline = Boolean(
    event.registrationDeadline && now > new Date(event.registrationDeadline)
  );
  const isFull = registered >= totalCapacity;
  const isExplicitlyClosed = event.isRegistrationOpen === false;

  // Closed for new registrations if ongoing, completed, deadline passed, full, or manually closed
  const isClosed = isCancelled || isCompleted || isOngoing || isPastDeadline || isFull || isExplicitlyClosed;

  // Format Date and Time
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
    <div className={`group bg-white dark:bg-[#111827] rounded-3xl border ${
      isOngoing
        ? 'border-emerald-500/50 shadow-md shadow-emerald-500/10'
        : 'border-soft-peach dark:border-gray-800'
    } overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E53E24]/40 transition-all duration-300 flex flex-col justify-between`}>
      <div>
        {/* Card Header Banner */}
        <div className="relative h-48 bg-gradient-to-r from-[#E53E24] to-[#F97316] overflow-hidden flex items-end p-4">
          {event.bannerImage ? (
            <img
              src={event.bannerImage}
              alt={event.title}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                isCompleted ? 'grayscale contrast-125 opacity-75' : 'group-hover:scale-105'
              }`}
            />
          ) : (
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          )}

          {/* Top Left: Lifecycle Indicator Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5">
            {isOngoing && (
              <span className="px-3 py-1 text-xs font-black rounded-full bg-emerald-500 text-white flex items-center gap-1.5 shadow-md uppercase tracking-wider animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>Live Now</span>
              </span>
            )}

            {isCompleted && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-stone-900/90 text-stone-200 border border-stone-700/60 shadow-md backdrop-blur-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-stone-400" />
                <span>Completed</span>
              </span>
            )}

            {!isOngoing && !isCompleted && !isCancelled && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#F97316]" />
                <span>Upcoming</span>
              </span>
            )}
          </div>

          {/* Top Right: Category Tag */}
          <div className="absolute top-3.5 right-3.5 z-10">
            {event.category && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-white/95 dark:bg-gray-900/90 text-[#111827] dark:text-white flex items-center gap-1 shadow-xs backdrop-blur-xs">
                <Tag className="w-3 h-3 text-[#E53E24]" />
                {event.category}
              </span>
            )}
          </div>

          {/* Bottom Banner Bar */}
          <div className="relative z-10 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3 text-left">
          <h3 className="font-extrabold text-lg text-[#111827] dark:text-white group-hover:text-[#E53E24] transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="text-xs text-[#4B5563] dark:text-gray-300 line-clamp-2 leading-relaxed">
            {event.description || 'Join us for this exciting campus technology event at GVPCE.'}
          </p>

          <div className="space-y-1.5 pt-1 text-xs text-[#4B5563] dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#E53E24] shrink-0" />
              <span>{formattedDate}</span>
            </div>

            {formattedTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                <span>{formattedTime}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
              <span className="truncate">{event.venue || 'GVPCE Campus'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-0 border-t border-soft-peach dark:border-gray-800 space-y-3">
        {/* Attendees Meter */}
        <div className="pt-3">
          <div className="flex justify-between items-center text-xs text-[#4B5563] dark:text-gray-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#E53E24]" />
              <span className="font-bold text-[#111827] dark:text-white">{registered}</span> / {totalCapacity} participants
            </span>
            <span>
              {isFull ? (
                <span className="text-red-500 font-bold">Housefull</span>
              ) : isCompleted ? (
                <span className="text-gray-400 font-semibold">Ended</span>
              ) : (
                `${spotsLeft} spots left`
              )}
            </span>
          </div>

          <div className="w-full bg-soft-peach dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? 'bg-gray-400'
                  : isFull
                  ? 'bg-red-500'
                  : 'bg-gradient-to-r from-[#F97316] to-[#E53E24]'
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
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 shadow-2xs hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Pass Confirmed (View Pass)</span>
            </Link>
          ) : isCompleted ? (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
              <span>Event Concluded</span>
            </button>
          ) : isOngoing ? (
            <Link
              to={user ? "/dashboard" : "/login"}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Live in Session • Join/Verify</span>
            </Link>
          ) : isClosed ? (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center gap-1.5 cursor-not-allowed"
            >
              <AlertCircle className="w-4 h-4" />
              <span>
                {isCancelled
                  ? 'Event Cancelled'
                  : isFull
                  ? 'Registrations Full'
                  : 'Registration Closed'}
              </span>
            </button>
          ) : onRegister ? (
            <button
              type="button"
              onClick={() => onRegister(event)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#E53E24] hover:bg-[#CB321A] shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
            >
              <span>RSVP / Join Event</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link
              to={user ? "/dashboard" : "/login"}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#E53E24] hover:bg-[#CB321A] shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
            >
              <span>{user ? 'View & Register' : 'Sign In to Register'}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}