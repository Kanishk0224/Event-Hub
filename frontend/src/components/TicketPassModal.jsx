import React, { useEffect } from 'react';
import { useEventHub } from '../context/EventHubContext';
import { motion } from 'framer-motion';
import {
  X,
  Printer,
  Calendar,
  CheckCircle2,
  QrCode,
  Share2,
  AlertCircle,
  Sparkles,
  Download
} from 'lucide-react';

export const TicketPassModal = ({ ticket, registration, isOpen, onClose }) => {
  const { events, selectedTicket, showToast } = useEventHub();

  const pass = ticket || registration || selectedTicket;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (isOpen !== undefined && !isOpen) return null;
  if (!pass) return null;

  const event = events.find(e => e.id === pass.eventId || e.slug === pass.eventId) || {
    title: pass.eventTitle || 'Flagship Event',
    location: pass.location || 'Online / Campus',
    mode: 'Hybrid',
    startDate: '2026-10-15'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`EventHub Verified Pass: #${pass.ticketId}\nVenue: ${event.location}\nMode: ${event.mode}`);
    const location = encodeURIComponent(event.location);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
    showToast('Opening Google Calendar...');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`I'm attending ${pass.eventTitle} with EventHub pass #${pass.ticketId}!`);
      showToast('Ticket details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
      >
        {/* Modal Top Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Verified Admission E-Pass
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Pass / Save PDF"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition-colors"
            >
              <Printer size={15} />
            </button>
            <button
              onClick={handleShare}
              title="Share Ticket"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition-colors"
            >
              <Share2 size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-xs transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Skeuomorphic Perforated Ticket Card */}
        <div className="p-6 relative space-y-6">
          {/* Perforated Edge Notches */}
          <div className="ticket-edge-left" />
          <div className="ticket-edge-right" />

          {/* Event Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {event.categoryLabel || 'Flagship Event'}
              </span>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                #{pass.ticketId}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white pt-1">
              {pass.eventTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {event.location} • {event.mode}
            </p>
          </div>

          {/* Perforated Divider */}
          <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800 my-4" />

          {/* Attendee Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Attendee Name</span>
              <p className="font-bold text-slate-900 dark:text-white truncate">{pass.userName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Email</span>
              <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{pass.userEmail || 'Verified'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Role / Affiliation</span>
              <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{pass.affiliation || pass.userRole}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Pass Type</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 truncate">{pass.ticketType || 'Standard Entry'}</p>
            </div>
          </div>

          {/* Stylized QR Code Matrix Visual */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200 shrink-0">
                <QrCode size={64} className="text-slate-900" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Live Check-in Barcode</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {pass.qrValue || `EH-${pass.ticketId}`}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={12} />
                  <span>{pass.checkedIn ? 'Checked In' : 'Valid for Entry'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCalendar}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
            >
              <Calendar size={13} className="text-indigo-500" />
              <span>Add to Cal</span>
            </button>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Please present this digital ticket pass or PDF printout at the venue registration desk.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketPassModal;
