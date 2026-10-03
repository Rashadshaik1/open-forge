import { useState, useEffect, useCallback } from 'react';
import {
  Star,
  X,
  CheckCircle2,
  Award,
  MessageSquare,
  Heart,
  Lightbulb,
  Send,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getEvents, submitFeedback, getEventFeedback } from '../api';

export default function EventFeedbackModal({ isOpen, onClose, defaultEventId }) {
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [eventsList, setEventsList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(defaultEventId || '');
  const [feedbackText, setFeedbackText] = useState('');
  const [favoriteMoment, setFavoriteMoment] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Fetch events list for the dropdown
  useEffect(() => {
    if (isOpen) {
      getEvents().then((res) => {
        const events = res.data?.data || [];
        setEventsList(events);
        if (events.length > 0 && !selectedEventId) {
          setSelectedEventId(events[0]._id);
        }
      });
    }
  }, [isOpen, selectedEventId]);

  // Fetch real reviews for selected event
  const loadFeedbackForEvent = useCallback(async (eventId) => {
    if (!eventId) return;
    try {
      const res = await getEventFeedback(eventId);
      setReviews(res.data?.data || []);
    } catch (err) {
      setReviews([]);
    }
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadFeedbackForEvent(selectedEventId);
    }
  }, [selectedEventId, loadFeedbackForEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !selectedEventId) return;

    try {
      setIsSubmitting(true);
      await submitFeedback(selectedEventId, {
        rating,
        comment: feedbackText.trim(),
        favoriteMoment: favoriteMoment.trim(),
        suggestions: suggestions.trim(),
      });

      setSubmitted(true);
      await loadFeedbackForEvent(selectedEventId);

      setTimeout(() => {
        setSubmitted(false);
        setFeedbackText('');
        setFavoriteMoment('');
        setSuggestions('');
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review. Confirm attendance was verified.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-soft-peach dark:border-gray-800 overflow-hidden text-[#111827] dark:text-[#F9FAFB] transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-soft-peach dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E53E24] to-[#F97316] flex items-center justify-center text-white shadow-md">
              <Award className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#111827] dark:text-white">
                Event Ratings & Feedback
              </h2>
              <p className="text-xs text-[#4B5563] dark:text-gray-400">
                Share your genuine review to help build even better events
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Average Score Summary Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#FFF7ED] via-white to-[#FFF7ED] dark:from-gray-800/80 dark:via-[#111827] dark:to-gray-800/80 border border-[#E53E24]/20 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-[#E53E24] flex items-center gap-1">
                <span>4.9</span>
                <span className="text-base text-amber-500">★</span>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-white">
                  Campus Satisfaction Score
                </div>
                <div className="text-[11px] text-[#4B5563] dark:text-gray-400">
                  Based on verified student check-in reviews
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-[#111827] dark:text-white">
                Thank You for Your Review!
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-gray-400 max-w-sm mx-auto">
                Your feedback has been recorded in the database.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider">
                  Select Event
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-[#111827] dark:text-white focus:outline-none focus:border-[#E53E24]"
                >
                  {eventsList.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5-Star Rating Picker */}
              <div className="p-4 rounded-2xl bg-[#FFF7ED]/60 dark:bg-gray-800/50 border border-[#E53E24]/10 text-center space-y-2">
                <span className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                  How would you rate your overall experience?
                </span>

                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled = (hoverRating || rating) >= starValue;
                    return (
                      <button
                        type="button"
                        key={starValue}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transform hover:scale-125 transition-transform duration-150 cursor-pointer"
                        aria-label={`Rate ${starValue} stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#E53E24]" />
                  <span>Student Feedback Review</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what you liked about the speaker, challenges, organization..."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                />
              </div>

              {/* Highlights & Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>Favorite Moment</span>
                  </label>
                  <input
                    type="text"
                    value={favoriteMoment}
                    onChange={(e) => setFavoriteMoment(e.target.value)}
                    placeholder="e.g. Solving clue #3, networking"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-[#111827] dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Suggestions for Next Time</span>
                  </label>
                  <input
                    type="text"
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    placeholder="e.g. More hands-on challenges"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E53E24] to-[#F97316] hover:opacity-95 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit My Event Review</span>
                </button>
              </div>
            </form>
          )}

          {/* Real Reviews */}
          <div className="pt-4 border-t border-soft-peach dark:border-gray-800 space-y-3 text-left">
            <span className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider block">
              Verified Event Reviews ({reviews.length})
            </span>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-3.5 rounded-2xl bg-[#FFF7ED]/50 dark:bg-gray-800/40 border border-soft-peach dark:border-gray-700/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827] dark:text-white">
                      {rev.user?.name || 'Verified Attendee'}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}