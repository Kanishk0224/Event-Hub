import { useState, useEffect } from 'react';
import { useEventHub } from '../context/EventHubContext';
import { motion } from 'framer-motion';
import {
  X,
  Calendar,
  MapPin,
  Globe2,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Ticket,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';

export const EventDetailModal = ({ event, onClose, onRegisterClick }) => {
  const {
    bookmarks,
    toggleBookmark,
    registrations,
    currentUser,
    setSelectedTicket,
    setTicketModalOpen,
    showToast
  } = useEventHub();

  const [activeDetailTab, setActiveDetailTab] = useState('overview'); // 'overview' | 'schedule' | 'speakers' | 'faqs'
  const [expandedFaq, setExpandedFaq] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const isBookmarked = bookmarks.includes(event.id);
  const userRegistration = registrations.find(
    r => r.eventId === event.id && currentUser && r.userId === currentUser.id && r.status !== 'cancelled'
  );

  const isFull = event.registeredCount >= event.maxCapacity;
  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));

  let progressBg = 'bg-emerald-500';
  let progressText = 'text-emerald-600 dark:text-emerald-400';
  if (capacityPercent >= 90) {
    progressBg = 'bg-rose-500';
    progressText = 'text-rose-600 dark:text-rose-400';
  } else if (capacityPercent >= 70) {
    progressBg = 'bg-amber-500';
    progressText = 'text-amber-600 dark:text-amber-400';
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!');
    }
  };

  const handlePassView = () => {
    if (userRegistration) {
      setSelectedTicket(userRegistration);
      setTicketModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white backdrop-blur-md transition-colors"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Banner Section */}
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-slate-900 overflow-hidden">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-indigo-600/90 text-white backdrop-blur-md">
                  {event.categoryLabel || event.category}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/20 text-white backdrop-blur-md flex items-center gap-1">
                  {event.mode === 'Online' ? <Globe2 size={13} /> : <MapPin size={13} />}
                  <span>{event.mode} Mode</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 max-w-3xl">
                {event.tagline}
              </p>

              {/* Host Tag */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                <img
                  src={event.organizer.logo}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-white/30"
                />
                <span>
                  Organized by <strong className="text-white">{event.organizer.name}</strong>
                </span>
                {event.organizer.verified && (
                  <CheckCircle2 size={14} className="text-indigo-400" />
                )}
                <span className="text-slate-400 hidden sm:inline">• {event.organizer.type}</span>
              </div>
            </div>
          </div>

          {/* Body: 2 Columns */}
          <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Details & Tabs (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                    <Calendar size={14} className="text-indigo-500" />
                    <span>Dates</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                    <MapPin size={14} className="text-rose-500" />
                    <span>Venue</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {event.location}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                    <Users size={14} className="text-purple-500" />
                    <span>Team Size</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {event.teamSize}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
                    <Award size={14} className="text-emerald-500" />
                    <span>Entry Fee</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {event.isFree ? 'FREE' : `₹${event.price}`}
                  </p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
                <button
                  onClick={() => setActiveDetailTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                    activeDetailTab === 'overview'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Overview & Perks
                </button>
                <button
                  onClick={() => setActiveDetailTab('schedule')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                    activeDetailTab === 'schedule'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Agenda Timeline
                </button>
                {event.speakers && event.speakers.length > 0 && (
                  <button
                    onClick={() => setActiveDetailTab('speakers')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                      activeDetailTab === 'speakers'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Speakers ({event.speakers.length})
                  </button>
                )}
                {event.faqs && event.faqs.length > 0 && (
                  <button
                    onClick={() => setActiveDetailTab('faqs')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                      activeDetailTab === 'faqs'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    FAQs
                  </button>
                )}
              </div>

              {/* Tab 1: Overview */}
              {activeDetailTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      About the Event
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2.5">
                      {event.description.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Prizes Grid */}
                  {event.prizes && event.prizes.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Award size={18} className="text-amber-500" />
                        <span>Prizes & Recognition</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.prizes.map((p, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20"
                          >
                            <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                              Rank #{idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                              {p.rank}
                            </h4>
                            <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                              {p.prize}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Perks & Takeaways */}
                  {event.perks && event.perks.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles size={18} className="text-indigo-500" />
                        <span>Perks & Key Takeaways</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {event.perks.map((perk, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
                          >
                            <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Eligibility */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Eligibility & Participation Criteria
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                      {event.eligibility}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Schedule Timeline */}
              {activeDetailTab === 'schedule' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Event Schedule & Sessions
                  </h3>
                  {event.schedule && event.schedule.length > 0 ? (
                    <div className="space-y-6">
                      {event.schedule.map((dayPlan, dayIdx) => (
                        <div key={dayIdx} className="space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            <Calendar size={13} />
                            <span>{dayPlan.day}</span>
                          </div>

                          <div className="space-y-2.5 border-l-2 border-indigo-500/30 pl-4 ml-2">
                            {dayPlan.sessions.map((sess, sessIdx) => (
                              <div
                                key={sessIdx}
                                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    {sess.time}
                                  </span>
                                  {sess.room && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                      {sess.room}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {sess.title}
                                </h4>
                                {sess.speaker && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Lead by <strong>{sess.speaker}</strong>
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Full agenda to be announced by host.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Speakers */}
              {activeDetailTab === 'speakers' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Keynote Speakers & Mentors
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.speakers?.map((sp, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3.5"
                      >
                        <img
                          src={sp.avatar}
                          alt={sp.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
                        />
                        <div className="overflow-hidden flex-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {sp.name}
                          </h4>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate">
                            {sp.role}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {sp.company}
                          </p>
                        </div>
                        {sp.linkedin && (
                          <a
                            href={sp.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                            title="LinkedIn Profile"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: FAQs */}
              {activeDetailTab === 'faqs' && (
                <div className="space-y-3 animate-fade-in">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-2">
                    {event.faqs?.map((faq, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                          className="w-full p-3.5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2"
                        >
                          <span>{faq.q}</span>
                          {expandedFaq === idx ? (
                            <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaq === idx && (
                          <div className="px-3.5 pb-3.5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 pt-2.5">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Sticky Sidebar CTA Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                {/* Capacity Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">Capacity Meter</span>
                    <span className={progressText}>
                      {isFull ? 'CAPACITY FULL' : `${capacityPercent}% FILLED`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full ${progressBg} rounded-full transition-all duration-500`}
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span><strong>{event.registeredCount}</strong> registered</span>
                    <span>Max: <strong>{event.maxCapacity}</strong></span>
                  </div>
                </div>

                {/* Deadline Alert */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
                  <Flame size={16} className="flex-shrink-0 text-amber-500" />
                  <div>
                    <strong>Registration Closes</strong>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {new Date(event.registrationDeadline).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                {userRegistration ? (
                  <button
                    onClick={handlePassView}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 transition-all"
                  >
                    <Ticket size={16} />
                    <span>
                      {userRegistration.status === 'waitlist'
                        ? `Waitlisted (#${userRegistration.waitlistPosition})`
                        : 'View My E-Ticket Pass'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => onRegisterClick(event)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      isFull
                        ? event.allowWaitlist
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    <span>
                      {isFull
                        ? (event.allowWaitlist ? 'Join Automated Waitlist' : 'Registrations Closed')
                        : 'Register Now'}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                )}

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => toggleBookmark(event.id)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Bookmark
                      size={14}
                      className={isBookmarked ? 'fill-indigo-500 text-indigo-500' : ''}
                    />
                    <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>
                </div>

                {/* Security Guarantee */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>Verified EventHub Quality Checked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
