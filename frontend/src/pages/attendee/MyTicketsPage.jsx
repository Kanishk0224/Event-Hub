import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  QrCode,
  Calendar,
  MapPin,
  Trash2,
  Download,
  AlertTriangle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import TicketPassModal from '../../components/TicketPassModal';

export const MyTicketsPage = () => {
  const {
    currentUser,
    events,
    registrations,
    cancelRegistration,
    ticketModalOpen,
    setTicketModalOpen,
    selectedTicket,
    setSelectedTicket
  } = useEventHub();

  const userRegs = registrations.filter((r) => r.userId === currentUser?.id && r.status === 'confirmed');
  const [cancelTargetId, setCancelTargetId] = useState(null);

  return (
    <div className="space-y-8">
      <PageHeader
          showBack
          title="My Registered E-Tickets"
        subtitle="Manage and access your verified digital admission passes with live QR verification."
        breadcrumbs={[
          { label: 'Attendee Hub', to: '/app/attendee/overview' },
          { label: 'My Tickets' }
        ]}
      />


      {userRegs.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No confirmed tickets"
          description="You don't have any active registrations right now. Explore upcoming hackathons and claim your pass!"
          action={
            <Link
              to="/events"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              Browse Catalog
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userRegs.map((reg) => {
            const matchedEvent = events.find((e) => e.id === reg.eventId) || {};
            return (
              <div
                key={reg.id}
                className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all"
              >
                {/* Perforated tear circles */}
                <div className="ticket-edge-left" />
                <div className="ticket-edge-right" />

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="badge-chip badge-success text-[10px]">
                        ✓ Active Pass
                      </span>
                      <span className="text-xs text-slate-400">
                        {reg.ticketType || 'Standard Entry'}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      #{reg.ticketId}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {reg.eventTitle}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{matchedEvent.startDate || 'Upcoming 2026'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{matchedEvent.location || 'Online'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Team / Attendee roster details */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <p className="text-[11px] font-semibold text-slate-400">Attendee & Team</p>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {reg.userName} {reg.teamName && reg.teamName !== 'Individual' ? `(${reg.teamName})` : ''}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setCancelTargetId(reg.id)}
                      className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Cancel Registration</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTicket(reg);
                        setTicketModalOpen(true);
                      }}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Display QR Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancelTargetId}
        onClose={() => setCancelTargetId(null)}
        onConfirm={() => {
          if (cancelTargetId) {
            cancelRegistration(cancelTargetId);
            setCancelTargetId(null);
          }
        }}
        title="Cancel Event Registration?"
        message="Are you sure you want to release your confirmed slot? If this event has a waitlist, your seat will be automatically awarded to the next participant."
        confirmText="Yes, Cancel My Pass"
        isDanger={true}
      />

      <TicketPassModal
        registration={selectedTicket}
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
      />
    </div>
  );
};

export default MyTicketsPage;
