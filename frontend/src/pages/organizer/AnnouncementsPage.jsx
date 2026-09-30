import React, { useState } from 'react';
import { Bell, Send, CheckCircle, Sparkles } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';

export const AnnouncementsPage = () => {
  const { events, currentUser, showToast } = useEventHub();
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    {
      id: '1',
      title: 'Discord Server & Discord Role Link Released!',
      event: 'National Generative AI & LLM Hackathon 2026',
      date: 'Yesterday at 04:30 PM',
      recipients: 438
    },
    {
      id: '2',
      title: 'Workshop Sandbox Credentials Sent via Email',
      event: 'Full-Stack System Design & Microservices Bootcamp',
      date: '3 days ago',
      recipients: 242
    }
  ]);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newBroadcast = {
      id: `bc-${Date.now()}`,
      title: title.trim(),
      event: selectedEventId === 'all' ? 'All Active Events' : events.find((e) => e.id === selectedEventId)?.title || 'Event',
      date: 'Just now',
      recipients: 500
    };

    setHistory([newBroadcast, ...history]);
    setTitle('');
    setMessage('');
    showToast(`📢 Broadcast dispatched to ${newBroadcast.recipients} registered participants!`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Broadcast Updates & Announcements"
        subtitle="Send urgent updates, Zoom links, Discord invites, or instructions to registered attendees."
        breadcrumbs={[
          { label: 'Host Center', to: '/app/organizer/overview' },
          { label: 'Broadcasts' }
        ]}
      />

      {/* Composer Form */}
      <form onSubmit={handleBroadcast} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-500" />
          <span>Compose New Announcement</span>
        </h3>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
            Target Event Audience
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
          >
            <option value="all">All Active Hosted Programs</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
            Announcement Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Schedule Update: Keynote Starts at 10:00 AM"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
            Message Body (Sent via Email & In-App Notification)
          </label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide links, sandbox access instructions, or important guidelines..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>Dispatch to All Registrants</span>
          </button>
        </div>
      </form>

      {/* Broadcast History */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Past Broadcast History
        </h3>
        <div className="space-y-3">
          {history.map((h) => (
            <div key={h.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{h.title}</h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">{h.event}</p>
                <p className="text-[11px] text-slate-400 mt-1">Dispatched: {h.date} • {h.recipients} recipients</p>
              </div>
              <span className="badge-chip badge-success text-[10px]">
                Delivered
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
