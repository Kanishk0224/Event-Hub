import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, Trash2, ArrowRight } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export const WaitlistPage = () => {
  const { currentUser, registrations, cancelRegistration, events = [] } = useEventHub();
  const waitlistRegs = registrations.filter((r) => r.userId === currentUser?.id && r.status === 'waitlist');
  const [cancelTargetId, setCancelTargetId] = useState(null);

  return (
    <div className="space-y-8">
      <PageHeader
          showBack
          title="Live Waitlist Queue"
        subtitle="Track your queue position for high-demand events. When a seat opens, you will be automatically promoted."
        breadcrumbs={[
          { label: 'Attendee Hub', to: '/app/attendee/overview' },
          { label: 'Waitlist' }
        ]}
      />


      {/* Auto-promotion Engine Banner */}
      <div className="rounded-3xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-6 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
            Automated Waitlist Promotion Engine
          </h3>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed">
            Our automated dispatch checks cancellations 24/7. When a confirmed participant drops their slot, the #1 participant on the waitlist is instantly converted to a Confirmed Pass and notified via email.
          </p>
        </div>
      </div>

      {waitlistRegs.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No waitlisted events"
          description="You are not currently on any event waitlists. All your registrations have confirmed spots!"
          action={
            <Link
              to="/events"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
            >
              Browse Events
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {waitlistRegs.map((reg) => {
            const matchedEvent = (events || []).find(e => e.id === reg.eventId || e._id === reg.eventId || e.title === reg.eventTitle);
            const targetUrl = matchedEvent ? `/events/${matchedEvent.id || matchedEvent._id || matchedEvent.slug}` : '/events';

            return (
              <div
                key={reg.id || reg._id || reg.ticketId}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="badge-chip badge-warning text-[10px]">
                      Position #{reg.waitlistPosition || 1}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ID: #{reg.ticketId || reg.id}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {reg.eventTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Registered on: {new Date(reg.registrationDate || Date.now()).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCancelTargetId(reg.id || reg._id)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    Leave Waitlist
                  </button>
                  <Link
                    to={targetUrl}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>View Event</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leave confirmation */}
      <ConfirmDialog
        isOpen={!!cancelTargetId}
        onClose={() => setCancelTargetId(null)}
        onConfirm={() => {
          if (cancelTargetId) {
            cancelRegistration(cancelTargetId);
            setCancelTargetId(null);
          }
        }}
        title="Leave Waitlist Queue?"
        message="You will lose your queue position for this event."
        confirmText="Leave Waitlist"
        isDanger={true}
      />
    </div>
  );
};

export default WaitlistPage;
