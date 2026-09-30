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
  MapPin,
  Clock,
  Shield
} from 'lucide-react';

export const TicketPassModal = ({ ticket: propTicket, registration, onClose, isOpen = true }) => {
  const { events, showToast } = useEventHub();

  const ticket = propTicket || registration;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !ticket) return null;

  const event = events.find(e => e.id === ticket.eventId || e._id === ticket.eventId) || {};

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(ticket.eventTitle || event.title || 'EventHub Event');
    const details = encodeURIComponent(`EventHub Verified Pass: ${ticket.ticketId || ticket.id}\nVenue: ${event.location || 'Online'}\nMode: ${event.mode || 'Hybrid'}`);
    const location = encodeURIComponent(event.location || 'Online');
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
    showToast('Opening Google Calendar...');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`I'm attending ${ticket.eventTitle || event.title} with EventHub verified pass #${ticket.ticketId || ticket.id}!`);
      showToast('Ticket details copied to clipboard!');
    }
  };

  const qrRefValue = ticket.qrValue || ticket.qrCodeData || `EVENTHUB:${ticket.eventId || 'EVT'}:${ticket.ticketId || ticket.id || 'PASS'}`;

  // Generate a clean deterministic QR visual representation
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrRefValue)}&color=0f172a&bgcolor=ffffff`;

  const isConfirmed = ticket.status === 'confirmed' || ticket.status === 'registered';
  const isWaitlist = ticket.status === 'waitlist' || ticket.status === 'waitlisted';

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
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
            <Sparkles size={16} className="text-amber-500 animate-spin" />
            <span>Official E-Ticket & Digital Access Pass</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close pass"
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
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
                isConfirmed
                  ? 'bg-emerald-400 text-slate-950'
                  : isWaitlist
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-rose-400 text-slate-950'
              }`}>
                {isConfirmed ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>CONFIRMED</span>
                  </>
                ) : isWaitlist ? (
                  <>
                    <AlertCircle size={12} />
                    <span>WAITLIST (#{ticket.waitlistPosition || 1})</span>
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
                  {ticket.eventTitle || event.title || 'Event Program'}
                </h2>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  {ticket.ticketType || ticket.passTier || 'All-Access Pass'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ATTENDEE
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {ticket.userName || ticket.attendeeName || 'Registered Participant'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                    {ticket.affiliation || ticket.userEmail || ticket.attendeeEmail || ''}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TICKET NUMBER
                  </span>
                  <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">
                    #{ticket.ticketId || ticket.ticketNumber || ticket.id}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Role: {String(ticket.userRole || 'student').toUpperCase()}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    DATE & TIME
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : (ticket.eventDate || 'Upcoming 2026')}
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
                    {event.location || ticket.eventLocation || 'Campus / Online'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Mode: {event.mode || ticket.eventMode || 'Hybrid'}
                  </p>
                </div>
              </div>

              {/* Team Roster if any */}
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
            <div className="p-5 bg-slate-50/90 dark:bg-slate-800/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {/* Live Functional QR Code */}
                <div className="w-20 h-20 rounded-xl bg-white p-1.5 border border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-md shrink-0">
                  <img
                    src={qrSvgUrl}
                    alt="Ticket QR Code"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to stylized SVG vector icon if external API is blocked
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'block';
                    }}
                  />
                  <QrCode size={56} className="text-slate-900 hidden" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Scan for Fast Desk Check-In
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Present this QR pass at venue desk entrance.
                  </p>
                  <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block mt-1">
                    REF: #{ticket.ticketId || ticket.ticketNumber || ticket.id}
                  </span>
                </div>
              </div>

              {/* Attendance Verification Stamp */}
              <div className="text-right">
                {ticket.checkedIn ? (
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                    <span className="text-xs font-black block">✓ CHECKED IN</span>
                    <small className="text-[9px]">
                      {ticket.checkedInTime ? new Date(ticket.checkedInTime).toLocaleDateString() : 'Verified'}
                    </small>
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                    <span className="text-xs font-black block">VALID PASS</span>
                    <small className="text-[9px]">Verified Secure</small>
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
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleAddToCalendar}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Calendar size={14} />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Share Pass"
          >
            <Share2 size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketPassModal;
