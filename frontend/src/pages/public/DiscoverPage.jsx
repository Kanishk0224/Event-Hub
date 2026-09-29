import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  Search,
  Grid,
  List,
  Calendar,
  X,
  Sparkles,
  MapPin,
  Clock,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/ui/PageHeader';

export const DiscoverPage = () => {
  const { events, categories, bookmarks, toggleBookmark } = useEventHub();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const modeParam = searchParams.get('mode') || 'all';
  const priceParam = searchParams.get('price') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';
  const featuredParam = searchParams.get('featured') === 'true';

  // Local UI state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter setters
  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (!val || val === 'all' || val === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(val));
    }
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  // Filter computation
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (evt.status === 'cancelled') return false;

      // Keyword query
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const matchesTitle = evt.title?.toLowerCase().includes(q);
        const matchesDesc = evt.description?.toLowerCase().includes(q);
        const matchesLoc = evt.location?.toLowerCase().includes(q);
        const matchesOrg = evt.organizer?.name?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesOrg) return false;
      }

      // Category
      if (categoryParam !== 'all' && evt.category !== categoryParam) {
        return false;
      }

      // Mode (Online / In-Person / Hybrid)
      if (modeParam !== 'all') {
        if (modeParam === 'Online' && evt.mode !== 'Online') return false;
        if (modeParam === 'In-Person' && evt.mode !== 'In-Person' && evt.mode !== 'Hybrid') return false;
      }

      // Price
      if (priceParam === 'free' && !evt.isFree && evt.price > 0) return false;
      if (priceParam === 'paid' && evt.isFree) return false;

      // Featured only
      if (featuredParam && !evt.isFeatured) return false;

      return true;
    }).sort((a, b) => {
      if (sortParam === 'date') return new Date(a.startDate || 0) - new Date(b.startDate || 0);
      if (sortParam === 'popularity') return (b.registeredCount || 0) - (a.registeredCount || 0);
      if (sortParam === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortParam === 'price_desc') return (b.price || 0) - (a.price || 0);
      // Default: featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [events, queryParam, categoryParam, modeParam, priceParam, sortParam, featuredParam]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeFiltersCount = [
    queryParam ? 1 : 0,
    categoryParam !== 'all' ? 1 : 0,
    modeParam !== 'all' ? 1 : 0,
    priceParam !== 'all' ? 1 : 0,
    featuredParam ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Breadcrumb */}
      <PageHeader
        title="Discover Events"
        subtitle={`Explore ${filteredEvents.length} upcoming hackathons, bootcamps, workshops and tech conferences.`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Discover' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
              <span>Filters ({activeFiltersCount})</span>
            </button>
          </div>
        }
      />

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sticky top-24 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Filter className="h-4 w-4 text-indigo-500" />
              <span>Filters</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Search Keywords
            </label>
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryParam}
                onChange={(e) => updateParam('q', e.target.value)}
                placeholder="Title, speaker, topic..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Category
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam('category', 'all')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                  categoryParam === 'all'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>All Categories</span>
                {categoryParam === 'all' && <Check className="h-3.5 w-3.5" />}
              </button>
              {categories.filter((c) => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    categoryParam === cat.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat.name}</span>
                  {categoryParam === cat.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Format / Mode */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Event Format
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'Online', label: 'Online' },
                { id: 'In-Person', label: 'In-Person' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => updateParam('mode', m.id)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    modeParam === m.id
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Pricing
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'free', label: 'Free' },
                { id: 'paid', label: 'Paid' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => updateParam('price', p.id)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    priceParam === p.id
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Spotlight Toggle */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Featured Spotlights Only
            </span>
            <input
              type="checkbox"
              checked={featuredParam}
              onChange={(e) => updateParam('featured', e.target.checked)}
              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Top Filter Bar: Active Filter Chips & Sort Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing <strong className="text-slate-900 dark:text-white">{filteredEvents.length}</strong> events
              </span>

              {/* Active Filter Chips */}
              {queryParam && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>"{queryParam}"</span>
                  <button onClick={() => updateParam('q', '')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {categoryParam !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Category: {categories.find((c) => c.id === categoryParam)?.name || categoryParam}</span>
                  <button onClick={() => updateParam('category', 'all')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {modeParam !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Format: {modeParam}</span>
                  <button onClick={() => updateParam('mode', 'all')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {priceParam !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Price: {priceParam.toUpperCase()}</span>
                  <button onClick={() => updateParam('price', 'all')}><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                aria-label="Sort events"
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="date">Date: Soonest</option>
                <option value="popularity">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Grid / List */}
          {filteredEvents.length === 0 ? (
            <EmptyState
              title="No events match your criteria"
              description="Try adjusting your keywords or clearing some filters to see more upcoming hackathons and summits."
              action={
                <button
                  onClick={clearAllFilters}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
                >
                  Clear All Filters
                </button>
              }
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isBookmarked={bookmarks.includes(event.id)}
                  onToggleBookmark={() => toggleBookmark(event.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedEvents.map((event) => (
                <div
                  key={event.id}
                  className="group flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="h-32 w-full sm:w-48 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="badge-chip badge-primary text-[10px]">
                        {event.categoryLabel}
                      </span>
                      <span className="text-xs text-slate-400">
                        {event.mode} • {event.startDate}
                      </span>
                    </div>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                    >
                      {event.title}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {event.tagline || event.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                        {event.isFree ? 'Free' : `₹${event.price}`}
                      </span>
                      <Link
                        to={`/events/${event.id}`}
                        className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-xl text-xs font-semibold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
