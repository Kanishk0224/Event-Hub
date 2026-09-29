import { useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';

export const TicketPassModal = ({ ticket, onClose }) => {
  const { events, showToast } = useEventHub();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticket) return null;

  const event = events.find(e => e.id === ticket.eventId);

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`EventHub Verified Pass: ${ticket.ticketId}\nVenue: ${event.location}\nMode: ${event.mode}`);
    const location = encodeURIComponent(event.location);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
    showToast('Opening Google Calendar...');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`I'm attending ${ticket.eventTitle} with EventHub pass #${ticket.ticketId}!`);
      showToast('Ticket details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
      >
        {/* Modal Top Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
            <Sparkles size={16} className="text-amber-500 animate-spin" />
            <span>Official E-Ticket & Digital Access Pass</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close pass"
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Ticket Body */}
        <div className="p-5 sm:p-6" id="printable-pass">
          <div className="relative rounded-2xl bg-gradient-to-b from-indigo-900/10 via-purple-900/5 to-slate-900/10 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-950/40 border-2 border-indigo-500/30 overflow-hidden shadow-lg">
            {/* Perforated Notches */}
            <div className="ticket-edge-left bg-white dark:bg-slate-900 border-r border-indigo-500/30" />
            <div className="ticket-edge-right bg-white dark:bg-slate-900 border-l border-indigo-500/30" />

            {/* Ticket Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white text-indigo-600 font-black text-lg flex items-center justify-center shadow-xs">
                  E
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight leading-none">EventHub</h3>
                  <span className="text-[10px] font-semibold tracking-wider text-indigo-100 uppercase">
                    Verified Participant Pass
                  </span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                ticket.status === 'confirmed'
                  ? 'bg-emerald-400 text-slate-950'
                  : ticket.status === 'waitlist'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-rose-400 text-slate-950'
              }`}>
                {ticket.status === 'confirmed' ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>CONFIRMED</span>
                  </>
                ) : ticket.status === 'waitlist' ? (
                  <>
                    <AlertCircle size={12} />
                    <span>WAITLIST (#{ticket.waitlistPosition})</span>
                  </>
                ) : (
                  <span>CANCELLED</span>
                )}
              </div>
            </div>

            {/* Ticket Middle: Event & Attendee Details */}
            <div className="p-5 space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {ticket.eventTitle}
                </h2>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  {ticket.ticketType}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ATTENDEE
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {ticket.userName}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                    {ticket.affiliation}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TICKET NUMBER
                  </span>
                  <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">
                    {ticket.ticketId}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Role: {ticket.userRole.toUpperCase()}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    DATE & TIME
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {event ? new Date(event.startDate).toLocaleDateString() : 'Upcoming'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Doors open 30m prior
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    VENUE / FORMAT
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                    {event ? event.location : 'Campus / Online'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Mode: {event?.mode || 'Hybrid'}
                  </p>
                </div>
              </div>

              {/* Team Roster */}
              {ticket.teamMembers && ticket.teamMembers.length > 1 && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    TEAM ROSTER: {ticket.teamName}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ticket.teamMembers.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] font-semibold bg-white dark:bg-slate-700 rounded-md text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Perforated Dotted Separator */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
            </div>

            {/* Ticket Bottom: QR Code & Security Stamp */}
            <div className="p-5 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {/* Stylized QR Code */}
                <div className="w-16 h-16 rounded-xl bg-white p-1.5 border border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-xs flex-shrink-0">
                  <QrCode size={52} className="text-slate-900" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Scan for Fast Desk Check-In
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Present on mobile or paper at entrance.
                  </p>
                  <span className="font-mono text-[10px] text-indigo-500 dark:text-indigo-400 block mt-0.5">
                    REF: {ticket.qrValue}
                  </span>
                </div>
              </div>

              {/* Attendance Verification Stamp */}
              <div className="text-right">
                {ticket.checkedIn ? (
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    <span className="text-xs font-black block">✓ CHECKED IN</span>
                    <small className="text-[9px]">
                      {new Date(ticket.checkedInTime).toLocaleDateString()}
                    </small>
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                    <span className="text-xs font-black block">VALID PASS</span>
                    <small className="text-[9px]">Verified</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleAddToCalendar}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Calendar size={14} />
            <span>Calendar</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketPassModal;

