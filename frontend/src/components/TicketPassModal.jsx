import React from 'react';
import { useEventHub } from '../context/EventHubContext';
import {
  X,
  Printer,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  QrCode,
  Share2,
  AlertCircle,
  Sparkles,
  Download
} from 'lucide-react';

export const TicketPassModal = ({ ticket, onClose }) => {
  const { events, showToast } = useEventHub();

  if (!ticket) return null;

  const event = events.find(e => e.id === ticket.eventId);

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`EventHub Ticket: ${ticket.ticketId}\nVenue: ${event.location}`);
    const location = encodeURIComponent(event.location);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
    showToast('Redirecting to Google Calendar...');
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="ticket-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="ticket-modal-top-bar">
          <div className="ticket-modal-title-group">
            <Sparkles size={18} className="text-amber-500" />
            <span>Official E-Ticket & Entry Pass</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* The Digital Pass Card (Printable) */}
        <div className="printable-ticket-card" id="printable-pass">
          {/* Ticket Header */}
          <div className="ticket-card-header">
            <div className="ticket-brand">
              <span className="brand-badge-e">E</span>
              <div>
                <strong>EventHub</strong>
                <span>VERIFIED PARTICIPANT PASS</span>
              </div>
            </div>
            <div className={`ticket-status-pill ${ticket.status}`}>
              {ticket.status === 'confirmed' ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>CONFIRMED ENTRY</span>
                </>
              ) : ticket.status === 'waitlist' ? (
                <>
                  <AlertCircle size={14} />
                  <span>WAITLIST (QUEUE #{ticket.waitlistPosition})</span>
                </>
              ) : (
                <span>CANCELLED</span>
              )}
            </div>
          </div>

          {/* Ticket Middle: Event & Attendee Info */}
          <div className="ticket-card-body">
            <h2 className="ticket-event-title">{ticket.eventTitle}</h2>

            <div className="ticket-grid-meta">
              <div className="ticket-meta-block">
                <label>ATTENDEE NAME</label>
                <strong>{ticket.userName}</strong>
                <span className="ticket-role-sub">{ticket.userRole.toUpperCase()} ({ticket.affiliation})</span>
              </div>

              <div className="ticket-meta-block">
                <label>TICKET NUMBER</label>
                <strong className="ticket-code-highlight">{ticket.ticketId}</strong>
                <span className="ticket-role-sub">{ticket.ticketType}</span>
              </div>

              <div className="ticket-meta-block">
                <label>DATE & TIME</label>
                <strong>{event ? new Date(event.startDate).toLocaleDateString() : 'Upcoming'}</strong>
                <span className="ticket-role-sub">Doors open 30 min before schedule</span>
              </div>

              <div className="ticket-meta-block">
                <label>LOCATION / PLATFORM</label>
                <strong>{event ? event.location : 'Campus / Online'}</strong>
                <span className="ticket-role-sub">Mode: {event?.mode || 'Hybrid'}</span>
              </div>
            </div>

            {/* Team or Solo info */}
            {ticket.teamMembers && ticket.teamMembers.length > 1 && (
              <div className="ticket-team-box">
                <label>TEAM ROSTER: {ticket.teamName}</label>
                <div className="ticket-team-pills">
                  {ticket.teamMembers.map((m, idx) => (
                    <span key={idx} className="team-pill-badge">{m}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ticket Perforated Divider */}
          <div className="ticket-perforated-line">
            <div className="notch notch-left"></div>
            <div className="dash-line"></div>
            <div className="notch notch-right"></div>
          </div>

          {/* Ticket Bottom: QR Code & Security verification */}
          <div className="ticket-card-footer">
            <div className="ticket-qr-area">
              {/* Stylized QR Code Mockup */}
              <div className="mock-qr-code">
                <div className="qr-corner top-left"></div>
                <div className="qr-corner top-right"></div>
                <div className="qr-corner bottom-left"></div>
                <div className="qr-center-matrix">
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel active"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel active"></div>
                  <div className="qr-pixel active"></div>
                  <div className="qr-pixel"></div>
                  <div className="qr-pixel active"></div>
                </div>
              </div>
              <div className="qr-instructions">
                <strong>Scan at Registration Desk</strong>
                <p>Present this barcode on mobile or paper for badge printing and entry.</p>
                <span className="security-hash">REF: {ticket.qrValue}</span>
              </div>
            </div>

            <div className="ticket-attendance-status">
              {ticket.checkedIn ? (
                <div className="checked-in-stamp">
                  <span>✓ CHECKED IN</span>
                  <small>{new Date(ticket.checkedInTime).toLocaleDateString()}</small>
                </div>
              ) : (
                <div className="ready-stamp">
                  <span>VALID PASS</span>
                  <small>EventHub Security Checked</small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ticket-actions-row">
          <button className="btn-ticket-action" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>
          <button className="btn-ticket-action primary" onClick={handleAddToCalendar}>
            <Calendar size={16} />
            <span>Add to Google Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};