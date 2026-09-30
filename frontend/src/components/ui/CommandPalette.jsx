import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, X, ArrowRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const { events, categories } = useEventHub();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
      setSelectedMode('all');
      setSelectedPrice('all');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter events based on query, category, mode, and price
  const q = query.toLowerCase().trim();

  const filteredEvents = events.filter((e) => {
    // Text search
    if (q) {
      const matchText =
        e.title?.toLowerCase().includes(q) ||
        e.categoryLabel?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.tagline?.toLowerCase().includes(q);
      if (!matchText) return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const cat = (e.category || '').toLowerCase();
      const catLabel = (e.categoryLabel || '').toLowerCase();
      if (!cat.includes(selectedCategory.toLowerCase()) && !catLabel.includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }

    // Mode filter
    if (selectedMode !== 'all') {
      if ((e.mode || '').toLowerCase() !== selectedMode.toLowerCase()) {
        return false;
      }
    }

    // Pricing filter
    if (selectedPrice === 'free') {
      if (!e.isFree && e.price > 0) return false;
    } else if (selectedPrice === 'paid') {
      if (e.isFree || !e.price || e.price === 0) return false;
    }

    return true;
  });

  const handleSelectEvent = (eventId) => {
    navigate(`/events/${eventId}`);
    onClose();
  };

  const handleViewAllInCatalog = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedMode !== 'all') params.set('mode', selectedMode);
    if (selectedPrice !== 'all') params.set('price', selectedPrice);
    navigate(`/events?${params.toString()}`);
    onClose();
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedMode('all');
    setSelectedPrice('all');
  };

  const hasActiveFilters = query.trim() || selectedCategory !== 'all' || selectedMode !== 'all' || selectedPrice !== 'all';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Filter & Search Events
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="px-5 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by event title, topic, college, or city..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-10 pr-9 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          {/* Format / Mode Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
            {['all', 'In-Person', 'Online', 'Hybrid'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                  selectedMode === mode
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode === 'all' ? 'All Formats' : mode}
              </button>
            ))}
          </div>

          {/* Pricing Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Fees' },
              { id: 'free', label: 'Free' },
              { id: 'paid', label: 'Paid' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPrice(p.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all cursor-pointer ${
                  selectedPrice === p.id
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Category Pills Row */}
        <div className="px-5 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.id || cat.slug || cat.name}
              onClick={() => setSelectedCategory(cat.slug || cat.name)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === (cat.slug || cat.name)
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filtered Events Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredEvents.length > 0 ? (
            filteredEvents.slice(0, 8).map((event) => (
              <div
                key={event.id || event._id}
                onClick={() => handleSelectEvent(event.id || event._id)}
                className="group flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/30 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120'}
                    alt={event.title}
                    className="h-11 w-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {event.categoryLabel || event.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{event.location || event.mode}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>{event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Upcoming'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    event.isFree || event.price === 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                  }`}>
                    {event.isFree || event.price === 0 ? 'FREE' : `₹${event.price}`}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No events found matching your filter criteria
              </p>
              <p className="text-xs text-slate-400">
                Try selecting different formats, categories, or clearing search keywords.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Catalog Link */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Showing {Math.min(8, filteredEvents.length)} of {filteredEvents.length} filtered events
          </span>
          <button
            onClick={handleViewAllInCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <span>Open in Full Catalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
