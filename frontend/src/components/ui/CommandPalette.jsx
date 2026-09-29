import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, Compass, LayoutDashboard, X, ArrowRight, Sparkles } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { events, users, currentUser } = useEventHub();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or prop
          window.dispatchEvent(new CustomEvent('toggle-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items based on query
  const q = query.toLowerCase().trim();

  const filteredEvents = events
    .filter((e) => e.title.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q))
    .slice(0, 4);

  const filteredUsers = users
    .filter((u) => u.name.toLowerCase().includes(q) || u.organizationName?.toLowerCase().includes(q))
    .slice(0, 3);

  const navigationPages = [
    { label: 'Explore Events', path: '/events', icon: Compass, category: 'Navigation' },
    { label: 'Home Page', path: '/', icon: Sparkles, category: 'Navigation' },
    ...(currentUser
      ? [
          { label: 'Attendee Overview', path: '/app/attendee/overview', icon: LayoutDashboard, category: 'App' },
          { label: 'My Registered Tickets', path: '/app/attendee/tickets', icon: Calendar, category: 'App' },
          { label: 'Saved Wishlist', path: '/app/attendee/saved', icon: Sparkles, category: 'App' },
          { label: 'Event Calendar', path: '/app/attendee/calendar', icon: Calendar, category: 'App' },
          { label: 'My Profile', path: '/app/attendee/profile', icon: User, category: 'App' },
          ...(currentUser.role === 'host' || currentUser.role === 'organizer'
            ? [
                { label: 'Organizer Overview', path: '/app/organizer/overview', icon: LayoutDashboard, category: 'Organizer' },
                { label: 'Create New Event', path: '/app/organizer/create-event', icon: Calendar, category: 'Organizer' },
                { label: 'Attendee Check-in Desk', path: '/app/organizer/check-in', icon: User, category: 'Organizer' }
              ]
            : []),
          ...(currentUser.role === 'admin'
            ? [{ label: 'Admin Moderation', path: '/app/admin/moderation', icon: LayoutDashboard, category: 'Admin' }]
            : [])
        ]
      : [
          { label: 'Sign In / Register', path: '/login', icon: User, category: 'Auth' }
        ])
  ].filter((p) => p.label.toLowerCase().includes(q));

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-950/50">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, event name, or navigate to a page... (ESC to exit)"
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Navigation Pages */}
          {navigationPages.length > 0 && (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Quick Navigation
              </p>
              <div className="space-y-1">
                {navigationPages.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Events */}
          {filteredEvents.length > 0 && (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Events
              </p>
              <div className="space-y-1">
                {filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleSelect(`/events/${event.id}`)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                      <div className="truncate">
                        <p className="font-medium truncate">{event.title}</p>
                        <p className="text-xs text-slate-400 truncate">{event.categoryLabel} • {event.location}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 ml-2">
                      {event.isFree ? 'Free' : `₹${event.price}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Users / Hosts */}
          {filteredUsers.length > 0 && (
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Organizers & Profiles
              </p>
              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(`/organizers/${user.id}`)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full object-cover" />
                      <span className="font-medium">{user.organizationName || user.name}</span>
                      <span className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-slate-500 capitalize">
                        {user.role}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredEvents.length === 0 && navigationPages.length === 0 && filteredUsers.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">
              No results found for "{query}". Try a different keyword.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-4 py-2.5 text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-300">↑↓</span>
            <span>Navigate</span>
            <span className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-300">↵</span>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-300">ESC</span>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
