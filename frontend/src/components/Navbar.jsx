import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEventHub } from '../context/EventHubContext';
import ThemeToggle from './ui/ThemeToggle';
import BackendStatusIndicator from './ui/BackendStatusIndicator';
import {
  Sparkles,
  Search,
  PlusCircle,
  Bell,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Ticket,
  Menu,
  X,
  Compass,
  User,
  LayoutDashboard,
  Heart,
  Calendar,
  Settings
} from 'lucide-react';

export const Navbar = ({ onOpenCommandPalette }) => {
  const {
    currentUser,
    notifications,
    bookmarks,
    logout,
    markNotificationRead,
    clearAllNotifications,
    setAuthModalOpen,
    setAuthMode
  } = useEventHub();

  const navigate = useNavigate();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Click outside to close popovers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userNotifications = notifications.filter(
    (n) => !currentUser || n.userId === currentUser.id
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleDashboardRoute = () => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role === 'host' || currentUser.role === 'organizer') {
      navigate('/app/organizer/overview');
    } else if (currentUser.role === 'admin') {
      navigate('/app/admin/overview');
    } else {
      navigate('/app/attendee/overview');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 dark:from-white dark:via-indigo-100 dark:to-indigo-300 bg-clip-text text-transparent">
                EventHub
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase -mt-1">
                Summits & Hackathons
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              Discover
            </NavLink>
            {currentUser && (
              <button
                onClick={handleDashboardRoute}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Dashboard
              </button>
            )}
          </nav>
        </div>

        {/* Center: Global Search Command Trigger */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-3.5 py-2 text-xs text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Search events, topics, or hosts...</span>
            </div>
            <kbd className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-300">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Backend Status, Theme, Notifications & User */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Backend Status Live Health Indicator */}
          <BackendStatusIndicator />

          {/* Host an Event CTA */}
          <Link
            to={currentUser?.role === 'host' ? '/app/organizer/create-event' : '/login?mode=register'}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Host Event</span>
          </Link>

          {/* Theme Switcher Toggle */}
          <ThemeToggle />

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4 z-50 animate-fade-in space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Notifications ({userNotifications.length})
                  </h4>
                  {userNotifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {userNotifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400">No notifications</p>
                  ) : (
                    userNotifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          !notif.read
                            ? 'border-indigo-100 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/30'
                            : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link
                    to="/app/attendee/notifications"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-xl object-cover ring-2 ring-indigo-500/30"
                />
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 badge-chip badge-primary text-[10px] capitalize">
                      {currentUser.role}
                    </span>
                  </div>

                  <Link
                    to={
                      currentUser.role === 'host' || currentUser.role === 'organizer'
                        ? '/app/organizer/overview'
                        : currentUser.role === 'admin'
                        ? '/app/admin/overview'
                        : '/app/attendee/overview'
                    }
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/app/attendee/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/app/attendee/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-2 text-xs font-bold shadow hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] flex-1 flex flex-col bg-white dark:bg-slate-900 p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">EventHub</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Search Button */}
            <div className="pt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenCommandPalette) onOpenCommandPalette();
                }}
                className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Search events, topics...</span>
                </div>
                <kbd className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px]">Ctrl+K</kbd>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="py-4 space-y-1.5 flex-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600"
              >
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Home</span>
              </Link>
              <Link
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600"
              >
                <Compass className="h-4 w-4 text-indigo-500" />
                <span>Discover Events</span>
              </Link>

              {currentUser && (
                <>
                  <button
                    onClick={() => {
                      handleDashboardRoute();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 cursor-pointer text-left"
                  >
                    <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                    <span>Dashboard ({currentUser.role})</span>
                  </button>
                  <Link
                    to="/app/attendee/tickets"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600"
                  >
                    <Ticket className="h-4 w-4 text-indigo-500" />
                    <span>My Tickets</span>
                  </Link>
                </>
              )}

              <Link
                to={currentUser?.role === 'host' ? '/app/organizer/create-event' : '/login?mode=register'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Host an Event</span>
              </Link>
            </div>

            {/* Mobile Footer & Auth */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-slate-500">API Status:</span>
                <BackendStatusIndicator />
              </div>

              {currentUser ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out ({currentUser.name})</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?mode=register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary !py-2.5 !text-xs text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

