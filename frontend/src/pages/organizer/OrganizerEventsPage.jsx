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
  const { events, currentUser, cancelEvent, showToast, createEvent } = useEventHub();
  const navigate = useNavigate();

  const [selectedCancelId, setSelectedCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Administrative rescheduling');

  const myEvents = events.filter(
    (e) => e.organizer?.id === currentUser?.id || e.organizer?.name === (currentUser?.organizationName || currentUser?.name)
  );

  const handleDuplicate = (event) => {
    const duplicated = createEvent({
      ...event,
      title: `${event.title} (Copy)`,
      registeredCount: 0,
      waitlistCount: 0
    });
    showToast(`Duplicated "${event.title}" as new draft.`);
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
                          onClick={() => handleDuplicate(evt)}
                          title="Duplicate Event"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        {evt.status !== 'cancelled' && (
                          <button
                            onClick={() => setSelectedCancelId(evt.id)}
                            title="Cancel Event"
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
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
    </div>
  );
};

export default OrganizerEventsPage;
