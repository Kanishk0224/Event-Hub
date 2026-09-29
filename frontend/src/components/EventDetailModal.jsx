import React, { useState } from 'react';
import { useEventHub } from '../context/EventHubContext';
import {
  X,
  Calendar,
  MapPin,
  Globe2,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Ticket,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';

export const EventDetailModal = ({ event, onClose, onRegisterClick }) => {
  const { bookmarks, toggleBookmark, registrations, currentUser, setSelectedTicket, setTicketModalOpen, showToast } = useEventHub();
  const [activeDetailTab, setActiveDetailTab] = useState('overview'); // 'overview' | 'schedule' | 'speakers' | 'faqs'
  const [expandedFaq, setExpandedFaq] = useState(0);

  if (!event) return null;

  const isBookmarked = bookmarks.includes(event.id);
  const userRegistration = registrations.find(
    r => r.eventId === event.id && currentUser && r.userId === currentUser.id && r.status !== 'cancelled'
  );

  const isFull = event.registeredCount >= event.maxCapacity;
  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));

  let progressColor = '#10b981';
  if (capacityPercent >= 90) progressColor = '#ef4444';
  else if (capacityPercent >= 70) progressColor = '#f59e0b';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!');
    }
  };

  const handlePassView = () => {
    if (userRegistration) {
      setSelectedTicket(userRegistration);
      setTicketModalOpen(true);
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="event-detail-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-floating-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Banner Hero */}
        <div className="modal-hero-banner">
          <img src={event.bannerUrl} alt={event.title} className="modal-hero-img" />
          <div className="modal-hero-gradient"></div>

          <div className="modal-hero-content">
            <div className="modal-hero-tags">
              <span className={`category-tag tag-${event.category}`}>
                {event.categoryLabel || event.category}
              </span>
              <span className="mode-tag">
                {event.mode === 'Online' ? '🌐 Virtual Mode' : event.mode === 'Hybrid' ? '⚡ Hybrid Mode' : '📍 Campus / Offline'}
              </span>
            </div>

            <h1 className="modal-hero-title">{event.title}</h1>
            <p className="modal-hero-tagline">{event.tagline}</p>

            {/* Organizer bar */}
            <div className="modal-organizer-row">
              <img src={event.organizer.logo} alt="" className="modal-org-logo" />
              <div>
                <div className="modal-org-name-row">
                  <span>Organized by <strong>{event.organizer.name}</strong></span>
                  {event.organizer.verified && (
                    <CheckCircle2 size={16} className="text-blue-500 verified-icon" />
                  )}
                </div>
                <span className="modal-org-type">{event.organizer.type} • {event.organizer.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="modal-body-layout">
          {/* Main Left Column */}
          <div className="modal-left-content">
            {/* Quick Metrics Bar */}
            <div className="modal-quick-stats-strip">
              <div className="stat-pill">
                <Calendar size={16} className="stat-icon" />
                <div>
                  <label>Date & Duration</label>
                  <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="stat-pill">
                <MapPin size={16} className="stat-icon" />
                <div>
                  <label>Venue / Platform</label>
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="stat-pill">
                <Users size={16} className="stat-icon" />
                <div>
                  <label>Team Size</label>
                  <span>{event.teamSize}</span>
                </div>
              </div>

              <div className="stat-pill">
                <Award size={16} className="stat-icon" />
                <div>
                  <label>Registration Fee</label>
                  <span className="fee-highlight">{event.isFree ? 'FREE' : `₹${event.price}`}</span>
                </div>
              </div>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="modal-nav-tabs">
              <button
                className={`modal-tab-btn ${activeDetailTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('overview')}
              >
                Overview & Perks
              </button>
              <button
                className={`modal-tab-btn ${activeDetailTab === 'schedule' ? 'active' : ''}`}
                onClick={() => setActiveDetailTab('schedule')}
              >
                Schedule & Agenda
              </button>
              {event.speakers && event.speakers.length > 0 && (
                <button
                  className={`modal-tab-btn ${activeDetailTab === 'speakers' ? 'active' : ''}`}
                  onClick={() => setActiveDetailTab('speakers')}
                >
                  Keynote Speakers
                </button>
              )}
              {event.faqs && event.faqs.length > 0 && (
                <button
                  className={`modal-tab-btn ${activeDetailTab === 'faqs' ? 'active' : ''}`}
                  onClick={() => setActiveDetailTab('faqs')}
                >
                  FAQs
                </button>
              )}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeDetailTab === 'overview' && (
              <div className="modal-tab-panel">
                <section className="detail-section">
                  <h3>About the Opportunity</h3>
                  <div className="description-text">
                    {event.description.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </section>

                {/* Prizes & Rewards */}
                {event.prizes && event.prizes.length > 0 && (
                  <section className="detail-section prizes-section">
                    <h3>🏆 Prizes, Rewards & Grants</h3>
                    <div className="prizes-grid">
                      {event.prizes.map((p, idx) => (
                        <div key={idx} className="prize-card">
                          <div className="prize-rank-badge">#{idx + 1} Rank</div>
                          <h4>{p.rank}</h4>
                          <p className="prize-amount">{p.prize}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Perks & Takeaways */}
                {event.perks && event.perks.length > 0 && (
                  <section className="detail-section perks-section">
                    <h3>✨ Perks & Key Takeaways</h3>
                    <div className="perks-tags-list">
                      {event.perks.map((perk, idx) => (
                        <div key={idx} className="perk-tag-item">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Eligibility & Guidelines */}
                <section className="detail-section">
                  <h3>Eligibility & Criteria</h3>
                  <div className="eligibility-box">
                    <div className="info-row">
                      <strong>Who Can Apply:</strong>
                      <span>{event.eligibility}</span>
                    </div>
                    <div className="info-row">
                      <strong>Team Requirement:</strong>
                      <span>{event.teamSize}</span>
                    </div>
                    <div className="info-row">
                      <strong>Format:</strong>
                      <span>{event.mode} ({event.location})</span>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB 2: SCHEDULE */}
            {activeDetailTab === 'schedule' && (
              <div className="modal-tab-panel">
                <section className="detail-section">
                  <h3>Structured Event Agenda & Timeline</h3>
                  <div className="schedule-timeline">
                    {event.schedule && event.schedule.length > 0 ? (
                      event.schedule.map((dayPlan, dayIdx) => (
                        <div key={dayIdx} className="timeline-day-block">
                          <div className="day-header-pill">
                            <Calendar size={14} />
                            <span>{dayPlan.day}</span>
                          </div>

                          <div className="sessions-list">
                            {dayPlan.sessions.map((sess, sessIdx) => (
                              <div key={sessIdx} className="session-item-row">
                                <div className="session-time-col">
                                  <Clock size={14} />
                                  <span>{sess.time}</span>
                                </div>
                                <div className="session-details-col">
                                  <h4>{sess.title}</h4>
                                  {sess.speaker && (
                                    <p className="session-speaker">
                                      👤 <strong>Lead:</strong> {sess.speaker}
                                    </p>
                                  )}
                                  {sess.room && (
                                    <span className="session-room-tag">📍 {sess.room}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-data-text">Detailed schedule will be released shortly by the host.</p>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* TAB 3: SPEAKERS */}
            {activeDetailTab === 'speakers' && (
              <div className="modal-tab-panel">
                <section className="detail-section">
                  <h3>Distinguished Speakers & Industry Mentors</h3>
                  <div className="speakers-grid">
                    {event.speakers?.map((sp, idx) => (
                      <div key={idx} className="speaker-card">
                        <img src={sp.avatar} alt={sp.name} className="speaker-avatar-lg" />
                        <h4>{sp.name}</h4>
                        <span className="speaker-role">{sp.role}</span>
                        <span className="speaker-company">{sp.company}</span>
                        {sp.linkedin && (
                          <a
                            href={sp.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="speaker-linkedin-link"
                          >
                            <ExternalLink size={14} />
                            <span>Connect</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* TAB 4: FAQS */}
            {activeDetailTab === 'faqs' && (
              <div className="modal-tab-panel">
                <section className="detail-section">
                  <h3>Frequently Asked Questions</h3>
                  <div className="faqs-accordion">
                    {event.faqs?.map((faq, idx) => (
                      <div
                        key={idx}
                        className={`faq-item ${expandedFaq === idx ? 'expanded' : ''}`}
                        onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                      >
                        <div className="faq-question-header">
                          <span>{faq.q}</span>
                          {expandedFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        {expandedFaq === idx && (
                          <div className="faq-answer-body">
                            <p>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Right Sticky Action Sidebar */}
          <div className="modal-right-sidebar">
            <div className="sticky-action-card">
              {/* Capacity Status */}
              <div className="sidebar-capacity-block">
                <div className="sidebar-cap-header">
                  <span>Participant Capacity</span>
                  <span className="sidebar-cap-percent" style={{ color: progressColor }}>
                    {isFull ? 'CAPACITY FULL' : `${capacityPercent}% Filled`}
                  </span>
                </div>
                <div className="capacity-track">
                  <div
                    className="capacity-fill"
                    style={{ width: `${capacityPercent}%`, backgroundColor: progressColor }}
                  ></div>
                </div>
                <div className="sidebar-cap-numbers">
                  <span><strong>{event.registeredCount}</strong> Registered</span>
                  <span>Limit: <strong>{event.maxCapacity}</strong></span>
                </div>
                {isFull && event.allowWaitlist && (
                  <div className="waitlist-alert-chip">
                    <AlertCircle size={14} />
                    <span>Waitlist enabled ({event.waitlistCount || 0} in queue)</span>
                  </div>
                )}
              </div>

              {/* Deadline reminder */}
              <div className="sidebar-deadline-box">
                <Flame size={16} className="text-amber-500" />
                <div>
                  <strong>Registration Closes</strong>
                  <p>{new Date(event.registrationDeadline).toLocaleString()}</p>
                </div>
              </div>

              {/* CTA Button */}
              {userRegistration ? (
                <button className="sidebar-pass-btn" onClick={handlePassView}>
                  <Ticket size={18} />
                  <span>
                    {userRegistration.status === 'waitlist'
                      ? `Waitlisted (Queue #${userRegistration.waitlistPosition})`
                      : 'View My E-Ticket Pass'}
                  </span>
                </button>
              ) : (
                <button
                  className={`sidebar-register-btn ${isFull ? 'waitlist-mode' : ''}`}
                  onClick={() => onRegisterClick(event)}
                >
                  <span>
                    {isFull
                      ? (event.allowWaitlist ? 'Join Waitlist' : 'Registrations Closed')
                      : 'Register Now'}
                  </span>
                  <ArrowRight size={16} />
                </button>
              )}

              {/* Share & Bookmark buttons */}
              <div className="sidebar-secondary-actions">
                <button
                  className={`btn-action-outline ${isBookmarked ? 'active' : ''}`}
                  onClick={() => toggleBookmark(event.id)}
                >
                  <Bookmark size={16} fill={isBookmarked ? '#0073e6' : 'none'} />
                  <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                </button>

                <button className="btn-action-outline" onClick={handleShare}>
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>

              {/* Trust Badge */}
              <div className="trust-guarantee">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Verified Event by EventHub Quality Council</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
