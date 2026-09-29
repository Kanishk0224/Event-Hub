import React, { useState } from 'react';
import { useEventHub } from '../../context/EventHubContext';
import {
  Ticket,
  Clock,
  Award,
  Bookmark,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  Download,
  GraduationCap,
  Briefcase,
  User,
  ShieldCheck,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';

export const AttendeeDashboard = ({ onSelectEvent, onRegisterClick }) => {
  const {
    currentUser,
    events,
    registrations,
    bookmarks,
    cancelRegistration,
    setSelectedTicket,
    setTicketModalOpen,
    setActiveTab,
    showToast
  } = useEventHub();

  const [activeSubTab, setActiveSubTab] = useState('passes'); // 'passes' | 'waitlist' | 'certificates' | 'bookmarks' | 'profile'
  const [cancelModalId, setCancelModalId] = useState(null);

  if (!currentUser) {
    return (
      <div className="dashboard-container empty-state-container">
        <h2>Participant Portal</h2>
        <p>Please log in as a Student or Working Professional to access your registered passes.</p>
      </div>
    );
  }

  // Filter registrations for current user
  const userRegs = registrations.filter(
    r => r.userId === currentUser.id && r.status !== 'cancelled'
  );

  const confirmedPasses = userRegs.filter(r => r.status === 'confirmed');
  const waitlistPasses = userRegs.filter(r => r.status === 'waitlist');
  const attendedPasses = userRegs.filter(r => r.checkedIn);
  const bookmarkedEvents = events.filter(e => bookmarks.includes(e.id));

  const handleOpenTicket = (reg) => {
    setSelectedTicket(reg);
    setTicketModalOpen(true);
  };

  const handleConfirmCancel = (regId) => {
    cancelRegistration(regId);
    setCancelModalId(null);
  };

  const handleDownloadCert = (eventTitle) => {
    showToast(`Downloading Certificate of Participation for "${eventTitle}"...`);
  };

  return (
    <div className="dashboard-container attendee-dashboard">
      {/* Top Profile Header Banner */}
      <div className="dashboard-profile-header">
        <div className="profile-header-left">
          <img src={currentUser.avatar} alt={currentUser.name} className="dashboard-avatar-lg" />
          <div className="profile-header-text">
            <div className="profile-name-row">
              <h2>{currentUser.name}</h2>
              <span className={`role-badge ${currentUser.role}`}>
                {currentUser.role === 'student' ? (
                  <>
                    <GraduationCap size={14} />
                    <span>Student Participant</span>
                  </>
                ) : (
                  <>
                    <Briefcase size={14} />
                    <span>Working Professional</span>
                  </>
                )}
              </span>
            </div>
            <p className="profile-affiliation-sub">
              {currentUser.role === 'student' ? (
                <>🏛️ {currentUser.college} • {currentUser.degree} (Batch '{currentUser.gradYear || '2026'})</>
              ) : (
                <>💼 {currentUser.company} • {currentUser.jobTitle} • {currentUser.industry}</>
              )}
            </p>
            <div className="profile-contact-chips">
              <span>📧 {currentUser.email}</span>
              <span>📱 {currentUser.phone || '+91 98765 43210'}</span>
            </div>
          </div>
        </div>

        <div className="profile-header-right">
          <button className="btn-explore-more" onClick={() => setActiveTab('explore')}>
            <span>Explore More Events</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-card" onClick={() => setActiveSubTab('passes')}>
          <div className="kpi-icon blue">
            <Ticket size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{confirmedPasses.length}</span>
            <span className="kpi-title">Confirmed Passes</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveSubTab('waitlist')}>
          <div className="kpi-icon amber">
            <Clock size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{waitlistPasses.length}</span>
            <span className="kpi-title">Waitlist Entries</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveSubTab('certificates')}>
          <div className="kpi-icon green">
            <Award size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{attendedPasses.length}</span>
            <span className="kpi-title">Attended / Certified</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveSubTab('bookmarks')}>
          <div className="kpi-icon purple">
            <Bookmark size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{bookmarkedEvents.length}</span>
            <span className="kpi-title">Saved Events</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="dashboard-sub-nav">
        <button
          className={`sub-nav-btn ${activeSubTab === 'passes' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('passes')}
        >
          <Ticket size={16} />
          <span>My Passes ({confirmedPasses.length})</span>
        </button>
        <button
          className={`sub-nav-btn ${activeSubTab === 'waitlist' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('waitlist')}
        >
          <Clock size={16} />
          <span>Waitlist Queue ({waitlistPasses.length})</span>
        </button>
        <button
          className={`sub-nav-btn ${activeSubTab === 'certificates' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('certificates')}
        >
          <Award size={16} />
          <span>Certificates & Badges ({attendedPasses.length})</span>
        </button>
        <button
          className={`sub-nav-btn ${activeSubTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('bookmarks')}
        >
          <Bookmark size={16} />
          <span>Saved Events ({bookmarkedEvents.length})</span>
        </button>
      </div>

      {/* =========================================================
          SUB-TAB 1: CONFIRMED PASSES
      ========================================================= */}
      {activeSubTab === 'passes' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Active Event Passes & Tickets</h3>
              <p>Carry your digital QR ticket pass for instant check-in on event day.</p>
            </div>
          </div>

          {confirmedPasses.length === 0 ? (
            <div className="empty-state-box">
              <Ticket size={40} className="empty-icon text-gray-400" />
              <h4>No Active Event Passes</h4>
              <p>You haven't registered for any upcoming events yet.</p>
              <button className="primary-action-btn" onClick={() => setActiveTab('explore')}>
                Browse Live Events
              </button>
            </div>
          ) : (
            <div className="passes-grid-layout">
              {confirmedPasses.map((reg) => {
                const event = events.find(e => e.id === reg.eventId);
                return (
                  <div key={reg.id} className="pass-overview-card">
                    <div className="pass-card-top">
                      <div className="pass-event-badge">
                        <span>{event?.categoryLabel || 'Event'}</span>
                      </div>
                      <span className="pass-ticket-id">#{reg.ticketId}</span>
                    </div>

                    <h4 className="pass-event-title">{reg.eventTitle}</h4>

                    <div className="pass-details-list">
                      <div className="pass-detail-row">
                        <Calendar size={14} />
                        <span>{event ? new Date(event.startDate).toLocaleDateString() : 'Upcoming'}</span>
                      </div>
                      <div className="pass-detail-row">
                        <MapPin size={14} />
                        <span>{event?.location || 'Campus / Online'}</span>
                      </div>
                      <div className="pass-detail-row">
                        <User size={14} />
                        <span>Registered as: {reg.teamName}</span>
                      </div>
                    </div>

                    <div className="pass-card-status-bar">
                      {reg.checkedIn ? (
                        <div className="status-indicator checked">
                          <CheckCircle2 size={15} />
                          <span>Attendance Checked In</span>
                        </div>
                      ) : (
                        <div className="status-indicator ready">
                          <CheckCircle2 size={15} />
                          <span>Entry Pass Confirmed</span>
                        </div>
                      )}
                    </div>

                    <div className="pass-actions-group">
                      <button
                        className="btn-view-pass-primary"
                        onClick={() => handleOpenTicket(reg)}
                      >
                        <Ticket size={16} />
                        <span>View E-Pass (QR)</span>
                      </button>

                      <button
                        className="btn-cancel-pass"
                        onClick={() => setCancelModalId(reg.id)}
                        title="Cancel this registration"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SUB-TAB 2: WAITLIST QUEUE
      ========================================================= */}
      {activeSubTab === 'waitlist' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Automated Waitlist Queue</h3>
              <p>When an existing attendee cancels, you will be automatically upgraded to confirmed status!</p>
            </div>
          </div>

          {waitlistPasses.length === 0 ? (
            <div className="empty-state-box">
              <Clock size={40} className="empty-icon text-gray-400" />
              <h4>No Waitlisted Events</h4>
              <p>You are not currently in any waiting list.</p>
            </div>
          ) : (
            <div className="waitlist-cards-list">
              {waitlistPasses.map((reg) => (
                <div key={reg.id} className="waitlist-item-card">
                  <div className="waitlist-queue-badge">
                    <span className="queue-pos">#{reg.waitlistPosition || 1}</span>
                    <span className="queue-label">In Line</span>
                  </div>

                  <div className="waitlist-info-col">
                    <h4>{reg.eventTitle}</h4>
                    <p>Registration Ref: {reg.ticketId} • Applied on {new Date(reg.registrationDate).toLocaleDateString()}</p>
                    <div className="auto-promote-note">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>Auto-Promotion Active: Instant SMS & Email notification when slot opens.</span>
                    </div>
                  </div>

                  <div className="waitlist-actions-col">
                    <button
                      className="btn-cancel-waitlist"
                      onClick={() => cancelRegistration(reg.id)}
                    >
                      Leave Waitlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SUB-TAB 3: CERTIFICATES & BADGES
      ========================================================= */}
      {activeSubTab === 'certificates' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Verified Participation Certificates</h3>
              <p>Official certificates of completion & badges for events you've attended.</p>
            </div>
          </div>

          {attendedPasses.length === 0 ? (
            <div className="empty-state-box">
              <Award size={40} className="empty-icon text-gray-400" />
              <h4>No Certificates Available Yet</h4>
              <p>Once you check in and attend an event, your digitally verifiable certificates will appear here.</p>
            </div>
          ) : (
            <div className="certificates-grid">
              {attendedPasses.map((reg) => (
                <div key={reg.id} className="certificate-mock-card">
                  <div className="cert-top-gold-bar"></div>
                  <div className="cert-body">
                    <Award size={36} className="cert-icon" />
                    <h5>CERTIFICATE OF PARTICIPATION</h5>
                    <p className="cert-awarded-to">Proudly presented to</p>
                    <strong className="cert-recipient-name">{currentUser.name}</strong>
                    <p className="cert-event-line">for participating in <strong>{reg.eventTitle}</strong></p>
                    <span className="cert-issue-date">Issued by EventHub & Event Organizers</span>
                  </div>
                  <button
                    className="btn-download-cert"
                    onClick={() => handleDownloadCert(reg.eventTitle)}
                  >
                    <Download size={15} />
                    <span>Download PDF Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SUB-TAB 4: BOOKMARKED EVENTS
      ========================================================= */}
      {activeSubTab === 'bookmarks' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Saved Opportunities ({bookmarkedEvents.length})</h3>
              <p>Events and hackathons you have bookmarked for quick review.</p>
            </div>
          </div>

          {bookmarkedEvents.length === 0 ? (
            <div className="empty-state-box">
              <Bookmark size={40} className="empty-icon text-gray-400" />
              <h4>No Saved Events</h4>
              <p>Click the bookmark icon on any event card to save it for later.</p>
              <button className="primary-action-btn" onClick={() => setActiveTab('explore')}>
                Explore Events
              </button>
            </div>
          ) : (
            <div className="bookmarked-events-list">
              {bookmarkedEvents.map((evt) => (
                <div key={evt.id} className="bookmark-horizontal-row">
                  <img src={evt.bannerUrl} alt="" className="bookmark-thumb" />
                  <div className="bookmark-details">
                    <span className="category-tag">{evt.categoryLabel}</span>
                    <h4>{evt.title}</h4>
                    <p>{evt.location} • Starts {new Date(evt.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bookmark-actions">
                    <button
                      className="btn-view-details-sm"
                      onClick={() => onSelectEvent(evt)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn-register-sm"
                      onClick={() => onRegisterClick(evt)}
                    >
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalId && (
        <div className="modal-backdrop-overlay" onClick={() => setCancelModalId(null)}>
          <div className="confirmation-modal-box" onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={36} className="text-red-500 mb-2" />
            <h3>Cancel Registration?</h3>
            <p>
              Are you sure you want to cancel your pass? Your slot will be immediately released
              and given to the next participant waiting in line on the waitlist.
            </p>
            <div className="confirm-modal-actions">
              <button className="btn-cancel-modal-back" onClick={() => setCancelModalId(null)}>
                Keep Pass
              </button>
              <button
                className="btn-cancel-modal-confirm"
                onClick={() => handleConfirmCancel(cancelModalId)}
              >
                Yes, Cancel Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
