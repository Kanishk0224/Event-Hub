import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Award,
  Shield,
  Share2,
  Heart,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Star,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send,
  CalendarPlus
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import EventCard from '../../components/EventCard';
import RatingStars from '../../components/ui/RatingStars';
import EmptyState from '../../components/ui/EmptyState';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    events,
    currentUser,
    registrations,
    bookmarks,
    toggleBookmark,
    showToast,
    openRegisterModal,
    openTicketModal,
    setSelectedEventForModal,
    setRegisterModalOpen,
    setTicketModalOpen,
    setSelectedTicket
  } = useEventHub();

  const event = events.find((e) => e.id === id || e.slug === id || e._id === id);

  const [activeTab, setActiveTab] = useState('about');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [localReviews, setLocalReviews] = useState([
    {
      id: 'rev-1',
      userName: 'Aarav Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Incredible speaker lineup and mentorship! The cloud sandbox environments worked smoothly.',
      date: '2 days ago',
      verified: true
    },
    {
      id: 'rev-2',
      userName: 'Sneha Patel',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      rating: 5,
      comment: 'Top-tier organization. The round 2 problem statements were challenging and practical.',
      date: '1 week ago',
      verified: true
    }
  ]);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <EmptyState
          title="Event Not Found"
          description="The event you are looking for may have been removed or rescheduled."
          action={
            <Link
              to="/events"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              Browse All Events
            </Link>
          }
        />
      </div>
    );
  }

  // Registration & capacity status
  const isBookmarked = bookmarks.includes(event.id);
  const userRegistration = registrations.find(
    (r) => r.eventId === event.id && r.userId === currentUser?.id && r.status !== 'cancelled'
  );
  const isRegistered = !!userRegistration;
  const isFull = event.registeredCount >= event.maxCapacity;
  const isWaitlist = isFull && event.allowWaitlist;
  const pct = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));

  // Related events
  const relatedEvents = events
    .filter((e) => e.id !== event.id && (e.category === event.category || e.mode === event.mode))
    .slice(0, 3);

  // ICS Calendar generation
  const downloadIcsFile = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EventHub//Event Calendar//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description?.replace(/\n/g, ' ')}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.slug || 'event'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendar invite (.ics) downloaded.');
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      showToast('Event link copied to clipboard!');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${event.title} on EventHub: ${url}`)}`);
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Joining ${event.title}! Register here:`)}&url=${encodeURIComponent(url)}`);
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newRev = {
      id: `rev-${Date.now()}`,
      userName: currentUser?.name || 'Verified Attendee',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      rating: newRating,
      comment: newComment.trim(),
      date: 'Just now',
      verified: true
    };
    setLocalReviews([newRev, ...localReviews]);
    setNewComment('');
    showToast('Thank you for rating this event!');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* 1. Hero Banner Area */}
      <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-slate-900">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge-chip badge-primary">
              {event.categoryLabel}
            </span>
            <span className="badge-chip badge-success">
              {event.mode}
            </span>
            {event.isFeatured && (
              <span className="badge-chip badge-purple">
                <Sparkles className="h-3 w-3" />
                <span>Featured</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {event.title}
          </h1>
          {event.tagline && (
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl">
              {event.tagline}
            </p>
          )}
        </div>
      </div>

      {/* 2. Main Content & Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Details & Tabs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Metadata Pill Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{event.startDate || 'Oct 2026'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Team Format</p>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{event.teamSize || 'Individual'}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
              {[
                { id: 'about', label: 'About & Perks' },
                { id: 'agenda', label: 'Agenda Timeline' },
                { id: 'speakers', label: `Speakers (${event.speakers?.length || 0})` },
                { id: 'reviews', label: `Reviews (${localReviews.length})` },
                { id: 'faqs', label: 'FAQs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: About & Perks */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    About this Event
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </div>
                </div>

                {/* Prizes & Grants */}
                {event.prizes && event.prizes.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      <span>Prizes, Cash Awards & Grants</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {event.prizes.map((p, i) => (
                        <div key={i} className="p-4 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{p.rank}</p>
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">{p.prize}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Perks list */}
                {event.perks && event.perks.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                      What You'll Receive
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {event.perks.map((perk, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Agenda Timeline */}
            {activeTab === 'agenda' && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Event Schedule & Sessions
                </h3>
                {event.schedule && event.schedule.length > 0 ? (
                  <div className="space-y-6">
                    {event.schedule.map((dayPlan, dIdx) => (
                      <div key={dIdx} className="space-y-3">
                        <div className="inline-block rounded-lg bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {dayPlan.day}
                        </div>
                        <div className="space-y-3 pl-2 border-l-2 border-indigo-200 dark:border-indigo-900">
                          {dayPlan.sessions?.map((sess, sIdx) => (
                            <div key={sIdx} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{sess.time}</span>
                                <span>{sess.room}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sess.title}</h4>
                              {sess.speaker && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Speaker: {sess.speaker}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Detailed session schedule will be announced shortly.</p>
                )}
              </div>
            )}

            {/* Tab 3: Keynote Speakers */}
            {activeTab === 'speakers' && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Keynote Speakers & Jury Mentors
                </h3>
                {event.speakers && event.speakers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.speakers.map((spk, idx) => (
                      <div key={idx} className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                        <img src={spk.avatar} alt={spk.name} className="h-12 w-12 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{spk.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{spk.role}</p>
                          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 truncate">{spk.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Speakers to be announced.</p>
                )}
              </div>
            )}

            {/* Tab 4: Reviews & Ratings */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Attendee Reviews & Feedback
                    </h3>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={5} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">4.9/5</span>
                    </div>
                  </div>

                  {/* Submit review form */}
                  <form onSubmit={handleReviewSubmit} className="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Leave a rating & review
                    </p>
                    <div className="mb-3">
                      <RatingStars rating={newRating} readOnly={false} onChange={setNewRating} />
                    </div>
                    <textarea
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience, mentors, or sessions..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Post Review</span>
                      </button>
                    </div>
                  </form>

                  {/* Reviews list */}
                  <div className="space-y-3">
                    {localReviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <img src={rev.userAvatar} alt={rev.userName} className="h-7 w-7 rounded-full object-cover" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                            {rev.verified && (
                              <span className="rounded bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                                Verified
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>
                        <RatingStars rating={rev.rating} size="xs" />
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: FAQs */}
            {activeTab === 'faqs' && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h3>
                {event.faqs?.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Host Profile Info Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={event.organizer?.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80'}
                  alt={event.organizer?.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {event.organizer?.name}
                    </h4>
                    {event.organizer?.verified && (
                      <Shield className="h-4 w-4 fill-emerald-500 text-white" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {event.organizer?.type || 'Premier Event Organizer'}
                  </p>
                </div>
              </div>
              <Link
                to={`/organizers/${event.organizer?.id || 'org-1'}`}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Right Sticky Registration Card */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-6">
              {/* Pricing Header */}
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ticket Price
                </span>
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {event.isFree ? 'FREE' : `₹${event.price}`}
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Capacity Meter</span>
                  <span className="text-slate-500">{event.registeredCount} / {event.maxCapacity} Seats</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-right">
                  {isFull ? (event.allowWaitlist ? 'Waitlist open' : 'Sold Out') : `${event.maxCapacity - event.registeredCount} seats remaining`}
                </p>
              </div>

              {/* Main Action Button */}
              {isRegistered ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      ✓ You are registered for this event
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Ticket ID: #{userRegistration.ticketId}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (openTicketModal) {
                        openTicketModal(userRegistration);
                      } else {
                        setSelectedTicket(userRegistration);
                        setTicketModalOpen(true);
                      }
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer"
                  >
                    View E-Ticket Pass
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (openRegisterModal) {
                      openRegisterModal(event);
                    } else {
                      setSelectedEventForModal(event);
                      setRegisterModalOpen(true);
                    }
                  }}
                  className={`w-full rounded-xl py-3.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                    isFull
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 shadow-indigo-600/30'
                  }`}
                >
                  {isFull ? 'Join Event Waitlist' : 'Register Now (Instant Pass)'}
                </button>
              )}

              {/* Secondary Actions: Calendar & Wishlist */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={downloadIcsFile}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <CalendarPlus className="h-4 w-4 text-indigo-500" />
                  <span>Add to Cal</span>
                </button>
                <button
                  onClick={() => toggleBookmark(event.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-colors ${
                    isBookmarked
                      ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-rose-500' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Share event */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Share this Event
                </p>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                  >
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* 3. Related Events Grid */}
        {relatedEvents.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 pb-20 lg:pb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
              Similar Events You Might Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((rEvent) => (
                <EventCard
                  key={rEvent.id}
                  event={rEvent}
                  isBookmarked={bookmarks.includes(rEvent.id)}
                  onToggleBookmark={() => toggleBookmark(rEvent.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Register CTA Bar (Hidden on Desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Price</p>
          <p className="text-base font-extrabold text-slate-900 dark:text-white">
            {event.isFree ? 'Free Admission' : `₹${finalPrice}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRegistration ? (
            <button
              onClick={() => {
                if (openTicketModal) {
                  openTicketModal(userRegistration);
                } else {
                  setSelectedTicket(userRegistration);
                  setTicketModalOpen(true);
                }
              }}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/25"
            >
              <Ticket className="h-4 w-4" />
              <span>Digital Pass</span>
            </button>
          ) : (
            <button
              onClick={handleRegisterClick}
              disabled={isFull && !event.allowWaitlist}
              className={`py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md ${
                isFull
                  ? event.allowWaitlist
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                  : 'btn-primary'
              }`}
            >
              <span>{isFull ? (event.allowWaitlist ? 'Join Waitlist' : 'Sold Out') : 'Register Now'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
