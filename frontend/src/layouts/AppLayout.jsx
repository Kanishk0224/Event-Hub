import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  LayoutDashboard,
  Ticket,
  Heart,
  CalendarCheck,
  Clock,
  Bell,
  User,
  Settings,
  PlusCircle,
  Users,
  QrCode,
  BarChart3,
  Tag,
  ShieldCheck,
  FolderKanban,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Menu,
  X,
  Compass,
  ArrowRight,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useEventHub } from '../context/EventHubContext';
import ThemeToggle from '../components/ui/ThemeToggle';
import CommandPalette from '../components/ui/CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const AppLayout = () => {
  const { currentUser, logout, notifications, toastMessage, switchDemoUser, isBackendConnected } = useEventHub();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read && (!n.userId || n.userId === currentUser?.id)).length;

  const role = currentUser?.role || 'student';
  const isHost = role === 'host' || role === 'organizer';
  const isAdmin = role === 'admin';

  // Attendee navigation items
  const attendeeNav = [
    { label: 'Overview', to: '/app/attendee/overview', icon: LayoutDashboard },
    { label: 'My Tickets', to: '/app/attendee/tickets', icon: Ticket },
    { label: 'Saved Events', to: '/app/attendee/saved', icon: Heart },
    { label: 'Event Calendar', to: '/app/attendee/calendar', icon: CalendarCheck },
    { label: 'Waitlist Queue', to: '/app/attendee/waitlist', icon: Clock },
    { label: 'Notifications', to: '/app/attendee/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { label: 'My Profile', to: '/app/attendee/profile', icon: User },
    { label: 'Settings', to: '/app/attendee/settings', icon: Settings }
  ];

  // Organizer navigation items
  const organizerNav = [
    { label: 'Overview', to: '/app/organizer/overview', icon: LayoutDashboard },
    { label: 'My Events', to: '/app/organizer/events', icon: Calendar },
    { label: 'Event Details & Stats', to: '/app/organizer/event-inspector', icon: FileText },
    { label: 'Create Event', to: '/app/organizer/create-event', icon: PlusCircle, isAction: true },
    { label: 'Participants', to: '/app/organizer/participants', icon: Users },
    { label: 'Check-in Desk', to: '/app/organizer/check-in', icon: QrCode },
    { label: 'Analytics', to: '/app/organizer/analytics', icon: BarChart3 },
    { label: 'Broadcasts', to: '/app/organizer/announcements', icon: Bell },
    { label: 'Team', to: '/app/organizer/team', icon: Users },
    { label: 'Settings', to: '/app/organizer/settings', icon: Settings }
  ];

  // Admin navigation items
  const adminNav = [
    { label: 'Overview', to: '/app/admin/overview', icon: LayoutDashboard },
    { label: 'Moderation Queue', to: '/app/admin/moderation', icon: ShieldCheck },
    { label: 'User Directory', to: '/app/admin/users', icon: Users },
    { label: 'Categories', to: '/app/admin/categories', icon: FolderKanban },
    { label: 'Reports & Logs', to: '/app/admin/reports', icon: FileText },
    { label: 'Settings', to: '/app/admin/settings', icon: Settings }
  ];

  const currentNav = isAdmin ? adminNav : isHost ? organizerNav : attendeeNav;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#080C14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Fixed Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 backdrop-blur-xl transition-all duration-300 z-30 fixed top-0 left-0 bottom-0 h-screen ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 dark:from-white dark:via-indigo-100 dark:to-indigo-300 bg-clip-text text-transparent">
                EventHub
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User Info Capsule */}
        {!collapsed && currentUser && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="mb-2">
            {!collapsed && (
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {isAdmin ? 'Admin Portal' : isHost ? 'Host Center' : 'Attendee Hub'}
              </p>
            )}
            {currentNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    } ${collapsed ? 'justify-center px-2' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${item.isAction ? 'text-indigo-500 dark:text-indigo-400' : ''}`} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            {!collapsed && (
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Public Discover
              </p>
            )}
            <Link
              to="/events"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all ${
                collapsed ? 'justify-center px-2' : ''
              }`}
              title={collapsed ? 'Discover Events' : undefined}
            >
              <Compass className="h-5 w-5 shrink-0 text-slate-400" />
              {!collapsed && <span>Discover Events</span>}
            </Link>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {!collapsed && (
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
          )}
          <button
            onClick={logout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
              collapsed ? 'justify-center px-2' : ''
            }`}
            title="Log Out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        {/* Top App Header */}
        <header className="h-16 sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6">
          {/* Backend Status Indicator */}
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold border shadow-xs transition-colors ${
            isBackendConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
          }`}>
            <span className={`h-2 w-2 rounded-full shrink-0 ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="truncate">{isBackendConnected ? 'MongoDB Atlas Connected' : 'Atlas Connecting...'}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global Search Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-1.5 text-xs text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all w-64 cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Filter & search events...</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Demo Switcher Quick Bar */}
            <div className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Demo:</span>
              <button
                onClick={() => {
                  switchDemoUser('student');
                  navigate('/app/attendee/overview');
                }}
                className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  role === 'student' || role === 'employee'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Attendee
              </button>
              <button
                onClick={() => {
                  switchDemoUser('host');
                  navigate('/app/organizer/overview');
                }}
                className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  role === 'host' || role === 'organizer'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Organizer
              </button>
              <button
                onClick={() => {
                  switchDemoUser('admin');
                  navigate('/app/admin/overview');
                }}
                className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                  role === 'admin'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            <div className="sm:hidden">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            <ThemeToggle />

            {/* Notification Bell */}
            <Link
              to="/app/attendee/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* User Profile avatar */}
            <Link
              to="/app/attendee/profile"
              className="flex items-center gap-2.5 rounded-xl p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="h-8 w-8 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
            </Link>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-full flex-1 flex flex-col bg-white dark:bg-slate-900 shadow-2xl p-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">EventHub</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {currentNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 max-w-md"
          >
            <div
              className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                toastMessage.type === 'error'
                  ? 'border-rose-500/30 bg-rose-950/90 text-rose-100'
                  : toastMessage.type === 'warning'
                  ? 'border-amber-500/30 bg-amber-950/90 text-amber-100'
                  : toastMessage.type === 'info'
                  ? 'border-blue-500/30 bg-blue-950/90 text-blue-100'
                  : 'border-emerald-500/30 bg-slate-900/95 text-emerald-100'
              }`}
            >
              {toastMessage.type === 'error' ? (
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              ) : toastMessage.type === 'warning' ? (
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
              ) : toastMessage.type === 'info' ? (
                <Info className="h-5 w-5 shrink-0 text-blue-400" />
              ) : (
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
              )}
              <div className="flex-1 text-sm font-medium leading-snug">
                {toastMessage.message}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
