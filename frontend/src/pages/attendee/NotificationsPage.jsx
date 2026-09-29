import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  CheckCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

export const NotificationsPage = () => {
  const { currentUser, notifications, markNotificationRead, clearAllNotifications } = useEventHub();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const userNotifs = notifications.filter((n) => !n.userId || n.userId === currentUser?.id);
  const filtered = userNotifs.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notification Center"
        subtitle="Stay updated on ticket confirmations, host announcements, and security alerts."
        breadcrumbs={[
          { label: 'Attendee Hub', to: '/app/attendee/overview' },
          { label: 'Notifications' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        }
      />

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Notifications ({userNotifs.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
          }`}
        >
          Unread Only ({userNotifs.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up!"
          description="You don't have any notifications at the moment."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.read
                  ? 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  notif.type === 'error'
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                    : notif.type === 'warning'
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                    : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                }`}
              >
                <Bell className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {new Date(notif.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
