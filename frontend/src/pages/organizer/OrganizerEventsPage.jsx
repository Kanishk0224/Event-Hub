import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  PlusCircle,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export const OrganizerEventsPage = () => {
  const { events, currentUser, cancelEvent, showToast, createEvent, deleteEvent } = useEventHub();
  const navigate = useNavigate();

  const [selectedCancelId, setSelectedCancelId] = useState(null);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Administrative rescheduling');

  // Duplicate Modal State
  const [duplicateTarget, setDuplicateTarget] = useState(null);
  const [dupTitle, setDupTitle] = useState('');
  const [dupDate, setDupDate] = useState('');
  const [dupLocation, setDupLocation] = useState('');
  const [dupMode, setDupMode] = useState('In-Person');

  const myEvents = events.filter(
    (e) => e.organizer?.id === currentUser?.id || e.organizer?.name === (currentUser?.organizationName || currentUser?.name)
  );

  const openDuplicateModal = (event) => {
    setDuplicateTarget(event);
    setDupTitle(`${event.title} - Cohort 2`);
    const d = new Date(event.startDate || Date.now());
    d.setDate(d.getDate() + 14);
    setDupDate(d.toISOString().slice(0, 10));
    setDupLocation(event.location || '');
    setDupMode(event.mode || 'In-Person');
  };

  const handleConfirmDuplicate = (e) => {
    e.preventDefault();
    if (!duplicateTarget) return;

    if (!dupTitle.trim()) {
      showToast('Please specify an event title.', 'error');
      return;
    }
    if (!dupDate) {
      showToast('Please specify an event date.', 'error');
      return;
    }

    // Strict duplicate restriction: cannot have replica until at least one field is different!
    const isIdentical =
      dupTitle.trim().toLowerCase() === duplicateTarget.title.trim().toLowerCase() &&
      dupDate === (duplicateTarget.startDate || '').slice(0, 10) &&
      dupLocation.trim().toLowerCase() === (duplicateTarget.location || '').trim().toLowerCase() &&
      dupMode.trim().toLowerCase() === (duplicateTarget.mode || '').trim().toLowerCase();

    if (isIdentical) {
      showToast(
        'Duplicate Prevented: All fields are identical to the original event. Please modify at least one field (Title, Date, or Venue) to create a new edition.',
        'error'
      );
      return;
    }

    const created = createEvent({
      ...duplicateTarget,
      title: dupTitle.trim(),
      startDate: dupDate,
      location: dupLocation.trim() || 'Online',
      mode: dupMode,
      registeredCount: 0,
      waitlistCount: 0
    });

    if (created) {
      setDuplicateTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Hosted Events"
        subtitle="Manage active programs, edit agendas, duplicate templates, and monitor registrations."
        breadcrumbs={[
          { label: 'Host Center', to: '/app/organizer/overview' },
          { label: 'My Events' }
        ]}
        actions={
          <Link
            to="/app/organizer/create-event"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Event</span>
          </Link>
        }
      />

      {/* Events Table Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-6">Event Title & Category</th>
                <th className="py-3.5 px-4">Date & Mode</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {myEvents.map((evt) => {
                const pct = Math.min(100, Math.round(((evt.registeredCount || 0) / (evt.maxCapacity || 100)) * 100));
                return (
                  <tr key={evt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={evt.bannerUrl} alt={evt.title} className="h-10 w-16 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{evt.title}</p>
                          <span className="badge-chip badge-primary text-[10px] mt-1">
                            {evt.categoryLabel}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      <p className="font-semibold">{evt.startDate || 'Upcoming'}</p>
                      <p className="text-[11px] text-slate-400">{evt.mode} • {evt.location}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1 w-32">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>{evt.registeredCount || 0} / {evt.maxCapacity}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`badge-chip text-[10px] ${
                          evt.status === 'published'
                            ? 'badge-success'
                            : evt.status === 'cancelled'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {evt.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/events/${evt.id}`}
                          title="Preview Public Page"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => openDuplicateModal(evt)}
                          title="Create New Edition (Anti-Duplicate Guarded)"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        {evt.status !== 'cancelled' && (
                          <button
                            onClick={() => setSelectedCancelId(evt.id)}
                            title="Cancel Event"
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-amber-600 transition-colors cursor-pointer"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedDeleteId(evt.id)}
                          title="Permanently Delete Event"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Event Dialog */}
      <ConfirmDialog
        isOpen={!!selectedCancelId}
        onClose={() => setSelectedCancelId(null)}
        onConfirm={() => {
          if (selectedCancelId) {
            cancelEvent(selectedCancelId, cancelReason);
            setSelectedCancelId(null);
          }
        }}
        title="Cancel Event & Notify Registrants?"
        message="This action will mark the event as cancelled and automatically dispatch email / in-app notifications to all registered participants."
        confirmText="Confirm Cancellation"
        isDanger={true}
      />

      {/* Delete Event Dialog */}
      <ConfirmDialog
        isOpen={!!selectedDeleteId}
        onClose={() => setSelectedDeleteId(null)}
        onConfirm={() => {
          if (selectedDeleteId) {
            deleteEvent(selectedDeleteId);
            showToast('Event permanently deleted.');
            setSelectedDeleteId(null);
          }
        }}
        title="Permanently Delete Event?"
        message="This action will permanently delete this event and remove any associated records from your portal."
        confirmText="Delete Permanently"
        isDanger={true}
      />

      {/* Duplicate / Template Modal with Anti-Replica Restriction */}
      {duplicateTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="badge-chip badge-primary text-[10px]">
                  Use as Template
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Create New Event Edition
                </h3>
              </div>
              <button
                onClick={() => setDuplicateTarget(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
              <p className="font-bold flex items-center gap-1.5 mb-1">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Anti-Duplicate Restriction</span>
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Exact replica events cannot be created. At least one detail (Title, Date, or Venue) must differ from the source event.
              </p>
            </div>

            <form onSubmit={handleConfirmDuplicate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  New Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={dupTitle}
                  onChange={(e) => setDupTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Hackathon - Season 2"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dupDate}
                    onChange={(e) => setDupDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Event Format
                  </label>
                  <select
                    value={dupMode}
                    onChange={(e) => setDupMode(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Online">Online / Virtual</option>
                    <option value="In-Person">In-Person Campus</option>
                    <option value="Hybrid">Hybrid (Both)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={dupLocation}
                  onChange={(e) => setDupLocation(e.target.value)}
                  placeholder="e.g. IIT Bombay / Zoom"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDuplicateTarget(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Create Distinct Edition</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerEventsPage;
