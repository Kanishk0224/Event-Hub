import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventHub } from '../context/EventHubContext';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  Award,
  Bookmark,
  Sparkles,
  ArrowRight,
  Ticket,
  AlertCircle,
  Globe2,
  MapPin
} from 'lucide-react';

export const EventCard = ({ event, onSelectEvent, onRegisterClick }) => {
  const navigate = useNavigate();
  const {
    bookmarks,
    toggleBookmark,
    registrations,
    currentUser,
    setSelectedTicket,
    setTicketModalOpen,
    setSelectedEventForModal,
    setRegisterModalOpen,
    openRegisterModal,
    openTicketModal
  } = useEventHub();

  if (!event) return null;

  const eventId = event.id || event._id || event.slug;
  const isBookmarked = bookmarks.includes(eventId) || bookmarks.includes(event.id);

  // Check user registration
  const userRegistration = registrations.find(
    r => (r.eventId === eventId || r.eventId === event.id || r.eventId === event._id) && currentUser && r.userId === currentUser.id && r.status !== 'cancelled'
  );

  const isFull = (event.registeredCount || 0) >= (event.maxCapacity || 100);
  const capacityPercent = Math.min(100, Math.round(((event.registeredCount || 0) / (event.maxCapacity || 100)) * 100));

  // Determine progress bar styling
  let progressBg = 'bg-emerald-500';
  let progressText = 'text-emerald-600 dark:text-emerald-400';
  if (capacityPercent >= 90) {
    progressBg = 'bg-rose-500';
    progressText = 'text-rose-600 dark:text-rose-400';
  } else if (capacityPercent >= 70) {
    progressBg = 'bg-amber-500';
    progressText = 'text-amber-600 dark:text-amber-400';
  }

  const handleCardClick = () => {
    if (onSelectEvent) {
      onSelectEvent(event);
    } else {
      navigate(`/events/${eventId}`);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    if (onSelectEvent) {
      onSelectEvent(event);
    } else {
      navigate(`/events/${eventId}`);
    }
  };

  const handleRegisterButtonClick = (e) => {
    e.stopPropagation();
    if (onRegisterClick) {
      onRegisterClick(event);
    } else {
      if (openRegisterModal) {
        openRegisterModal(event);
      } else {
        setSelectedEventForModal(event);
        setRegisterModalOpen(true);
      }
    }
  };

  const handlePassClick = (e) => {
    e.stopPropagation();
    if (userRegistration) {
      if (openTicketModal) {
        openTicketModal(userRegistration);
      } else {
        setSelectedTicket(userRegistration);
        setTicketModalOpen(true);
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleCardClick}
      className="group glass-card flex flex-col overflow-hidden cursor-pointer hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 bg-white dark:bg-slate-900 transition-all duration-300 relative"
    >
      {/* Banner Image with Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80'}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-lg bg-slate-900/80 backdrop-blur-md text-white border border-white/15">
              {event.categoryLabel || event.category || 'Event'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/90 backdrop-blur-md text-slate-800 dark:bg-slate-900/90 dark:text-slate-200 border border-white/20 flex items-center gap-1">
              {event.mode === 'Online' ? <Globe2 size={11} /> : <MapPin size={11} />}
              <span>{event.mode || 'Hybrid'}</span>
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(event.id);
            }}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Event'}
            className="pointer-events-auto p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md text-white border border-white/20 transition-transform active:scale-90"
          >
            <Bookmark
              size={14}
              className={isBookmarked ? 'fill-indigo-400 text-indigo-400' : 'text-white'}
            />
          </button>
        </div>

        {/* Featured Spotlight Badge */}
        {event.isFeatured && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 rounded-lg backdrop-blur-md shadow-xs">
            <Sparkles size={12} className="animate-spin text-amber-400" />
            <span>Featured Spotlight</span>
          </div>
        )}

        {/* Start Date Pill */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900/80 border border-white/10 rounded-lg backdrop-blur-md">
          {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Upcoming'}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Organizer Header */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={event.organizer?.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80'}
              alt={event.organizer?.name || 'Organizer'}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[180px]">
              {event.organizer?.name || 'Authorized Host'}
            </span>
            {event.organizer?.verified && (
              <CheckCircle2 size={13} className="text-indigo-500 flex-shrink-0" />
            )}
          </div>

          {/* Title & Tagline */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {event.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.tagline || event.description}
          </p>

          {/* Meta Chips */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Award size={13} className="text-amber-500" />
              <span>
                {event.prizes && event.prizes.length > 0
                  ? event.prizes[0].prize?.split('+')[0]
                  : 'Certificates'}
              </span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Users size={13} className="text-indigo-500" />
              <span>{event.teamSize || 'Individual'}</span>
            </div>

            <div className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-bold ${
              event.isFree
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
            }`}>
              {event.isFree ? 'FREE' : `₹${event.price}`}
            </div>
          </div>
        </div>

        {/* Bottom Section: Progress Bar & Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Capacity Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold">
              <span className="text-slate-500 dark:text-slate-400">
                Seats: <strong className="text-slate-800 dark:text-slate-200">{event.registeredCount || 0}</strong> / {event.maxCapacity || 100}
              </span>
              <span className={progressText}>
                {isFull ? 'FULL' : `${capacityPercent}% filled`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${progressBg} rounded-full transition-all duration-500`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
            {isFull && event.allowWaitlist && (
              <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                <AlertCircle size={11} />
                <span>Waitlist active ({event.waitlistCount || 0} in queue)</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {userRegistration ? (
              <button
                type="button"
                onClick={handlePassClick}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                  userRegistration.status === 'waitlist'
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <Ticket size={14} />
                <span>
                  {userRegistration.status === 'waitlist'
                    ? `Waitlist (#${userRegistration.waitlistPosition || 1})`
                    : 'View Digital Pass'}
                </span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDetailsClick}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-center cursor-pointer"
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={handleRegisterButtonClick}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isFull
                      ? event.allowWaitlist
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/25'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'btn-primary !py-2 !px-3'
                  }`}
                >
                  <span>{isFull ? (event.allowWaitlist ? 'Join Waitlist' : 'Full') : 'Register'}</span>
                  <ArrowRight size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Skeleton version for seamless loading states
export const EventCardSkeleton = () => (
  <div className="glass-card animate-pulse bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
    <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-slate-800" />
    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  </div>
);

export default EventCard;
