import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  Award,
  Users,
  CheckCircle,
  Star,
  ChevronRight,
  Shield,
  Zap,
  Globe,
  Heart
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import EventCard, { EventCardSkeleton } from '../../components/EventCard';
import { motion } from 'framer-motion';

export const HomePage = () => {
  const { events, categories, users, bookmarks, toggleBookmark, isLoading, currentUser } = useEventHub();
  const navigate = useNavigate();

  // Search state
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (location) params.set('location', location);
    navigate(`/events?${params.toString()}`);
  };

  // Filtered event buckets
  const featuredEvents = events.filter((e) => e.isFeatured && e.status === 'published');
  const trendingEvents = [...events].sort((a, b) => (b.registeredCount || 0) - (a.registeredCount || 0)).slice(0, 3);
  const weekendEvents = events.filter((e) => e.status === 'published').slice(0, 3);

  // Top organizers list
  const topOrganizers = users.filter((u) => u.role === 'host' || u.role === 'organizer').slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section with Glow and Integrated Search */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-mesh-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800/80 bg-white/80 dark:bg-indigo-950/40 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 shadow-sm backdrop-blur-md mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
            <span>Discover 5,000+ verified hackathons, bootcamps & summits</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight"
          >
            Experience World-Class <br />
            <span className="text-gradient">Events & Tech Summits</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Connect with industry leaders, level up your engineering skills, and secure instant verifiable ticket passes.
          </motion.p>

          {/* Integrated Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 max-w-4xl mx-auto"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2 sm:gap-3"
            >
              {/* Keyword */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search events, topics..."
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                />
              </div>

              {/* Category */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
                <Sparkles className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="all" className="dark:bg-slate-900">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="dark:bg-slate-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-1/3">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or Online"
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-md shadow-indigo-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Find Events</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Popular Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Trending:</span>
              {['AI & LLMs', 'Hackathons', 'Cloud Architecture', 'System Design', 'Cybersecurity'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    navigate(`/events?q=${encodeURIComponent(tag)}`);
                  }}
                  className="rounded-full bg-white dark:bg-slate-800/80 px-3 py-1 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">50K+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active Attendees</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">1,200+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Events Hosted</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">99.8%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Host Verification Rate</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-500">4.9/5</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Attendee Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Events Carousel / Highlights */}
      {isLoading ? (
        <section className="py-12 bg-white dark:bg-slate-900/50 border-y border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  <span>Editor's Spotlight</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Featured Highlights
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <EventCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      ) : featuredEvents.length > 0 && (
        <section className="py-12 bg-white dark:bg-slate-900/50 border-y border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  <span>Editor's Spotlight</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Featured Highlights
                </h2>
              </div>
              <Link
                to="/events?featured=true"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>View all</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 3).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isBookmarked={bookmarks.includes(event.id)}
                  onToggleBookmark={() => toggleBookmark(event.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Browse By Category Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Explore by Category
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Find tailored opportunities across tech hackathons, coding bootcamps, executive summits and masterclasses.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.filter((c) => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              to={`/events?category=${cat.id}`}
              className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center text-center"
            >
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
              >
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Events */}
      <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="h-4 w-4" />
                <span>Popular & In Demand</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Trending Right Now
              </h2>
            </div>
            <Link
              to="/events?sort=popularity"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Explore all trending</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <EventCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isBookmarked={bookmarks.includes(event.id)}
                  onToggleBookmark={() => toggleBookmark(event.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Top Verified Organizers */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Top Verified Organizers
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Follow leading tech institutions, communities, and enterprise organizers.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>See more</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topOrganizers.map((org) => (
            <div
              key={org.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all flex flex-col items-center text-center"
            >
              <img
                src={org.avatar}
                alt={org.name}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 mb-3"
              />
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {org.organizationName || org.name}
                </h3>
                {org.verified && <Shield className="h-4 w-4 fill-emerald-500 text-white shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {org.hostCategory || 'Premier Community'}
              </p>
              <Link
                to={`/organizers/${org.id}`}
                className="mt-4 w-full rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/30 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                View Profile & Events
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold">How EventHub Works</h2>
            <p className="mt-2 text-slate-400 text-sm">
              Effortless registration, verifiable QR passes, and automated waitlist promotion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold">Discover & Filter</h3>
              <p className="mt-2 text-sm text-slate-400">
                Search verified hackathons and workshops with granular filters for format, category, and date.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold">1-Click Fast Pass</h3>
              <p className="mt-2 text-sm text-slate-400">
                Claim solo or team tickets with instant QR code issuance, Apple/Google wallet sync, and PDF download.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-6 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold">Check-In & Certify</h3>
              <p className="mt-2 text-sm text-slate-400">
                Scan QR code at registration desk, attend sessions, rate the event, and download verified certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Become an Organizer CTA Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 sm:p-14 text-white shadow-2xl border border-indigo-800/50">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-400/30 mb-4">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>For Universities, Tech Communities & Enterprises</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Host Your Next Flagship Event on EventHub
            </h2>
            <p className="mt-4 text-sm sm:text-base text-indigo-200">
              Create multi-tiered ticketing, collect registrations, automate waitlist promotions, and monitor real-time check-in analytics with fraud protection.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/app/organizer/create-event"
                className="px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold text-sm shadow-lg hover:bg-slate-100 transition-colors"
              >
                Create Event Now
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl border border-indigo-400/40 bg-indigo-900/40 text-white font-semibold text-sm hover:bg-indigo-900/70 transition-colors"
              >
                Host Verification Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* View More Events CTA */}
      <section className="py-16 text-center bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Discover 5,000+ More Events
          </h2>
          <p className="text-indigo-100 text-sm mb-8">
            Sign up to unlock the full catalog — hackathons, bootcamps, workshops, and corporate summits.
          </p>
          <button
            onClick={() => {
              if (currentUser) {
                navigate('/events');
              } else {
                navigate('/login?mode=register');
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-700 font-bold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <span>{currentUser ? 'Browse All Events' : 'Sign Up to See More'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
          {!currentUser && (
            <p className="mt-4 text-[11px] text-indigo-200">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="underline font-bold cursor-pointer">
                Sign in here
              </button>
            </p>
          )}
        </div>
      </section>
    </div>

  );
};

export default HomePage;
